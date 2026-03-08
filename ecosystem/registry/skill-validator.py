#!/usr/bin/env python3
"""
JARVIS Skill Validator

Validates SKILL.md files against schema and checks dependencies.
"""

import json
import sys
import os
import yaml
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# Paths
SCRIPT_DIR = Path(__file__).parent
JARVIS_ROOT = SCRIPT_DIR.parent.parent
SKILL_SCHEMA_PATH = JARVIS_ROOT / "skills" / "SKILL-SCHEMA.json"


class SkillValidator:
    """Validates skills against schema and dependency requirements"""

    def __init__(self, schema_path: Path = SKILL_SCHEMA_PATH):
        self.schema_path = schema_path
        self.schema = self._load_schema()

    def _load_schema(self) -> Dict:
        """Load skill schema"""
        try:
            with open(self.schema_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Error: Schema not found: {self.schema_path}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"❌ Error: Invalid schema JSON: {e}")
            sys.exit(1)

    def parse_skill_md(self, skill_path: Path) -> Optional[Dict]:
        """Parse SKILL.md file and extract metadata"""
        try:
            with open(skill_path, 'r') as f:
                content = f.read()

            # Check for YAML frontmatter (---...---)
            frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)

            if not frontmatter_match:
                # No frontmatter found - skill needs updating
                return {
                    "name": skill_path.parent.name,
                    "description": "Legacy skill without metadata",
                    "metadata": {
                        "jarvis": {
                            "domain": "general",
                            "security_level": "medium",
                            "version": "1.0.0"
                        }
                    },
                    "_legacy": True
                }

            # Parse YAML frontmatter
            frontmatter_yaml = frontmatter_match.group(1)
            metadata = yaml.safe_load(frontmatter_yaml)

            return metadata

        except Exception as e:
            print(f"❌ Error parsing {skill_path}: {e}")
            return None

    def validate_schema(self, metadata: Dict) -> Tuple[bool, List[str]]:
        """Validate metadata against schema"""
        errors = []

        # Check required fields
        required = self.schema.get('required', [])
        for field in required:
            if field not in metadata:
                errors.append(f"Missing required field: {field}")

        # Validate name format
        name = metadata.get('name', '')
        if name:
            name_pattern = self.schema['properties']['name'].get('pattern', '')
            if name_pattern and not re.match(name_pattern, name):
                errors.append(f"Invalid name format: {name} (must be kebab-case)")

        # Validate domain
        if 'metadata' in metadata and 'jarvis' in metadata['metadata']:
            jarvis_meta = metadata['metadata']['jarvis']

            # Check domain is valid
            domain = jarvis_meta.get('domain')
            valid_domains = self.schema['properties']['metadata']['properties']['jarvis']['properties']['domain'].get('enum', [])
            if domain and domain not in valid_domains:
                errors.append(f"Invalid domain: {domain} (must be one of {', '.join(valid_domains)})")

            # Check security_level is valid
            security_level = jarvis_meta.get('security_level')
            valid_levels = self.schema['properties']['metadata']['properties']['jarvis']['properties']['security_level'].get('enum', [])
            if security_level and security_level not in valid_levels:
                errors.append(f"Invalid security_level: {security_level} (must be one of {', '.join(valid_levels)})")

            # Check allowed_operations are valid
            operations = jarvis_meta.get('allowed_operations', [])
            valid_ops = self.schema['properties']['metadata']['properties']['jarvis']['properties']['allowed_operations']['items'].get('enum', [])
            for op in operations:
                if op not in valid_ops:
                    errors.append(f"Invalid operation: {op} (must be one of {', '.join(valid_ops)})")

        return len(errors) == 0, errors

    def check_dependencies(self, metadata: Dict) -> Tuple[bool, List[str]]:
        """Check if required dependencies are available"""
        warnings = []

        if 'metadata' not in metadata or 'jarvis' not in metadata['metadata']:
            return True, []

        jarvis_meta = metadata['metadata']['jarvis']
        requires = jarvis_meta.get('requires', {})

        # Check required binaries
        bins = requires.get('bins', [])
        for bin_name in bins:
            if not self._check_binary(bin_name):
                warnings.append(f"Required binary not found: {bin_name}")

        # Check required environment variables
        env_vars = requires.get('env', [])
        for env_var in env_vars:
            if not os.getenv(env_var):
                warnings.append(f"Required environment variable not set: {env_var}")

        # Check MCP servers (if applicable)
        mcp_servers = requires.get('mcp_servers', [])
        for server in mcp_servers:
            # Check if MCP server is configured in settings.json
            if not self._check_mcp_server(server):
                warnings.append(f"Required MCP server not configured: {server}")

        return len(warnings) == 0, warnings

    def _check_binary(self, bin_name: str) -> bool:
        """Check if binary exists in PATH"""
        from shutil import which
        return which(bin_name) is not None

    def _check_mcp_server(self, server_name: str) -> bool:
        """Check if MCP server is configured in .claude/settings.json"""
        settings_path = JARVIS_ROOT / ".claude" / "settings.json"
        if not settings_path.exists():
            return False

        try:
            with open(settings_path, 'r') as f:
                settings = json.load(f)
            mcp_servers = settings.get('mcpServers', {})
            return server_name in mcp_servers
        except Exception:
            return False

    def validate_skill(self, skill_path: Path, check_deps: bool = True) -> Tuple[bool, Dict]:
        """
        Validate a skill

        Returns:
            (is_valid, result_dict)
        """
        result = {
            "skill_path": str(skill_path),
            "valid": False,
            "errors": [],
            "warnings": [],
            "metadata": None,
            "legacy": False
        }

        # Parse skill metadata
        metadata = self.parse_skill_md(skill_path)
        if metadata is None:
            result["errors"].append("Failed to parse SKILL.md")
            return False, result

        result["metadata"] = metadata
        result["legacy"] = metadata.get("_legacy", False)

        # Validate schema
        schema_valid, schema_errors = self.validate_schema(metadata)
        if not schema_valid:
            result["errors"].extend(schema_errors)

        # Check dependencies
        if check_deps:
            deps_ok, dep_warnings = self.check_dependencies(metadata)
            if not deps_ok:
                result["warnings"].extend(dep_warnings)

        # Skill is valid if no errors (warnings are OK)
        result["valid"] = len(result["errors"]) == 0

        return result["valid"], result


