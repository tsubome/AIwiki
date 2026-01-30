# OLMo Family Catalog
## AI2 Open Language Models Comprehensive Guide

---

## Overview

OLMo (Open Language Model) は、Allen Institute for AI (AI2) が開発した完全オープンソースの大規模言語モデルファミリーです。2024年2月に最初のリリースが行われ、モデルの重み、学習データ、コード、評価方法、中間チェックポイントなどすべてが公開されている点が最大の特徴です。

**開発元**: Allen Institute for AI (AI2)
**創設者**: Paul G. Allen (Microsoft共同創設者)
**本拠地**: Seattle, Washington
**ライセンス**: Apache 2.0
**公式サイト**: https://allenai.org/olmo
**GitHub**: https://github.com/allenai/OLMo
**HuggingFace**: https://huggingface.co/allenai

---

## Model Family Tree

```
OLMo Family
├── OLMo (Dense Models)
│   ├── OLMo 1 (February 2024)
│   ├── OLMo 1.7 / April 2024
│   ├── OLMo July 2024
│   ├── OLMo 2 (November 2024)
│   │   ├── OLMo 2 1B
│   │   ├── OLMo 2 7B
│   │   ├── OLMo 2 13B
│   │   └── OLMo 2 32B
│   └── OLMo 3 (November 2025)
│       ├── OLMo 3 7B (Base, Instruct, Think)
│       └── OLMo 3 32B (Base, Instruct, Think)
│
├── OLMoE (Mixture of Experts)
│   ├── OLMoE 1B-7B (September 2024)
│   └── OLMoE 1B-7B (January 2025)
│
├── Molmo (Vision-Language Models)
│   ├── Molmo 1 (September 2024)
│   │   ├── MolmoE-1B
│   │   ├── Molmo-7B-D
│   │   ├── Molmo-7B-O
│   │   └── Molmo-72B
│   └── Molmo 2 (December 2025)
│       ├── Molmo 2-4B
│       ├── Molmo 2-8B
│       └── Molmo 2-O-7B
│
└── Tülu (Post-training Recipes)
    ├── Tülu 2
    └── Tülu 3
```

---

## 1. OLMo 1 (February 2024)

### 概要
AI2初の完全オープンソース大規模言語モデル。学習データ（Dolma）、コード、チェックポイント、ログすべてを公開した画期的なリリース。

### モデルバリエーション

| モデル名 | パラメータ | 学習トークン | コンテキスト長 | リリース日 |
|----------|-----------|-------------|---------------|-----------|
| OLMo-1B | 1B | 3T | 2,048 | 2024-02 |
| OLMo-7B | 7B | 2.5T | 2,048 | 2024-02 |
| OLMo-7B-Twin-2T | 7B | 2T | 2,048 | 2024-02 |

### 技術仕様
- **アーキテクチャ**: Decoder-only Transformer
- **学習データ**: Dolma 1.5 (3T tokens)
- **Vocabulary**: 50,280 tokens
- **最適化**: AdamW
- **学習インフラ**: AMD MI250X (LUMI), A100-40GB (MosaicML)
- **日付カットオフ**: Feb/March 2023

### HuggingFace URLs
- Base 7B: https://huggingface.co/allenai/OLMo-7B
- Base 1B: https://huggingface.co/allenai/OLMo-1B
- Instruct: https://huggingface.co/allenai/OLMo-7B-Instruct
- SFT: https://huggingface.co/allenai/OLMo-7B-SFT

### 論文
- **タイトル**: OLMo: Accelerating the Science of Language Models
- **arXiv**: https://arxiv.org/abs/2402.00838

---

## 2. OLMo 1.7 / April 2024

### 概要
OLMo 1.0からMMLUで24ポイント改善。コンテキスト長拡張と新しいDolma 1.7データセット、2段階学習カリキュラムを導入。

### 改善点
- コンテキスト長: 2,048 → 4,096トークン
- MMLU: 28 → 52 (+24ポイント)
- Dolma 1.7データセット（多様なソース追加）
- 2段階学習カリキュラム

### モデルバリエーション

