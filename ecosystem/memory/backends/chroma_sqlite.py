#!/usr/bin/env python3
"""
JARVIS Memory Backend - Chroma + SQLite

Local-first implementation:
- Chroma for vector embeddings and semantic search
- SQLite for full-text search (FTS5)
- Combined hybrid search
"""

import sqlite3
import json
import chromadb
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime
from collections import defaultdict

from .base import MemoryBackend, MemoryDocument, SearchResult


class ChromaSQLiteBackend(MemoryBackend):
    """
    Chroma + SQLite backend for local-first memory storage.

    Storage:
    - Vector embeddings: Chroma persistent storage
    - Full-text search: SQLite FTS5
    - Metadata: Both stores (synchronized)
    """

    def __init__(self, storage_path: Optional[Path] = None):
        """
        Initialize Chroma + SQLite backend.

        Args:
            storage_path: Path to storage directory (default: ~/.jarvis/memory)
        """
        if storage_path is None:
            storage_path = Path.home() / ".jarvis" / "memory"

        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)

        # Initialize Chroma
        chroma_path = self.storage_path / "chroma"
        chroma_path.mkdir(parents=True, exist_ok=True)

        self.chroma_client = chromadb.PersistentClient(
            path=str(chroma_path),
            settings=chromadb.Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )

        # Get or create collection
        self.collection = self.chroma_client.get_or_create_collection(
            name="jarvis_memory",
            metadata={"hnsw:space": "cosine"}
        )

        # Initialize SQLite with FTS5
        sqlite_path = self.storage_path / "memory.db"
        self.sqlite_conn = sqlite3.connect(str(sqlite_path))
        self.sqlite_conn.row_factory = sqlite3.Row
        self._setup_fts()

    def _setup_fts(self):
        """Set up SQLite FTS5 tables"""
        cursor = self.sqlite_conn.cursor()

        # Create FTS5 virtual table for full-text search
        cursor.execute("""
            CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
                doc_id UNINDEXED,
                content,
                metadata UNINDEXED,
                created_at UNINDEXED,
                tokenize = 'porter unicode61'
            )
        """)

        # Create regular table for metadata queries
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS memory_docs (
                doc_id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                metadata TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        # Create indexes
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_created_at ON memory_docs(created_at)
        """)

        self.sqlite_conn.commit()

    def add_document(self, content: str, metadata: Dict[str, Any]) -> str:
        """Add document to both Chroma and SQLite"""
        doc_id = self._generate_id(content)
        now = datetime.now().isoformat()

        # Add created_at to metadata
        metadata_with_time = metadata.copy()
        metadata_with_time["created_at"] = now
        metadata_with_time["updated_at"] = now

        # Add to Chroma (with embeddings)
        try:
            self.collection.add(
                documents=[content],
                metadatas=[metadata_with_time],
                ids=[doc_id]
            )
        except Exception as e:
            # Handle duplicate by updating
            self.collection.update(
                documents=[content],
                metadatas=[metadata_with_time],
                ids=[doc_id]
            )

        # Add to SQLite FTS
        cursor = self.sqlite_conn.cursor()

        # Insert into regular table
        cursor.execute("""
            INSERT OR REPLACE INTO memory_docs (doc_id, content, metadata, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (doc_id, content, json.dumps(metadata_with_time), now, now))

        # Insert into FTS table
        cursor.execute("""
            INSERT OR REPLACE INTO memory_fts (doc_id, content, metadata, created_at)
            VALUES (?, ?, ?, ?)
        """, (doc_id, content, json.dumps(metadata_with_time), now))

        self.sqlite_conn.commit()

        return doc_id

    def get_document(self, doc_id: str) -> Optional[MemoryDocument]:
        """Get document by ID"""
        cursor = self.sqlite_conn.cursor()
        cursor.execute("""
            SELECT doc_id, content, metadata, created_at, updated_at
            FROM memory_docs
            WHERE doc_id = ?
        """, (doc_id,))

        row = cursor.fetchone()
        if not row:
            return None

        metadata = json.loads(row["metadata"])
        return MemoryDocument(
            id=row["doc_id"],
            content=row["content"],
            metadata=metadata,
            created_at=datetime.fromisoformat(row["created_at"]),
            updated_at=datetime.fromisoformat(row["updated_at"])
        )

    def update_document(self, doc_id: str, content: Optional[str] = None,
                       metadata: Optional[Dict[str, Any]] = None) -> bool:
        """Update document in both stores"""
        # Get existing document
        existing = self.get_document(doc_id)
        if not existing:
            return False

        # Prepare updates
        new_content = content if content is not None else existing.content
        new_metadata = self._merge_metadata(existing.metadata, metadata or {})
        new_metadata["updated_at"] = datetime.now().isoformat()

        # Update Chroma
        self.collection.update(
            documents=[new_content],
            metadatas=[new_metadata],
            ids=[doc_id]
        )

        # Update SQLite
        cursor = self.sqlite_conn.cursor()
        cursor.execute("""
            UPDATE memory_docs
            SET content = ?, metadata = ?, updated_at = ?
            WHERE doc_id = ?
        """, (new_content, json.dumps(new_metadata), new_metadata["updated_at"], doc_id))

        # Update FTS
        cursor.execute("""
            UPDATE memory_fts
            SET content = ?, metadata = ?
            WHERE doc_id = ?
        """, (new_content, json.dumps(new_metadata), doc_id))

        self.sqlite_conn.commit()
        return True

    def delete_document(self, doc_id: str) -> bool:
        """Delete document from both stores"""
        # Delete from Chroma
        try:
            self.collection.delete(ids=[doc_id])
        except Exception:
            pass

        # Delete from SQLite
        cursor = self.sqlite_conn.cursor()
        cursor.execute("DELETE FROM memory_docs WHERE doc_id = ?", (doc_id,))
        cursor.execute("DELETE FROM memory_fts WHERE doc_id = ?", (doc_id,))
        self.sqlite_conn.commit()

        return cursor.rowcount > 0

    def search_vector(self, query: str, limit: int = 5,
                     filter_metadata: Optional[Dict[str, Any]] = None) -> List[SearchResult]:
        """Semantic search via Chroma embeddings"""
        # Build where clause for metadata filtering
        where_clause = None
        if filter_metadata:
            where_clause = filter_metadata

        # Query Chroma
        results = self.collection.query(
            query_texts=[query],
            n_results=limit,
            where=where_clause
        )

        # Convert to SearchResult objects
        search_results = []
        if results["documents"] and results["documents"][0]:
            for i, doc_id in enumerate(results["ids"][0]):
                doc = self.get_document(doc_id)
                if doc:
                    # Chroma returns distances, convert to similarity score (0-1)
                    distance = results["distances"][0][i]
                    score = 1.0 / (1.0 + distance)  # Convert distance to similarity

                    search_results.append(SearchResult(
                        document=doc,
                        score=score,
                        source="vector"
                    ))

        return search_results

    def search_keyword(self, query: str, limit: int = 5,
                      filter_metadata: Optional[Dict[str, Any]] = None) -> List[SearchResult]:
        """Full-text search via SQLite FTS5"""
        cursor = self.sqlite_conn.cursor()

        # Build SQL query
        sql = """
            SELECT doc_id, rank
            FROM memory_fts
            WHERE memory_fts MATCH ?
            ORDER BY rank
            LIMIT ?
        """

        # Execute FTS query
        cursor.execute(sql, (query, limit))
        rows = cursor.fetchall()

        # Convert to SearchResult objects
        search_results = []
        for row in rows:
            doc = self.get_document(row["doc_id"])
            if doc:
                # Filter by metadata if provided
                if filter_metadata:
                    matches = all(doc.metadata.get(k) == v for k, v in filter_metadata.items())
                    if not matches:
                        continue

                # FTS5 rank is negative (lower is better), normalize to 0-1
                # Typical rank range is -10 to -1
                score = max(0.0, 1.0 + (row["rank"] / 10.0))

                search_results.append(SearchResult(
                    document=doc,
                    score=score,
                    source="keyword"
                ))

        return search_results[:limit]

    def search_hybrid(self, query: str, limit: int = 5,
                     filter_metadata: Optional[Dict[str, Any]] = None,
                     vector_weight: float = 0.7) -> List[SearchResult]:
        """Combined vector + keyword search"""
        # Get results from both searches
        vector_results = self.search_vector(query, limit * 2, filter_metadata)
        keyword_results = self.search_keyword(query, limit * 2, filter_metadata)

        # Combine results with weighted scores
        combined = defaultdict(lambda: {"doc": None, "scores": {"vector": 0.0, "keyword": 0.0}})

        for result in vector_results:
            doc_id = result.document.id
            combined[doc_id]["doc"] = result.document
            combined[doc_id]["scores"]["vector"] = result.score

        for result in keyword_results:
            doc_id = result.document.id
            if combined[doc_id]["doc"] is None:
                combined[doc_id]["doc"] = result.document
            combined[doc_id]["scores"]["keyword"] = result.score

        # Calculate weighted scores
        keyword_weight = 1.0 - vector_weight
        final_results = []

        for doc_id, data in combined.items():
            hybrid_score = (
                data["scores"]["vector"] * vector_weight +
                data["scores"]["keyword"] * keyword_weight
            )
            final_results.append(SearchResult(
                document=data["doc"],
                score=hybrid_score,
                source="hybrid"
            ))

        # Sort by hybrid score and limit
        final_results.sort(key=lambda x: x.score, reverse=True)
        return final_results[:limit]

    def list_documents(self, filter_metadata: Optional[Dict[str, Any]] = None,
                      limit: Optional[int] = None) -> List[MemoryDocument]:
        """List all documents"""
        cursor = self.sqlite_conn.cursor()

        sql = "SELECT doc_id, content, metadata, created_at, updated_at FROM memory_docs"
        params = []

        if limit:
            sql += " LIMIT ?"
            params.append(limit)

        cursor.execute(sql, params)
        rows = cursor.fetchall()

        documents = []
        for row in rows:
            metadata = json.loads(row["metadata"])

            # Filter by metadata if provided
            if filter_metadata:
                matches = all(metadata.get(k) == v for k, v in filter_metadata.items())
                if not matches:
                    continue

            documents.append(MemoryDocument(
                id=row["doc_id"],
                content=row["content"],
                metadata=metadata,
                created_at=datetime.fromisoformat(row["created_at"]),
                updated_at=datetime.fromisoformat(row["updated_at"])
            ))

        return documents

    def export_all(self) -> List[Dict[str, Any]]:
        """Export all documents for migration"""
        documents = self.list_documents()
        return [
            {
                "id": doc.id,
                "content": doc.content,
                "metadata": doc.metadata,
                "created_at": doc.created_at.isoformat() if doc.created_at else None,
                "updated_at": doc.updated_at.isoformat() if doc.updated_at else None
            }
            for doc in documents
        ]

    def close(self):
        """Close connections"""
        self.sqlite_conn.close()
        # Chroma client doesn't need explicit closing

    def get_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        cursor = self.sqlite_conn.cursor()

        # Count documents
        cursor.execute("SELECT COUNT(*) as count FROM memory_docs")
        total_docs = cursor.fetchone()["count"]

        # Get collection count from Chroma
        chroma_count = self.collection.count()

        # Count by type
        cursor.execute("""
            SELECT metadata
            FROM memory_docs
        """)

        type_counts = defaultdict(int)
        domain_counts = defaultdict(int)

        for row in cursor.fetchall():
            metadata = json.loads(row["metadata"])
            doc_type = metadata.get("type", "unknown")
            domain = metadata.get("domain", "unknown")
            type_counts[doc_type] += 1
            domain_counts[domain] += 1

        return {
            "total_documents": total_docs,
            "chroma_documents": chroma_count,
            "by_type": dict(type_counts),
            "by_domain": dict(domain_counts),
            "storage_path": str(self.storage_path)
        }
