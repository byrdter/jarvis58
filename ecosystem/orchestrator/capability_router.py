#!/usr/bin/env python3
"""
JARVIS Brain - Capability Router

Takes Intent from IntentRecognizer and makes routing decisions:
- Route directly (high confidence)
- Confirm first (medium confidence)
- Ask for clarification (low confidence / ambiguous)
- Show options (no match)

Part of Phase 2A Week 2: Capability Router implementation.
"""

import sys
from typing import Dict, List, Optional
from dataclasses import dataclass
from intent_recognizer import Intent, IntentRecognizer


@dataclass
class RoutingDecision:
    """Decision about what to do with a user request"""

    decision_type: str  # "route_direct", "confirm_first", "clarify", "show_options", "no_match"
    intent: Intent      # The matched intent

    # For route_direct and confirm_first
    execute_capability: Optional[str] = None  # "jarvis-investment.analyze_etf"

    # For confirm_first
    confirmation_message: Optional[str] = None  # "Did you mean X?"

    # For clarify (multiple possible matches)
    clarification_options: Optional[List[Dict]] = None

    # For show_options (low confidence)
    suggested_capabilities: Optional[List[Dict]] = None

    # For no_match
    fallback_message: Optional[str] = None

    # Always included
    confidence: float = 0.0
    reasoning: str = ""  # Why this decision was made


