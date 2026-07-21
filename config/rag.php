<?php

return [
    'similarity_threshold' => (float) env('RAG_SIMILARITY_THRESHOLD', 0.65),
    'top_k' => (int) env('RAG_TOP_K', 3),
    'chunk_size' => (int) env('RAG_CHUNK_SIZE', 800),
    'chunk_overlap' => (int) env('RAG_CHUNK_OVERLAP', 150),
];
