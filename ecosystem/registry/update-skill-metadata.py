#!/usr/bin/env python3
"""
Helper script to add metadata frontmatter to existing SKILL.md files
"""

from pathlib import Path
import sys

JARVIS_ROOT = Path(__file__).parent.parent.parent
SKILLS_DIR = JARVIS_ROOT / "skills"

# Skill metadata mapping (skill_name -> metadata dict)
SKILL_METADATA = {
    "etf-screener": {
        "name": "etf-screener",
        "description": "Analyze a universe of ETFs to identify which are in favorable market stages",
        "domain": "investment",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read", "network"],
        "bins": ["jarvis-price"],
        "env": ["ALPACA_API_KEY"],
        "version": "2.0.0",
        "tags": ["investment", "etf", "screening", "stage-detection"],
        "integrates_with": ["market-analysis", "portfolio-builder"],
        "feeds_into": ["portfolio-builder"],
        "consumes_from": ["market-analysis"]
    },
    "portfolio-builder": {
        "name": "portfolio-builder",
        "description": "Construct portfolio allocation with position sizing based on screened opportunities",
        "domain": "investment",
        "security_level": "high",
        "requires_approval": True,
        "allowed_operations": ["read", "write", "network"],
        "bins": ["jarvis-price"],
        "env": ["ALPACA_API_KEY"],
        "version": "2.0.0",
        "tags": ["investment", "portfolio", "allocation", "position-sizing"],
        "integrates_with": ["etf-screener", "portfolio-monitor"],
        "feeds_into": ["portfolio-monitor"],
        "consumes_from": ["etf-screener"]
    },
    "portfolio-monitor": {
        "name": "portfolio-monitor",
        "description": "Daily stop checks and weekly portfolio reviews for active positions",
        "domain": "investment",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read", "network"],
        "bins": ["jarvis-price"],
        "env": ["ALPACA_API_KEY"],
        "version": "2.0.0",
        "tags": ["investment", "monitoring", "stops", "alerts"],
        "integrates_with": ["portfolio-builder", "performance-tracker"],
        "feeds_into": ["performance-tracker"],
        "consumes_from": ["portfolio-builder"]
    },
    "performance-tracker": {
        "name": "performance-tracker",
        "description": "Monthly strategy validation and performance analytics",
        "domain": "investment",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read", "write", "network"],
        "bins": ["jarvis-price"],
        "env": ["ALPACA_API_KEY"],
        "version": "2.0.0",
        "tags": ["investment", "performance", "analytics", "validation"],
        "integrates_with": ["portfolio-monitor"],
        "feeds_into": [],
        "consumes_from": ["portfolio-monitor"]
    },
    "market-insights": {
        "name": "market-insights",
        "description": "Automated Chris Vermeulen YouTube analysis and insights extraction",
        "domain": "investment",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read", "network"],
        "bins": [],
        "env": [],
        "mcp_servers": ["youtube"],
        "version": "2.0.0",
        "tags": ["investment", "insights", "youtube", "automation"],
        "integrates_with": [],
        "feeds_into": ["market-analysis"],
        "consumes_from": []
    },
    "obsidian-manager": {
        "name": "obsidian-manager",
        "description": "Manage Obsidian vault organization across 7 domains",
        "domain": "productivity",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read", "write"],
        "bins": [],
        "env": [],
        "version": "2.0.0",
        "tags": ["productivity", "obsidian", "knowledge-management", "notes"],
        "integrates_with": [],
        "feeds_into": [],
        "consumes_from": []
    },
    "agent-browser": {
        "name": "agent-browser",
        "description": "Automated web browsing and content extraction",
        "domain": "general",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read", "network", "execute"],
        "bins": ["agent-browser"],
        "env": [],
        "version": "1.0.0",
        "tags": ["general", "web", "automation", "scraping"],
        "integrates_with": [],
        "feeds_into": [],
        "consumes_from": []
    },
    "image-generator-lovart": {
        "name": "image-generator-lovart",
        "description": "Generate images using Lovart API for content creation",
        "domain": "content-creation",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read", "write", "network"],
        "bins": [],
        "env": ["LOVART_API_KEY"],
        "version": "1.0.0",
        "tags": ["content-creation", "images", "generation", "api"],
        "integrates_with": ["byrddynasty-video-creator"],
        "feeds_into": ["byrddynasty-video-creator"],
        "consumes_from": []
    },
    "news-aggregator": {
        "name": "news-aggregator",
        "description": "Aggregate and analyze news from multiple sources",
        "domain": "research",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read", "network"],
        "bins": [],
        "env": [],
        "version": "1.0.0",
        "tags": ["research", "news", "aggregation", "analysis"],
        "integrates_with": [],
        "feeds_into": [],
        "consumes_from": []
    },
    "social-poster": {
        "name": "social-poster",
        "description": "Post content to social media platforms",
        "domain": "content-creation",
        "security_level": "high",
        "requires_approval": True,
        "allowed_operations": ["read", "write", "network"],
        "bins": [],
        "env": [],
        "mcp_servers": ["twitter", "linkedin"],
        "version": "1.0.0",
        "tags": ["content-creation", "social-media", "posting", "automation"],
        "integrates_with": [],
        "feeds_into": [],
        "consumes_from": []
    },
    "script-optimizer": {
        "name": "script-optimizer",
        "description": "Optimize video scripts for engagement and clarity",
        "domain": "content-creation",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read", "write"],
        "bins": [],
        "env": [],
        "version": "1.0.0",
        "tags": ["content-creation", "scripts", "optimization", "video"],
        "integrates_with": ["byrddynasty-video-creator"],
        "feeds_into": ["byrddynasty-video-creator"],
        "consumes_from": []
    },
    "video-standards-checker": {
        "name": "video-standards-checker",
        "description": "Check video content against Byrddynasty quality standards",
        "domain": "content-creation",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read"],
        "bins": [],
        "env": [],
        "version": "1.0.0",
        "tags": ["content-creation", "video", "quality", "standards"],
        "integrates_with": ["byrddynasty-video-creator"],
        "feeds_into": [],
        "consumes_from": ["byrddynasty-video-creator"]
    },
    "youtube-shorts-creator": {
        "name": "youtube-shorts-creator",
        "description": "Create YouTube Shorts content from long-form videos",
        "domain": "content-creation",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read", "write", "network"],
        "bins": [],
        "env": [],
        "version": "1.0.0",
        "tags": ["content-creation", "youtube", "shorts", "video"],
        "integrates_with": [],
        "feeds_into": [],
        "consumes_from": ["byrddynasty-video-creator"]
    },
    "image-repository-manager": {
        "name": "image-repository-manager",
        "description": "Manage and organize image repository for content creation",
        "domain": "content-creation",
        "security_level": "low",
        "requires_approval": False,
        "allowed_operations": ["read", "write"],
        "bins": [],
        "env": [],
        "version": "1.0.0",
        "tags": ["content-creation", "images", "repository", "management"],
        "integrates_with": ["byrddynasty-video-creator"],
        "feeds_into": ["byrddynasty-video-creator", "social-poster"],
        "consumes_from": ["image-generator-lovart"]
    },
    "byrddynasty-video-creator": {
        "name": "byrddynasty-video-creator",
        "description": "Create long-form Byrddynasty video content following VIDEO-CREATION-STANDARD",
        "domain": "content-creation",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read", "write"],
        "bins": [],
        "env": [],
        "version": "2.0.0",
        "tags": ["content-creation", "video", "byrddynasty", "long-form"],
        "integrates_with": ["script-optimizer", "image-repository-manager", "video-standards-checker"],
        "feeds_into": ["youtube-shorts-creator", "social-poster"],
        "consumes_from": ["script-optimizer", "image-repository-manager"]
    }
}


