#!/usr/bin/env python3
"""
JARVIS Embedding Provider

Generates embeddings for semantic search with fallback strategy:
1. OpenAI API (primary) - text-embedding-3-small
2. Sentence Transformers (fallback) - all-MiniLM-L6-v2
"""

import os
from typing import List, Optional
import numpy as np


class EmbeddingProvider:
    """
    Manages embedding generation with fallback.

    Primary: OpenAI API (fast, high quality)
    Fallback: Local sentence-transformers (offline capable)
    """

    def __init__(self, provider: str = "auto", api_key: Optional[str] = None):
        """
        Initialize embedding provider.

        Args:
            provider: "openai", "local", or "auto" (tries OpenAI first)
            api_key: OpenAI API key (default: from OPENAI_API_KEY env)
        """
        self.provider = provider
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

        self.openai_client = None
        self.local_model = None

        # Initialize based on provider
        if provider == "openai":
            self._init_openai()
        elif provider == "local":
            self._init_local()
        elif provider == "auto":
            # Try OpenAI first, fall back to local
            if self.api_key:
                try:
                    self._init_openai()
                    self.provider = "openai"
                except Exception as e:
                    print(f"⚠️  OpenAI initialization failed: {e}")
                    print("   Falling back to local embeddings...")
                    self._init_local()
                    self.provider = "local"
            else:
                print("ℹ️  No OpenAI API key found, using local embeddings")
                self._init_local()
                self.provider = "local"

    def _init_openai(self):
        """Initialize OpenAI client"""
        if not self.api_key:
            raise ValueError("OpenAI API key required")

        from openai import OpenAI
        self.openai_client = OpenAI(api_key=self.api_key)

        # Test connection
        try:
            _ = self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input="test"
            )
            print("✅ OpenAI embeddings initialized")
        except Exception as e:
            raise Exception(f"OpenAI API test failed: {e}")

    def _init_local(self):
        """Initialize local sentence-transformers model"""
        try:
            from sentence_transformers import SentenceTransformer
            self.local_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ Local embeddings initialized (all-MiniLM-L6-v2)")
        except ImportError:
            raise ImportError(
                "sentence-transformers not installed. "
                "Install with: pip install sentence-transformers"
            )

    def get_embedding(self, text: str) -> List[float]:
        """
        Get embedding for text.

        Args:
            text: Text to embed

        Returns:
            List of floats (embedding vector)
        """
        if self.provider == "openai":
            return self._get_openai_embedding(text)
        else:
            return self._get_local_embedding(text)

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Get embeddings for multiple texts (batch).

        Args:
            texts: List of texts to embed

        Returns:
            List of embedding vectors
        """
        if self.provider == "openai":
            return self._get_openai_embeddings(texts)
        else:
            return self._get_local_embeddings(texts)

    def _get_openai_embedding(self, text: str) -> List[float]:
        """Get embedding from OpenAI API"""
        response = self.openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def _get_openai_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get batch embeddings from OpenAI API"""
        response = self.openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=texts
        )
        return [item.embedding for item in response.data]

    def _get_local_embedding(self, text: str) -> List[float]:
        """Get embedding from local model"""
        embedding = self.local_model.encode(text, convert_to_numpy=True)
        return embedding.tolist()

    def _get_local_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get batch embeddings from local model"""
        embeddings = self.local_model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    def get_dimension(self) -> int:
        """Get embedding dimension"""
        if self.provider == "openai":
            return 1536  # text-embedding-3-small dimension
        else:
            return 384  # all-MiniLM-L6-v2 dimension

    def get_info(self) -> dict:
        """Get provider information"""
        return {
            "provider": self.provider,
            "model": "text-embedding-3-small" if self.provider == "openai" else "all-MiniLM-L6-v2",
            "dimension": self.get_dimension(),
            "batch_capable": True
        }


# Singleton instance
_embedding_provider = None


def get_embedding_provider(provider: str = "auto") -> EmbeddingProvider:
    """
    Get global embedding provider (singleton).

    Args:
        provider: "openai", "local", or "auto"

    Returns:
        EmbeddingProvider instance
    """
    global _embedding_provider
    if _embedding_provider is None:
        _embedding_provider = EmbeddingProvider(provider=provider)
    return _embedding_provider


# Convenience functions
def embed(text: str) -> List[float]:
    """Get embedding for text (uses global provider)"""
    provider = get_embedding_provider()
    return provider.get_embedding(text)


def embed_batch(texts: List[str]) -> List[List[float]]:
    """Get embeddings for texts (uses global provider)"""
    provider = get_embedding_provider()
    return provider.get_embeddings(texts)
