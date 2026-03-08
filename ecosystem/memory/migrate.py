#!/usr/bin/env python3
"""
JARVIS Memory Migration - Markdown to Database

Migrate existing learnings.md and work-status.md to hybrid memory system.
"""

import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple
import shutil

from .manager import JarvisMemoryManager


JARVIS_ROOT = Path(__file__).parent.parent.parent
CONTEXT_DIR = JARVIS_ROOT / "context" / "memory"
LEARNINGS_MD = CONTEXT_DIR / "learnings.md"
WORK_STATUS_MD = CONTEXT_DIR / "work-status.md"
USER_PREFS_MD = CONTEXT_DIR / "user-preferences.md"


def parse_learnings_md() -> List[Dict]:
    """
    Parse learnings.md into structured entries.

    Format expected:
    ## Category

    - **Learning title**: Description
    - Another learning
    """
    if not LEARNINGS_MD.exists():
        print(f"⚠️  {LEARNINGS_MD} not found, skipping")
        return []

    with open(LEARNINGS_MD, 'r') as f:
        content = f.read()

    entries = []
    current_category = "general"

    # Split by headers
    sections = re.split(r'^##\s+(.+)$', content, flags=re.MULTILINE)

    for i in range(1, len(sections), 2):
        if i + 1 >= len(sections):
            break

        category = sections[i].strip()
        section_content = sections[i + 1].strip()

        # Parse bullet points
        lines = section_content.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('- '):
                # Remove bullet
                learning = line[2:].strip()

                # Extract bold title if present
                title_match = re.match(r'\*\*(.+?)\*\*:\s*(.+)', learning)
                if title_match:
                    title = title_match.group(1)
                    description = title_match.group(2)
                    full_text = f"{title}: {description}"
                else:
                    full_text = learning

                entries.append({
                    "content": full_text,
                    "metadata": {
                        "type": "learning",
                        "category": category.lower(),
                        "source": "learnings.md",
                        "migrated_at": datetime.now().isoformat()
                    }
                })

    return entries


def parse_work_status_md() -> List[Dict]:
    """
    Parse work-status.md into structured entries.

    Format expected:
    ## Date: Title

    Content...

    ### Subtask

    Content...
    """
    if not WORK_STATUS_MD.exists():
        print(f"⚠️  {WORK_STATUS_MD} not found, skipping")
        return []

    with open(WORK_STATUS_MD, 'r') as f:
        content = f.read()

    entries = []

    # Split by level 2 headers (## Date: Title)
    sections = re.split(r'^##\s+(.+)$', content, flags=re.MULTILINE)

    for i in range(1, len(sections), 2):
        if i + 1 >= len(sections):
            break

        header = sections[i].strip()
        section_content = sections[i + 1].strip()

        # Extract date from header
        date_match = re.match(r'(.+?):\s*(.+)', header)
        if date_match:
            date_str = date_match.group(1).strip()
            title = date_match.group(2).strip()
        else:
            date_str = "unknown"
            title = header

        # Create entry for main section
        entries.append({
            "content": f"{title}\n\n{section_content[:500]}",  # Truncate long sections
            "metadata": {
                "type": "work_status",
                "date": date_str,
                "title": title,
                "source": "work-status.md",
                "migrated_at": datetime.now().isoformat()
            }
        })

    return entries


def parse_user_preferences_md() -> List[Dict]:
    """
    Parse user-preferences.md into structured entries.

    Format: Freeform, parse by sections or paragraphs
    """
    if not USER_PREFS_MD.exists():
        print(f"⚠️  {USER_PREFS_MD} not found, skipping")
        return []

    with open(USER_PREFS_MD, 'r') as f:
        content = f.read()

    entries = []

    # Split by level 2 headers
    sections = re.split(r'^##\s+(.+)$', content, flags=re.MULTILINE)

    for i in range(1, len(sections), 2):
        if i + 1 >= len(sections):
            break

        header = sections[i].strip()
        section_content = sections[i + 1].strip()

        entries.append({
            "content": f"{header}\n\n{section_content}",
            "metadata": {
                "type": "preference",
                "category": header.lower(),
                "source": "user-preferences.md",
                "migrated_at": datetime.now().isoformat()
            }
        })

    return entries


def archive_markdown_files():
    """Archive original markdown files with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    archive_dir = CONTEXT_DIR / "archive" / timestamp
    archive_dir.mkdir(parents=True, exist_ok=True)

    files_to_archive = [LEARNINGS_MD, WORK_STATUS_MD, USER_PREFS_MD]

    for file_path in files_to_archive:
        if file_path.exists():
            dest = archive_dir / file_path.name
            shutil.copy2(file_path, dest)
            print(f"   Archived: {file_path.name} → {dest}")


def migrate_to_hybrid(dry_run: bool = False, archive: bool = True):
    """
    Migrate markdown files to hybrid memory system.

    Args:
        dry_run: If True, parse but don't actually migrate
        archive: If True, archive original files after migration
    """
    print("🔄 Starting memory migration...")
    print(f"   Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Parse markdown files
    print("📖 Parsing markdown files...")
    learnings = parse_learnings_md()
    work_status = parse_work_status_md()
    preferences = parse_user_preferences_md()

    total = len(learnings) + len(work_status) + len(preferences)
    print(f"   Learnings: {len(learnings)}")
    print(f"   Work status: {len(work_status)}")
    print(f"   Preferences: {len(preferences)}")
    print(f"   Total: {total} entries")
    print()

    if dry_run:
        print("✅ Dry run complete - no changes made")
        return

    if total == 0:
        print("⚠️  No entries to migrate")
        return

    # Confirm migration
    confirm = input(f"Migrate {total} entries to hybrid memory? (yes/no): ")
    if confirm.lower() != "yes":
        print("❌ Migration cancelled")
        return

    # Initialize memory manager
    print("\n💾 Initializing memory manager...")
    memory = JarvisMemoryManager()

    # Migrate learnings
    print(f"\n📚 Migrating {len(learnings)} learnings...")
    for i, entry in enumerate(learnings, 1):
        doc_id = memory.add_document(entry["content"], entry["metadata"])
        if i % 10 == 0:
            print(f"   {i}/{len(learnings)}...")

    # Migrate work status
    print(f"\n⚙️  Migrating {len(work_status)} work status entries...")
    for i, entry in enumerate(work_status, 1):
        doc_id = memory.add_document(entry["content"], entry["metadata"])
        if i % 10 == 0:
            print(f"   {i}/{len(work_status)}...")

    # Migrate preferences
    print(f"\n⭐ Migrating {len(preferences)} preferences...")
    for entry in preferences:
        doc_id = memory.add_document(entry["content"], entry["metadata"])

    # Archive originals
    if archive:
        print("\n📦 Archiving original markdown files...")
        archive_markdown_files()

    # Show stats
    print("\n📊 Migration complete!")
    stats = memory.get_stats()
    print(f"   Total documents: {stats.get('total_documents', 'N/A')}")
    print(f"   Backend: {stats.get('storage_path', 'N/A')}")

    memory.close()


def main():
    """CLI entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="Migrate JARVIS memory to hybrid system")
    parser.add_argument("--dry-run", action="store_true",
                       help="Parse files but don't migrate")
    parser.add_argument("--no-archive", action="store_true",
                       help="Don't archive original files")

    args = parser.parse_args()

    migrate_to_hybrid(
        dry_run=args.dry_run,
        archive=not args.no_archive
    )


if __name__ == "__main__":
    main()