def generate_frontmatter(skill_name: str) -> str:
    """Generate YAML frontmatter for a skill"""
    meta = SKILL_METADATA.get(skill_name, {
        "name": skill_name,
        "description": f"JARVIS skill: {skill_name}",
        "domain": "general",
        "security_level": "medium",
        "requires_approval": False,
        "allowed_operations": ["read"],
        "bins": [],
        "env": [],
        "version": "1.0.0",
        "tags": [skill_name],
        "integrates_with": [],
        "feeds_into": [],
        "consumes_from": []
    })

    # Build frontmatter
    lines = ["---"]
    lines.append(f"name: {meta['name']}")
    lines.append(f"description: {meta['description']}")
    lines.append("metadata:")
    lines.append("  jarvis:")
    lines.append("    requires:")

    # bins
    lines.append("      bins:")
    if meta.get('bins'):
        for bin in meta['bins']:
            lines.append(f"        - {bin}")
    else:
        lines.append("        []")

    # env
    lines.append("      env:")
    if meta.get('env'):
        for env in meta['env']:
            lines.append(f"        - {env}")
    else:
        lines.append("        []")

    # config
    lines.append("      config: []")

    # mcp_servers
    lines.append("      mcp_servers:")
    if meta.get('mcp_servers'):
        for server in meta['mcp_servers']:
            lines.append(f"        - {server}")
    else:
        lines.append("        []")

    # primaryEnv
    if meta.get('env'):
        lines.append(f"    primaryEnv: {meta['env'][0]}")
    else:
        lines.append("    primaryEnv: \"\"")

    # domain
    lines.append(f"    domain: {meta['domain']}")

    # security_level
    lines.append(f"    security_level: {meta['security_level']}")

    # requires_approval
    lines.append(f"    requires_approval: {str(meta['requires_approval']).lower()}")

    # allowed_operations
    lines.append("    allowed_operations:")
    for op in meta['allowed_operations']:
        lines.append(f"      - {op}")

    # version
    lines.append(f"    version: {meta['version']}")

    # author
    lines.append("    author: JARVIS")

    # tags
    lines.append("    tags:")
    for tag in meta['tags']:
        lines.append(f"      - {tag}")

    # integrates_with
    lines.append("    integrates_with:")
    if meta['integrates_with']:
        for skill in meta['integrates_with']:
            lines.append(f"      - {skill}")
    else:
        lines.append("      []")

    # feeds_into
    lines.append("    feeds_into:")
    if meta['feeds_into']:
        for skill in meta['feeds_into']:
            lines.append(f"      - {skill}")
    else:
        lines.append("      []")

    # consumes_from
    lines.append("    consumes_from:")
    if meta['consumes_from']:
        for skill in meta['consumes_from']:
            lines.append(f"      - {skill}")
    else:
        lines.append("      []")

    lines.append("---")
    lines.append("")  # Empty line after frontmatter

    return "\n".join(lines)


