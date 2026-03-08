#!/usr/bin/env python3
"""
JARVIS Brain - Main Orchestration Entry Point

This is the central controller that:
1. Takes user requests in natural language
2. Recognizes intent using IntentRecognizer
3. Routes to appropriate capability using CapabilityRouter
4. Detects and orchestrates workflows using WorkflowOrchestrator
5. Returns execution plan for Claude Code to follow

Example usage:
    brain = JarvisBrain()
    result = brain.process("Create a video about my portfolio performance")

    # Result includes:
    # - What capability/workflow to execute
    # - Confidence level
    # - Execution plan for Claude Code
    # - Any confirmations needed

Part of Phase 2 Integration & Real-World Testing.
"""

import sys
import json
from pathlib import Path
from typing import Dict, Optional, Union, List
from dataclasses import dataclass, asdict, field

from intent_recognizer import Intent, IntentRecognizer
from capability_router import RoutingDecision, CapabilityRouter
from workflow_orchestrator import Workflow, WorkflowOrchestrator

# Import memory and skill discovery (Phase 4 enhancement)
try:
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from memory import JarvisMemoryManager, SearchResult
    from registry.skill_discovery import SkillDiscovery
    MEMORY_AVAILABLE = True
    SKILL_DISCOVERY_AVAILABLE = True
except ImportError as e:
    print(f"⚠️  Memory/Skill systems not available: {e}")
    MEMORY_AVAILABLE = False
    SKILL_DISCOVERY_AVAILABLE = False


@dataclass
class BrainResponse:
    """
    Complete response from JARVIS Brain to Claude Code.

    This is what Claude Code receives to execute the user's request.
    """
    # What type of response is this?
    response_type: str  # "single_capability", "workflow", "confirmation_needed", "clarification_needed", "no_match"

    # The original request
    user_request: str

    # Intent information
    intent: Intent

    # Routing decision
    routing_decision: RoutingDecision

    # If workflow detected
    workflow: Optional[Workflow] = None

    # Execution instructions for Claude Code
    execution_plan: str = ""

    # Human-readable summary
    summary: str = ""

    # Metadata
    confidence: float = 0.0
    requires_confirmation: bool = False
    token_savings_estimate: str = ""

    # Phase 4: Memory context (from hybrid search)
    memory_context: List[Dict] = field(default_factory=list)  # Relevant memories for this request
    available_skills: List[str] = field(default_factory=list)  # Skills discovered for this request


