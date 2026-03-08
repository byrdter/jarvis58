#!/usr/bin/env python3
"""
JARVIS Brain - Workflow Orchestrator

Detects and executes multi-step workflows that require chaining multiple capabilities.

Example:
    "Create a video about my portfolio performance"
    → Step 1: track_performance (get data)
    → Step 2: create_script (write script using data)
    → Step 3: create_launch_package (YouTube package)

Part of Phase 2B Week 3: Workflow Orchestrator implementation.
"""

import sys
import json
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from pathlib import Path
from intent_recognizer import Intent, IntentRecognizer


@dataclass
class WorkflowStep:
    """Single step in a multi-step workflow"""
    step_number: int
    app_id: str
    capability_id: str
    capability_name: str

    # Input/output mapping
    inputs: Dict[str, str] = field(default_factory=dict)  # {param: source}
    outputs: List[str] = field(default_factory=list)

    # Execution metadata
    status: str = "pending"  # pending, in_progress, completed, failed
    result: Optional[Dict] = None
    error: Optional[str] = None


@dataclass
class Workflow:
    """Complete multi-step workflow"""
    workflow_id: str
    name: str
    description: str
    steps: List[WorkflowStep]

    # Execution mode
    execution_mode: str = "sequential"  # sequential or parallel

    # State tracking
    current_step: int = 0
    status: str = "pending"  # pending, in_progress, completed, failed

    # Results
    step_results: Dict[int, Dict] = field(default_factory=dict)
    final_output: Optional[Dict] = None