| モデル名 | パラメータ | 学習トークン | コンテキスト長 |
|----------|-----------|-------------|---------------|
| OLMo-7B-0424 | 7B | 2T + 50B | 4,096 |

### 学習カリキュラム
**Stage 1**: Dolma 1.7で2Tトークン学習
**Stage 2**: 高品質サブセット（Wikipedia, OpenWebMath, Flan）で50Bトークン追加学習

### HuggingFace URLs
- Base: https://huggingface.co/allenai/OLMo-7B-0424
- Instruct: https://huggingface.co/allenai/OLMo-7B-0424-Instruct

---

## 3. OLMo July 2024

### 概要
Dolma 1.7の改良版データセットと2段階カリキュラムによる性能向上。

### モデルバリエーション

| モデル名 | パラメータ | 改善点 |
|----------|-----------|--------|
| OLMo-1B-0724 | 1B | HellaSwag +4.4ポイント |
| OLMo-7B-0724 | 7B | 2段階カリキュラム適用 |

### HuggingFace URLs
- 1B Base: https://huggingface.co/allenai/OLMo-1B-0724-hf
- 7B Base: https://huggingface.co/allenai/OLMo-7B-0724-hf
- 7B SFT: https://huggingface.co/allenai/OLMo-7B-0724-SFT-hf
- 7B Instruct: https://huggingface.co/allenai/OLMo-7B-0724-Instruct-hf

---

## 4. OLMo 2 (November 2024)

### 概要
最大5Tトークンで学習した新世代モデル。RMSNorm、Z-loss正則化、学習率アニーリングなど安定性向上技術を導入。Llama 3.1 8Bを上回る性能。

### モデルバリエーション

| モデル名 | パラメータ | 学習トークン | コンテキスト長 | リリース日 |
|----------|-----------|-------------|---------------|-----------|
| OLMo-2-1B | 1B | 4T | 4,096 | 2025-05 |
| OLMo-2-7B | 7B | 4T | 4,096 | 2024-11 |
| OLMo-2-13B | 13B | 5T | 4,096 | 2024-11 |
| OLMo-2-32B | 32B | 6T | 4,096 | 2025-03 |

### 技術仕様
- **学習データ**: OLMo-Mix-1124 (3.9T) + Dolmino-Mix-1124 (843B)
- **正規化**: RMSNorm (post-normalization)
- **位置埋め込み**: Rotary Positional Embeddings (RoPE)
- **安定化**: Z-loss正則化
- **ポストトレーニング**: Tülu 3パイプライン (SFT → DPO → RLVR)

### 学習カリキュラム
**Stage 1** (90%): OLMo-Mix-1124 (DCLM, Dolma, Starcoder, Proof Pile II)
**Stage 2** (10%): Dolmino-Mix-1124 (高品質Webデータ + ドメイン特化データ)

### ベンチマーク性能 (OLMo 2 7B)
- MMLU: 63.7%
- GSM8K: 68.0%
- HellaSwag: 80.4%
- ARC-Challenge: 55.4%

### HuggingFace URLs
**1B Models**
- Base: https://huggingface.co/allenai/OLMo-2-0425-1B
- Instruct: https://huggingface.co/allenai/OLMo-2-0425-1B-Instruct

**7B Models**
- Base: https://huggingface.co/allenai/OLMo-2-1124-7B
- SFT: https://huggingface.co/allenai/OLMo-2-1124-7B-SFT
- DPO: https://huggingface.co/allenai/OLMo-2-1124-7B-DPO
- Instruct: https://huggingface.co/allenai/OLMo-2-1124-7B-Instruct
- Reward Model: https://huggingface.co/allenai/OLMo-2-1124-7B-RM

**13B Models**
- Base: https://huggingface.co/allenai/OLMo-2-1124-13B
- SFT: https://huggingface.co/allenai/OLMo-2-1124-13B-SFT
- DPO: https://huggingface.co/allenai/OLMo-2-1124-13B-DPO
- Instruct: https://huggingface.co/allenai/OLMo-2-1124-13B-Instruct
- Reward Model: https://huggingface.co/allenai/OLMo-2-1124-13B-RM