class JarvisBrain:
    """
    Central orchestrator for JARVIS system.

    This is the "brain" that understands user requests and directs
    them to the appropriate capabilities or workflows.

    Benefits:
    - Single entry point for all user requests
    - Automatic intent recognition
    - Smart routing with confidence scoring
    - Workflow detection for multi-step tasks
    - 60-85% token reduction vs reading full context

    Example:
        brain = JarvisBrain()

        # Simple request
        response = brain.process("Get today's AI news")
        # -> Routes to research-aggregator.aggregate_news

        # Workflow request
        response = brain.process("Build my portfolio")
        # -> Detects 3-step workflow: screen → build → save

        # Ambiguous request
        response = brain.process("What's happening?")
        # -> Asks for clarification
    """

    def __init__(self, registry_path: Optional[str] = None, enable_memory: bool = True, enable_skill_discovery: bool = True):
        """
        Initialize JARVIS Brain with all orchestrator components.

        Args:
            registry_path: Path to apps.json registry (auto-detected if None)
            enable_memory: Enable memory system integration (default: True)
            enable_skill_discovery: Enable skill discovery (default: True)
        """
        # Auto-detect registry path if not provided
        if registry_path is None:
            brain_dir = Path(__file__).parent
            registry_path = str(brain_dir.parent / "registry" / "apps.json")

        # Initialize orchestrator components
        self.recognizer = IntentRecognizer(registry_path)
        self.router = CapabilityRouter(self.recognizer)
        self.orchestrator = WorkflowOrchestrator(self.recognizer)

        # Phase 4: Initialize memory system
        self.memory = None
        if enable_memory and MEMORY_AVAILABLE:
            try:
                self.memory = JarvisMemoryManager()
                print("✅ Memory system integrated")
            except Exception as e:
                print(f"⚠️  Memory system unavailable: {e}")

        # Phase 4: Initialize skill discovery
        self.skill_discovery = None
        if enable_skill_discovery and SKILL_DISCOVERY_AVAILABLE:
            try:
                self.skill_discovery = SkillDiscovery()
                discovered = self.skill_discovery.discover_skills(check_deps=False)
                print(f"✅ Skill discovery: {len(discovered)} skills available")
            except Exception as e:
                print(f"⚠️  Skill discovery unavailable: {e}")

        # Statistics
        self.requests_processed = 0
        self.token_savings_total = 0

    def process(self, user_request: str) -> BrainResponse:
        """
        Main entry point - process any user request.

        This is what Claude Code calls to understand what to do.

        Args:
            user_request: Natural language request from user

        Returns:
            BrainResponse with complete execution instructions

        Example:
            >>> brain = JarvisBrain()
            >>> response = brain.process("Create video about AI news")
            >>> print(response.summary)
            "🔄 Multi-Step Workflow: Create YouTube Video (Complete)
             4 steps: Research → Script → Images → Launch Package"
        """
        self.requests_processed += 1

        # Phase 4: Search memory for relevant context
        memory_context = self._search_memory(user_request)

        # Phase 4: Get available skills
        available_skills = self._get_available_skills(user_request)

        # Step 1: Check for workflow first
        workflow = self.orchestrator.detect_workflow(user_request)

        if workflow:
            return self._handle_workflow(user_request, workflow, memory_context, available_skills)

        # Step 2: No workflow - route as single capability
        routing_decision = self.router.route(user_request)

        return self._handle_single_capability(user_request, routing_decision, memory_context, available_skills)

    def _search_memory(self, query: str, limit: int = 3) -> List[Dict]:
        """
        Search memory for relevant context using memory layer routing.

        Memory Layers:
        - L1 (Session): Recent conversation context
        - L2 (Long-term): Vector + keyword hybrid search
        - L3 (Preferences): User preferences (always loaded)

        Args:
            query: Search query
            limit: Maximum results

        Returns:
            List of relevant memory documents
        """
        if not self.memory:
            return []

        try:
            # Determine memory layer based on query
            layer = self._select_memory_layer(query)

            if layer == "session":
                # L1: Session buffer (not implemented yet - future enhancement)
                # For now, fall through to hybrid search
                pass

            # L2: Long-term hybrid search
            results = self.memory.search(query, limit=limit, search_mode="hybrid")

            # Format results for Brain context
            return [
                {
                    "content": result.document.content[:200],  # Truncate for context
                    "score": result.score,
                    "metadata": result.document.metadata
                }
                for result in results
            ]

        except Exception as e:
            print(f"⚠️  Memory search failed: {e}")
            return []

    def _select_memory_layer(self, query: str) -> str:
        """
        Select appropriate memory layer based on query.

        Args:
            query: User query

        Returns:
            "session", "longterm", or "preferences"
        """
        # Recency keywords → Session layer (L1)
        recency_keywords = ["just", "last", "recent", "current", "now", "latest", "today"]
        if any(kw in query.lower() for kw in recency_keywords):
            return "session"

        # Pattern/learning keywords → Long-term layer (L2)
        pattern_keywords = ["pattern", "learn", "remember", "always", "usually", "history"]
        if any(kw in query.lower() for kw in pattern_keywords):
            return "longterm"

        # Preference keywords → Preferences layer (L3)
        preference_keywords = ["prefer", "like", "want", "style", "tolerance", "settings"]
        if any(kw in query.lower() for kw in preference_keywords):
            return "preferences"

        # Default: Hybrid (search all layers)
        return "longterm"

    def _get_available_skills(self, query: str) -> List[str]:
        """
        Get available skills relevant to query.

        Args:
            query: User query

        Returns:
            List of skill names
        """
        if not self.skill_discovery:
            return []

        try:
            # Get all available (valid, no warnings) skills
            skills = self.skill_discovery.get_available_skills()
            return [skill.name for skill in skills]

        except Exception as e:
            print(f"⚠️  Skill discovery failed: {e}")
            return []

    def _handle_workflow(self, user_request: str, workflow: Workflow,
                        memory_context: List[Dict], available_skills: List[str]) -> BrainResponse:
        """
        Handle multi-step workflow requests.

        Args:
            user_request: Original user request
            workflow: Detected workflow

        Returns:
            BrainResponse with workflow execution plan
        """
        # Get first step intent for metadata
        first_step = workflow.steps[0]
        intent = Intent(
            primary_action=workflow.name,
            domain=first_step.app_id,
            confidence=0.95,  # Workflow detection is high confidence
            matched_app=first_step.app_id,
            matched_capability=first_step.capability_id,
            capability_name=workflow.name,
            keywords_matched=[],
            is_workflow=True
        )

        # Create routing decision
        routing_decision = RoutingDecision(
            decision_type="route_direct",
            intent=intent,
            execute_capability=f"workflow.{workflow.workflow_id}",
            confidence=0.95,
            reasoning=f"Detected {len(workflow.steps)}-step workflow"
        )

        # Generate execution plan
        execution_plan = self.orchestrator.get_workflow_plan(workflow)

        # Generate summary
        summary = self.orchestrator.explain_workflow(workflow)
        summary += f"\n⏱️  Estimated Duration: {self.orchestrator.estimate_duration(workflow)}\n"

        # Check if confirmation needed
        requires_confirmation = self.orchestrator.requires_user_confirmation(workflow)

        # Estimate token savings
        # Traditional approach: Read all SKILL.md files for all steps (2,500-6,300 tokens each)
        # JARVIS Brain: Single workflow plan (400-900 tokens)
        traditional_tokens = len(workflow.steps) * 4000  # Average 4,000 per skill
        brain_tokens = 650  # Average workflow plan size
        savings_pct = int((1 - brain_tokens / traditional_tokens) * 100)
        token_savings = f"{savings_pct}% ({traditional_tokens - brain_tokens:,} tokens saved)"

        self.token_savings_total += (traditional_tokens - brain_tokens)

        return BrainResponse(
            response_type="workflow",
            user_request=user_request,
            intent=intent,
            routing_decision=routing_decision,
            workflow=workflow,
            execution_plan=execution_plan,
            summary=summary,
            confidence=0.95,
            requires_confirmation=requires_confirmation,
            token_savings_estimate=token_savings,
            memory_context=memory_context,
            available_skills=available_skills
        )

    def _handle_single_capability(
        self,
        user_request: str,
        routing_decision: RoutingDecision,
        memory_context: List[Dict],
        available_skills: List[str]
    ) -> BrainResponse:
        """
        Handle single capability requests.

        Args:
            user_request: Original user request
            routing_decision: Routing decision from CapabilityRouter

        Returns:
            BrainResponse with execution instructions
        """
        # Determine response type
        if routing_decision.decision_type == "route_direct":
            response_type = "single_capability"
            requires_confirmation = False
        elif routing_decision.decision_type == "confirm_first":
            response_type = "confirmation_needed"
            requires_confirmation = True
        elif routing_decision.decision_type == "clarify":
            response_type = "clarification_needed"
            requires_confirmation = False
        else:
            response_type = "no_match"
            requires_confirmation = False

        # Generate execution plan
        execution_plan = self._generate_capability_plan(routing_decision)

        # Generate summary
        summary = self.router.explain_routing(routing_decision)

        # Estimate token savings
        # Traditional: Read full SKILL.md (2,500-6,300 tokens)
        # Brain: Routing decision + minimal context (400-900 tokens)
        traditional_tokens = 4000
        brain_tokens = 650
        savings_pct = int((1 - brain_tokens / traditional_tokens) * 100)
        token_savings = f"{savings_pct}% ({traditional_tokens - brain_tokens:,} tokens saved)"

        self.token_savings_total += (traditional_tokens - brain_tokens)

        return BrainResponse(
            response_type=response_type,
            user_request=user_request,
            intent=routing_decision.intent,
            routing_decision=routing_decision,
            workflow=None,
            execution_plan=execution_plan,
            summary=summary,
            confidence=routing_decision.confidence,
            requires_confirmation=requires_confirmation,
            token_savings_estimate=token_savings,
            memory_context=memory_context,
            available_skills=available_skills
        )

    def _generate_capability_plan(self, decision: RoutingDecision) -> str:
        """
        Generate execution plan for single capability.

        Args:
            decision: Routing decision

        Returns:
            Formatted execution plan string
        """
        if decision.decision_type == "route_direct":
            plan = f"# Execute: {decision.intent.capability_name}\n\n"
            plan += f"**Capability:** `{decision.execute_capability}`\n"
            plan += f"**Confidence:** {decision.confidence:.0%}\n"
            plan += f"**Domain:** {decision.intent.domain}\n\n"
            plan += "## Action\n"
            plan += f"Execute the `{decision.execute_capability}` capability immediately.\n\n"
            plan += "## After Execution\n"
            plan += "- Update work-status.md with results\n"
            plan += "- Notify user of completion\n"
            return plan

        elif decision.decision_type == "confirm_first":
            plan = f"# Confirm Before Executing: {decision.intent.capability_name}\n\n"
            plan += f"**Capability:** `{decision.execute_capability}`\n"
            plan += f"**Confidence:** {decision.confidence:.0%} (medium)\n\n"
            plan += "## Required Confirmation\n"
            plan += f"{decision.confirmation_message}\n\n"
            plan += "## If User Confirms\n"
            plan += f"Execute `{decision.execute_capability}`\n"
            return plan

        elif decision.decision_type == "clarify":
            plan = "# Clarification Needed\n\n"
            plan += f"**Confidence:** {decision.confidence:.0%} (low)\n\n"
            plan += "## Ask User to Choose\n"
            if decision.clarification_options:
                for i, opt in enumerate(decision.clarification_options, 1):
                    plan += f"{i}. {opt['capability_name']}\n"
            return plan

        else:  # no_match or show_options
            plan = "# No Matching Capability\n\n"
            plan += f"{decision.fallback_message}\n\n"
            plan += "## Available Capabilities\n"
            plan += self.router.list_capabilities()
            return plan

    def get_statistics(self) -> Dict:
        """
        Get JARVIS Brain usage statistics.

        Returns:
            Dictionary with usage stats and token savings
        """
        return {
            "requests_processed": self.requests_processed,
            "total_token_savings": self.token_savings_total,
            "estimated_cost_savings": f"${self.token_savings_total * 0.000003:.2f}",  # $3 per 1M tokens
            "average_savings_per_request": int(self.token_savings_total / max(1, self.requests_processed))
        }

    def process_interactive(self) -> None:
        """
        Interactive mode for testing JARVIS Brain.

        Enter requests and see how Brain processes them.
        """
        print("🧠 JARVIS Brain - Interactive Mode")
        print("=" * 70)
        print("Enter requests to see how JARVIS Brain processes them.")
        print("Type 'quit' to exit, 'stats' for statistics.\n")

        while True:
            try:
                user_input = input("\n💬 Request: ").strip()

                if not user_input:
                    continue

                if user_input.lower() == 'quit':
                    print("\n👋 Goodbye!")
                    break

                if user_input.lower() == 'stats':
                    stats = self.get_statistics()
                    print("\n📊 Statistics:")
                    print(f"   Requests Processed: {stats['requests_processed']}")
                    print(f"   Total Token Savings: {stats['total_token_savings']:,}")
                    print(f"   Estimated Cost Savings: {stats['estimated_cost_savings']}")
                    print(f"   Avg Savings/Request: {stats['average_savings_per_request']:,} tokens")
                    continue

                # Process request
                response = self.process(user_input)

                # Display results
                print(f"\n{response.summary}")
                print(f"\n💾 Token Savings: {response.token_savings_estimate}")

                if response.requires_confirmation:
                    print("\n⚠️  User confirmation required before execution")

                # Show execution plan if requested
                show_plan = input("\n📋 Show execution plan? (y/n): ").strip().lower()
                if show_plan == 'y':
                    print(f"\n{response.execution_plan}")

            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")
                import traceback
                traceback.print_exc()


