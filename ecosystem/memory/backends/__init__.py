"""
JARVIS Memory Backends

Pluggable backend implementations.
"""

from .base import MemoryBackend, MemoryDocument, SearchResult
from .chroma_sqlite import ChromaSQLiteBackend

# Future backends (not yet fully implemented)
# from .supabase import SupabaseBackend
# from .knowledge_graph import Neo4jGraphBackend, ApacheAGEBackend

__all__ = [
    "MemoryBackend",
    "MemoryDocument",
    "SearchResult",
    "ChromaSQLiteBackend"
]