**32B Models**
- Base: https://huggingface.co/allenai/OLMo-2-0325-32B
- SFT: https://huggingface.co/allenai/OLMo-2-0325-32B-SFT
- DPO: https://huggingface.co/allenai/OLMo-2-0325-32B-DPO
- Instruct: https://huggingface.co/allenai/OLMo-2-0325-32B-Instruct

### 論文
- **タイトル**: 2 OLMo 2 Furious
- **arXiv**: https://arxiv.org/abs/2501.00656

---

## 5. OLMo 3 (November 2025)

### 概要
完全オープンな「モデルフロー」を提供する最新世代。Base、Instruct、Thinkの3バリアントを持ち、推論能力が大幅に向上。65,000トークンのコンテキスト長をサポート。

### モデルバリエーション

| モデル名 | パラメータ | 学習トークン | コンテキスト長 | バリアント |
|----------|-----------|-------------|---------------|-----------|
| OLMo-3-7B | 7B | 6T | 65,536 | Base, Instruct, Think |
| OLMo-3-32B | 32B | 5.5T | 65,536 | Base, Instruct, Think |

### バリアント説明
- **Base**: 事前学習済みベースモデル
- **Instruct**: マルチターンチャット、ツール使用、指示追従に最適化
- **Think**: 数学・コード・推論タスク向け長い思考連鎖を出力

### 技術仕様
- **学習データ**: Dolma 3 (9T pool → 6T mix)
- **ポストトレーニングデータ**: Dolci datasets
- **アーキテクチャ**: Dense decoder-only Transformer
- **正規化**: RMSNorm (post-normalization) + QK-norm
- **注意機構**: 
  - 7B: Multi-Head Attention
  - 32B: Grouped Query Attention (40 heads, 8 KV heads)
- **Sliding Window Attention**: 対応

### 学習プロセス
1. **Pretraining**: Dolma 3 Mixで一般的な事前学習
2. **Midtraining**: 高品質ドメイン特化データで継続学習
3. **Context Extension**: 長コンテキスト対応の拡張
4. **Post-training**:
   - SFT (Supervised Fine-Tuning)
   - DPO (Direct Preference Optimization)
   - RLVR (Reinforcement Learning with Verifiable Rewards)

### ベンチマーク性能 (OLMo 3-Think 7B)
- MATH: Qwen 3 8Bと同等
- AIME 2024/2025: Qwen 3 8Bに数ポイント差
- HumanEvalPlus: 比較モデル中トップ
- BigBench Hard: 競争力あり

### HuggingFace URLs
**7B Models**
- Base: https://huggingface.co/allenai/Olmo-3-1025-7B
- Instruct: https://huggingface.co/allenai/Olmo-3-7B-Instruct
- Think: https://huggingface.co/allenai/Olmo-3-7B-Think

**32B Models**
- Base: https://huggingface.co/allenai/Olmo-3-1125-32B
- Instruct: https://huggingface.co/allenai/Olmo-3-32B-Instruct
- Think: https://huggingface.co/allenai/Olmo-3-32B-Think

**OLMo 3.1 (Extended RL)**
- 32B Think: https://huggingface.co/allenai/Olmo-3.1-32B-Think
- 32B Instruct: https://huggingface.co/allenai/Olmo-3.1-32B-Instruct

### 論文
- **Project Page**: https://allenai.org/papers/olmo3

---

## 6. OLMoE (Mixture of Experts)

### 概要
Mixture-of-Experts (MoE) アーキテクチャを採用した効率的なモデル。7Bの総パラメータ数で1Bのみをアクティブに使用し、同等コストのモデルを大幅に上回る性能を実現。

### モデルバリエーション

| モデル名 | アクティブ | 総パラメータ | 学習トークン | リリース日 |
|----------|-----------|-------------|-------------|-----------|
| OLMoE-1B-7B-0924 | 1B | 7B | 5T | 2024-09 |
| OLMoE-1B-7B-0125 | 1B | 7B | 5T+ | 2025-01 |

