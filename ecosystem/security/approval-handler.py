#!/usr/bin/env python3
"""
JARVIS Approval Handler

Implements human-in-the-loop approval for high-risk operations.

Security Gates:
1. High-security skills (portfolio-builder, social-poster)
2. Destructive operations (delete, reset, force-push)
3. Financial transactions (portfolio changes)
4. Public actions (social media posts)

Part of Phase 5: Security Validation
"""

import sys
import json
from pathlib import Path
from typing import Dict, Optional, List
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class ApprovalRequest:
    """Request for user approval"""
    skill_name: str
    action_description: str
    security_level: str
    operations: List[str]
    params: Dict
    risks: List[str]
    timestamp: str


@dataclass
class ApprovalResponse:
    """User response to approval request"""
    approved: bool
    reason: Optional[str]
    timestamp: str
    modifications: Optional[Dict] = None


class ApprovalHandler:
    """
    Manages approval workflow for high-risk operations.

    Approval Flow:
    1. Skill requests approval
    2. Handler formats approval request
    3. User reviews and approves/denies
    4. Handler logs decision
    5. Skill proceeds or aborts
    """

    def __init__(self, log_path: Optional[Path] = None):
        """
        Initialize approval handler.

        Args:
            log_path: Path to approval log (default: ~/.jarvis/approvals.log)
        """
        if log_path is None:
            log_path = Path.home() / ".jarvis" / "approvals.log"

        self.log_path = log_path
        self.log_path.parent.mkdir(parents=True, exist_ok=True)

    def request_approval(
        self,
        skill_name: str,
        action_description: str,
        security_level: str,
        operations: List[str],
        params: Dict,
        risks: Optional[List[str]] = None
    ) -> ApprovalResponse:
        """
        Request user approval for operation.

        Args:
            skill_name: Name of skill requesting approval
            action_description: Human-readable description of action
            security_level: Security level (low/medium/high)
            operations: List of operations (read/write/delete/execute/network)
            params: Skill parameters
            risks: List of identified risks

        Returns:
            ApprovalResponse with user decision
        """
        risks = risks or []

        # Create approval request
        request = ApprovalRequest(
            skill_name=skill_name,
            action_description=action_description,
            security_level=security_level,
            operations=operations,
            params=params,
            risks=risks,
            timestamp=datetime.now().isoformat()
        )

        # Display approval prompt
        self._display_approval_prompt(request)

        # Get user decision
        approved, reason, modifications = self._get_user_decision(request)

        # Create response
        response = ApprovalResponse(
            approved=approved,
            reason=reason,
            timestamp=datetime.now().isoformat(),
            modifications=modifications
        )

        # Log decision
        self._log_approval(request, response)

        return response

    def _display_approval_prompt(self, request: ApprovalRequest):
        """
        Display approval prompt to user.

        Args:
            request: Approval request
        """
        print("\n" + "=" * 70)
        print("🔒 APPROVAL REQUIRED")
        print("=" * 70)
        print(f"\nSkill: {request.skill_name}")
        print(f"Security Level: {request.security_level.upper()}")
        print(f"\nAction: {request.action_description}")
        print(f"\nOperations: {', '.join(request.operations)}")

        if request.params:
            print(f"\nParameters:")
            for key, value in request.params.items():
                # Truncate long values
                value_str = str(value)
                if len(value_str) > 60:
                    value_str = value_str[:57] + "..."
                print(f"  {key}: {value_str}")

        if request.risks:
            print(f"\n⚠️  Identified Risks:")
            for risk in request.risks:
                print(f"  - {risk}")

        print("\n" + "=" * 70)

    def _get_user_decision(self, request: ApprovalRequest) -> tuple:
        """
        Get user decision via command-line prompt.

        Args:
            request: Approval request

        Returns:
            Tuple of (approved, reason, modifications)
        """
        while True:
            decision = input("\nApprove this action? (yes/no/modify): ").strip().lower()

            if decision in ["yes", "y"]:
                reason = input("Reason (optional): ").strip() or "User approved"
                return True, reason, None

            elif decision in ["no", "n"]:
                reason = input("Reason for denial: ").strip() or "User denied"
                return False, reason, None

            elif decision in ["modify", "m"]:
                print("\nModification not yet implemented.")
                print("Please approve or deny the action as-is.")
                continue

            else:
                print("Invalid input. Please enter 'yes', 'no', or 'modify'.")

    def _log_approval(self, request: ApprovalRequest, response: ApprovalResponse):
        """
        Log approval decision.

        Args:
            request: Approval request
            response: User response
        """
        log_entry = {
            "request": asdict(request),
            "response": asdict(response)
        }

        try:
            with open(self.log_path, 'a') as f:
                f.write(json.dumps(log_entry) + "\n")
        except Exception as e:
            print(f"⚠️  Failed to log approval: {e}")

    def get_approval_history(self, skill_name: Optional[str] = None, limit: int = 10) -> List[Dict]:
        """
        Get approval history.

        Args:
            skill_name: Filter by skill name (optional)
            limit: Maximum number of entries to return

        Returns:
            List of approval log entries
        """
        if not self.log_path.exists():
            return []

        history = []
        try:
            with open(self.log_path, 'r') as f:
                for line in f:
                    entry = json.loads(line.strip())

                    if skill_name:
                        if entry["request"]["skill_name"] == skill_name:
                            history.append(entry)
                    else:
                        history.append(entry)

                    if len(history) >= limit:
                        break

        except Exception as e:
            print(f"⚠️  Failed to read approval history: {e}")

        return history

    def get_approval_stats(self) -> Dict:
        """
        Get approval statistics.

        Returns:
            Dictionary with approval stats
        """
        if not self.log_path.exists():
            return {"total": 0, "approved": 0, "denied": 0}

        stats = {
            "total": 0,
            "approved": 0,
            "denied": 0,
            "by_skill": {},
            "by_security_level": {"low": 0, "medium": 0, "high": 0}
        }

        try:
            with open(self.log_path, 'r') as f:
                for line in f:
                    entry = json.loads(line.strip())
                    stats["total"] += 1

                    if entry["response"]["approved"]:
                        stats["approved"] += 1
                    else:
                        stats["denied"] += 1

                    # By skill
                    skill_name = entry["request"]["skill_name"]
                    stats["by_skill"][skill_name] = stats["by_skill"].get(skill_name, 0) + 1

                    # By security level
                    level = entry["request"]["security_level"]
                    stats["by_security_level"][level] += 1

        except Exception as e:
            print(f"⚠️  Failed to calculate stats: {e}")

        return stats