def main():
    """Run JARVIS Brain in interactive mode or with test cases."""
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        # Interactive mode
        brain = JarvisBrain()
        brain.process_interactive()
    else:
        # Test cases
        brain = JarvisBrain()

        test_requests = [
            # Single capabilities
            "Get today's AI news",
            "Find me the best ETF to buy right now",
            "Create a YouTube promotion packet for Observability",

            # Workflows
            "Build my portfolio",
            "Create a video about AI news",
            "Create a video about my portfolio performance",

            # Edge cases
            "What's happening in the market?",
            "Help me with investing",
        ]

        print("🧠 JARVIS Brain - Integration Test")
        print("=" * 70)
        print("\nTesting all orchestrator components working together:\n")

        for i, request in enumerate(test_requests, 1):
            print(f"\n{'='*70}")
            print(f"Test {i}/{len(test_requests)}: \"{request}\"")
            print('='*70)

            response = brain.process(request)

            print(f"\n{response.summary}")
            print(f"\n💾 Token Savings: {response.token_savings_estimate}")

            if response.requires_confirmation:
                print("⚠️  Requires user confirmation")

            print()

        # Show final statistics
        print("\n" + "=" * 70)
        print("📊 Final Statistics")
        print("=" * 70)
        stats = brain.get_statistics()
        print(f"Requests Processed: {stats['requests_processed']}")
        print(f"Total Token Savings: {stats['total_token_savings']:,} tokens")
        print(f"Estimated Cost Savings: {stats['estimated_cost_savings']}")
        print(f"Average Savings per Request: {stats['average_savings_per_request']:,} tokens")
        print("\n✅ JARVIS Brain integration test complete!\n")


if __name__ == "__main__":
    main()
