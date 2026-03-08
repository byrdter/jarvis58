#!/usr/bin/env python3
"""
JARVIS Memory Backend Migration

Migrate data between different memory backends.

Supports:
- Chroma+SQLite → Supabase
- Chroma+SQLite → Neo4j
- Supabase → Neo4j
- Any → Any
"""

from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

from .manager import JarvisMemoryManager
from .backends.base import MemoryBackend


def migrate_backend(from_backend: str, to_backend: str,
                   from_kwargs: Dict[str, Any] = None,
                   to_kwargs: Dict[str, Any] = None,
                   dry_run: bool = False):
    """
    Migrate data from one backend to another.

    Args:
        from_backend: Source backend name ("chroma_sqlite", "supabase", "neo4j")
        to_backend: Destination backend name
        from_kwargs: Source backend initialization kwargs
        to_kwargs: Destination backend initialization kwargs
        dry_run: If True, export but don't import

    Example:
        migrate_backend("chroma_sqlite", "supabase", dry_run=False)
    """
    from_kwargs = from_kwargs or {}
    to_kwargs = to_kwargs or {}

    print("🔄 Backend Migration")
    print(f"{'='*70}")
    print(f"From: {from_backend}")
    print(f"To:   {to_backend}")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"{'='*70}\n")

    # Initialize source backend
    print(f"📦 Loading source backend ({from_backend})...")
    source_manager = JarvisMemoryManager(backend=from_backend, **from_kwargs)

    # Export all documents
    print("📤 Exporting documents...")
    documents = source_manager.export()
    print(f"   Found {len(documents)} documents")

    if len(documents) == 0:
        print("⚠️  No documents to migrate")
        source_manager.close()
        return

    # Show stats
    by_type = {}
    by_domain = {}
    for doc in documents:
        doc_type = doc["metadata"].get("type", "unknown")
        domain = doc["metadata"].get("domain", "unknown")
        by_type[doc_type] = by_type.get(doc_type, 0) + 1
        by_domain[domain] = by_domain.get(domain, 0) + 1

    print("\n📊 Document breakdown:")
    print("   By type:")
    for doc_type, count in sorted(by_type.items()):
        print(f"      {doc_type}: {count}")
    print("   By domain:")
    for domain, count in sorted(by_domain.items()):
        print(f"      {domain}: {count}")

    if dry_run:
        print("\n✅ Dry run complete - no changes made")
        source_manager.close()
        return

    # Confirm migration
    print()
    confirm = input(f"Migrate {len(documents)} documents to {to_backend}? (yes/no): ")
    if confirm.lower() != "yes":
        print("❌ Migration cancelled")
        source_manager.close()
        return

    # Initialize destination backend
    print(f"\n💾 Initializing destination backend ({to_backend})...")
    dest_manager = JarvisMemoryManager(backend=to_backend, **to_kwargs)

    # Import documents
    print(f"\n📥 Importing {len(documents)} documents...")
    migrated = 0
    errors = 0

    for i, doc in enumerate(documents, 1):
        try:
            dest_manager.add_document(
                content=doc["content"],
                metadata=doc["metadata"]
            )
            migrated += 1

            if i % 10 == 0:
                print(f"   {i}/{len(documents)}... ({migrated} migrated, {errors} errors)")

        except Exception as e:
            print(f"   ❌ Error migrating document {doc.get('id', 'unknown')}: {e}")
            errors += 1

    # Final stats
    print(f"\n{'='*70}")
    print("✅ Migration complete!")
    print(f"{'='*70}")
    print(f"   Migrated: {migrated}/{len(documents)}")
    if errors > 0:
        print(f"   Errors: {errors}")

    # Close connections
    source_manager.close()
    dest_manager.close()


def verify_migration(backend1: str, backend2: str,
                    backend1_kwargs: Dict[str, Any] = None,
                    backend2_kwargs: Dict[str, Any] = None):
    """
    Verify that two backends have the same data.

    Args:
        backend1: First backend name
        backend2: Second backend name
        backend1_kwargs: First backend kwargs
        backend2_kwargs: Second backend kwargs
    """
    backend1_kwargs = backend1_kwargs or {}
    backend2_kwargs = backend2_kwargs or {}

    print("🔍 Verifying migration...")
    print(f"{'='*70}\n")

    # Load both backends
    manager1 = JarvisMemoryManager(backend=backend1, **backend1_kwargs)
    manager2 = JarvisMemoryManager(backend=backend2, **backend2_kwargs)

    # Get stats
    stats1 = manager1.get_stats()
    stats2 = manager2.get_stats()

    print(f"Backend 1 ({backend1}):")
    print(f"   Documents: {stats1.get('total_documents', 'N/A')}")

    print(f"\nBackend 2 ({backend2}):")
    print(f"   Documents: {stats2.get('total_documents', 'N/A')}")

    # Compare counts
    count1 = stats1.get('total_documents', 0)
    count2 = stats2.get('total_documents', 0)

    if count1 == count2:
        print(f"\n✅ Document counts match ({count1})")
    else:
        print(f"\n⚠️  Document counts differ: {count1} vs {count2}")

    manager1.close()
    manager2.close()


def main():
    """CLI entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="Migrate JARVIS memory between backends")

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Migrate command
    migrate_parser = subparsers.add_parser("migrate", help="Migrate data between backends")
    migrate_parser.add_argument("--from", dest="from_backend", required=True,
                               choices=["chroma_sqlite", "supabase", "neo4j"],
                               help="Source backend")
    migrate_parser.add_argument("--to", dest="to_backend", required=True,
                               choices=["chroma_sqlite", "supabase", "neo4j"],
                               help="Destination backend")
    migrate_parser.add_argument("--dry-run", action="store_true",
                               help="Export but don't import")

    # Verify command
    verify_parser = subparsers.add_parser("verify", help="Verify migration")
    verify_parser.add_argument("--backend1", required=True,
                              choices=["chroma_sqlite", "supabase", "neo4j"],
                              help="First backend")
    verify_parser.add_argument("--backend2", required=True,
                              choices=["chroma_sqlite", "supabase", "neo4j"],
                              help="Second backend")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    if args.command == "migrate":
        migrate_backend(
            from_backend=args.from_backend,
            to_backend=args.to_backend,
            dry_run=args.dry_run
        )
    elif args.command == "verify":
        verify_migration(
            backend1=args.backend1,
            backend2=args.backend2
        )


if __name__ == "__main__":
    main()
