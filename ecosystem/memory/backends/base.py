#!/usr/bin/env python3
"""
JARVIS Memory Backend - Abstract Interface

Pluggable backend architecture for memory storage.
Supports multiple implementations: local (Chroma+SQLite), cloud (Supabase), graph (Neo4j).
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class MemoryDocument:
    """A document stored in memory"""
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class SearchResult:
    """A search result with relevance score"""
    document: MemoryDocument
    score: float
    source: str  # "vector", "keyword", or "hybrid"


class MemoryBackend(ABC):
    """
    Abstract interface for memory backends.

    All backends must implement these methods to be compatible with JARVIS.
    """

    @abstractmethod
    def add_document(self, content: str, metadata: Dict[str, Any]) -> str:
        """
        Add a document to memory.

        Args:
            content: The text content
            metadata: Metadata dict (e.g., {"type": "learning", "domain": "investment"})

        Returns:
            Document ID
        """
        pass

    @abstractmethod
    def get_document(self, doc_id: str) -> Optional[MemoryDocument]:
        """
        Get a document by ID.

        Args:
            doc_id: Document ID

        Returns:
            MemoryDocument or None if not found
        """
        pass

    @abstractmethod
    def update_document(self, doc_id: str, content: Optional[str] = None,
                       metadata: Optional[Dict[str, Any]] = None) -> bool:
        """
        Update a document.

        Args:
            doc_id: Document ID
            content: New content (optional)
            metadata: New metadata to merge (optional)

        Returns:
            True if successful, False if not found
        """
        pass

    @abstractmethod
    def delete_document(self, doc_id: str) -> bool:
        """
        Delete a document.

        Args:
            doc_id: Document ID

        Returns:
            True if deleted, False if not found
        """
        pass

    @abstractmethod
    def search_vector(self, query: str, limit: int = 5,
                     filter_metadata: Optional[Dict[str, Any]] = None) -> List[SearchResult]:
        """
        Semantic search via vector embeddings.

        Args:
            query: Search query
            limit: Maximum results
            filter_metadata: Optional metadata filters (e.g., {"domain": "investment"})

        Returns:
            List of SearchResult objects sorted by relevance
        """
        pass

    @abstractmethod
    def search_keyword(self, query: str, limit: int = 5,
                      filter_metadata: Optional[Dict[str, Any]] = None) -> List[SearchResult]:
        """
        Full-text keyword search.

        Args:
            query: Search query
            limit: Maximum results
            filter_metadata: Optional metadata filters

        Returns:
            List of SearchResult objects sorted by relevance
        """
        pass

    @abstractmethod
    def search_hybrid(self, query: str, limit: int = 5,
                     filter_metadata: Optional[Dict[str, Any]] = None,
                     vector_weight: float = 0.7) -> List[SearchResult]:
        """
        Combined vector + keyword search with weighted ranking.

        Args:
            query: Search query
            limit: Maximum results
            filter_metadata: Optional metadata filters
            vector_weight: Weight for vector results (0.0-1.0), keyword weight is (1 - vector_weight)

        Returns:
            List of SearchResult objects with combined relevance scores
        """
        pass

    @abstractmethod
    def list_documents(self, filter_metadata: Optional[Dict[str, Any]] = None,
                      limit: Optional[int] = None) -> List[MemoryDocument]:
        """
        List all documents, optionally filtered.

        Args:
            filter_metadata: Optional metadata filters
            limit: Optional result limit

        Returns:
            List of MemoryDocument objects
        """
        pass

    @abstractmethod
    def export_all(self) -> List[Dict[str, Any]]:
        """
        Export all documents for migration.

        Returns:
            List of dicts with content and metadata
        """
        pass

    @abstractmethod
    def close(self):
        """
        Close connections and cleanup resources.
        """
        pass

    # Optional graph operations (only for graph backends)

    def add_relationship(self, from_doc_id: str, to_doc_id: str,
                        relationship_type: str, properties: Optional[Dict] = None):
        """
        Add a relationship between documents (graph backends only).

        Args:
            from_doc_id: Source document ID
            to_doc_id: Target document ID
            relationship_type: Type of relationship (e.g., "RELATED_TO", "DEPENDS_ON")
            properties: Optional relationship properties
        """
        raise NotImplementedError("Graph operations not supported by this backend")

    def search_graph(self, start_doc_id: str, relationship_types: Optional[List[str]] = None,
                    max_depth: int = 2) -> List[MemoryDocument]:
        """
        Graph traversal search (graph backends only).

        Args:
            start_doc_id: Starting document ID
            relationship_types: Optional list of relationship types to follow
            max_depth: Maximum traversal depth

        Returns:
            List of related MemoryDocument objects
        """
        raise NotImplementedError("Graph operations not supported by this backend")

    # Utility methods

    def _generate_id(self, content: str) -> str:
        """Generate a unique ID for content"""
        import hashlib
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def _merge_metadata(self, existing: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
        """Merge metadata dicts"""
        merged = existing.copy()
        merged.update(updates)
        return merged

    def __enter__(self):
        """Context manager support"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager cleanup"""
        self.close()
