#!/usr/bin/env python3
"""
JARVIS Brain - Intent Recognizer

Analyzes user requests and determines intent by matching keywords
to registered capabilities in the ecosystem registry.

Part of Phase 2A Week 1: Intent Router implementation.
"""

import json
import re
import sys
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from difflib import SequenceMatcher


@dataclass
class Intent:
    """Parsed user request with matched capability"""
    primary_action: str              # Main action user wants
    domain: str                      # "investments", "research", "content", "knowledge"
    confidence: float                # 0.0 - 1.0
    matched_app: str                 # App ID (e.g., "jarvis-investment")
    matched_capability: str          # Capability ID (e.g., "analyze_etf")
    capability_name: str             # Human-readable name
    keywords_matched: List[str]      # Which keywords triggered the match
    is_workflow: bool                # Single capability or multi-step?
    workflow_steps: Optional[List] = None  # If workflow, what steps?
    raw_request: str = ""            # Original user request


class IntentRecognizer:
    """
    Recognizes user intent by matching keywords to registered capabilities.

    Uses a three-tier matching strategy:
    1. Exact keyword match (high confidence 0.85-0.95)
    2. Fuzzy keyword match (medium confidence 0.50-0.80)
    3. LLM fallback (for complex/ambiguous requests)

    Example:
        recognizer = IntentRecognizer(registry_path="ecosystem/registry/apps.json")
        intent = recognizer.recognize("Analyze SPY")
        # Returns Intent with matched_capability="analyze_etf", confidence=0.92
    """

    def __init__(self, registry_path: str):
        """
        Initialize intent recognizer with ecosystem registry.

        Args:
            registry_path: Path to apps.json registry file
        """
        self.registry_path = Path(registry_path)
        self.registry = self._load_registry()
        # Apps are in the root jarvis/apps directory
        # registry_path is: .../jarvis/ecosystem/registry/apps.json
        # We need: .../jarvis/apps/
        jarvis_root = self.registry_path.parent.parent.parent  # Go up 3 levels
        self.apps_dir = jarvis_root / "apps"
        self.app_manifests = self._load_app_manifests()
        self.keyword_map = self._build_keyword_map()

    def _load_registry(self) -> Dict:
        """Load ecosystem registry from JSON file"""
        if not self.registry_path.exists():
            raise FileNotFoundError(f"Registry not found: {self.registry_path}")

        with open(self.registry_path) as f:
            return json.load(f)

    def _load_app_manifests(self) -> List[Dict]:
        """
        Load all app manifests from apps directory.

        Returns:
            List of app manifests with full capability details
        """
        manifests = []
        app_names = self.registry.get("apps", [])

        for app_name in app_names:
            manifest_path = self.apps_dir / app_name / "manifest.json"

            if manifest_path.exists():
                with open(manifest_path) as f:
                    manifest = json.load(f)
                    manifests.append(manifest)
            else:
                print(f"Warning: No manifest found for {app_name} at {manifest_path}")

        return manifests

    def _build_keyword_map(self) -> Dict[str, List[Dict]]:
        """
        Build keyword → capability mapping for fast lookups.

        Returns:
            {
                "analyze": [
                    {
                        "app_id": "jarvis-investment",
                        "capability_id": "analyze_etf",
                        "capability_name": "Analyze ETF",
                        "domain": "investments",
                        "all_keywords": ["analyze", "analysis", "etf", ...]
                    },
                    ...
                ],
                ...
            }
        """
        keyword_map = {}

        for app in self.app_manifests:
            app_id = app["app_id"]
            domain = app["domain"]

            for capability in app.get("capabilities", []):
                cap_id = capability["id"]
                cap_name = capability["name"]
                keywords = capability.get("keywords", [])

                # Map each keyword to this capability
                for keyword in keywords:
                    if keyword not in keyword_map:
                        keyword_map[keyword] = []

                    keyword_map[keyword].append({
                        "app_id": app_id,
                        "capability_id": cap_id,
                        "capability_name": cap_name,
                        "domain": domain,
                        "all_keywords": keywords
                    })

        return keyword_map

    def recognize(self, user_request: str) -> Intent:
        """
        Main entry point: Recognize intent from user request.

        Args:
            user_request: Natural language request from user

        Returns:
            Intent object with matched capability and confidence

        Example:
            >>> intent = recognizer.recognize("Analyze QQQ")
            >>> print(intent.matched_capability)
            "analyze_etf"
            >>> print(intent.confidence)
            0.92
        """
        # Step 1: Tokenize request
        tokens = self._tokenize(user_request)

        # Step 2: Find exact keyword matches
        exact_matches = self._find_exact_matches(tokens)

        if exact_matches:
            # Step 3a: We have exact matches - rank by confidence
            ranked = self._rank_matches(exact_matches, tokens)
            best_match = ranked[0]

            return Intent(
                primary_action=best_match["capability_id"],
                domain=best_match["domain"],
                confidence=best_match["confidence"],
                matched_app=best_match["app_id"],
                matched_capability=best_match["capability_id"],
                capability_name=best_match["capability_name"],
                keywords_matched=best_match["keywords_matched"],
                is_workflow=False,  # Single capability for now
                raw_request=user_request
            )

        # Step 3b: No exact matches - try fuzzy matching
        fuzzy_matches = self._find_fuzzy_matches(tokens)

        if fuzzy_matches:
            ranked = self._rank_matches(fuzzy_matches, tokens)
            best_match = ranked[0]

            # Lower confidence for fuzzy matches
            return Intent(
                primary_action=best_match["capability_id"],
                domain=best_match["domain"],
                confidence=best_match["confidence"] * 0.7,  # Reduce confidence
                matched_app=best_match["app_id"],
                matched_capability=best_match["capability_id"],
                capability_name=best_match["capability_name"],
                keywords_matched=best_match["keywords_matched"],
                is_workflow=False,
                raw_request=user_request
            )

        # Step 3c: No matches at all - return low-confidence fallback
        return Intent(
            primary_action="unknown",
            domain="unknown",
            confidence=0.0,
            matched_app="",
            matched_capability="",
            capability_name="",
            keywords_matched=[],
            is_workflow=False,
            raw_request=user_request
        )

    def _tokenize(self, text: str) -> List[str]:
        """
        Tokenize user request into lowercase words.

        Args:
            text: User request

        Returns:
            List of tokens

        Example:
            >>> _tokenize("Analyze SPY using 4-stage framework")
            ["analyze", "spy", "using", "4-stage", "framework"]
        """
        # Convert to lowercase
        text = text.lower()

        # Remove special characters but keep hyphens and numbers
        text = re.sub(r'[^\w\s-]', ' ', text)

        # Split into tokens
        tokens = text.split()

        return tokens

    def _find_exact_matches(self, tokens: List[str]) -> List[Dict]:
        """
        Find capabilities with exact keyword matches.

        Args:
            tokens: Tokenized user request

        Returns:
            List of matching capabilities with metadata
        """
        matches = []

        for token in tokens:
            if token in self.keyword_map:
                for capability in self.keyword_map[token]:
                    # Check if already matched (avoid duplicates)
                    existing = next(
                        (m for m in matches if m["capability_id"] == capability["capability_id"]),
                        None
                    )

                    if existing:
                        # Add to keywords_matched
                        existing["keywords_matched"].append(token)
                    else:
                        # New match
                        matches.append({
                            **capability,
                            "keywords_matched": [token],
                            "match_type": "exact"
                        })

        return matches

    def _find_fuzzy_matches(self, tokens: List[str]) -> List[Dict]:
        """
        Find capabilities with fuzzy keyword matches (Levenshtein distance).

        Args:
            tokens: Tokenized user request

        Returns:
            List of matching capabilities with similarity scores
        """
        matches = []
        threshold = 0.75  # Minimum similarity for fuzzy match

        for token in tokens:
            # Compare to all keywords in registry
            for keyword, capabilities in self.keyword_map.items():
                similarity = SequenceMatcher(None, token, keyword).ratio()

                if similarity >= threshold:
                    for capability in capabilities:
                        # Check if already matched
                        existing = next(
                            (m for m in matches if m["capability_id"] == capability["capability_id"]),
                            None
                        )

                        if existing:
                            existing["keywords_matched"].append(f"{token}~{keyword}")
                            existing["similarity_scores"].append(similarity)
                        else:
                            matches.append({
                                **capability,
                                "keywords_matched": [f"{token}~{keyword}"],
                                "similarity_scores": [similarity],
                                "match_type": "fuzzy"
                            })

        return matches

    def _rank_matches(self, matches: List[Dict], tokens: List[str]) -> List[Dict]:
        """
        Rank matched capabilities by confidence score.

        Confidence calculation:
            confidence = (keyword_match_score * 0.7) +
                        (token_coverage * 0.2) +
                        (recency_boost * 0.1)

        Args:
            matches: List of matched capabilities
            tokens: Original tokens from user request

        Returns:
            Sorted list (highest confidence first)
        """
        for match in matches:
            # Keyword match score (how many capability keywords matched)
            keywords_matched = len(match["keywords_matched"])
            total_keywords = len(match["all_keywords"])
            keyword_score = keywords_matched / total_keywords if total_keywords > 0 else 0

            # Token coverage (how many user tokens were matched)
            # This rewards matches that cover more of the user's request
            unique_matched_tokens = len(set(match["keywords_matched"]))
            total_tokens = len(tokens)
            token_coverage = unique_matched_tokens / total_tokens if total_tokens > 0 else 0

            # Recency boost (TODO: track recently used capabilities)
            recency_boost = 0.0

            # Calculate base confidence
            confidence = (keyword_score * 0.5) + (token_coverage * 0.4) + (recency_boost * 0.1)

            # Boost for exact matches
            if match["match_type"] == "exact":
                confidence = min(confidence + 0.20, 0.95)  # Cap at 0.95

            # Boost for multiple keyword matches (shows strong intent)
            if keywords_matched >= 2:
                confidence = min(confidence + 0.15, 0.95)

            # Boost for high token coverage (user's words match capability well)
            if token_coverage >= 0.5:
                confidence = min(confidence + 0.10, 0.95)

            match["confidence"] = confidence

        # Sort by confidence (highest first)
        return sorted(matches, key=lambda m: m["confidence"], reverse=True)

    def recognize_multi_intent(self, user_request: str) -> List[Intent]:
        """
        Detect if user request requires multiple capabilities (workflow).

        Example:
            "Build a portfolio" might require:
            1. screen_opportunities (find candidates)
            2. build_portfolio (construct allocation)

        Args:
            user_request: Natural language request

        Returns:
            List of Intent objects (if multiple detected)
        """
        # For now, return single intent
        # TODO: Implement workflow detection in Phase 2B
        return [self.recognize(user_request)]

    def get_capabilities_by_domain(self, domain: str) -> List[Dict]:
        """
        Get all capabilities for a specific domain.

        Args:
            domain: "investments", "research", "content", "knowledge"

        Returns:
            List of capabilities in that domain
        """
        capabilities = []

        for app in self.app_manifests:
            if app["domain"] == domain:
                for cap in app.get("capabilities", []):
                    capabilities.append({
                        "app_id": app["app_id"],
                        "capability_id": cap["id"],
                        "capability_name": cap["name"],
                        "keywords": cap.get("keywords", [])
                    })

        return capabilities

    def list_all_capabilities(self) -> Dict[str, List[Dict]]:
        """
        Get comprehensive list of all capabilities grouped by domain.

        Returns:
            {
                "investments": [...],
                "research": [...],
                "content": [...],
                "knowledge": [...]
            }
        """
        by_domain = {}

        for app in self.app_manifests:
            domain = app["domain"]
            if domain not in by_domain:
                by_domain[domain] = []

            for cap in app.get("capabilities", []):
                by_domain[domain].append({
                    "app_id": app["app_id"],
                    "capability_id": cap["id"],
                    "capability_name": cap["name"],
                    "description": cap.get("description", ""),
                    "keywords": cap.get("keywords", [])
                })

        return by_domain


