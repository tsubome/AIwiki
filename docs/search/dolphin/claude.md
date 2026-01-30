# Dolphinファミリー完全モデルカタログ：AIwiki JSON作成用データ集

Eric Hartford氏とCognitive Computationsが開発するDolphinファミリーは、**検閲なし（Uncensored）**の指示調整済みモデルシリーズとして広く知られている。2023年のMicrosoftのOrcaペーパーにインスパイアされた初代Dolphinから、2025年のDolphin 3.0世代まで急速に進化し、汎用チャットからコーディング・MoE・大規模マージモデルまで多様なバリエーションを展開している。本レポートでは、各モデルのJSON作成に必要な全情報を体系的に整理する。

---

## ファミリー情報（_family.json用）

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin |
| **slug** | dolphin |
| **developer** | Eric Hartford / Cognitive Computations |
| **description (ja)** | Eric Hartford氏が開発する検閲なしの指示調整済みモデルシリーズ。様々なベースモデル上でファインチューニングされ、高い従順性とコーディング能力を持つ。 |
| **description (en)** | An uncensored instruct-tuned model series developed by Eric Hartford. Fine-tuned on various base models, featuring high compliance and strong coding capabilities. |
| **website** | https://erichartford.com/dolphin |
| **versions** | dolphin3, dolphin-llama3, dolphin-llama2, dolphin-mistral, dolphin-mixtral, dolphin-nemo, dolphin-phi, dolphin-yi, dolphin-qwen, dolphincoder, tinydolphin, megadolphin |

---

## 初代・基盤モデル

### 0. Dolphin (初代 LLaMA/LLaMA 2ベース)

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin LLaMA |
| **slug** | dolphin-llama |
| **releaseDate** | 2023-07（LLaMA-1）/ 2023-08（LLaMA-2） |
| **developer** | Eric Hartford |
| **license** | LLaMA License（非商用）/ Llama 2 Community License（商用可） |
| **modelType** | FINETUNE |

**特徴**：
- MicrosoftのOrcaペーパーを実装した初のモデル
- FLANv2をGPT-4/GPT-3.5で補完したデータセットで学習
- アライメントとバイアスを除去した「検閲なし」モデルの先駆け
- Airoboros等の追加データセットで創造性を強化

**スペック**：
- contextLength: **2,048**（LLaMA-1）/ **4,096**（LLaMA-2）
- trainingTime: 数日（qLoRA、4x A100）
- datasets: 842,610 instructions（GPT-4）+ 2,625,353 instructions（GPT-3.5）

**プロンプトテンプレート**：
```
SYSTEM: {system_message}
USER: {prompt}
ASSISTANT:
```

**バリエーション**：

| バージョン | サイズ | ベースモデル | HuggingFace URL | License |
|-----------|--------|-------------|-----------------|---------|
| 初代 | 13B | LLaMA-1 | https://huggingface.co/cognitivecomputations/dolphin-llama-13b | 非商用 |
| 初代 | 7B | LLaMA-2 | https://huggingface.co/cognitivecomputations/dolphin-llama2-7b | Llama 2 |

**スポンサー**: preemo（LLaMA-2版）

**家系図**: baseModel: "meta-llama/Llama-2-7b", type: "finetune"

---

## コアモデルライン

### 1. Dolphin 3.0

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin 3.0 |
| **slug** | dolphin3 |
| **releaseDate** | 2025-01-05 |
| **developer** | Eric Hartford / Cognitive Computations / Ben Gitter / BlouseJury |
| **sponsors** | Crusoe Cloud (16x L40S), Akash (8x H100), Lazarus (16x H100), Cerebras (inference), a16z (grant) |
| **license** | Base Model License（Llama: Llama 3.1 Community License, Qwen: Apache 2.0） |
| **modelType** | FINETUNE |

**特徴**：
- 次世代汎用ローカルモデル
- コーディング、数学、エージェント、関数呼び出し、一般用途に最適化
- ローカルファーストアーキテクチャ
- ステアラブル（制御可能）なAIフレームワーク
- システムプロンプトによるアライメント制御
- DeepSeek-V3でデータ補完、RLHFlowの報酬モデルでフィルタリング