def update_skill(skill_path: Path):
    """Add frontmatter to a SKILL.md file"""
    skill_name = skill_path.parent.name

    # Read existing content
    with open(skill_path, 'r') as f:
        content = f.read()

    # Check if already has frontmatter
    if content.startswith("---"):
        print(f"  ⚠️  Skipping {skill_name} (already has frontmatter)")
        return False

    # Generate frontmatter
    frontmatter = generate_frontmatter(skill_name)

    # Prepend frontmatter
    new_content = frontmatter + content

    # Write back
    with open(skill_path, 'w') as f:
        f.write(new_content)

    print(f"  ✅ Updated {skill_name}")
    return True


def main():
    """Update all skills with metadata"""
    print("🔧 Adding metadata frontmatter to all skills...")
    print()

    updated = 0
    skipped = 0

    for skill_dir in sorted(SKILLS_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue

        skill_md = skill_dir / "SKILL.md"
        if not skill_md.exists():
            continue

        if update_skill(skill_md):
            updated += 1
        else:
            skipped += 1

    print()
    print(f"{'='*70}")
    print(f"✅ Metadata update complete!")
    print(f"{'='*70}")
    print(f"Updated: {updated} skills")
    print(f"Skipped: {skipped} skills (already have metadata)")
    print()


if __name__ == "__main__":
    main()
