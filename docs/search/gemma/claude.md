# Gemmaファミリー完全モデルカタログ：AIwiki JSON作成用データ集

Google DeepMindのGemmaファミリーは、**10モデルシリーズ**で構成される包括的なAIエコシステムを形成している。Gemma（ラテン語で「宝石」）は2024年2月の初代モデルから2025年のGemma 3世代まで急速に進化し、テキスト生成からビジョン・コーディング・安全性評価・埋め込みまで多様な専門モデルを展開している。本レポートでは、各モデルのJSON作成に必要な全情報を体系的に整理する。

---

## コアLLM進化ライン

### 1. Gemma 1

| フィールド | 値 |
|-----------|-----|
| **name** | Gemma |
| **slug** | gemma |
| **releaseDate** | 2024-02-21 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（7B）**：
- MMLU (5-shot): **64.3**
- HumanEval: **32.3**
- MATH: **24.3**
- GSM8K: **50.9**
- ARC-c: **61.1**
- Source: https://ai.google.dev/gemma/docs/model_card

**スペック**：
- contextLength: **8,192**
- trainingTokens: **6T** (7B), **2T** (2B)
- knowledgeCutoff: 2023年
- languages: English (primary)
- architecture: Decoder-only Transformer, RoPE, GeGLU, RMSNorm, Multi-Query Attention (2B) / Multi-Head Attention (7B), Vocab 256,000

**プロンプトテンプレート**：
```json
{
  "format": "gemma",
  "user": "<start_of_turn>user\n{user_message}<end_of_turn>",
  "assistant": "<start_of_turn>model\n{assistant_response}<end_of_turn>",
  "stopTokens": ["<end_of_turn>", "<eos>"]
}
```

**バリエーション**：

| サイズ | HuggingFace URL (Base) | HuggingFace URL (Instruct) | minVram |
|--------|------------------------|---------------------------|---------|
| 2B | https://huggingface.co/google/gemma-2b | https://huggingface.co/google/gemma-2b-it | 5GB |
| 7B | https://huggingface.co/google/gemma-7b | https://huggingface.co/google/gemma-7b-it | 17GB |

**リンク**：
- huggingface: https://huggingface.co/google
- paper: https://arxiv.org/abs/2403.08295
- github: https://github.com/google-deepmind/gemma
- website: https://ai.google.dev/gemma

**家系図**: baseModel: N/A, type: N/A（ルートモデル）

---

### 2. Gemma 2

| フィールド | 値 |
|-----------|-----|
| **name** | Gemma 2 |
| **slug** | gemma2 |
| **releaseDate** | 2024-06-27 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（27B）**：
- MMLU (5-shot): **75.2**
- HumanEval: **51.8**
- MATH: **46.6**
- GSM8K: **74.0**
- ARC-c: **71.4**
- Source: https://ai.google.dev/gemma/docs/model_card_2

**ベンチマーク（9B）**：
- MMLU (5-shot): **71.3**
- HumanEval: **40.2**
- MATH: **36.6**

**スペック**：
- contextLength: **8,192**
- trainingTokens: **13T** (27B), **8T** (9B)
- knowledgeCutoff: 2024年初頭
- languages: English (primary)
- architecture: Decoder-only Transformer, Interleaved Local-Global Sliding Window Attention, Logit Soft-capping, Grouped-Query Attention (GQA), Knowledge Distillation (2B/9B), RoPE, SwiGLU, RMSNorm, Vocab 256,000

**バリエーション**：

| サイズ | Layers | Q/KV Heads | HuggingFace URL | minVram (BF16) | minVram (INT8) | minVram (INT4) |
|--------|--------|------------|-----------------|----------------|----------------|----------------|
| 2B | 26 | 8/4 | https://huggingface.co/google/gemma-2-2b | 5GB | 3GB | 2GB |
| 9B | 42 | 16/8 | https://huggingface.co/google/gemma-2-9b | 22GB | 11GB | 6GB |
| 27B | 46 | 32/16 | https://huggingface.co/google/gemma-2-27b | 65GB | 32GB | 17GB |

**リンク**：
- huggingface: https://huggingface.co/google
- paper: https://arxiv.org/abs/2408.00118
- github: https://github.com/google-deepmind/gemma
- website: https://ai.google.dev/gemma

**家系図**: baseModel: "Gemma", type: "evolution"

---

### 3. Gemma 3