def main():
    """Example usage and testing"""
    # Initialize recognizer
    registry_path = Path(__file__).parent.parent / "registry" / "apps.json"

    if not registry_path.exists():
        print(f"Error: Registry not found at {registry_path}")
        print("Make sure ecosystem/registry/apps.json exists")
        return 1

    recognizer = IntentRecognizer(str(registry_path))

    # Test cases
    test_requests = [
        "Analyze SPY",
        "What's in my portfolio?",
        "Show me Stage 2 opportunities",
        "Create a video about AI news",
        "Search my notes for reinforcement learning",
        "Build my portfolio",
        "Get the latest Chris Vermeulen video",
    ]

    print("🧠 JARVIS Brain - Intent Recognizer Test\n")
    print("=" * 60)

    for request in test_requests:
        intent = recognizer.recognize(request)

        print(f"\nRequest: \"{request}\"")
        print(f"  Matched: {intent.capability_name}")
        print(f"  App: {intent.matched_app}")
        print(f"  Domain: {intent.domain}")
        print(f"  Confidence: {intent.confidence:.2f}")
        print(f"  Keywords: {', '.join(intent.keywords_matched)}")

    print("\n" + "=" * 60)
    print("\n✅ Intent Recognizer is working!")

    # List all capabilities
    print("\n📋 All Available Capabilities:\n")
    all_caps = recognizer.list_all_capabilities()

    for domain, capabilities in all_caps.items():
        print(f"\n{domain.upper()}:")
        for cap in capabilities:
            print(f"  - {cap['capability_name']} ({cap['capability_id']})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