**スペック**：
- contextLength: **8,192**（ファインチューニング時）/ ベースモデル依存（最大128K）
- languages: 多言語対応（ベースモデル依存）
- architecture: Transformer Decoder-only（Llama 3.1 / Qwen 2.5ベース）

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>", "<|im_start|>"]
}
```

**バリエーション**：

| サイズ | ベースモデル | HuggingFace URL | minVram | recommendedVram |
|--------|-------------|-----------------|---------|-----------------|
| 0.5B | Qwen 2.5-0.5B | https://huggingface.co/dphn/Dolphin3.0-Qwen2.5-0.5B | 1GB | 2GB |
| 1B | Llama 3.2-1B | https://huggingface.co/dphn/Dolphin3.0-Llama3.2-1B | 3GB | 4GB |
| 1.5B | Qwen 2.5-1.5B | https://huggingface.co/dphn/Dolphin3.0-Qwen2.5-1.5B | 4GB | 6GB |
| 3B | Qwen 2.5-3B | https://huggingface.co/dphn/Dolphin3.0-Qwen2.5-3b | 7GB | 9GB |
| 3B | Llama 3.2-3B | https://huggingface.co/dphn/Dolphin3.0-Llama3.2-3B | 7GB | 10GB |
| 8B | Llama 3.1-8B | https://huggingface.co/dphn/Dolphin3.0-Llama3.1-8B | 16GB | 20GB |
| 24B | Mistral-24B | https://huggingface.co/dphn/Dolphin3.0-Mistral-24B | 48GB | 60GB |

**Dolphin 3.0 R1バリエーション**（推論特化）：

| サイズ | ベースモデル | HuggingFace URL | minVram |
|--------|-------------|-----------------|---------|
| 24B | Mistral-24B | https://huggingface.co/dphn/Dolphin3.0-R1-Mistral-24B | 48GB |

**ベンチマーク (Llama3.1-8B版)**：
| メトリクス | スコア |
|-----------|--------|
| IFEval (0-Shot) | 76.21% |
| BBH (3-Shot) | 27.63% |
| MATH Lvl 5 (4-Shot) | 10.50% |
| GPQA (0-shot) | 4.36% |
| MuSR (0-shot) | 8.97% |
| MMLU-PRO (5-shot) | 22.13% |

**リンク**：
- huggingface: https://huggingface.co/dphn
- github: https://github.com/cognitivecomputations
- website: https://erichartford.com/dolphin

**家系図**: baseModel: "Llama 3.1 / Qwen 2.5", type: "finetune"

---

### 2. Dolphin 2.9 / 2.9.1 / 2.9.2 / 2.9.4 (Llama 3系)

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin 2.9 Llama 3 |
| **slug** | dolphin-llama3 |
| **releaseDate** | 2024-04-20 |
| **developer** | Eric Hartford / Lucas Atkins / Fernando Fernandes / Cognitive Computations |
| **license** | Meta Llama 3 Community License |
| **modelType** | FINETUNE |

**特徴**：
- 検閲なし（アライメントとバイアスを除去）
- 指示追従、会話、コーディングスキル
- 初期的なエージェント能力と関数呼び出しサポート
- 256Kコンテキストウィンドウ版も利用可能

**スペック**：
- contextLength: **8,192**（標準）/ **256,000**（拡張版）
- trainingSequenceLength: 4,096
- languages: 多言語（英語優先）
- architecture: Llama 3 Transformer Decoder-only

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"],
  "defaultSystemPrompt": "You are Dolphin, a helpful AI assistant."
}
```

**バリエーション（Llama 3ベース）**：

| バージョン | サイズ | HuggingFace URL | minVram | recommendedVram |
|-----------|--------|-----------------|---------|-----------------|
| 2.9 | 8B | https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-8b | 16GB | 20GB |
| 2.9.1 | 8B | https://huggingface.co/cognitivecomputations/dolphin-2.9.1-llama-3-8b | 16GB | 20GB |
| 2.9 | 70B | https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-70b | 140GB | 160GB |

**バリエーション（Llama 3.1ベース）**：

