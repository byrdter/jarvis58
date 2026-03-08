"""
JARVIS Memory System

Pluggable memory architecture with hybrid search (vector + keyword).

Quick start:
    from ecosystem.memory import JarvisMemoryManager

    # Initialize (uses Chroma + SQLite by default)
    memory = JarvisMemoryManager()

    # Add learning
    memory.add_learning("MACD works best with Stage 2", {"domain": "investment"})

    # Search
    results = memory.search("MACD Stage 2", limit=5)

    # Print results
    for result in results:
        print(f"{result.score:.3f} - {result.document.content}")

Backends:
    - chroma_sqlite (default): Local-first, Chroma + SQLite
    - supabase (future): Cloud-ready, pgvector + PostgreSQL
    - neo4j (future): Knowledge graph, Neo4j

Switch backends via environment variable:
    export JARVIS_MEMORY_BACKEND=supabase
"""

from .manager import (
    JarvisMemoryManager,
    get_memory_manager,
    remember,
    recall,
    get_learnings
)

from .backends.base import (
    MemoryBackend,
    MemoryDocument,
    SearchResult
)

from .embedding import (
    EmbeddingProvider,
    get_embedding_provider,
    embed,
    embed_batch
)

__all__ = [
    # Main API
    "JarvisMemoryManager",
    "get_memory_manager",
    "remember",
    "recall",
    "get_learnings",

    # Data types
    "MemoryBackend",
    "MemoryDocument",
    "SearchResult",

    # Embeddings
    "EmbeddingProvider",
    "get_embedding_provider",
    "embed",
    "embed_batch"
]

__version__ = "2.0.0"
