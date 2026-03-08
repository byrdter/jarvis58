#!/usr/bin/env python3
"""
JARVIS Memory Manager

Main interface for memory operations with pluggable backends.
"""

import os
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime

from .backends.base import MemoryBackend, MemoryDocument, SearchResult
from .backends.chroma_sqlite import ChromaSQLiteBackend
from .embedding import get_embedding_provider


class JarvisMemoryManager:
    """
    Main memory manager with pluggable backend support.

    Backends:
    - chroma_sqlite: Local-first (Chroma + SQLite) - Phase 2
    - supabase: Cloud-ready (pgvector + PostgreSQL) - Phase 3+
    - neo4j: Knowledge graph (Neo4j) - Phase 6+

    Usage:
        # Use default backend (Chroma + SQLite)
        memory = JarvisMemoryManager()

        # Add learning
        memory.add_learning("Stage 2 signals work best with MACD confirmation", {
            "domain": "investment",
            "source": "market_analysis"
        })

        # Search
        results = memory.search("MACD Stage 2", limit=5)

        # Change backend via env var
        export JARVIS_MEMORY_BACKEND=supabase
        memory = JarvisMemoryManager()  # Now uses Supabase
    """

    def __init__(self, backend: Optional[str] = None, **backend_kwargs):
        """
        Initialize memory manager.

        Args:
            backend: Backend name ("chroma_sqlite", "supabase", "neo4j")
                    If None, uses JARVIS_MEMORY_BACKEND env var (default: "chroma_sqlite")
            **backend_kwargs: Backend-specific arguments
        """
        # Determine backend
        backend_name = backend or os.getenv("JARVIS_MEMORY_BACKEND", "chroma_sqlite")

        # Initialize embedding provider
        self.embedding_provider = get_embedding_provider()

        # Initialize backend
        if backend_name == "chroma_sqlite":
            self.backend = ChromaSQLiteBackend(**backend_kwargs)
        elif backend_name == "supabase":
            from .backends.supabase import SupabaseBackend
            self.backend = SupabaseBackend(**backend_kwargs)
        elif backend_name == "neo4j":
            from .backends.knowledge_graph import Neo4jGraphBackend
            self.backend = Neo4jGraphBackend(**backend_kwargs)
        else:
            raise ValueError(f"Unknown backend: {backend_name}")

        self.backend_name = backend_name

        print(f"✅ Memory manager initialized (backend: {backend_name})")

    # High-level API

    def add_learning(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        Add a learning to memory.

        Args:
            content: Learning text
            metadata: Optional metadata (domain, source, etc.)

        Returns:
            Document ID
        """
        metadata = metadata or {}
        metadata["type"] = "learning"
        return self.backend.add_document(content, metadata)

    def add_work_status(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        Add work status entry.

        Args:
            content: Status description
            metadata: Optional metadata

        Returns:
            Document ID
        """
        metadata = metadata or {}
        metadata["type"] = "work_status"
        return self.backend.add_document(content, metadata)

    def add_preference(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        Add user preference.

        Args:
            content: Preference text
            metadata: Optional metadata

        Returns:
            Document ID
        """
        metadata = metadata or {}
        metadata["type"] = "preference"
        return self.backend.add_document(content, metadata)

    def search(self, query: str, limit: int = 5,
              doc_type: Optional[str] = None,
              domain: Optional[str] = None,
              search_mode: str = "hybrid") -> List[SearchResult]:
        """
        Search memory.

        Args:
            query: Search query
            limit: Maximum results
            doc_type: Filter by type ("learning", "work_status", "preference")
            domain: Filter by domain ("investment", "content-creation", etc.)
            search_mode: "vector", "keyword", or "hybrid" (default)

        Returns:
            List of SearchResult objects
        """
        # Build filter
        filter_metadata = {}
        if doc_type:
            filter_metadata["type"] = doc_type
        if domain:
            filter_metadata["domain"] = domain

        # Search based on mode
        if search_mode == "vector":
            return self.backend.search_vector(query, limit, filter_metadata)
        elif search_mode == "keyword":
            return self.backend.search_keyword(query, limit, filter_metadata)
        else:
            return self.backend.search_hybrid(query, limit, filter_metadata)

    def get_learnings(self, domain: Optional[str] = None, limit: int = 10) -> List[MemoryDocument]:
        """
        Get all learnings, optionally filtered by domain.

        Args:
            domain: Optional domain filter
            limit: Maximum results

        Returns:
            List of learning documents
        """
        filter_metadata = {"type": "learning"}
        if domain:
            filter_metadata["domain"] = domain

        return self.backend.list_documents(filter_metadata, limit)

    def get_work_status(self, limit: int = 10) -> List[MemoryDocument]:
        """Get recent work status entries"""
        return self.backend.list_documents({"type": "work_status"}, limit)

    def get_preferences(self) -> List[MemoryDocument]:
        """Get all user preferences"""
        return self.backend.list_documents({"type": "preference"})

    # Direct backend access

    def add_document(self, content: str, metadata: Dict[str, Any]) -> str:
        """Add document directly (low-level API)"""
        return self.backend.add_document(content, metadata)

    def get_document(self, doc_id: str) -> Optional[MemoryDocument]:
        """Get document by ID"""
        return self.backend.get_document(doc_id)

    def update_document(self, doc_id: str, content: Optional[str] = None,
                       metadata: Optional[Dict[str, Any]] = None) -> bool:
        """Update document"""
        return self.backend.update_document(doc_id, content, metadata)

    def delete_document(self, doc_id: str) -> bool:
        """Delete document"""
        return self.backend.delete_document(doc_id)

    # Stats and utilities

    def get_stats(self) -> Dict[str, Any]:
        """Get memory statistics"""
        if hasattr(self.backend, 'get_stats'):
            return self.backend.get_stats()
        else:
            # Generic stats
            all_docs = self.backend.list_documents()
            return {
                "backend": self.backend_name,
                "total_documents": len(all_docs),
                "embedding_provider": self.embedding_provider.get_info()
            }

    def export(self) -> List[Dict[str, Any]]:
        """Export all memory for backup/migration"""
        return self.backend.export_all()

    def close(self):
        """Close backend connections"""
        self.backend.close()

    # Context manager support

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


# Singleton instance
_memory_manager = None


def get_memory_manager(**kwargs) -> JarvisMemoryManager:
    """
    Get global memory manager (singleton).

    Args:
        **kwargs: Passed to JarvisMemoryManager constructor

    Returns:
        JarvisMemoryManager instance
    """
    global _memory_manager
    if _memory_manager is None:
        _memory_manager = JarvisMemoryManager(**kwargs)
    return _memory_manager


# Convenience functions

def remember(content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
    """Add learning to memory (convenience function)"""
    manager = get_memory_manager()
    return manager.add_learning(content, metadata)


def recall(query: str, limit: int = 5, **kwargs) -> List[SearchResult]:
    """Search memory (convenience function)"""
    manager = get_memory_manager()
    return manager.search(query, limit, **kwargs)


def get_learnings(domain: Optional[str] = None) -> List[MemoryDocument]:
    """Get learnings (convenience function)"""
    manager = get_memory_manager()
    return manager.get_learnings(domain)


# CLI interface

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="JARVIS Memory Manager CLI")
    parser.add_argument("--add", help="Add learning to memory")
    parser.add_argument("--search", help="Search memory")
    parser.add_argument("--stats", action="store_true", help="Show statistics")
    parser.add_argument("--domain", help="Filter by domain")
    parser.add_argument("--limit", type=int, default=5, help="Result limit")

    args = parser.parse_args()

    with JarvisMemoryManager() as memory:
        if args.add:
            doc_id = memory.add_learning(args.add, {"domain": args.domain} if args.domain else {})
            print(f"✅ Added learning: {doc_id}")

        elif args.search:
            results = memory.search(args.search, limit=args.limit, domain=args.domain)
            print(f"\n🔍 Search results for: '{args.search}'")
            print(f"{'='*70}")
            for i, result in enumerate(results, 1):
                print(f"\n{i}. [{result.source}] Score: {result.score:.3f}")
                print(f"   {result.document.content[:200]}...")
                if result.document.metadata:
                    print(f"   Meta: {result.document.metadata}")

        elif args.stats:
            stats = memory.get_stats()
            print("\n📊 Memory Statistics")
            print(f"{'='*70}")
            for key, value in stats.items():
                print(f"{key}: {value}")

        else:
            parser.print_help()