| バージョン | サイズ | HuggingFace URL | minVram |
|-----------|--------|-----------------|---------|
| 2.9.4 | 8B | https://huggingface.co/cognitivecomputations/dolphin-2.9.4-llama3.1-8b | 16GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations
- website: https://erichartford.com/dolphin

**家系図**: baseModel: "meta-llama/Meta-Llama-3-8B", type: "finetune"

---

### 3. Dolphin 2.8 Mistral

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin 2.8 Mistral |
| **slug** | dolphin-mistral |
| **releaseDate** | 2024-03-25 |
| **developer** | Eric Hartford / Cognitive Computations |
| **license** | Apache 2.0 |
| **modelType** | FINETUNE |

**特徴**：
- Mistral-7B-v0.2ベース
- 指示、会話、コーディングスキル
- 検閲なし
- 32Kコンテキスト（ファインチューニングは16K）

**スペック**：
- contextLength: **32,768**（ベース）/ **16,384**（ファインチューニング時）
- trainingTime: 3日（10x L40S）
- languages: 多言語
- architecture: Mistral Transformer Decoder-only

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"]
}
```

**バリエーション**：

| バージョン | サイズ | HuggingFace URL | minVram | recommendedVram |
|-----------|--------|-----------------|---------|-----------------|
| 2.8 | 7B | https://huggingface.co/cognitivecomputations/dolphin-2.8-mistral-7b-v02 | 14GB | 18GB |
| 2.6 | 7B | https://huggingface.co/cognitivecomputations/dolphin-2.6-mistral-7b-dpo | 14GB | 18GB |
| 2.5 | 7B | https://huggingface.co/cognitivecomputations/dolphin-2.5-mistral-7b | 14GB | 18GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations/dolphin-2.8-mistral-7b-v02

**家系図**: baseModel: "mistralai/Mistral-7B-v0.2", type: "finetune"

---

### 4. Dolphin Mixtral (2.5 / 2.6 / 2.7)

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin Mixtral |
| **slug** | dolphin-mixtral |
| **releaseDate** | 2023-12-15（2.5）/ 2024-01-01（2.7） |
| **developer** | Eric Hartford / Cognitive Computations |
| **license** | Apache 2.0 |
| **modelType** | FINETUNE |

**特徴**：
- Mixtral-8x7B MoEアーキテクチャベース
- コーディングに非常に優れる
- 検閲なし
- qLoRAによる効率的なファインチューニング

**スペック**：
- contextLength: **32,768**（ベース）/ **16,384**（ファインチューニング時）
- trainingTime: 3日（4x A100 qLoRA）
- architecture: Mixture of Experts (8x7B)
- totalParameters: **46.7B**
- activeParameters: **12.9B**

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"],
  "defaultSystemPrompt": "You are Dolphin, an uncensored and unbiased AI assistant."
}
```

**バリエーション**：

| バージョン | サイズ | HuggingFace URL | minVram | recommendedVram |
|-----------|--------|-----------------|---------|-----------------|
| 2.7 | 8x7B | https://huggingface.co/cognitivecomputations/dolphin-2.7-mixtral-8x7b | 90GB | 100GB |
| 2.6 | 8x7B | https://huggingface.co/cognitivecomputations/dolphin-2.6-mixtral-8x7b | 90GB | 100GB |
| 2.5 | 8x7B | https://huggingface.co/cognitivecomputations/dolphin-2.5-mixtral-8x7b | 90GB | 100GB |

**Mixtral 8x22Bバリエーション**：

| バージョン | サイズ | HuggingFace URL | minVram |
|-----------|--------|-----------------|---------|
| 2.9 | 8x22B | https://huggingface.co/cognitivecomputations/dolphin-2.9-mixtral-8x22b | 250GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations/dolphin-2.7-mixtral-8x7b
- website: https://erichartford.com/dolphin-25-mixtral-8x7b

**家系図**: baseModel: "mistralai/Mixtral-8x7B-v0.1", type: "finetune"

---

### 5. Dolphin-Yi

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin 2.2 Yi |
| **slug** | dolphin-yi |
| **releaseDate** | 2023-12 |
| **developer** | Eric Hartford / Cognitive Computations |
| **license** | Yi License |
| **modelType** | FINETUNE |