class WorkflowOrchestrator:
    """
    Detects and orchestrates multi-step workflows.

    Capabilities:
    1. Detect when user request requires multiple steps
    2. Build workflow with proper sequencing
    3. Map outputs to inputs between steps
    4. Execute workflow (or return plan for Claude to execute)
    5. Handle errors and recovery

    Example:
        orchestrator = WorkflowOrchestrator(intent_recognizer)
        workflow = orchestrator.detect_workflow("Create video about portfolio")

        if workflow:
            print(f"Detected {len(workflow.steps)}-step workflow:")
            for step in workflow.steps:
                print(f"  {step.step_number}. {step.capability_name}")
    """

    def __init__(self, intent_recognizer: IntentRecognizer):
        """
        Initialize workflow orchestrator.

        Args:
            intent_recognizer: IntentRecognizer for capability lookup
        """
        self.recognizer = intent_recognizer
        self.predefined_workflows = self._load_predefined_workflows()

    def _load_predefined_workflows(self) -> Dict[str, Workflow]:
        """
        Load predefined workflow templates.

        Returns:
            Dictionary of workflow templates by name
        """
        workflows = {}

        # Workflow 1: Build Portfolio from Scratch
        workflows["build_portfolio_complete"] = Workflow(
            workflow_id="build_portfolio_complete",
            name="Build Portfolio from Scratch",
            description="Screen ETFs, select candidates, construct allocation",
            steps=[
                WorkflowStep(
                    step_number=1,
                    app_id="jarvis-investment",
                    capability_id="screen_opportunities",
                    capability_name="Screen ETF Opportunities",
                    inputs={},
                    outputs=["buy_candidates", "ranked_etfs"]
                ),
                WorkflowStep(
                    step_number=2,
                    app_id="jarvis-investment",
                    capability_id="build_portfolio",
                    capability_name="Build Portfolio",
                    inputs={
                        "capital_amount": "from_user_input",
                        "etf_candidates": "from_step_1.buy_candidates"
                    },
                    outputs=["portfolio_allocation"]
                ),
                WorkflowStep(
                    step_number=3,
                    app_id="knowledge-management",
                    capability_id="update_context",
                    capability_name="Update Context",
                    inputs={
                        "context_type": "investments",
                        "content": "from_step_2.portfolio_allocation"
                    },
                    outputs=["update_status"]
                )
            ],
            execution_mode="sequential"
        )

        # Workflow 2: Create YouTube Video (Complete Pipeline)
        workflows["create_youtube_video"] = Workflow(
            workflow_id="create_youtube_video",
            name="Create YouTube Video (Complete)",
            description="Research → Script → Images → Launch Package",
            steps=[
                WorkflowStep(
                    step_number=1,
                    app_id="research-aggregator",
                    capability_id="aggregate_news",
                    capability_name="Aggregate AI News",
                    inputs={"time_period": "from_user_input"},
                    outputs=["news_digest", "trending_topics"]
                ),
                WorkflowStep(
                    step_number=2,
                    app_id="content-creation",
                    capability_id="create_script",
                    capability_name="Create Video Script",
                    inputs={
                        "topic": "from_user_input",
                        "research_data": "from_step_1.news_digest"
                    },
                    outputs=["video_script", "image_prompts"]
                ),
                WorkflowStep(
                    step_number=3,
                    app_id="content-creation",
                    capability_id="generate_images",
                    capability_name="Generate Images",
                    inputs={"image_prompts": "from_step_2.image_prompts"},
                    outputs=["image_files"]
                ),
                WorkflowStep(
                    step_number=4,
                    app_id="content-creation",
                    capability_id="create_launch_package",
                    capability_name="Create Launch Package",
                    inputs={"video_topic": "from_user_input"},
                    outputs=["launch_package"]
                )
            ],
            execution_mode="sequential"
        )

        # Workflow 3: Portfolio Performance Video
        workflows["portfolio_performance_video"] = Workflow(
            workflow_id="portfolio_performance_video",
            name="Portfolio Performance Video",
            description="Track performance → Create video script → Launch package",
            steps=[
                WorkflowStep(
                    step_number=1,
                    app_id="jarvis-investment",
                    capability_id="track_performance",
                    capability_name="Track Performance",
                    inputs={"time_period": "from_user_input"},
                    outputs=["performance_report"]
                ),
                WorkflowStep(
                    step_number=2,
                    app_id="content-creation",
                    capability_id="create_script",
                    capability_name="Create Video Script",
                    inputs={
                        "topic": "portfolio_performance",
                        "research_data": "from_step_1.performance_report"
                    },
                    outputs=["video_script"]
                ),
                WorkflowStep(
                    step_number=3,
                    app_id="content-creation",
                    capability_id="create_launch_package",
                    capability_name="Create Launch Package",
                    inputs={"video_topic": "portfolio_performance"},
                    outputs=["launch_package"]
                )
            ],
            execution_mode="sequential"
        )

        return workflows

    def detect_workflow(self, user_request: str) -> Optional[Workflow]:
        """
        Detect if user request matches a predefined workflow.

        Args:
            user_request: User's natural language request

        Returns:
            Workflow if detected, None if single capability sufficient

        Example:
            >>> workflow = orchestrator.detect_workflow("Build my portfolio")
            >>> print(workflow.name)
            "Build Portfolio from Scratch"
        """
        request_lower = user_request.lower()

        # Check for workflow keywords (multi-keyword detection)
        # Order matters - more specific workflows first
        workflow_triggers = {
            "portfolio_performance_video": [
                ("video", "portfolio", "performance"),
                ("video", "portfolio"),
                ("video", "performance", "portfolio"),
            ],
            "create_youtube_video": [
                ("create", "video", "ai"),
                ("make", "video", "ai"),
                ("video", "ai", "news"),
                ("youtube", "video", "ai"),
            ],
            "build_portfolio_complete": [
                ("build", "portfolio"),
                ("allocate", "portfolio"),
                ("construct", "portfolio"),
            ],
        }

        # Match request to workflow triggers
        # Workflow matches if ALL keywords in a trigger are present
        # More specific (more keywords) should come first
        best_match = None
        best_match_specificity = 0

        for workflow_id, trigger_sets in workflow_triggers.items():
            for trigger_keywords in trigger_sets:
                if all(keyword in request_lower for keyword in trigger_keywords):
                    # Found a match - check if it's more specific than previous match
                    specificity = len(trigger_keywords)
                    if specificity > best_match_specificity:
                        best_match = workflow_id
                        best_match_specificity = specificity

        if best_match:
            return self.predefined_workflows[best_match]

        # No workflow detected - single capability should suffice
        return None

    def build_dynamic_workflow(
        self,
        intents: List[Intent],
        user_request: str
    ) -> Optional[Workflow]:
        """
        Build workflow dynamically from multiple detected intents.

        This is for requests that don't match predefined workflows
        but require multiple capabilities.

        Args:
            intents: List of Intent objects detected from request
            user_request: Original user request

        Returns:
            Dynamically constructed Workflow

        Example:
            >>> intents = [
            ...     Intent(matched_capability="analyze_etf", ...),
            ...     Intent(matched_capability="build_portfolio", ...)
            ... ]
            >>> workflow = orchestrator.build_dynamic_workflow(intents, request)
        """
        if len(intents) < 2:
            return None  # Not a workflow, single capability

        # Build workflow from intents
        steps = []
        for i, intent in enumerate(intents, 1):
            step = WorkflowStep(
                step_number=i,
                app_id=intent.matched_app,
                capability_id=intent.matched_capability,
                capability_name=intent.capability_name,
                inputs=self._resolve_inputs(i, steps),
                outputs=[f"step_{i}_output"]
            )
            steps.append(step)

        workflow = Workflow(
            workflow_id=f"dynamic_{hash(user_request)}",
            name="Dynamic Workflow",
            description=f"Auto-generated for: {user_request}",
            steps=steps,
            execution_mode="sequential"
        )

        return workflow

    def _resolve_inputs(
        self,
        step_number: int,
        previous_steps: List[WorkflowStep]
    ) -> Dict[str, str]:
        """
        Automatically resolve inputs for a step based on previous steps.

        Args:
            step_number: Current step number
            previous_steps: List of previous WorkflowStep objects

        Returns:
            Dictionary of input parameters with source mappings
        """
        if not previous_steps:
            return {}  # First step, no inputs from previous steps

        # Simple heuristic: output of previous step feeds current step
        prev_step = previous_steps[-1]

        return {
            "input_data": f"from_step_{prev_step.step_number}.{prev_step.outputs[0]}"
        }

    def explain_workflow(self, workflow: Workflow) -> str:
        """
        Generate human-readable explanation of workflow.

        Args:
            workflow: Workflow to explain

        Returns:
            Formatted string explaining the workflow
        """
        output = f"🔄 Multi-Step Workflow: {workflow.name}\n"
        output += f"   {workflow.description}\n\n"

        for step in workflow.steps:
            output += f"   Step {step.step_number}: {step.capability_name}\n"

            # Show inputs
            if step.inputs:
                for param, source in step.inputs.items():
                    if "from_step" in source:
                        output += f"      ← Input: {param} (from previous step)\n"
                    elif "from_user" in source:
                        output += f"      ← Input: {param} (you'll provide)\n"

            # Show outputs
            if step.outputs:
                output += f"      → Output: {', '.join(step.outputs)}\n"

            output += "\n"

        return output

    def requires_user_confirmation(self, workflow: Workflow) -> bool:
        """
        Determine if workflow requires user confirmation before execution.

        Args:
            workflow: Workflow to check

        Returns:
            True if confirmation needed, False otherwise
        """
        # Multi-step workflows should always confirm
        # (except for very common/safe workflows)

        safe_workflows = [
            "build_portfolio_complete",  # User explicitly asked
        ]

        if workflow.workflow_id in safe_workflows:
            return False

        return True  # Confirm by default for multi-step

    def estimate_duration(self, workflow: Workflow) -> str:
        """
        Estimate how long workflow will take.

        Args:
            workflow: Workflow to estimate

        Returns:
            Human-readable duration estimate
        """
        # Simple heuristic based on step count
        step_count = len(workflow.steps)

        if step_count <= 2:
            return "~30 seconds"
        elif step_count <= 3:
            return "~1-2 minutes"
        else:
            return f"~{step_count} minutes"

    def get_workflow_plan(self, workflow: Workflow) -> str:
        """
        Generate execution plan for Claude Code to follow.

        This is what Claude Code will read and execute step-by-step.

        Args:
            workflow: Workflow to execute

        Returns:
            Formatted execution plan
        """
        plan = f"# Workflow Execution Plan: {workflow.name}\n\n"
        plan += f"**Description:** {workflow.description}\n"
        plan += f"**Steps:** {len(workflow.steps)}\n"
        plan += f"**Mode:** {workflow.execution_mode}\n"
        plan += f"**Estimated Duration:** {self.estimate_duration(workflow)}\n\n"
        plan += "---\n\n"

        for step in workflow.steps:
            plan += f"## Step {step.step_number}: {step.capability_name}\n\n"
            plan += f"**App:** {step.app_id}\n"
            plan += f"**Capability:** {step.capability_id}\n\n"

            if step.inputs:
                plan += "**Inputs:**\n"
                for param, source in step.inputs.items():
                    plan += f"- `{param}`: {source}\n"
                plan += "\n"

            if step.outputs:
                plan += "**Outputs:**\n"
                for output in step.outputs:
                    plan += f"- `{output}`\n"
                plan += "\n"

            plan += f"**Action:** Execute `{step.app_id}.{step.capability_id}`\n\n"
            plan += "---\n\n"

        plan += "## After Completion\n\n"
        plan += "- Update work-status.md with workflow results\n"
        plan += "- Notify user of completion\n"
        plan += f"- Final output: {workflow.steps[-1].capability_name} result\n"

        return plan