class CapabilityRouter:
    """
    Routes user requests to appropriate capabilities based on intent.

    Routing Logic:
    - Confidence >= 0.80: Route directly (high confidence)
    - Confidence 0.50-0.79: Confirm first (medium confidence)
    - Confidence 0.30-0.49: Ask for clarification (low confidence)
    - Confidence < 0.30: Show available options or no match

    Example:
        router = CapabilityRouter(intent_recognizer)
        decision = router.route("Analyze SPY")

        if decision.decision_type == "route_direct":
            execute(decision.execute_capability)
        elif decision.decision_type == "confirm_first":
            user_confirms = ask_user(decision.confirmation_message)
            if user_confirms:
                execute(decision.execute_capability)
    """

    # Confidence thresholds
    THRESHOLD_HIGH = 0.80    # Route directly without confirmation
    THRESHOLD_MEDIUM = 0.50  # Confirm before routing
    THRESHOLD_LOW = 0.30     # Ask for clarification

    def __init__(self, intent_recognizer: IntentRecognizer):
        """
        Initialize capability router with intent recognizer.

        Args:
            intent_recognizer: IntentRecognizer instance for parsing requests
        """
        self.recognizer = intent_recognizer

    def route(self, user_request: str) -> RoutingDecision:
        """
        Main routing entry point.

        Args:
            user_request: Natural language request from user

        Returns:
            RoutingDecision with action to take

        Example:
            >>> decision = router.route("Build my portfolio")
            >>> print(decision.decision_type)
            "route_direct"
            >>> print(decision.execute_capability)
            "jarvis-investment.build_portfolio"
        """
        # Step 1: Get intent from recognizer
        intent = self.recognizer.recognize(user_request)

        # Step 2: Check for multi-intent (workflow detection)
        # TODO: Implement in Phase 2B Week 3
        # For now, handle single intents only

        # Step 3: Route based on confidence
        if intent.confidence >= self.THRESHOLD_HIGH:
            return self._route_direct(intent)

        elif intent.confidence >= self.THRESHOLD_MEDIUM:
            return self._confirm_first(intent)

        elif intent.confidence >= self.THRESHOLD_LOW:
            return self._ask_clarification(intent)

        else:
            return self._show_options_or_no_match(intent)

    def _route_direct(self, intent: Intent) -> RoutingDecision:
        """
        High confidence (>= 0.80) - Route directly without confirmation.

        Args:
            intent: Matched intent with high confidence

        Returns:
            RoutingDecision to execute immediately
        """
        capability_path = f"{intent.matched_app}.{intent.matched_capability}"

        return RoutingDecision(
            decision_type="route_direct",
            intent=intent,
            execute_capability=capability_path,
            confidence=intent.confidence,
            reasoning=f"High confidence ({intent.confidence:.0%}) match to {intent.capability_name}"
        )

    def _confirm_first(self, intent: Intent) -> RoutingDecision:
        """
        Medium confidence (0.50-0.79) - Confirm before executing.

        Args:
            intent: Matched intent with medium confidence

        Returns:
            RoutingDecision requesting user confirmation
        """
        capability_path = f"{intent.matched_app}.{intent.matched_capability}"

        # Build confirmation message
        message = f"Did you mean: {intent.capability_name}?"

        # Add context if keywords matched
        if intent.keywords_matched:
            matched_keywords = ", ".join(intent.keywords_matched[:3])  # Show first 3
            message += f" (matched: {matched_keywords})"

        return RoutingDecision(
            decision_type="confirm_first",
            intent=intent,
            execute_capability=capability_path,
            confirmation_message=message,
            confidence=intent.confidence,
            reasoning=f"Medium confidence ({intent.confidence:.0%}) - confirming before routing"
        )

    def _ask_clarification(self, intent: Intent) -> RoutingDecision:
        """
        Low confidence (0.30-0.49) - Ask user to clarify which capability they meant.

        Args:
            intent: Matched intent with low confidence

        Returns:
            RoutingDecision with clarification options
        """
        # Get other capabilities in the same domain as alternatives
        domain_capabilities = self.recognizer.get_capabilities_by_domain(intent.domain)

        # Build clarification options
        options = []
        for cap in domain_capabilities[:3]:  # Show top 3 options
            options.append({
                "capability_id": cap["capability_id"],
                "capability_name": cap["capability_name"],
                "app_id": cap["app_id"]
            })

        return RoutingDecision(
            decision_type="clarify",
            intent=intent,
            clarification_options=options,
            confidence=intent.confidence,
            reasoning=f"Low confidence ({intent.confidence:.0%}) - need clarification"
        )

    def _show_options_or_no_match(self, intent: Intent) -> RoutingDecision:
        """
        Very low confidence (< 0.30) - Show available options or indicate no match.

        Args:
            intent: Matched intent with very low confidence (or no match)

        Returns:
            RoutingDecision with suggested capabilities or no match message
        """
        if intent.confidence > 0:
            # Some match found, but very weak - show suggestions
            all_capabilities = self.recognizer.list_all_capabilities()

            # Flatten to list
            suggestions = []
            for domain, caps in all_capabilities.items():
                for cap in caps[:2]:  # Top 2 per domain
                    suggestions.append({
                        "domain": domain,
                        "capability_name": cap["capability_name"],
                        "capability_id": cap["capability_id"],
                        "description": cap.get("description", "")
                    })

            return RoutingDecision(
                decision_type="show_options",
                intent=intent,
                suggested_capabilities=suggestions,
                confidence=intent.confidence,
                reasoning=f"Very low confidence ({intent.confidence:.0%}) - showing available options"
            )
        else:
            # No match at all
            fallback_msg = (
                "I didn't understand that request. "
                "Try asking about: investments, research, content creation, or knowledge management."
            )

            return RoutingDecision(
                decision_type="no_match",
                intent=intent,
                fallback_message=fallback_msg,
                confidence=0.0,
                reasoning="No capability matched the request"
            )

    def detect_workflow(self, user_request: str) -> Optional[List[Intent]]:
        """
        Detect if user request requires multiple capabilities (workflow).

        TODO: Implement in Phase 2B Week 3 (WorkflowOrchestrator)

        Example:
            "Create a video about my portfolio performance"
            → Requires: track_performance + create_script + create_launch_package

        Args:
            user_request: User's request

        Returns:
            List of Intent objects if workflow detected, None if single capability
        """
        # Placeholder for Phase 2B
        return None

    def explain_routing(self, decision: RoutingDecision) -> str:
        """
        Generate human-readable explanation of routing decision.

        Args:
            decision: RoutingDecision to explain

        Returns:
            Human-readable explanation string
        """
        if decision.decision_type == "route_direct":
            return (
                f"✅ Routing to: {decision.intent.capability_name}\n"
                f"   Confidence: {decision.confidence:.0%} (high)\n"
                f"   Action: Executing immediately"
            )

        elif decision.decision_type == "confirm_first":
            return (
                f"⚠️  Possible match: {decision.intent.capability_name}\n"
                f"   Confidence: {decision.confidence:.0%} (medium)\n"
                f"   Action: {decision.confirmation_message}"
            )

        elif decision.decision_type == "clarify":
            options_str = "\n".join([
                f"   {i+1}. {opt['capability_name']}"
                for i, opt in enumerate(decision.clarification_options or [])
            ])
            return (
                f"❓ Need clarification\n"
                f"   Confidence: {decision.confidence:.0%} (low)\n"
                f"   Did you mean:\n{options_str}"
            )

        elif decision.decision_type == "show_options":
            return (
                f"❓ Not sure what you mean\n"
                f"   Confidence: {decision.confidence:.0%} (very low)\n"
                f"   Here's what I can do:\n"
                f"   (Use router.list_capabilities() to see all options)"
            )

        else:  # no_match
            return (
                f"❌ No match found\n"
                f"   {decision.fallback_message}"
            )

    def list_capabilities(self) -> str:
        """
        Generate formatted list of all available capabilities.

        Returns:
            Formatted string showing all capabilities grouped by domain
        """
        all_caps = self.recognizer.list_all_capabilities()

        output = "📋 JARVIS Capabilities:\n\n"

        for domain, capabilities in all_caps.items():
            output += f"{domain.upper()}:\n"
            for cap in capabilities:
                output += f"  • {cap['capability_name']}\n"
                if cap.get('description'):
                    output += f"    {cap['description']}\n"
            output += "\n"

        return output


def main():
    """Example usage and testing"""
    from pathlib import Path

    # Initialize
    registry_path = Path(__file__).parent.parent / "registry" / "apps.json"
    recognizer = IntentRecognizer(str(registry_path))
    router = CapabilityRouter(recognizer)

    # Test cases with various confidence levels
    test_requests = [
        # High confidence tests
        "Build my portfolio",              # Should route directly
        "Get today AI news",               # Should route directly

        # Medium confidence tests
        "Find me the best ETF to buy",    # Should confirm first
        "Create a Youtube packet",         # Should confirm first

        # Low confidence tests
        "What's happening in the market?", # Should ask for clarification

        # No match tests
        "Make me a sandwich",              # Should show no match
    ]

    print("🧠 JARVIS Brain - Capability Router Test\n")
    print("=" * 70)

    for request in test_requests:
        decision = router.route(request)

        print(f"\nRequest: \"{request}\"")
        print(router.explain_routing(decision))
        print()

    print("=" * 70)
    print("\n✅ Capability Router is working!\n")

    # Show all capabilities
    print(router.list_capabilities())

if __name__ == "__main__":
    main()