def main():
    """CLI entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="Validate JARVIS skills")
    parser.add_argument("skill_path", help="Path to SKILL.md file or skill directory")
    parser.add_argument("--no-deps", action="store_true", help="Skip dependency checks")
    parser.add_argument("--json", action="store_true", help="Output JSON format")

    args = parser.parse_args()

    # Resolve skill path
    skill_path = Path(args.skill_path)
    if skill_path.is_dir():
        skill_path = skill_path / "SKILL.md"

    if not skill_path.exists():
        print(f"❌ Error: SKILL.md not found: {skill_path}")
        sys.exit(1)

    # Validate
    validator = SkillValidator()
    is_valid, result = validator.validate_skill(skill_path, check_deps=not args.no_deps)

    # Output
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        # Human-readable output
        skill_name = result["metadata"].get("name", "unknown") if result["metadata"] else "unknown"

        if result["legacy"]:
            print(f"⚠️  Legacy skill (no metadata): {skill_name}")
            print("   Run with metadata to validate properly")
            sys.exit(1)

        if is_valid:
            print(f"✅ Valid: {skill_name}")

            if result["warnings"]:
                print(f"\n⚠️  Warnings:")
                for warning in result["warnings"]:
                    print(f"   - {warning}")
        else:
            print(f"❌ Invalid: {skill_name}")
            print(f"\nErrors:")
            for error in result["errors"]:
                print(f"   - {error}")

            if result["warnings"]:
                print(f"\nWarnings:")
                for warning in result["warnings"]:
                    print(f"   - {warning}")

            sys.exit(1)


if __name__ == "__main__":
    main()