### 技術仕様
- **アーキテクチャ**: Sparse Mixture-of-Experts
- **エキスパート数**: 8 experts per layer
- **アクティブエキスパート**: Top-2 routing
- **学習データ**: OLMoE-mix-0924 / Dolmino-mix-1124
- **効率性**: 同等密度モデルの2倍高速学習

### ポストトレーニングバリエーション
- **SFT**: Supervised Fine-Tuning版
- **Instruct**: SFT + DPO + RLVR版
- **DPO**: Direct Preference Optimization版

### HuggingFace URLs
**September 2024 Release**
- Base: https://huggingface.co/allenai/OLMoE-1B-7B-0924
- SFT: https://huggingface.co/allenai/OLMoE-1B-7B-0924-SFT
- Instruct: https://huggingface.co/allenai/OLMoE-1B-7B-0924-Instruct
- GGUF: https://huggingface.co/allenai/OLMoE-1B-7B-0924-GGUF

**January 2025 Release (Improved)**
- Base: https://huggingface.co/allenai/OLMoE-1B-7B-0125
- SFT: https://huggingface.co/allenai/OLMoE-1B-7B-0125-SFT
- DPO: https://huggingface.co/allenai/OLMoE-1B-7B-0125-DPO
- Instruct: https://huggingface.co/allenai/OLMoE-1B-7B-0125-Instruct

### 論文
- **タイトル**: OLMoE: Open Mixture-of-Experts Language Models
- **arXiv**: https://arxiv.org/abs/2409.02060

---

## 7. Molmo (Vision-Language Models) - September 2024

### 概要
AI2初の完全オープンマルチモーダルモデル。独自のPixMoデータセットで学習し、プロプライエタリモデルへの依存なしにGPT-4Vに匹敵する性能を達成。画像のポインティング機能が特徴。

### モデルバリエーション

| モデル名 | LLMベース | パラメータ | 特徴 |
|----------|----------|-----------|------|
| MolmoE-1B | OLMoE-1B-7B | 1B (active) / 7B | 効率重視、GPT-4V相当 |
| Molmo-7B-O | OLMo-7B-1024 | 7B | 完全オープン |
| Molmo-7B-D | Qwen2-7B | 7B | 高性能 |
| Molmo-72B | Qwen2-72B | 72B | 最高性能 |

### 技術仕様
- **Vision Encoder**: OpenAI CLIP ViT-L/14
- **コネクタ**: Multi-layer perceptron
- **学習データ**: PixMoデータセット
- **ポインティング**: 2D座標出力対応

### PixMoデータセット
- **PixMo-Cap**: 高詳細キャプション（音声による60-90秒の記述、平均200語以上）
- **PixMo-AskModelAnything**: 人手作成の画像QA
- **PixMo-CapQA**: 合成QAデータ
- **PixMo-Points**: 2Dポインティングデータ
- **PixMo-Docs**: ドキュメント理解データ
- **PixMo-Count**: カウンティングデータ

### HuggingFace URLs
- MolmoE-1B: https://huggingface.co/allenai/MolmoE-1B-0924
- Molmo-7B-O: https://huggingface.co/allenai/Molmo-7B-O-0924
- Molmo-7B-D: https://huggingface.co/allenai/Molmo-7B-D-0924
- Molmo-72B: https://huggingface.co/allenai/Molmo-72B-0924

### 論文
- **タイトル**: Molmo and PixMo: Open Weights and Open Data for State-of-the-Art Vision-Language Models
- **arXiv**: https://arxiv.org/abs/2409.17146

---

## 8. Molmo 2 (December 2025)

### 概要
ビデオ理解、マルチ画像推論、オブジェクトトラッキングに対応した次世代VLM。GPT-5やGemini 2.5 Proを上回る性能を一部タスクで達成。

### モデルバリエーション

| モデル名 | LLMベース | パラメータ | 特徴 |
|----------|----------|-----------|------|
| Molmo 2-4B | Qwen3 | 4B | 効率重視 |
| Molmo 2-8B | Qwen3 | 8B | ビデオグラウンディング・QA最適化 |
| Molmo 2-O-7B | OLMo | 7B | 完全オープン (エンドツーエンド) |