| フィールド | 値 |
|-----------|-----|
| **name** | Gemma 3 |
| **slug** | gemma3 |
| **releaseDate** | 2025-03-12 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（27B-IT）**：
- MMLU: **76.9**
- MMLU-Pro: **67.5**
- GPQA Diamond: **42.4**
- HumanEval: **87.8**
- MATH: **69.0**
- MMMU: **64.9**
- LMArena Elo: **1338**
- Source: https://arxiv.org/abs/2503.19786

**ベンチマーク（4B-IT）**：
- Gemma 2-27B-ITを上回る性能
- LiveCodeBench: 競争力のある結果

**スペック**：
- contextLength: **128,000** (4B/12B/27B), **32,000** (270M/1B)
- trainingTokens: N/A（非公開）
- knowledgeCutoff: 2025年初頭
- languages: **140+言語**
- architecture: 
  - Decoder-only Transformer
  - 5:1 Local-to-Global Attention ratio
  - RoPE (base frequency 1M, scaled 8x from Gemma 2)
  - SigLIP Vision Encoder (896x896)
  - Pan & Scan adaptive windowing
  - Bidirectional attention for images
  - QAT (Quantization-Aware Training) checkpoints available
  - Vocab 256,000

**プロンプトテンプレート**：
```json
{
  "format": "gemma3",
  "user": "<start_of_turn>user\n{user_message}<end_of_turn>",
  "assistant": "<start_of_turn>model\n{assistant_response}<end_of_turn>",
  "stopTokens": ["<end_of_turn>", "<eos>"],
  "visionTokens": ["<start_of_image>", "<end_of_image>"]
}
```

**バリエーション**：

| サイズ | Vision | Context | HuggingFace URL (Base) | HuggingFace URL (Instruct) | minVram (BF16) | minVram (INT4) |
|--------|--------|---------|------------------------|---------------------------|----------------|----------------|
| 270M | ❌ | 32K | https://huggingface.co/google/gemma-3-270m | https://huggingface.co/google/gemma-3-270m-it | 1GB | 0.3GB |
| 1B | ❌ | 32K | https://huggingface.co/google/gemma-3-1b | https://huggingface.co/google/gemma-3-1b-it | 3GB | 1GB |
| 4B | ✅ | 128K | https://huggingface.co/google/gemma-3-4b | https://huggingface.co/google/gemma-3-4b-it | 10GB | 3GB |
| 12B | ✅ | 128K | https://huggingface.co/google/gemma-3-12b | https://huggingface.co/google/gemma-3-12b-it | 28GB | 8GB |
| 27B | ✅ | 128K | https://huggingface.co/google/gemma-3-27b | https://huggingface.co/google/gemma-3-27b-it | 65GB | 17GB |

**リンク**：
- huggingface: https://huggingface.co/collections/google/gemma-3
- paper: https://arxiv.org/abs/2503.19786
- github: https://github.com/google-deepmind/gemma
- website: https://ai.google.dev/gemma/docs/core

**家系図**: baseModel: "Gemma 2", type: "evolution"

---

### 4. Gemma 3n

| フィールド | 値 |
|-----------|-----|
| **name** | Gemma 3n |
| **slug** | gemma3n |
| **releaseDate** | 2025-06-26 (Full release) / 2025-05-20 (Preview) |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（E4B）**：
- LMArena Elo: **1300+** (初の10B未満モデルで達成)
- GSM8K: **~83%**
- WMT24++ (ChrF): **50.1%**
- 60 FPS video processing on Pixel devices
- Source: https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/

**スペック**：
- contextLength: **32,000**
- trainingTokens: N/A
- knowledgeCutoff: 2025年
- languages: **140+言語**（テキスト）, **35言語**（マルチモーダル理解）
- architecture:
  - **MatFormer** (Matryoshka Transformer) - nested transformer for elastic inference
  - **Per-Layer Embeddings (PLE)** - CPU-friendly parameter caching
  - **LAuReL** and **AltUp** for architectural efficiency
  - **KV Cache Sharing** - 2x Prefill performance improvement
  - MobileNet-V5-300M vision encoder (256/512/768 resolution)
  - USM-based audio encoder (160ms chunks, ~6 tokens/sec)
  - Multimodal: Text + Image + Audio + Video
  - Effective parameters: E2B (5B actual → 2B effective), E4B (8B actual → 4B effective)

