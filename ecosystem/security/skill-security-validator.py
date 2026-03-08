#!/usr/bin/env python3
"""
JARVIS Skill Security Validator

Validates skill execution against security policies:
1. Security level enforcement (low/medium/high)
2. Approval requirements for high-risk operations
3. Allowed operations verification
4. Destructive action prevention

Part of Phase 5: Security Validation
"""

import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

# Import skill discovery for metadata
import importlib.util
registry_path = Path(__file__).parent.parent / "registry" / "skill-discovery.py"
spec = importlib.util.spec_from_file_location("skill_discovery", registry_path)
skill_discovery_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(skill_discovery_module)
SkillDiscovery = skill_discovery_module.SkillDiscovery
SkillInfo = skill_discovery_module.SkillInfo


@dataclass
class SecurityValidation:
    """Result of security validation"""
    is_valid: bool
    requires_approval: bool
    security_level: str
    allowed_operations: List[str]
    blocked_operations: List[str]
    warnings: List[str]
    reason: str


class SkillSecurityValidator:
    """
    Validates skill execution against security policies.

    Security Levels:
    - LOW: Read-only, analysis, monitoring (auto-approved)
    - MEDIUM: Content creation, automation (auto-approved with logging)
    - HIGH: Financial decisions, public posting (requires explicit approval)

    Allowed Operations:
    - read: Read files, databases, APIs
    - write: Write files, create content
    - delete: Delete files, remove data
    - execute: Execute commands, run processes
    - network: Make network requests
    """

    def __init__(self):
        """Initialize security validator with skill discovery"""
        self.skill_discovery = SkillDiscovery()
        self.skills = self.skill_discovery.discover_skills(check_deps=False)

    def validate_skill_execution(
        self,
        skill_name: str,
        requested_operations: Optional[List[str]] = None,
        params: Optional[Dict] = None
    ) -> SecurityValidation:
        """
        Validate if skill can be executed with given operations.

        Args:
            skill_name: Name of skill to execute
            requested_operations: Operations the skill will perform
            params: Skill parameters (checked for destructive patterns)

        Returns:
            SecurityValidation with approval requirements
        """
        # Get skill info
        skill = self.skills.get(skill_name)
        if not skill:
            return SecurityValidation(
                is_valid=False,
                requires_approval=False,
                security_level="unknown",
                allowed_operations=[],
                blocked_operations=[],
                warnings=[],
                reason=f"Skill not found: {skill_name}"
            )

        # Extract security metadata
        jarvis_meta = skill.metadata.get("metadata", {}).get("jarvis", {})
        security_level = jarvis_meta.get("security_level", "medium")
        requires_approval = jarvis_meta.get("requires_approval", False)
        allowed_operations = jarvis_meta.get("allowed_operations", ["read"])

        # Determine requested operations
        if requested_operations is None:
            # Use skill's default operations
            requested_operations = allowed_operations

        # Check if requested operations are allowed
        blocked = [op for op in requested_operations if op not in allowed_operations]

        # Check for destructive patterns in params
        warnings = []
        if params:
            destructive_warnings = self._check_destructive_params(params)
            warnings.extend(destructive_warnings)

        # Determine if approval is required
        approval_required = (
            requires_approval or  # Skill explicitly requires approval
            security_level == "high" or  # High security always requires approval
            len(blocked) > 0 or  # Blocked operations require approval
            len(warnings) > 0  # Warnings require confirmation
        )

        # Generate reason
        if blocked:
            reason = f"Blocked operations: {', '.join(blocked)}"
        elif approval_required and security_level == "high":
            reason = f"High security skill requires approval"
        elif warnings:
            reason = f"Warnings detected: {len(warnings)} potential risks"
        else:
            reason = f"Security level {security_level} - approved"

        return SecurityValidation(
            is_valid=len(blocked) == 0,  # Valid if no blocked operations
            requires_approval=approval_required,
            security_level=security_level,
            allowed_operations=allowed_operations,
            blocked_operations=blocked,
            warnings=warnings,
            reason=reason
        )

    def _check_destructive_params(self, params: Dict) -> List[str]:
        """
        Check parameters for destructive patterns.

        Args:
            params: Skill parameters

        Returns:
            List of warning messages
        """
        warnings = []

        # Convert all params to strings for pattern matching
        param_str = str(params).lower()

        # Destructive patterns
        destructive_patterns = {
            "delete": ["delete", "remove", "drop", "truncate"],
            "overwrite": ["overwrite", "replace", "force"],
            "reset": ["reset", "clear", "wipe"],
            "force_push": ["force-push", "force push", "--force"],
            "no_verify": ["--no-verify", "skip-hooks", "no-gpg-sign"]
        }

        for category, patterns in destructive_patterns.items():
            for pattern in patterns:
                if pattern in param_str:
                    warnings.append(
                        f"Destructive pattern detected: '{pattern}' ({category})"
                    )

        return warnings

    def validate_by_security_level(self, security_level: str) -> bool:
        """
        Check if security level is valid.

        Args:
            security_level: Security level to validate

        Returns:
            True if valid
        """
        valid_levels = ["low", "medium", "high"]
        return security_level in valid_levels

    def get_high_security_skills(self) -> List[SkillInfo]:
        """
        Get all high-security skills.

        Returns:
            List of SkillInfo for high-security skills
        """
        return [
            skill for skill in self.skills.values()
            if skill.metadata.get("metadata", {}).get("jarvis", {}).get("security_level") == "high"
        ]

    def get_skills_requiring_approval(self) -> List[SkillInfo]:
        """
        Get all skills that require explicit approval.

        Returns:
            List of SkillInfo for skills requiring approval
        """
        return [
            skill for skill in self.skills.values()
            if skill.metadata.get("metadata", {}).get("jarvis", {}).get("requires_approval", False)
        ]

    def generate_security_report(self) -> str:
        """
        Generate security report for all skills.

        Returns:
            Formatted security report
        """
        report = []
        report.append("# JARVIS Skill Security Report")
        report.append("=" * 70)
        report.append("")

        # Count by security level
        by_level = {"low": 0, "medium": 0, "high": 0}
        for skill in self.skills.values():
            level = skill.metadata.get("metadata", {}).get("jarvis", {}).get("security_level", "medium")
            by_level[level] = by_level.get(level, 0) + 1

        report.append(f"Total Skills: {len(self.skills)}")
        report.append(f"  Low Security: {by_level['low']}")
        report.append(f"  Medium Security: {by_level['medium']}")
        report.append(f"  High Security: {by_level['high']}")
        report.append("")

        # High security skills
        high_security = self.get_high_security_skills()
        if high_security:
            report.append("## High Security Skills (Require Approval)")
            report.append("-" * 70)
            for skill in high_security:
                jarvis_meta = skill.metadata.get("metadata", {}).get("jarvis", {})
                operations = ", ".join(jarvis_meta.get("allowed_operations", []))
                report.append(f"- {skill.name} ({skill.domain})")
                report.append(f"  Operations: {operations}")
                report.append(f"  Requires Approval: {jarvis_meta.get('requires_approval', False)}")
            report.append("")

        # Skills requiring approval
        approval_required = self.get_skills_requiring_approval()
        report.append(f"## Skills Requiring Explicit Approval: {len(approval_required)}")
        report.append("-" * 70)
        for skill in approval_required:
            report.append(f"- {skill.name} ({skill.domain}) - {skill.security_level}")
        report.append("")

        # Operations summary
        operations_count = {}
        for skill in self.skills.values():
            jarvis_meta = skill.metadata.get("metadata", {}).get("jarvis", {})
            for op in jarvis_meta.get("allowed_operations", []):
                operations_count[op] = operations_count.get(op, 0) + 1

        report.append("## Operations Summary")
        report.append("-" * 70)
        for op, count in sorted(operations_count.items()):
            report.append(f"- {op}: {count} skills")
        report.append("")

        return "\n".join(report)