**特徴**：
- 01.ai Yi-34Bベース（Llama互換版使用）
- 16Kコンテキストでファインチューニング
- 会話と共感能力（Samantha + WizardLM DNA）
- 検閲なし

**スペック**：
- contextLength: **16,384**
- architecture: Yi Transformer Decoder-only
- parameters: **34B**

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"]
}
```

**バリエーション**：

| バージョン | サイズ | HuggingFace URL | minVram |
|-----------|--------|-----------------|---------|
| 2.2 | 34B | https://huggingface.co/cognitivecomputations/dolphin-2_2-yi-34b | 68GB |

**スポンサー**: a16z

**家系図**: baseModel: "01-ai/Yi-34B", type: "finetune"

---

### 6. Dolphin-Qwen (2.9.x系)

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin Qwen |
| **slug** | dolphin-qwen |
| **releaseDate** | 2024-06（2.9.1）/ 2024-07（2.9.2/2.9.3） |
| **developer** | Eric Hartford / Lucas Atkins / Fernando Fernandes / Cognitive Computations |
| **license** | Qwen Tongyi-Qianwen License / Apache 2.0 |
| **modelType** | FINETUNE |

**特徴**：
- Qwen/Qwen2ベースのファインチューニング
- 指示追従、会話、コーディングスキル
- 初期的なエージェント能力と関数呼び出しサポート
- 検閲なし

**スペック**：
- contextLength: **128,000**（ベースモデル）/ **16,384**（ファインチューニング時）
- architecture: Qwen Transformer Decoder-only

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"]
}
```

**バリエーション**：

| バージョン | サイズ | ベースモデル | HuggingFace URL | minVram |
|-----------|--------|-------------|-----------------|---------|
| 2.9.3 | 0.5B | Qwen2-0.5B | https://huggingface.co/cognitivecomputations/dolphin-2.9.3-qwen2-0.5b | 2GB |
| 2.9.2 | 7B | Qwen2-7B | https://huggingface.co/cognitivecomputations/dolphin-2.9.2-qwen2-7b | 14GB |
| 2.9.1 | 110B | Qwen-110B | https://huggingface.co/cognitivecomputations/dolphin-2.9.1-qwen-110b | 220GB |

**注記**: Qwen2-0.5Bモデルは小型モデル向けにコーディング、関数呼び出し、多言語SystemChatデータセットを除外して学習

**スポンサー**: Crusoe Cloud

**家系図**: baseModel: "Qwen/Qwen2-7B", type: "finetune"

---

### 7. Dolphin-Nemo

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin 2.9.3 Mistral Nemo |
| **slug** | dolphin-nemo |
| **releaseDate** | 2024-08 |
| **developer** | Eric Hartford / Lucas Atkins / Fernando Fernandes / Cognitive Computations |
| **license** | Apache 2.0 |
| **modelType** | FINETUNE |

**特徴**：
- Mistral Nemo（NVidia/Mistral AI共同開発）ベース
- 128Kコンテキスト対応ベースモデル
- 指示追従、会話、コーディングスキル
- 初期的なエージェント能力と関数呼び出しサポート
- 検閲なし

**スペック**：
- contextLength: **128,000**（ベース）/ **8,192**（ファインチューニング時）
- parameters: **12B**
- architecture: Mistral Nemo Transformer Decoder-only

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"]
}
```

**バリエーション**：

| バージョン | サイズ | HuggingFace URL | minVram | recommendedVram |
|-----------|--------|-----------------|---------|-----------------|
| 2.9.3 | 12B | https://huggingface.co/cognitivecomputations/dolphin-2.9.3-mistral-nemo-12b | 24GB | 30GB |

**スポンサー**: Crusoe Cloud（8x H100ノード）

**家系図**: baseModel: "mistralai/Mistral-Nemo-Base-2407", type: "finetune"

---

## 小型・派生モデル

### 8. Dolphin Phi

| フィールド | 値 |
|-----------|-----|
| **name** | Dolphin Phi |
| **slug** | dolphin-phi |
| **releaseDate** | 2024-01-15 |
| **developer** | Eric Hartford / Fernando Fernandes / Cognitive Computations |
| **sponsor** | Convai |
| **license** | MIT License |
| **modelType** | FINETUNE |

**特徴**：
- Microsoft Phi-2（2.7B）ベースの小型モデル
- 検閲なし
- Samanthaベースの共感データを含む
- 軽量かつ高性能
- qLoRA + Axolotlで学習

**スペック**：
- contextLength: **2,048**
- parameters: **2.78B**
- trainingTime: 2日（4x A100 qLoRA）
- architecture: Phi-2 Transformer

**ベンチマーク（Dolphin 2.6 Phi-2）**：
- ARC: **59.81%**
- HellaSwag: **74.65%**
- GSM8K: **58.07%**
- Winogrande: **74.03%**
- Source: Open LLM Leaderboard

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"]
}
```