### 技術仕様
- **Vision Encoder**: SigLIP 2
- **ビデオ処理**: 最大128フレーム、2fps以下でサンプリング
- **パッチプーリング**: 3×3ウィンドウ
- **注意機構**: 視覚トークン間の双方向注意

### 新機能
- **ビデオポインティング**: 動画内の特定位置を指示
- **マルチオブジェクトトラッキング**: 複数オブジェクトの追跡
- **マルチフレーム推論**: 複数画像にまたがる推論
- **時間的グラウンディング**: フレームレベルのタイムライン関連付け

### 学習プロセス
**Stage 1** (Pretraining):
- 60% キャプション生成
- 30% 画像ポインティング
- 10% 自然言語（Tuluデータ含む）

**Stage 2** (SFT):
- 画像、マルチ画像、ビデオ、テキストの混合データ
- カテゴリ: キャプション、画像QA、ビデオQA、ポインティング、トラッキング、NLP

### データセット (9M+サンプル)
- 100,000+ユニークビデオの詳細キャプション
- 431,000クリップレベルキャプション
- 平均900語以上の詳細記述

### HuggingFace URLs
- Molmo 2-4B: https://huggingface.co/allenai/Molmo2-4B
- Molmo 2-8B: https://huggingface.co/allenai/Molmo2-8B
- Molmo 2-O-7B: https://huggingface.co/allenai/Molmo2-O-7B

### Collection
- https://huggingface.co/collections/allenai/molmo2

---

## 9. Tülu (Post-Training Framework)

### 概要
OLMoモデルの指示追従能力を向上させるためのポストトレーニングフレームワーク。SFT、DPO、RLVRの段階的な学習パイプラインを提供。

### バージョン

| バージョン | リリース | 対応モデル | 特徴 |
|-----------|---------|-----------|------|
| Tülu 2 | 2024 | OLMo 1.x, July 2024 | 基本的なSFT+DPO |
| Tülu 3 | 2024-11 | OLMo 2, OLMo 3, OLMoE | SFT+DPO+RLVR、多様なタスク対応 |

### Tülu 3 パイプライン
1. **SFT (Supervised Fine-Tuning)**
   - tulu-3-sft-olmo-2-mixture データセット
   - 数学、コード、チャット、一般知識

2. **DPO (Direct Preference Optimization)**
   - 選好データによる最適化
   - 応答品質の向上

3. **RLVR (Reinforcement Learning with Verifiable Rewards)**
   - 検証可能な報酬による強化学習
   - MATH、GSM8K、IFEvalなどのタスク改善

### データセット
- **SFT**: tulu-3-sft-olmo-2-mixture
- **DPO**: olmo-2-preference-mix
- **RLVR**: tulu-3-rlvr-mix

### HuggingFace Collections
- Tülu 3 Models: https://huggingface.co/collections/allenai/tulu-3-models
- Tülu 3 Datasets: https://huggingface.co/collections/allenai/tulu-3-datasets

### 論文
- **タイトル**: Tülu 3: Pushing Frontiers in Open Language Model Post-Training

---

## Training Datasets

### Dolma (OLMo 1-2向け)
| バージョン | トークン数 | 特徴 |
|-----------|-----------|------|
| Dolma 1.5 | 3T | 初期版、Webデータ中心 |
| Dolma 1.6 | 3T | 重複排除改善 |
| Dolma 1.7 | 2.3T | 多様なソース追加、品質フィルタリング |

**ソース**: Common Crawl (Dolma CC), Refined Web, StarCoder, C4, Stack Exchange, OpenWebMath, Project Gutenberg, Wikipedia, arXiv, Flan

- **HuggingFace**: https://huggingface.co/datasets/allenai/dolma
- **ライセンス**: ODC-BY

### Dolma 3 (OLMo 3向け)
| コンポーネント | トークン数 | 説明 |
|---------------|-----------|------|
| Dolma 3 Pool | 9T | 全データプール |
| Dolma 3 Mix | 6T | 事前学習用混合 |

**新機能**:
- 238M学術PDF（December 2024カットオフ）
- OlmOCRによるPDF→テキスト変換
- トークン制約混合と品質認識アップサンプリング