def main():
    """Example usage and testing"""
    from pathlib import Path

    # Initialize
    registry_path = Path(__file__).parent.parent / "registry" / "apps.json"
    recognizer = IntentRecognizer(str(registry_path))
    orchestrator = WorkflowOrchestrator(recognizer)

    # Test workflow detection
    test_requests = [
        "Build my portfolio",
        "Create a video about AI news",
        "Create a video about my portfolio performance",
        "Analyze SPY",  # Single capability, not a workflow
    ]

    print("🔄 JARVIS Brain - Workflow Orchestrator Test\n")
    print("=" * 70)

    for request in test_requests:
        workflow = orchestrator.detect_workflow(request)

        print(f"\nRequest: \"{request}\"")

        if workflow:
            print(orchestrator.explain_workflow(workflow))
            print(f"   ⏱️  Estimated Duration: {orchestrator.estimate_duration(workflow)}")
            print(f"   ⚠️  Requires Confirmation: {orchestrator.requires_user_confirmation(workflow)}")
        else:
            print("   ✅ Single capability sufficient (no workflow needed)\n")

    print("=" * 70)
    print("\n✅ Workflow Orchestrator is working!\n")

    # Show example execution plan
    print("📋 Example Execution Plan:\n")
    workflow = orchestrator.predefined_workflows["portfolio_performance_video"]
    print(orchestrator.get_workflow_plan(workflow))


if __name__ == "__main__":
    main()