**バリエーション**：

| バージョン | ベースモデル | HuggingFace URL | minVram | recommendedVram |
|-----------|-------------|-----------------|---------|-----------------|
| 2.6 | Phi-2 | https://huggingface.co/cognitivecomputations/dolphin-2_6-phi-2 | 6GB | 8GB |
| 2.9.1 | Phi-3 Mini 4K | https://huggingface.co/cognitivecomputations/Dolphin-2.9.1-Phi-3-Kensho-4.5B | 10GB | 12GB |
| 2.9.2 | Phi-3 Medium | https://huggingface.co/cognitivecomputations/dolphin-2.9.2-Phi-3-Medium | 28GB | 35GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations/dolphin-2_6-phi-2

**家系図**: baseModel: "microsoft/phi-2", type: "finetune"

---

### 9. TinyDolphin

| フィールド | 値 |
|-----------|-----|
| **name** | TinyDolphin |
| **slug** | tinydolphin |
| **releaseDate** | 2024-01-20 |
| **developer** | Kearm / Cognitive Computations |
| **license** | Apache 2.0 |
| **modelType** | FINETUNE |

**特徴**：
- TinyLlama（1.1B）ベースの超小型実験モデル
- Dolphin 2.8データセットで学習
- エッジデバイス向け
- 検閲なし

**スペック**：
- contextLength: **2,048**
- parameters: **1.1B**
- architecture: TinyLlama (Llama 2ベース)

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"]
}
```

**バリエーション**：

| バージョン | サイズ | HuggingFace URL | minVram | recommendedVram |
|-----------|--------|-----------------|---------|-----------------|
| 2.8 | 1.1B | https://huggingface.co/cognitivecomputations/TinyDolphin-2.8-1.1b | 3GB | 4GB |
| 2.8.1 | 1.1B | https://huggingface.co/cognitivecomputations/TinyDolphin-2.8.1-1.1b | 3GB | 4GB |
| 2.8.2-laser | 1.1B | https://huggingface.co/cognitivecomputations/TinyDolphin-2.8.2-1.1b-laser | 3GB | 4GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations/TinyDolphin-2.8-1.1b

**家系図**: baseModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0", type: "finetune"

---

### 7. MegaDolphin

| フィールド | 値 |
|-----------|-----|
| **name** | MegaDolphin |
| **slug** | megadolphin |
| **releaseDate** | 2024-01-10 |
| **developer** | Eric Hartford / Cognitive Computations |
| **sponsor** | abacus.ai |
| **license** | Llama 2 Community License |
| **modelType** | MERGE |

**特徴**：
- Dolphin 2.2-70Bを自己インターリーブした超大規模マージモデル
- Venus-120bにインスパイア
- 会話と共感能力（Samantha + WizardLM DNA）
- 検閲なし
- Charles GoddardのMergeKitで作成（約5分で作成）

**スペック**：
- contextLength: **16,384**
- parameters: **120B**（7つの70Bレイヤー範囲をインターリーブ）
- architecture: Llama 2 Transformer (Merged)

**マージ構成**：
```yaml
merge_method: passthrough
slices:
  - layer_range: [0, 20] from dolphin-2.2-70b
  - layer_range: [10, 30] from dolphin-2.2-70b
  - layer_range: [20, 40] from dolphin-2.2-70b
  - layer_range: [30, 50] from dolphin-2.2-70b
  - layer_range: [40, 60] from dolphin-2.2-70b
  - layer_range: [50, 70] from dolphin-2.2-70b
  - layer_range: [60, 80] from dolphin-2.2-70b