**プロンプトテンプレート**：
```json
{
  "format": "gemma3n",
  "user": "<start_of_turn>user\n{user_message}<end_of_turn>",
  "assistant": "<start_of_turn>model\n{assistant_response}<end_of_turn>",
  "stopTokens": ["<end_of_turn>", "<eos>"],
  "audioSupport": true,
  "videoSupport": true
}
```

**バリエーション**：

| サイズ | Actual Params | Effective Params | Memory | HuggingFace URL | minVram |
|--------|---------------|------------------|--------|-----------------|---------|
| E2B | 5B | 2B | 2GB | https://huggingface.co/google/gemma-3n-E2B-it | 2GB |
| E4B | 8B | 4B | 3GB | https://huggingface.co/google/gemma-3n-E4B-it | 3GB |

**リンク**：
- huggingface: https://huggingface.co/collections/google/gemma-3n
- github: https://github.com/google-deepmind/gemma
- website: https://ai.google.dev/gemma/docs/gemma-3n

**家系図**: baseModel: "Gemma 3", type: "official-derivative"

---

## コーディング特化モデル

### 5. CodeGemma

| フィールド | 値 |
|-----------|-----|
| **name** | CodeGemma |
| **slug** | codegemma |
| **releaseDate** | 2024-04-09 (v1.0) / 2024-05 (v1.1) |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | BASE / INSTRUCT |

**ベンチマーク（7B）**：
- HumanEval (Base): **44.4%**
- HumanEval (IT): **60.4%**
- HumanEval+ (IT): **54.9%**
- MBPP (IT): **67.2%**
- GSM8K: クラス最高
- Source: https://arxiv.org/abs/2406.11409

**スペック**：
- contextLength: **8,192**
- trainingTokens: **500B-1T** (code/math追加学習)
- knowledgeCutoff: 2024年
- languages: English + 多言語コード（C++, C#, Go, Java, JavaScript, Kotlin, Python, Rust等）
- architecture: 
  - Gemmaベース
  - Fill-in-the-Middle (FIM) training (80% FIM rate, 50-50 PSM/SPM)
  - Dependency Graph-based Packing
  - Unit Test-based Lexical Packing

**プロンプトテンプレート（FIM）**：
```json
{
  "format": "fim",
  "prefix": "<|fim_prefix|>{prefix}<|fim_suffix|>{suffix}<|fim_middle|>",
  "stopTokens": ["<|file_separator|>", "<end_of_turn>"]
}
```

**プロンプトテンプレート（Chat）**：
```json
{
  "format": "gemma-chat",
  "user": "<start_of_turn>user\n{user_message}<end_of_turn>",
  "assistant": "<start_of_turn>model\n{assistant_response}<end_of_turn>",
  "stopTokens": ["<end_of_turn>"]
}
```

**バリエーション**：

| サイズ | Type | HuggingFace URL | minVram |
|--------|------|-----------------|---------|
| 2B | Base (FIM) | https://huggingface.co/google/codegemma-2b | 5GB |
| 7B | Base (FIM) | https://huggingface.co/google/codegemma-7b | 17GB |
| 7B | Instruct | https://huggingface.co/google/codegemma-7b-it | 17GB |
| 7B (v1.1) | Instruct | https://huggingface.co/google/codegemma-1.1-7b-it | 17GB |

**リンク**：
- huggingface: https://huggingface.co/google
- paper: https://arxiv.org/abs/2406.11409
- github: https://github.com/google-deepmind/codegemma
- website: https://ai.google.dev/gemma/docs/codegemma

**家系図**: baseModel: "Gemma 7B", type: "official-derivative"

---

## 専門特化モデル

### 6. TranslateGemma

| フィールド | 値 |
|-----------|-----|
| **name** | TranslateGemma |
| **slug** | translategemma |
| **releaseDate** | 2025-01-14 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | INSTRUCT |

**ベンチマーク**：
- 12B model outperforms 27B Gemma 3 baseline
- Strong performance on Vistra image translation benchmark
- 55 language pairs supported
- Source: https://blog.google/innovation-and-ai/technology/developers-tools/translategemma/

**スペック**：
- contextLength: **128,000**
- trainingTokens: **4.3B** (SFT) + **10.2M** (RL)
- languages: **55言語**
- architecture: Gemma 3ベース, 翻訳特化ファインチューニング, SigLIP vision encoder（画像翻訳対応）

