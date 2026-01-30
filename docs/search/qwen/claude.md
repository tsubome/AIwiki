# Qwenファミリー完全モデルカタログ：AIwiki JSON作成用データ集

Alibaba CloudのQwenファミリーは、**13モデルシリーズ**で構成される包括的なAIエコシステムを形成している。Qwen（通義千問）は2023年の初代モデルから2025年のQwen3世代まで急速に進化し、テキスト生成からビジョン・コーディング・推論・埋め込みまで多様な専門モデルを展開している。本レポートでは、各モデルのJSON作成に必要な全情報を体系的に整理する。

---

## コアLLM進化ライン

### 1. Qwen (Qwen1.5シリーズ)

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen1.5 |
| **slug** | qwen1-5 |
| **releaseDate** | 2024-02-04 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 (0.5B-32B), Qwen License (72B, 110B) |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（72B Base）**：
- MMLU (5-shot): **77.5**
- HumanEval: **41.5**
- MATH: **34.1**
- GSM8K: **79.5**
- C-Eval: **84.1**
- Source: https://qwenlm.github.io/blog/qwen1.5/

**スペック**：
- contextLength: **32,768**
- trainingTokens: **3T**
- knowledgeCutoff: 2023年
- languages: ["Chinese", "English", "French", "Spanish", "German", "Russian", "Japanese", "Korean", "Vietnamese", "Thai", "Arabic", "Indonesian"]
- architecture: Decoder-only Transformer, GQA with QKV bias, RoPE, SwiGLU, RMSNorm, Vocab 151,646

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>", "<|endoftext|>"]
}
```

**バリエーション**：

| サイズ | HuggingFace URL | minVram | recommendedVram |
|--------|-----------------|---------|-----------------|
| 0.5B | https://huggingface.co/Qwen/Qwen1.5-0.5B | 1GB | 2GB |
| 1.8B | https://huggingface.co/Qwen/Qwen1.5-1.8B | 4GB | 6GB |
| 4B | https://huggingface.co/Qwen/Qwen1.5-4B | 8GB | 12GB |
| 7B | https://huggingface.co/Qwen/Qwen1.5-7B | 14GB | 18GB |
| 14B | https://huggingface.co/Qwen/Qwen1.5-14B | 28GB | 35GB |
| 32B | https://huggingface.co/Qwen/Qwen1.5-32B | 65GB | 80GB |
| 72B | https://huggingface.co/Qwen/Qwen1.5-72B | 145GB | 160GB |
| 110B | https://huggingface.co/Qwen/Qwen1.5-110B | 220GB | 250GB |
| MoE-A2.7B | https://huggingface.co/Qwen/Qwen1.5-MoE-A2.7B | 28GB | 35GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen
- github: https://github.com/QwenLM/Qwen1.5
- website: https://qwenlm.github.io/blog/qwen1.5/

**家系図**: baseModel: "Qwen (Original 2023)", type: "evolution"

---

### 2. Qwen2

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen2 |
| **slug** | qwen2 |
| **releaseDate** | 2024-06-07 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 (0.5B-57B), Qwen License (72B) |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（72B Base）**：
- MMLU (5-shot): **84.2**
- MMLU-Pro: **55.6**
- GPQA: **37.9**
- HumanEval: **64.6**
- MATH: **51.1**
- IFEval (Instruct): **77.6**
- Source: https://arxiv.org/abs/2407.10671

**スペック**：
- contextLength: **131,072** (7B, 72B) / **32,768** (0.5B, 1.5B)
- trainingTokens: **7T** (12T for 0.5B)
- knowledgeCutoff: 2024年初頭
- languages: 約30言語（英語、中国語、スペイン語、フランス語、ドイツ語、アラビア語、ロシア語、韓国語、日本語、タイ語、ベトナム語等）
- architecture: Decoder-only, GQA, RoPE with YARN, Dual Chunk Attention, SwiGLU, RMSNorm, Vocab 151,646

**バリエーション**：

| サイズ | Layers | Q/KV Heads | HuggingFace URL | minVram |
|--------|--------|------------|-----------------|---------|
| 0.5B | 24 | 14/2 | https://huggingface.co/Qwen/Qwen2-0.5B | 1.5GB |
| 1.5B | 28 | 12/2 | https://huggingface.co/Qwen/Qwen2-1.5B | 4GB |
| 7B | 28 | 28/4 | https://huggingface.co/Qwen/Qwen2-7B | 17GB |
| 72B | 80 | 64/8 | https://huggingface.co/Qwen/Qwen2-72B | 150GB |
| 57B-A14B (MoE) | 28 | 28/4 | https://huggingface.co/Qwen/Qwen2-57B-A14B | 120GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen
- paper: https://arxiv.org/abs/2407.10671
- github: https://github.com/QwenLM/Qwen2
- website: https://qwenlm.github.io/blog/qwen2/

**家系図**: baseModel: "Qwen1.5", type: "evolution"

---

### 3. Qwen2.5

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen2.5 |
| **slug** | qwen2-5 |
| **releaseDate** | 2024-09-19 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 (0.5B-32B), Qwen Research (3B), Qwen License (72B) |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（72B Base）**：
- MMLU (5-shot): **86.1**
- MMLU-Pro: **58.1**
- GPQA: **45.9**
- HumanEval: **59.1**
- MATH: **62.1**
- IFEval (Instruct): **84.1**
- Source: https://arxiv.org/abs/2412.15115

**ベンチマーク（72B Instruct）**：
- MMLU-Pro: **71.1**
- MATH: **83.1**
- HumanEval: **86.6**
- Arena-Hard: **81.2**

**スペック**：
- contextLength: **131,072** (7B以上) / **32,768** (0.5B-3B)
- trainingTokens: **18T**
- knowledgeCutoff: 2024年中頃
- languages: 29言語以上（中国語、英語、フランス語、スペイン語、ポルトガル語、ドイツ語、イタリア語、ロシア語、日本語、韓国語、ベトナム語、タイ語、アラビア語、インドネシア語等）
- architecture: Dense Decoder-only, GQA with QKV bias, RoPE, YARN + Dual Chunk Attention, SwiGLU, RMSNorm, Vocab 151,646

**バリエーション**：

| サイズ | Layers | Q/KV Heads | HuggingFace URL | minVram | recommendedVram |
|--------|--------|------------|-----------------|---------|-----------------|
| 0.5B | 24 | 14/2 | https://huggingface.co/Qwen/Qwen2.5-0.5B | 1GB | 2GB |
| 1.5B | 28 | 12/2 | https://huggingface.co/Qwen/Qwen2.5-1.5B | 4GB | 6GB |
| 3B | 36 | 16/2 | https://huggingface.co/Qwen/Qwen2.5-3B | 7GB | 10GB |
| 7B | 28 | 28/4 | https://huggingface.co/Qwen/Qwen2.5-7B | 17GB | 20GB |
| 14B | 48 | 40/8 | https://huggingface.co/Qwen/Qwen2.5-14B | 32GB | 40GB |
| 32B | 64 | 40/8 | https://huggingface.co/Qwen/Qwen2.5-32B | 70GB | 85GB |
| 72B | 80 | 64/8 | https://huggingface.co/Qwen/Qwen2.5-72B | 150GB | 170GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen
- paper: https://arxiv.org/abs/2412.15115
- github: https://github.com/QwenLM/Qwen2.5
- website: https://qwenlm.github.io/blog/qwen2.5/

**家系図**: baseModel: "Qwen2", type: "evolution"

---

### 4. Qwen3

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen3 |
| **slug** | qwen3 |
| **releaseDate** | 2025-04-29 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | BASE / INSTRUCT / THINKING |

**ベンチマーク（235B-A22B Instruct-2507）**：
- MMLU-Pro: **83.0**
- MMLU-Redux: **93.1**
- GPQA: **77.5**
- IFEval: **88.7**
- EvalPlus (HumanEval/MBPP): **87.9**
- Source: https://arxiv.org/abs/2505.09388

**スペック**：
- contextLength: **262,144** (256K, 1Mまで拡張可能)
- trainingTokens: **36T**
- knowledgeCutoff: 2025年初頭
- languages: **119言語**（Indo-European, Sino-Tibetan, Afro-Asiatic, Austronesian, Dravidian, Turkic等の言語族をカバー）
- architecture: Decoder-only Transformer, GQA, QK LayerNorm, RoPE, SwiGLU, RMSNorm, Vocab拡張

**プロンプトテンプレート**：
```json
{
  "format": "chatml-thinking",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n<think>\n{thinking_content}\n</think>\n{response}<|im_end|>",
  "stopTokens": ["<|im_end|>", "</s>"],
  "thinkingTokens": ["<think>", "</think>"],
  "thinkingControl": ["/think", "/no_think"]
}
```

**バリエーション（Dense）**：

| サイズ | Layers | Q/KV Heads | Context | HuggingFace URL | minVram |
|--------|--------|------------|---------|-----------------|---------|
| 0.6B | 28 | 16/8 | 32K | https://huggingface.co/Qwen/Qwen3-0.6B | 1.5GB |
| 1.7B | 28 | 16/8 | 32K | https://huggingface.co/Qwen/Qwen3-1.7B | 4GB |
| 4B | 36 | 32/8 | 32K | https://huggingface.co/Qwen/Qwen3-4B | 8GB |
| 8B | 36 | 32/8 | 128K | https://huggingface.co/Qwen/Qwen3-8B | 16GB |
| 14B | 40 | 40/8 | 128K | https://huggingface.co/Qwen/Qwen3-14B | 28GB |
| 32B | 64 | 64/8 | 128K | https://huggingface.co/Qwen/Qwen3-32B | 65GB |

**バリエーション（MoE）**：

| サイズ | Active | Experts | HuggingFace URL | minVram |
|--------|--------|---------|-----------------|---------|
| 30B-A3B | 3B | 128/8 | https://huggingface.co/Qwen/Qwen3-30B-A3B | 60GB |
| 235B-A22B | 22B | 128/8 | https://huggingface.co/Qwen/Qwen3-235B-A22B | 470GB |

**リンク**：
- huggingface: https://huggingface.co/collections/Qwen/qwen3-67dd247413f0e2e4f653967f
- paper: https://arxiv.org/abs/2505.09388
- github: https://github.com/QwenLM/Qwen3
- website: https://qwen.ai/

**家系図**: baseModel: "Qwen2.5", type: "evolution"

---

### 5. Qwen3-Next

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen3-Next-80B-A3B |
| **slug** | qwen3-next |
| **releaseDate** | 2025-09-10 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | BASE / INSTRUCT / THINKING |

**ベンチマーク（80B-A3B Instruct）**：
- MMLU-Pro: **80.6**
- MMLU-Redux: **90.9**
- GPQA: **72.9**
- IFEval: **87.6**
- LiveCodeBench v6: **56.6**
- Arena-Hard v2: **82.7**
- RULER 1M (Long-Context): **80.3%**
- Source: https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct

**スペック**：
- contextLength: **262,144** (256K native, 1Mまで拡張可能)
- trainingTokens: **15T**
- knowledgeCutoff: 2025年中頃
- languages: 119言語
- architecture: **Hybrid Transformer-Mamba**
  - Total: 80B, Active: 3B (3.9B per forward)
  - 48 Layers, Hidden: 2048
  - Layout: 12 × (3 × (Gated DeltaNet → MoE) → 1 × (Gated Attention → MoE))
  - Gated DeltaNet (Linear Attention): 32 V Heads, 16 QK Heads
  - High-Sparsity MoE: 512 experts, 10 active, 1 shared
  - Multi-Token Prediction (MTP)

**バリエーション**：

| バリアント | HuggingFace URL | minVram |
|-----------|-----------------|---------|
| Base | https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Base | 160GB |
| Instruct | https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct | 160GB |
| Thinking | https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Thinking | 160GB |
| Instruct-FP8 | https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct-FP8 | 82GB |
| Thinking-FP8 | https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Thinking-FP8 | 82GB |

**リンク**：
- huggingface: https://huggingface.co/collections/Qwen/qwen3-next
- paper: https://arxiv.org/abs/2505.09388
- github: https://github.com/QwenLM/Qwen3
- website: https://qwen.ai/

**家系図**: baseModel: "Qwen3", type: "evolution"

---

## ビジョン言語モデル

### 6. Qwen3-VL

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen3-VL |
| **slug** | qwen3-vl |
| **releaseDate** | 2025-09-23 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | INSTRUCT / THINKING |

**ベンチマーク（235B-A22B Instruct）**：
- MMMU: SOTA級
- MathVista: SOTA級
- MathVision: SOTA級
- DocVQA: 競争力のある性能
- Video: 1時間以上の動画対応
- Source: https://arxiv.org/abs/2511.21631

**スペック**：
- contextLength: **262,144** (256K native, 1Mまで拡張可能)
- languages: 32言語以上（OCR対応）
- architecture: 
  - Vision Encoder: Native dynamic-resolution ViT (16-pixel patch)
  - Interleaved-MRoPE, DeepStack fusion, Text-Timestamp Alignment
  - Window Attention (4 Full + Window, max 8x8)
  - Multimodal: Image, Video (hour-long), Document, GUI Agent

**バリエーション**：

| サイズ | Type | HuggingFace URL | minVram |
|--------|------|-----------------|---------|
| 2B | Dense | https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct | 6GB |
| 4B | Dense | https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct | 10GB |
| 8B | Dense | https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct | 18GB |
| 32B | Dense | https://huggingface.co/Qwen/Qwen3-VL-32B-Instruct | 70GB |
| 30B-A3B | MoE | https://huggingface.co/Qwen/Qwen3-VL-30B-A3B-Instruct | 60GB |
| 235B-A22B | MoE | https://huggingface.co/Qwen/Qwen3-VL-235B-A22B-Instruct | 470GB |

**プロンプトテンプレート**：
```json
{
  "format": "chatml-vision",
  "visionTokens": ["<|vision_start|>", "<|image_pad|>", "<|vision_end|>"],
  "stopTokens": ["<|im_end|>"]
}
```

**リンク**：
- huggingface: https://huggingface.co/collections/Qwen/qwen3-vl-68d2a7c1b8a8afce4ebd2dbe
- paper: https://arxiv.org/abs/2511.21631
- github: https://github.com/QwenLM/Qwen3-VL
- website: https://chat.qwen.ai

**家系図**: baseModel: "Qwen3", type: "official-derivative"

---

### 7. Qwen2.5-VL

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen2.5-VL |
| **slug** | qwen2-5-vl |
| **releaseDate** | 2025-01-28 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 (3B-32B), Qwen License (72B) |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（72B Instruct）**：
- MMMU_val: **70.2**
- MathVista_MINI: **74.8**
- DocVQA_VAL: **96.4**
- ChartQA_TEST: **89.5**
- OCRBench: **885**
- VideoMME (w/ sub): **79.1**
- ScreenSpot: **87.1**
- Source: https://arxiv.org/abs/2502.13923

**スペック**：
- contextLength: **32,768** (default), **131,072** (YaRN拡張)
- languages: 19言語以上（OCR対応）
- architecture:
  - Vision Encoder: Native dynamic-resolution ViT, 14-pixel patch, Window Attention
  - Multimodal Rotary Position Embedding (M-RoPE)
  - Dynamic FPS training, Absolute time encoding
  - Multimodal: Image, Video (1時間以上), Document, Visual Agent

**バリエーション**：

| サイズ | HuggingFace URL | minVram | recommendedVram |
|--------|-----------------|---------|-----------------|
| 3B | https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct | 8GB | 12GB |
| 7B | https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct | 16GB | 24GB |
| 32B | https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct | 70GB | 90GB |
| 72B | https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct | 144GB | 180GB |

**リンク**：
- huggingface: https://huggingface.co/collections/Qwen/qwen25-vl
- paper: https://arxiv.org/abs/2502.13923
- github: https://github.com/QwenLM/Qwen2.5-VL
- website: https://qwenlm.github.io/blog/qwen2.5-vl/

**家系図**: baseModel: "Qwen2.5", type: "official-derivative"

---

## コーディング特化モデル

### 8. Qwen3-Coder

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen3-Coder |
| **slug** | qwen3-coder |
| **releaseDate** | 2025-07-22 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | INSTRUCT (MoE) |

**ベンチマーク（480B-A35B）**：
- Aider Polyglot: **61.8%**
- SWE-Bench Verified: **67-69.6%** (Open SOTA)
- LiveCodeBench v5: **59%**
- SciCode: **36%**
- Source: https://qwenlm.github.io/blog/qwen3-coder/

**スペック**：
- contextLength: **262,144** (256K native, 1Mまで拡張可能)
- trainingTokens: **7.5T** (70% code ratio)
- languages: 100以上のプログラミング言語
- architecture: MoE (160 experts, 8 selected per token)

**バリエーション**：

| サイズ | Active | HuggingFace URL | minVram |
|--------|--------|-----------------|---------|
| 30B-A3B | 3.3B | https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct | 60GB |
| 480B-A35B | 35B | https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct | 250GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen
- github: https://github.com/QwenLM/Qwen3-Coder
- website: https://qwenlm.github.io/blog/qwen3-coder/

**家系図**: baseModel: "Qwen3", type: "official-derivative"

---

### 9. Qwen2.5-Coder

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen2.5-Coder |
| **slug** | qwen2-5-coder |
| **releaseDate** | 2024-11-12 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 (0.5B-32B除く3B), Qwen Research (3B) |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（32B Instruct）**：
- HumanEval: **92.7%**
- HumanEval+: **87.6%**
- MBPP: **~90%**
- BigCodeBench: SOTA
- LiveCodeBench: SOTA
- Aider: **73.7**
- McEval (40+ languages): **65.9**
- Source: https://arxiv.org/abs/2409.12186

**スペック**：
- contextLength: **131,072** (7B-32B), **32,768** (0.5B-3B)
- trainingTokens: **5.5T** (70% Code, 20% Text, 10% Math)
- languages: 92プログラミング言語
- architecture: Transformer, RoPE, SwiGLU, RMSNorm, GQA with QKV bias

**バリエーション**：

| サイズ | HuggingFace URL (Base) | HuggingFace URL (Instruct) | minVram |
|--------|------------------------|---------------------------|---------|
| 0.5B | https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B | https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct | 1.5GB |
| 1.5B | https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B | https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct | 4GB |
| 3B | https://huggingface.co/Qwen/Qwen2.5-Coder-3B | https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct | 7GB |
| 7B | https://huggingface.co/Qwen/Qwen2.5-Coder-7B | https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct | 17GB |
| 14B | https://huggingface.co/Qwen/Qwen2.5-Coder-14B | https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct | 32GB |
| 32B | https://huggingface.co/Qwen/Qwen2.5-Coder-32B | https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct | 70GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen
- paper: https://arxiv.org/abs/2409.12186
- github: https://github.com/QwenLM/Qwen2.5-Coder
- website: https://qwenlm.github.io/blog/qwen2.5-coder-family/

**家系図**: baseModel: "Qwen2.5", type: "official-derivative"

---

### 10. CodeQwen (CodeQwen1.5)

| フィールド | 値 |
|-----------|-----|
| **name** | CodeQwen1.5 |
| **slug** | codeqwen |
| **releaseDate** | 2024-04-16 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | BASE / INSTRUCT (Chat) |

**ベンチマーク**：
- HumanEval (Base): **51.8**
- HumanEval (Chat): **83.5**
- HumanEval+ (Chat): **78.7**
- MBPP (Chat): **77.7**
- SWE-Bench: **0.89** (GPT-3.5超え)
- Source: https://qwenlm.github.io/blog/codeqwen1.5/

**スペック**：
- contextLength: **65,536** (64K)
- trainingTokens: **~3T** (code-related)
- languages: 92プログラミング言語
- architecture: Qwen1.5ベース, GQA

**バリエーション**：

| バリアント | HuggingFace URL | minVram |
|-----------|-----------------|---------|
| 7B Base | https://huggingface.co/Qwen/CodeQwen1.5-7B | 14GB |
| 7B Chat | https://huggingface.co/Qwen/CodeQwen1.5-7B-Chat | 14GB |

**プロンプトテンプレート（FIM）**：
```json
{
  "format": "fim",
  "prefix": "<fim_prefix>{prefix}<fim_suffix>{suffix}<fim_middle>"
}
```

**リンク**：
- huggingface: https://huggingface.co/Qwen
- github: https://github.com/QwenLM/CodeQwen1.5
- website: https://qwenlm.github.io/blog/codeqwen1.5/

**家系図**: baseModel: "Qwen1.5-7B", type: "official-derivative"

---

## 専門特化モデル

### 11. QwQ (推論モデル)

| フィールド | 値 |
|-----------|-----|
| **name** | QwQ-32B |
| **slug** | qwq |
| **releaseDate** | 2025-03-06 (Preview: 2024-11-28) |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | INSTRUCT (Reasoning) |

**ベンチマーク（QwQ-32B）**：
- AIME24: **79.5%** (vs o1-mini 63.6%)
- LiveCodeBench: **63.4%** (vs o1-mini 53.8%)
- LiveBench: **73.1%** (vs o1-mini 59.1%)
- IFEval: **83.9%**
- GPQA: **65.2%** (Preview)
- MATH-500: **90.6%** (Preview)
- Source: https://qwenlm.github.io/blog/qwq-32b/

**スペック**：
- contextLength: **131,072** (QwQ-32B), **32,768** (Preview)
- knowledgeCutoff: 2024年12月
- languages: 29言語以上
- architecture: 32.5Bパラメータ, Transformer decoder-only, RoPE, SwiGLU, RMSNorm, GQA, YaRN

**プロンプトテンプレート**：
```json
{
  "format": "chatml-reasoning",
  "system": "<|im_start|>system\nYou are a helpful and harmless assistant. You are Qwen developed by Alibaba. You should think step-by-step.<|im_end|>",
  "user": "<|im_start|>user\n{content}<|im_end|>",
  "assistant": "<|im_start|>assistant\n<think>\n{reasoning}</think>\n{response}<|im_end|>",
  "stopTokens": ["<|im_start|>", "<|im_end|>"],
  "recommendedSettings": {"temperature": 0.6, "topP": 0.95, "topK": 20}
}
```

**バリエーション**：

| バリアント | HuggingFace URL | minVram |
|-----------|-----------------|---------|
| QwQ-32B | https://huggingface.co/Qwen/QwQ-32B | 65GB |
| QwQ-32B-Preview | https://huggingface.co/Qwen/QwQ-32B-Preview | 65GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen/QwQ-32B
- github: https://github.com/QwenLM/QwQ
- website: https://qwenlm.github.io/blog/qwq-32b/

**家系図**: baseModel: "Qwen2.5-32B", type: "official-derivative"

---

### 12. Qwen2.5-Math

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen2.5-Math |
| **slug** | qwen2-math |
| **releaseDate** | 2024-09-19 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（72B Instruct, CoT）**：
- GSM8K: **95.2%**
- MATH: **85.9%** (Greedy), **92.9%** (TIR RM@8)
- MMLU-STEM: **81.5%**
- OlympiadBench: **44.0%**
- AIME 2024: **21/30** (RM@256)
- CMATH: **92.3%**
- GaoKao Math QA: **72.8%**
- Source: https://arxiv.org/abs/2409.12122

**スペック**：
- contextLength: **4,096** (pre-training), 標準Qwen2.5サポート
- trainingTokens: **1T+** (Qwen Math Corpus v2)
- knowledgeCutoff: 2024年
- languages: 中国語、英語（バイリンガル）
- architecture: Qwen2.5ベース, CoT推論, Tool-integrated Reasoning (TIR, Pythonインタプリタ使用)

**プロンプトテンプレート**：
```json
{
  "format": "chatml-math",
  "systemCoT": "Please reason step by step, and put your final answer within \\boxed{}.",
  "systemTIR": "Please integrate natural language reasoning with programs to solve the problem above, and put your final answer within \\boxed{}.",
  "stopTokens": ["<|im_start|>", "<|im_end|>"]
}
```

**バリエーション**：

| サイズ | Type | HuggingFace URL | minVram |
|--------|------|-----------------|---------|
| 1.5B | Base | https://huggingface.co/Qwen/Qwen2.5-Math-1.5B | 4GB |
| 1.5B | Instruct | https://huggingface.co/Qwen/Qwen2.5-Math-1.5B-Instruct | 4GB |
| 7B | Base | https://huggingface.co/Qwen/Qwen2.5-Math-7B | 16GB |
| 7B | Instruct | https://huggingface.co/Qwen/Qwen2.5-Math-7B-Instruct | 16GB |
| 72B | Base | https://huggingface.co/Qwen/Qwen2.5-Math-72B | 150GB |
| 72B | Instruct | https://huggingface.co/Qwen/Qwen2.5-Math-72B-Instruct | 150GB |
| 72B | Reward Model | https://huggingface.co/Qwen/Qwen2.5-Math-RM-72B | 150GB |

**リンク**：
- huggingface: https://huggingface.co/Qwen/Qwen2.5-Math-72B-Instruct
- paper: https://arxiv.org/abs/2409.12122
- github: https://github.com/QwenLM/Qwen2.5-Math
- website: https://qwenlm.github.io/blog/qwen2.5-math/

**家系図**: baseModel: "Qwen2.5", type: "official-derivative"

---

### 13. Qwen3-Embedding

| フィールド | 値 |
|-----------|-----|
| **name** | Qwen3-Embedding |
| **slug** | qwen3-embedding |
| **releaseDate** | 2025-06-05 |
| **developer** | Alibaba Cloud / Qwen Team |
| **license** | Apache 2.0 |
| **modelType** | EMBEDDING |

**ベンチマーク（8B）**：
- MTEB Multilingual Overall: **70.58** (#1)
- MTEB English v2 Mean: **75.22**
- C-MTEB Chinese Mean: **73.84**
- MTEB Code: **80.68**
- Retrieval: **70.88**
- STS: **81.08**
- Classification: **74.00**
- Source: https://arxiv.org/abs/2506.05176

**スペック**：
- contextLength: **32,768**
- maxSequenceLength: 8,192（推奨）
- embeddingDimensions: 1024 (0.6B), 2560 (4B), 4096 (8B)
- languages: 100以上（自然言語+プログラミング言語）
- architecture: Dense Transformer decoder (Qwen3), Dual-encoder, Last token pooling (EOS), Matryoshka Representation Learning (MRL), LoRA fine-tuning

**プロンプトテンプレート（Embedding）**：
```json
{
  "format": "instruct-embedding",
  "queryTemplate": "Instruct: {task_description}\nQuery: {query_text}",
  "documentTemplate": "{document_text}",
  "exampleInstruction": "Given a web search query, retrieve relevant passages that answer the query"
}
```

**バリエーション**：

| サイズ | Layers | Embedding Dim | HuggingFace URL |
|--------|--------|---------------|-----------------|
| 0.6B | 28 | 1024 | https://huggingface.co/Qwen/Qwen3-Embedding-0.6B |
| 4B | 36 | 2560 | https://huggingface.co/Qwen/Qwen3-Embedding-4B |
| 8B | 36 | 4096 | https://huggingface.co/Qwen/Qwen3-Embedding-8B |

**Rerankerバリエーション**：

| サイズ | HuggingFace URL |
|--------|-----------------|
| 0.6B | https://huggingface.co/Qwen/Qwen3-Reranker-0.6B |
| 4B | https://huggingface.co/Qwen/Qwen3-Reranker-4B |
| 8B | https://huggingface.co/Qwen/Qwen3-Reranker-8B |

**リンク**：
- huggingface: https://huggingface.co/Qwen/Qwen3-Embedding-8B
- paper: https://arxiv.org/abs/2506.05176
- github: https://github.com/QwenLM/Qwen3-Embedding
- website: https://qwenlm.github.io/blog/qwen3-embedding/

**家系図**: baseModel: "Qwen3-Base", type: "official-derivative"

---

## Qwenファミリー家系図（_tree.json用）

```
Qwen (Original 2023)
└── type: "evolution"
    └── Qwen1.5 (2024-02-04)
        ├── type: "official-derivative"
        │   └── CodeQwen1.5 (2024-04-16)
        └── type: "evolution"
            └── Qwen2 (2024-06-07)
                └── type: "evolution"
                    └── Qwen2.5 (2024-09-19)
                        ├── type: "official-derivative"
                        │   ├── Qwen2.5-Coder (2024-11-12)
                        │   ├── Qwen2.5-Math (2024-09-19)
                        │   ├── Qwen2.5-VL (2025-01-28)
                        │   └── QwQ-32B (2025-03-06)
                        └── type: "evolution"
                            └── Qwen3 (2025-04-29)
                                ├── type: "evolution"
                                │   └── Qwen3-Next (2025-09-10)
                                └── type: "official-derivative"
                                    ├── Qwen3-Coder (2025-07-22)
                                    ├── Qwen3-VL (2025-09-23)
                                    └── Qwen3-Embedding (2025-06-05)
```

## 共通プロンプトテンプレート（全Qwenモデル）

```json
{
  "chatML": {
    "format": "chatml",
    "system": "<|im_start|>system\n{system_message}<|im_end|>",
    "user": "<|im_start|>user\n{user_message}<|im_end|>",
    "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
    "stopTokens": ["<|im_end|>", "<|endoftext|>"],
    "defaultSystemPrompt": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant."
  },
  "thinking": {
    "thinkStart": "<think>",
    "thinkEnd": "</think>",
    "enableThinking": "/think",
    "disableThinking": "/no_think"
  }
}
```

## まとめ

Qwenファミリーは**36兆トークン**学習の最新Qwen3から、**119言語対応**、**256Kコンテキスト**（1Mまで拡張可能）まで進化している。特に注目すべきは、Qwen3-NextのHybrid Transformer-Mambaアーキテクチャ（**80Bパラメータで3Bアクティブ**という高効率設計）と、QwQの強力な推論能力（o1-miniを大幅に上回る性能）である。全モデルがApache 2.0ライセンス（大型モデルの一部を除く）で提供され、商用利用可能な点も大きな特徴となっている。