```

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"],
  "defaultSystemPrompt": "You are MegaDolphin, an uncensored, unbiased, helpful AI assistant."
}
```

**バリエーション**：

| サイズ | HuggingFace URL | minVram | recommendedVram |
|--------|-----------------|---------|-----------------|
| 120B | https://huggingface.co/cognitivecomputations/MegaDolphin-120b | 240GB | 280GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations/MegaDolphin-120b

**家系図**: mergedFrom: ["cognitivecomputations/dolphin-2.2-70b"], type: "merge"

---

## 専門特化モデル

### 8. DolphinCoder

| フィールド | 値 |
|-----------|-----|
| **name** | DolphinCoder |
| **slug** | dolphincoder |
| **releaseDate** | 2024-03-01 |
| **developer** | Eric Hartford / Cognitive Computations |
| **sponsor** | latitude.sh |
| **license** | BigCode OpenRAIL-M |
| **modelType** | FINETUNE |

**特徴**：
- StarCoder2ベースのコーディング特化モデル
- 大量のコーディングデータで学習
- 検閲なし
- ソフトウェアエンジニアリングに最適化
- qLoRA + Axolotlで学習

**スペック**：
- contextLength: **16,384**
- trainingTime: 7B版は2日（8x L40S qLoRA）、15B版は3日（8x H100 qLoRA）
- architecture: StarCoder2 Transformer

**プロンプトテンプレート**：
```json
{
  "format": "chatml",
  "system": "<|im_start|>system\n{system_message}<|im_end|>",
  "user": "<|im_start|>user\n{user_message}<|im_end|>",
  "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
  "stopTokens": ["<|im_end|>"],
  "defaultSystemPrompt": "You are DolphinCoder, a helpful AI programming assistant."
}
```

**バリエーション**：

| サイズ | ベースモデル | HuggingFace URL | minVram | recommendedVram |
|--------|-------------|-----------------|---------|-----------------|
| 7B | StarCoder2-7B | https://huggingface.co/cognitivecomputations/dolphincoder-starcoder2-7b | 14GB | 18GB |
| 15B | StarCoder2-15B | https://huggingface.co/cognitivecomputations/dolphincoder-starcoder2-15b | 32GB | 40GB |

**リンク**：
- huggingface: https://huggingface.co/cognitivecomputations/dolphincoder-starcoder2-15b

**家系図**: baseModel: "bigcode/starcoder2-15b", type: "finetune"

---

## Dolphinファミリー家系図（_tree.json用）

```json
{
  "description": "Dolphinファミリーのモデル関係図",
  "relationships": [
    // === メインの進化ライン ===
    { "child": "dolphin-2.0", "parent": null, "type": "evolution" },
    { "child": "dolphin-2.2", "parent": "dolphin-2.0", "type": "evolution" },
    { "child": "dolphin-2.5", "parent": "dolphin-2.2", "type": "evolution" },
    { "child": "dolphin-2.6", "parent": "dolphin-2.5", "type": "evolution" },
    { "child": "dolphin-2.8", "parent": "dolphin-2.6", "type": "evolution" },
    { "child": "dolphin-2.9", "parent": "dolphin-2.8", "type": "evolution" },
    { "child": "dolphin3", "parent": "dolphin-2.9", "type": "evolution" },
    
    // === ベースモデル別派生 ===
    { "child": "dolphin-mistral", "parent": "dolphin-2.5", "type": "finetune" },
    { "child": "dolphin-mixtral", "parent": "dolphin-2.5", "type": "finetune" },
    { "child": "dolphin-llama3", "parent": "dolphin-2.9", "type": "finetune" },
    { "child": "dolphin-phi", "parent": "dolphin-2.6", "type": "finetune" },
    
    // === 特殊派生 ===
    { "child": "tinydolphin", "parent": "dolphin-2.8", "type": "finetune" },
    { "child": "megadolphin", "parent": "dolphin-2.2", "type": "merge" },
    { "child": "dolphincoder", "parent": "dolphin-2.8", "type": "finetune" },
    
    // === R1推論モデル ===
    { "child": "dolphin3-r1", "parent": "dolphin3", "type": "official-derivative" }
  ]
}
```