def main():
    """CLI entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="JARVIS Skill Security Validator")
    parser.add_argument("--validate", help="Validate specific skill")
    parser.add_argument("--operations", nargs="+", help="Requested operations")
    parser.add_argument("--report", action="store_true", help="Generate security report")
    parser.add_argument("--high-security", action="store_true", help="List high-security skills")

    args = parser.parse_args()

    validator = SkillSecurityValidator()

    if args.report:
        # Generate and print security report
        report = validator.generate_security_report()
        print(report)

    elif args.high_security:
        # List high-security skills
        high_skills = validator.get_high_security_skills()
        print("\n🔒 High Security Skills\n")
        for skill in high_skills:
            print(f"- {skill.name} ({skill.domain})")
            jarvis_meta = skill.metadata.get("metadata", {}).get("jarvis", {})
            print(f"  Approval Required: {jarvis_meta.get('requires_approval', False)}")
            print(f"  Operations: {', '.join(jarvis_meta.get('allowed_operations', []))}")
            print()

    elif args.validate:
        # Validate specific skill
        validation = validator.validate_skill_execution(
            skill_name=args.validate,
            requested_operations=args.operations
        )

        print(f"\n{'='*70}")
        print(f"Security Validation: {args.validate}")
        print(f"{'='*70}\n")
        print(f"Valid: {validation.is_valid}")
        print(f"Security Level: {validation.security_level}")
        print(f"Requires Approval: {validation.requires_approval}")
        print(f"Allowed Operations: {', '.join(validation.allowed_operations)}")

        if validation.blocked_operations:
            print(f"Blocked Operations: {', '.join(validation.blocked_operations)}")

        if validation.warnings:
            print(f"\nWarnings:")
            for warning in validation.warnings:
                print(f"  - {warning}")

        print(f"\nReason: {validation.reason}")
        print()

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