# Convenience functions

_approval_handler = None


def get_approval_handler() -> ApprovalHandler:
    """Get global approval handler (singleton)"""
    global _approval_handler
    if _approval_handler is None:
        _approval_handler = ApprovalHandler()
    return _approval_handler


def request_approval(skill_name: str, action: str, **kwargs) -> bool:
    """
    Convenience function to request approval.

    Returns:
        True if approved, False if denied
    """
    handler = get_approval_handler()
    response = handler.request_approval(
        skill_name=skill_name,
        action_description=action,
        **kwargs
    )
    return response.approved


def main():
    """CLI entry point for testing"""
    import argparse

    parser = argparse.ArgumentParser(description="JARVIS Approval Handler")
    parser.add_argument("--test", action="store_true", help="Run test approval")
    parser.add_argument("--history", action="store_true", help="Show approval history")
    parser.add_argument("--stats", action="store_true", help="Show approval stats")
    parser.add_argument("--skill", help="Filter by skill name")

    args = parser.parse_args()

    handler = ApprovalHandler()

    if args.test:
        # Test approval flow
        response = handler.request_approval(
            skill_name="portfolio-builder",
            action_description="Allocate $100,000 portfolio: QQQ $25K, USO $10K, BIL $65K",
            security_level="high",
            operations=["read", "write", "network"],
            params={
                "total_capital": 100000,
                "allocations": {
                    "QQQ": 25000,
                    "USO": 10000,
                    "BIL": 65000
                }
            },
            risks=[
                "Financial transaction - capital deployment",
                "Portfolio modification",
                "Brokerage API interaction"
            ]
        )

        print(f"\n{'='*70}")
        print(f"Decision: {'✅ APPROVED' if response.approved else '❌ DENIED'}")
        print(f"Reason: {response.reason}")
        print(f"Timestamp: {response.timestamp}")
        print(f"{'='*70}\n")

    elif args.history:
        # Show approval history
        history = handler.get_approval_history(skill_name=args.skill)

        print("\n📋 Approval History\n")
        for i, entry in enumerate(history, 1):
            request = entry["request"]
            response = entry["response"]

            print(f"{i}. {request['skill_name']}")
            print(f"   Action: {request['action_description']}")
            print(f"   Decision: {'✅ Approved' if response['approved'] else '❌ Denied'}")
            print(f"   Time: {request['timestamp']}")
            print()

    elif args.stats:
        # Show approval statistics
        stats = handler.get_approval_stats()

        print("\n📊 Approval Statistics\n")
        print(f"Total Requests: {stats['total']}")
        print(f"Approved: {stats['approved']} ({stats['approved']/max(1, stats['total'])*100:.1f}%)")
        print(f"Denied: {stats['denied']} ({stats['denied']/max(1, stats['total'])*100:.1f}%)")
        print()

        if stats['by_skill']:
            print("By Skill:")
            for skill, count in sorted(stats['by_skill'].items(), key=lambda x: -x[1]):
                print(f"  {skill}: {count}")
            print()

        print("By Security Level:")
        for level in ["low", "medium", "high"]:
            count = stats['by_security_level'][level]
            print(f"  {level}: {count}")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