**ビジュアル家系図**：
```
Dolphin (Original 2023, Orcaベース)
└── type: "evolution"
    └── Dolphin 2.0/2.1/2.2 (2023-10)
        ├── type: "merge"
        │   └── MegaDolphin-120B (2024-01)
        └── type: "evolution"
            └── Dolphin 2.5 (2023-12)
                ├── type: "finetune" [Mistral]
                │   └── Dolphin-Mistral (2.5/2.6/2.8)
                ├── type: "finetune" [Mixtral MoE]
                │   └── Dolphin-Mixtral (2.5/2.6/2.7/2.9)
                └── type: "evolution"
                    └── Dolphin 2.6 (2024-01)
                        ├── type: "finetune" [Phi-2]
                        │   └── Dolphin-Phi (2.6/2.9.x)
                        └── type: "evolution"
                            └── Dolphin 2.8 (2024-03)
                                ├── type: "finetune" [TinyLlama]
                                │   └── TinyDolphin (2.8)
                                ├── type: "finetune" [StarCoder2]
                                │   └── DolphinCoder (7B/15B)
                                └── type: "evolution"
                                    └── Dolphin 2.9 (2024-04)
                                        ├── type: "finetune" [Llama 3/3.1]
                                        │   └── Dolphin-Llama3 (2.9/2.9.1/2.9.4)
                                        └── type: "evolution"
                                            └── Dolphin 3.0 (2025-01)
                                                └── type: "official-derivative"
                                                    └── Dolphin 3.0 R1 (推論特化)
```

---

## 共通プロンプトテンプレート（全Dolphinモデル）

全てのDolphinモデルは**ChatML**形式を使用します。

```json
{
  "chatML": {
    "format": "chatml",
    "system": "<|im_start|>system\n{system_message}<|im_end|>",
    "user": "<|im_start|>user\n{user_message}<|im_end|>",
    "assistant": "<|im_start|>assistant\n{assistant_response}<|im_end|>",
    "stopTokens": ["<|im_end|>", "<|im_start|>"],
    "defaultSystemPrompt": "You are Dolphin, a helpful AI assistant."
  }
}
```

**推奨システムプロンプト例**：
```
You are Dolphin, a helpful AI assistant. A helpful and friendly AI assistant, Dolphin avoids discussing the system message unless directly asked about it.
```

---

## タグ一覧

全Dolphinモデルに共通するタグ：
- `uncensored` - 検閲なし
- `multilingual` - 多言語対応
- `roleplay` - ロールプレイ最適化

モデル別追加タグ：
| モデル | 追加タグ |
|--------|---------|
| Dolphin 3.0 | `coding`, `math`, `function-calling` |
| Dolphin-Mixtral | `moe`, `coding` |
| Dolphin-Mistral | `coding`, `long-context` |
| DolphinCoder | `coding` |
| TinyDolphin | `fast` |
| MegaDolphin | `merged` |

---

## まとめ

Dolphinファミリーは**検閲なし（Uncensored）**の設計哲学を貫き、ユーザーが自身のアライメント層を実装することを前提とした柔軟なモデルシリーズである。Llama、Mistral、Mixtral、Phi、StarCoderなど様々なベースモデル上でファインチューニングされ、汎用チャットからコーディング特化まで幅広い用途に対応する。

特に注目すべきは：
- **Dolphin 3.0**: ローカルファーストアーキテクチャとステアラブルなAIフレームワークによる次世代汎用モデル
- **DolphinCoder**: StarCoder2ベースの強力なコーディング特化モデル
- **MegaDolphin**: 自己インターリーブによる120B大規模マージモデル

全モデルがChatML形式のプロンプトテンプレートを採用し、ローカル実行環境（llama.cpp、Ollama、LM Studio等）での利用に最適化されている。
