#!/usr/bin/env python3
"""
JARVIS Skill Discovery Engine

Discovers skills from three locations with precedence:
1. Workspace skills (highest): ./skills/
2. User skills (medium): ~/.jarvis/skills/
3. Bundled skills (lowest): Built-in skills

OpenClaw-inspired pattern with JARVIS security enhancements.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
import importlib.util

# Add script directory to Python path for imports
SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(SCRIPT_DIR))

# Import skill validator using direct file import
spec = importlib.util.spec_from_file_location("skill_validator", SCRIPT_DIR / "skill-validator.py")
skill_validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(skill_validator)
SkillValidator = skill_validator.SkillValidator
JARVIS_ROOT = SCRIPT_DIR.parent.parent
WORKSPACE_SKILLS = JARVIS_ROOT / "skills"
USER_SKILLS = Path.home() / ".jarvis" / "skills"


@dataclass
class SkillInfo:
    """Information about a discovered skill"""
    name: str
    description: str
    source: str  # "workspace", "user", or "bundled"
    path: Path
    metadata: Dict
    valid: bool
    errors: List[str]
    warnings: List[str]
    security_level: str = "medium"
    domain: str = "general"
    version: str = "1.0.0"


class SkillDiscovery:
    """Discovers and manages skills from multiple locations"""

    def __init__(self):
        self.validator = SkillValidator()
        self.skills: Dict[str, SkillInfo] = {}

    def discover_skills(self, check_deps: bool = True) -> Dict[str, SkillInfo]:
        """
        Discover skills from all locations

        Returns:
            Dict mapping skill name to SkillInfo
        """
        # Define locations with precedence (first = highest)
        locations = [
            (WORKSPACE_SKILLS, "workspace"),
            (USER_SKILLS, "user"),
        ]

        discovered = {}

        for location, source in locations:
            if not location.exists():
                # Create user skills directory if it doesn't exist
                if source == "user":
                    location.mkdir(parents=True, exist_ok=True)
                    print(f"✨ Created user skills directory: {location}")
                continue

            # Scan for SKILL.md files
            for skill_dir in location.iterdir():
                if not skill_dir.is_dir():
                    continue

                skill_md = skill_dir / "SKILL.md"
                if not skill_md.exists():
                    continue

                # Parse and validate skill
                is_valid, result = self.validator.validate_skill(skill_md, check_deps=check_deps)

                if result["metadata"]:
                    skill_name = result["metadata"].get("name", skill_dir.name)

                    # Higher precedence wins (skip if already found)
                    if skill_name in discovered:
                        print(f"  ⚠️  Skipping {skill_name} from {source} (already loaded from {discovered[skill_name].source})")
                        continue

                    # Extract metadata
                    jarvis_meta = result["metadata"].get("metadata", {}).get("jarvis", {})

                    skill_info = SkillInfo(
                        name=skill_name,
                        description=result["metadata"].get("description", "No description"),
                        source=source,
                        path=skill_md,
                        metadata=result["metadata"],
                        valid=is_valid,
                        errors=result["errors"],
                        warnings=result["warnings"],
                        security_level=jarvis_meta.get("security_level", "medium"),
                        domain=jarvis_meta.get("domain", "general"),
                        version=jarvis_meta.get("version", "1.0.0")
                    )

                    discovered[skill_name] = skill_info

        self.skills = discovered
        return discovered

    def get_available_skills(self, domain: Optional[str] = None) -> List[SkillInfo]:
        """
        Get list of available (valid) skills

        Args:
            domain: Optional domain filter

        Returns:
            List of valid SkillInfo objects
        """
        available = [skill for skill in self.skills.values() if skill.valid and not skill.warnings]

        if domain:
            available = [skill for skill in available if skill.domain == domain]

        return sorted(available, key=lambda s: s.name)

    def get_skill(self, name: str) -> Optional[SkillInfo]:
        """Get skill by name"""
        return self.skills.get(name)

    def get_skills_by_domain(self) -> Dict[str, List[SkillInfo]]:
        """Group skills by domain"""
        by_domain = {}

        for skill in self.skills.values():
            domain = skill.domain
            if domain not in by_domain:
                by_domain[domain] = []
            by_domain[domain].append(skill)

        return by_domain

    def get_skills_by_security_level(self) -> Dict[str, List[SkillInfo]]:
        """Group skills by security level"""
        by_security = {}

        for skill in self.skills.values():
            level = skill.security_level
            if level not in by_security:
                by_security[level] = []
            by_security[level].append(skill)

        return by_security

    def print_summary(self):
        """Print discovery summary"""
        print(f"\n{'='*70}")
        print(f"JARVIS Skill Discovery Summary")
        print(f"{'='*70}")

        total = len(self.skills)
        valid = len([s for s in self.skills.values() if s.valid])
        with_warnings = len([s for s in self.skills.values() if s.warnings])
        invalid = len([s for s in self.skills.values() if not s.valid])

        print(f"Total skills discovered: {total}")
        print(f"  ✅ Valid: {valid}")
        print(f"  ⚠️  With warnings: {with_warnings}")
        print(f"  ❌ Invalid: {invalid}")

        # By source
        by_source = {}
        for skill in self.skills.values():
            source = skill.source
            by_source[source] = by_source.get(source, 0) + 1

        print(f"\nBy source:")
        for source, count in by_source.items():
            print(f"  {source}: {count}")

        # By domain
        by_domain = self.get_skills_by_domain()
        print(f"\nBy domain:")
        for domain, skills in sorted(by_domain.items()):
            print(f"  {domain}: {len(skills)}")

        # By security level
        by_security = self.get_skills_by_security_level()
        print(f"\nBy security level:")
        for level, skills in sorted(by_security.items()):
            print(f"  {level}: {len(skills)}")

        print(f"{'='*70}\n")

    def export_registry(self, output_path: Path):
        """Export skill registry to JSON"""
        registry = {
            "version": "1.0.0",
            "last_updated": None,  # Will be set by caller
            "total_skills": len(self.skills),
            "skills": {}
        }

        for name, skill in self.skills.items():
            registry["skills"][name] = {
                "name": skill.name,
                "description": skill.description,
                "source": skill.source,
                "path": str(skill.path),
                "valid": skill.valid,
                "domain": skill.domain,
                "security_level": skill.security_level,
                "version": skill.version,
                "errors": skill.errors,
                "warnings": skill.warnings
            }

        with open(output_path, 'w') as f:
            json.dump(registry, f, indent=2)

        print(f"✅ Registry exported to: {output_path}")


def main():
    """CLI entry point"""
    import argparse
    from datetime import datetime

    parser = argparse.ArgumentParser(description="Discover JARVIS skills")
    parser.add_argument("--no-deps", action="store_true", help="Skip dependency checks")
    parser.add_argument("--domain", help="Filter by domain")
    parser.add_argument("--export", help="Export registry to JSON file")
    parser.add_argument("--list", action="store_true", help="List all skills")
    parser.add_argument("--json", action="store_true", help="Output JSON format")

    args = parser.parse_args()

    # Discover skills
    discovery = SkillDiscovery()
    print("🔍 Discovering skills...")
    skills = discovery.discover_skills(check_deps=not args.no_deps)

    if args.json:
        # JSON output
        output = {
            "total": len(skills),
            "skills": [asdict(skill) for skill in skills.values()]
        }
        # Convert Path objects to strings
        for skill in output["skills"]:
            skill["path"] = str(skill["path"])
        print(json.dumps(output, indent=2))
    elif args.list:
        # List format
        if args.domain:
            available = discovery.get_available_skills(domain=args.domain)
        else:
            available = discovery.get_available_skills()

        print(f"\n{'Skill':<30} {'Domain':<15} {'Source':<12} {'Status':<10}")
        print(f"{'-'*70}")

        for skill in available:
            status = "✅" if skill.valid else "❌"
            if skill.warnings:
                status = "⚠️"
            print(f"{skill.name:<30} {skill.domain:<15} {skill.source:<12} {status:<10}")
    else:
        # Summary format
        discovery.print_summary()

        # Show invalid skills
        invalid = [s for s in skills.values() if not s.valid]
        if invalid:
            print("❌ Invalid skills:")
            for skill in invalid:
                print(f"  - {skill.name} ({skill.source})")
                for error in skill.errors:
                    print(f"    • {error}")

        # Show warnings
        with_warnings = [s for s in skills.values() if s.warnings and s.valid]
        if with_warnings:
            print("\n⚠️  Skills with warnings:")
            for skill in with_warnings:
                print(f"  - {skill.name} ({skill.source})")
                for warning in skill.warnings:
                    print(f"    • {warning}")

    # Export if requested
    if args.export:
        output_path = Path(args.export)
        discovery.export_registry(output_path)


if __name__ == "__main__":
    main()