**プロンプトテンプレート**：
```json
{
  "format": "translategemma",
  "user": {
    "role": "user",
    "content": [
      {
        "type": "text|image",
        "source_lang_code": "cs",
        "target_lang_code": "de-DE",
        "text": "{text_to_translate}"
      }
    ]
  },
  "stopTokens": ["<end_of_turn>"]
}
```

**バリエーション**：

| サイズ | Target | HuggingFace URL | minVram |
|--------|--------|-----------------|---------|
| 4B | Mobile/Edge | https://huggingface.co/google/translategemma-4b-it | 10GB |
| 12B | Consumer laptops | https://huggingface.co/google/translategemma-12b-it | 28GB |
| 27B | Cloud (H100/TPU) | https://huggingface.co/google/translategemma-27b-it | 65GB |

**リンク**：
- huggingface: https://huggingface.co/google
- website: https://blog.google/innovation-and-ai/technology/developers-tools/translategemma/

**家系図**: baseModel: "Gemma 3", type: "official-derivative"

---

### 7. EmbeddingGemma

| フィールド | 値 |
|-----------|-----|
| **name** | EmbeddingGemma |
| **slug** | embeddinggemma |
| **releaseDate** | 2025-09-04 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | EMBEDDING |

**ベンチマーク**：
- MTEB Multilingual: **#1** (500M以下カテゴリ)
- Comparable to models nearly 2x its size
- Source: https://developers.googleblog.com/en/introducing-embeddinggemma/

**スペック**：
- contextLength: **2,048**
- embeddingDimensions: **768** (Matryoshka: 768→128)
- languages: **100+言語**
- architecture:
  - Gemma 3ベース
  - Quantization-Aware Training (QAT)
  - Matryoshka Representation Learning
  - Same tokenizer as Gemma 3n
  - Sub-200MB RAM with quantization

**プロンプトテンプレート**：
```json
{
  "format": "instruct-embedding",
  "queryTemplate": "Instruct: {task_description}\nQuery: {query_text}",
  "documentTemplate": "{document_text}"
}
```

**バリエーション**：

| サイズ | RAM (QAT) | HuggingFace URL |
|--------|-----------|-----------------|
| 308M | <200MB | https://huggingface.co/google/embeddinggemma |

**リンク**：
- huggingface: https://huggingface.co/google
- website: https://developers.googleblog.com/en/introducing-embeddinggemma/

**家系図**: baseModel: "Gemma 3", type: "official-derivative"

---

### 8. FunctionGemma

| フィールド | 値 |
|-----------|-----|
| **name** | FunctionGemma |
| **slug** | functiongemma |
| **releaseDate** | 2025-08-14 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | INSTRUCT |

**スペック**：
- contextLength: **32,000**
- languages: English
- architecture: Gemma 3ベース, 関数呼び出し特化

**バリエーション**：

| サイズ | HuggingFace URL | minVram |
|--------|-----------------|---------|
| 270M | https://huggingface.co/google/functiongemma-270m | 1GB |

**リンク**：
- huggingface: https://huggingface.co/google
- website: https://ai.google.dev/gemma

**家系図**: baseModel: "Gemma 3", type: "official-derivative"

---

## 安全性モデル

### 9. ShieldGemma 1

| フィールド | 値 |
|-----------|-----|
| **name** | ShieldGemma |
| **slug** | shieldgemma |
| **releaseDate** | 2024-07-31 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | INSTRUCT (Safety Classifier) |

**機能**：
- テキスト安全性分類
- 4カテゴリ対応：
  1. Sexually Explicit（性的コンテンツ）
  2. Dangerous Content（危険なコンテンツ）
  3. Hate Speech（ヘイトスピーチ）
  4. Harassment（ハラスメント）
- Source: https://arxiv.org/abs/2407.21772

**スペック**：
- contextLength: **8,192**
- languages: English
- architecture: Gemma 2ベース, LLM-as-a-judge technique

**プロンプトテンプレート**：
```json
{
  "format": "shieldgemma",
  "preamble": "You are a policy expert trying to help determine whether a user prompt is in violation of the defined safety policies.",
  "input": "<start_of_turn>\nHuman Question: {user_prompt}\n<end_of_turn>",
  "policy": "Our safety principle is defined in the below:\n{safety_policy}",
  "question": "Does the human question violate the above principle?",
  "output": "Yes|No"
}
```