### OLMo-Mix-1124 (OLMo 2向け)
- **トークン数**: 3.9T
- **ソース**: DCLM, Dolma, Starcoder, Proof Pile II

### Dolmino-Mix-1124 (OLMo 2 Stage 2向け)
- **トークン数**: 843B
- **内容**: 高品質Webデータ + ドメイン特化データ（学術、Q&A、指示、数学）

---

## Prompt Format

### OLMo 2 / OLMo 3 (ChatML形式)
```
<|im_start|>system
You are OLMo, a helpful AI assistant built by Ai2.<|im_end|>
<|im_start|>user
{user_message}<|im_end|>
<|im_start|>assistant
{assistant_response}<|im_end|>
```

### OLMo 3-Think (推論モード)
```
<|im_start|>system
You are Olmo, a helpful AI assistant built by Ai2.
Your date cutoff is December 2024, and your model weights are available at https://huggingface.co/allenai.<|im_end|>
<|im_start|>user
{user_message}<|im_end|>
<|im_start|>assistant
<think>
{reasoning_process}
</think>
{final_answer}<|im_end|>
```

### OLMoE Format
```
<|endoftext|><|user|>
{user_message}
<|assistant|>
{assistant_response}<|endoftext|>
```

### Stop Tokens
- `<|im_start|>`
- `<|im_end|>`
- `<|endoftext|>`

---

## Usage Examples

### Transformers (OLMo 3)
```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "allenai/Olmo-3-7B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

messages = [{"role": "user", "content": "What is the capital of France?"}]
inputs = tokenizer.apply_chat_template(
    messages, 
    add_generation_prompt=True, 
    return_tensors='pt', 
    return_dict=True
)
response = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(response[0], skip_special_tokens=True))
```

### Transformers (OLMo 2)
```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("allenai/OLMo-2-1124-7B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("allenai/OLMo-2-1124-7B-Instruct")

message = [{"role": "user", "content": "How are you doing?"}]
inputs = tokenizer.apply_chat_template(message, return_tensors='pt')
response = model.generate(inputs, max_new_tokens=100)
print(tokenizer.decode(response[0]))
```

### Transformers (OLMoE)
```python
from transformers import OlmoeForCausalLM, AutoTokenizer
import torch

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
model = OlmoeForCausalLM.from_pretrained("allenai/OLMoE-1B-7B-0125-Instruct").to(DEVICE)
tokenizer = AutoTokenizer.from_pretrained("allenai/OLMoE-1B-7B-0125-Instruct")

messages = [{"role": "user", "content": "Explain quantum computing simply."}]
inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to(DEVICE)
out = model.generate(inputs, max_length=200)
print(tokenizer.decode(out[0]))
```

### Molmo 2 (Vision-Language)
```python
from transformers import AutoProcessor, AutoModelForImageTextToText

model_id = "allenai/Molmo2-8B"
processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForImageTextToText.from_pretrained(model_id, trust_remote_code=True)

# Process image and text
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image", "url": "image.jpg"},
            {"type": "text", "text": "What is in this image?"}
        ]
    }
]
```

---

## Quantization Support

### GGUF (llama.cpp)
- OLMoE-1B-7B-0924-GGUF: https://huggingface.co/allenai/OLMoE-1B-7B-0924-GGUF

### bitsandbytes
```python
model = AutoModelForCausalLM.from_pretrained(
    "allenai/OLMo-2-1124-7B",
    torch_dtype=torch.float16,
    load_in_8bit=True  # or load_in_4bit=True
)
```

---

## Infrastructure & Sponsors

### 学習インフラストラクチャ
- **LUMI Supercomputer**: AMD MI250X GPUs (フィンランド)
- **MosaicML**: NVIDIA A100-40GB GPUs
- **CSC (Finnish IT Center for Science)**

### サポート組織
- Databricks
- Kempner Institute for the Study of Natural and Artificial Intelligence (Harvard)
- AMD
- University of Washington

### 主要パートナーシップ
- **NSF + NVIDIA**: $152M initiative for open multimodal AI (2025)
- **Cancer AI Alliance**: Fred Hutch technical partner