**バリエーション**：

| サイズ | HuggingFace URL | minVram |
|--------|-----------------|---------|
| 2B | https://huggingface.co/google/shieldgemma-2b | 5GB |
| 9B | https://huggingface.co/google/shieldgemma-9b | 22GB |
| 27B | https://huggingface.co/google/shieldgemma-27b | 65GB |

**リンク**：
- huggingface: https://huggingface.co/google
- paper: https://arxiv.org/abs/2407.21772
- website: https://ai.google.dev/gemma/docs/shieldgemma

**家系図**: baseModel: "Gemma 2", type: "official-derivative"

---

### 10. ShieldGemma 2

| フィールド | 値 |
|-----------|-----|
| **name** | ShieldGemma 2 |
| **slug** | shieldgemma2 |
| **releaseDate** | 2025-03-12 |
| **developer** | Google DeepMind |
| **license** | Gemma Terms of Use |
| **modelType** | INSTRUCT (Image Safety Classifier) |

**機能**：
- **画像**安全性分類
- 3カテゴリ対応：
  1. Dangerous Content（危険なコンテンツ）
  2. Sexually Explicit（性的コンテンツ）
  3. Violence（暴力）
- Source: https://ai.google.dev/gemma/docs/shieldgemma

**スペック**：
- contextLength: **128,000**
- languages: English
- architecture: Gemma 3 4Bベース, SigLIP vision encoder

**バリエーション**：

| サイズ | HuggingFace URL | minVram |
|--------|-----------------|---------|
| 4B | https://huggingface.co/google/shieldgemma-2-4b | 10GB |

**リンク**：
- huggingface: https://huggingface.co/google
- website: https://ai.google.dev/gemma/docs/shieldgemma

**家系図**: baseModel: "Gemma 3", type: "official-derivative"

---

## Gemmaファミリー家系図（_tree.json用）

```
Gemma (2024-02-21)
└── type: "evolution"
    └── Gemma 2 (2024-06-27)
        ├── type: "official-derivative"
        │   └── ShieldGemma (2024-07-31)
        └── type: "evolution"
            └── Gemma 3 (2025-03-12)
                ├── type: "evolution"
                │   └── Gemma 3n (2025-06-26)
                └── type: "official-derivative"
                    ├── ShieldGemma 2 (2025-03-12)
                    ├── TranslateGemma (2025-01-14)
                    ├── EmbeddingGemma (2025-09-04)
                    └── FunctionGemma (2025-08-14)

Gemma (2024-02-21)
└── type: "official-derivative"
    └── CodeGemma (2024-04-09)
```

---

## 共通プロンプトテンプレート（全Gemmaモデル）

```json
{
  "gemma": {
    "format": "gemma",
    "user": "<start_of_turn>user\n{user_message}<end_of_turn>",
    "assistant": "<start_of_turn>model\n{assistant_response}<end_of_turn>",
    "stopTokens": ["<end_of_turn>", "<eos>"],
    "bosToken": "<bos>",
    "specialTokens": {
      "startOfTurn": "<start_of_turn>",
      "endOfTurn": "<end_of_turn>",
      "eos": "<eos>",
      "pad": "<pad>"
    }
  },
  "fim": {
    "prefix": "<|fim_prefix|>",
    "suffix": "<|fim_suffix|>",
    "middle": "<|fim_middle|>",
    "fileSeparator": "<|file_separator|>"
  }
}
```

---

## まとめ

Gemmaファミリーは**200M以上のダウンロード**を達成し、**60,000以上のコミュニティバリアント**が作成されている活発なエコシステムである。

**主要な特徴**：
- **Gemma 3**: 単一GPU/TPUで動作する最高性能モデル、128Kコンテキスト、140+言語対応、LMArena Elo 1338
- **Gemma 3n**: モバイルファースト設計、2GB RAMで動作、初の10B未満で1300+ Elo達成
- **CodeGemma**: Fill-in-the-Middle対応、IDE統合に最適
- **EmbeddingGemma**: 200MB未満のオンデバイス埋め込み、MTEB 500M以下で最高性能
- **ShieldGemma**: テキスト・画像の安全性分類

全モデルがGemma Terms of Useライセンスで提供され、商用利用可能（要規約確認）。Hugging Face、Kaggle、Vertex AI Model Gardenから入手可能。