---

## Tools & Ecosystem

### OLMo Core
- **GitHub**: https://github.com/allenai/OLMo-core
- **用途**: 学習、推論、ファインチューニング

### OLMo Eval
- **GitHub**: https://github.com/allenai/OLMo-Eval
- **用途**: OLMES評価フレームワーク

### Open Instruct
- **GitHub**: https://github.com/allenai/open-instruct
- **用途**: Tüluパイプライン、ファインチューニング

### OlmoTrace
- **用途**: モデル出力から学習データへのトレース
- **特徴**: 推論ステップと学習データの関連付け

### Dolma Toolkit
- **GitHub**: https://github.com/allenai/dolma
- **用途**: 大規模データセットキュレーション

---

## Key Research Contributions

1. **完全オープンソース**: 重み、データ、コード、チェックポイント、ログすべて公開
2. **OLMES**: 20ベンチマークからなる評価フレームワーク
3. **2段階学習カリキュラム**: 事前学習→高品質データでの継続学習
4. **Model Souping**: チェックポイントマージによる最終モデル最適化
5. **Mixture of Experts**: OLMoEによる効率的なスケーリング
6. **PixMo**: 音声ベースの高詳細キャプションデータ収集手法
7. **ポインティング機能**: 画像・動画内の位置指示

---

## Version Comparison Summary

| モデル | パラメータ | MMLU | コンテキスト | 特徴 |
|--------|-----------|------|-------------|------|
| OLMo 7B (Feb 2024) | 7B | ~28% | 2,048 | 初のフルオープン |
| OLMo 7B-0424 | 7B | 52% | 4,096 | +24pt MMLU改善 |
| OLMo 2 7B | 7B | 63.7% | 4,096 | Llama 3.1 8B超え |
| OLMo 2 13B | 13B | ~67% | 4,096 | Qwen 2.5 7B超え |
| OLMo 3 7B | 7B | - | 65,536 | Think推論対応 |
| OLMo 3 32B | 32B | - | 65,536 | 最高性能 |
| OLMoE 1B-7B | 1B/7B | ~50% | 4,096 | MoE、2x効率 |

---

## License

すべてのOLMoモデル: **Apache 2.0**
Dolmaデータセット: **ODC-BY**
PixMoデータセット: **Apache 2.0** (一部サードパーティ制限あり)

---

## Citation

### OLMo
```bibtex
@article{Groeneveld2024OLMo,
  title={OLMo: Accelerating the Science of Language Models},
  author={Groeneveld, Dirk and Beltagy, Iz and Walsh, Pete and others},
  journal={arXiv preprint arXiv:2402.00838},
  year={2024}
}
```

### OLMo 2
```bibtex
@misc{olmo20242olmo2furious,
  title={2 OLMo 2 Furious},
  author={Team OLMo and Pete Walsh and Luca Soldaini and others},
  year={2024},
  eprint={2501.00656},
  archivePrefix={arXiv}
}
```

### OLMoE
```bibtex
@misc{muennighoff2024olmoeopenmixtureofexpertslanguage,
  title={OLMoE: Open Mixture-of-Experts Language Models},
  author={Niklas Muennighoff and Luca Soldaini and others},
  year={2024},
  eprint={2409.02060},
  archivePrefix={arXiv}
}
```

### Molmo
```bibtex
@article{molmo2024,
  title={Molmo and PixMo: Open Weights and Open Data for State-of-the-Art Multimodal Models},
  author={Matt Deitke and Christopher Clark and others},
  year={2024}
}
```

### Dolma
```bibtex
@article{dolma,
  title={Dolma: An Open Corpus of Three Trillion Tokens for Language Model Pretraining Research},
  author={Luca Soldaini and Rodney Kinney and others},
  year={2024},
  journal={arXiv preprint arXiv:2402.00159}
}
```

---

## Contact

- **Technical inquiries**: olmo@allenai.org
- **Press**: press@allenai.org
- **Website**: https://allenai.org
- **Playground**: https://playground.allenai.org

---

*Last Updated: January 2026*
*Catalog Version: 1.0*
