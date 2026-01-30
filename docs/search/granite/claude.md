# IBM Granite モデルファミリー カタログ

## 目次
1. [概要](#概要)
2. [Graniteファミリーの歴史](#graniteファミリーの歴史)
3. [言語モデル（Granite 3.x系）](#言語モデルgranite-3x系)
4. [最新世代モデル（Granite 4.0系）](#最新世代モデルgranite-40系)
5. [コードモデル（Granite Code）](#コードモデルgranite-code)
6. [ビジョンモデル（Granite Vision）](#ビジョンモデルgranite-vision)
7. [エンベディングモデル（Granite Embedding）](#エンベディングモデルgranite-embedding)
8. [安全性モデル（Granite Guardian）](#安全性モデルgranite-guardian)
9. [時系列モデル（Granite TinyTimeMixer）](#時系列モデルgranite-tinytimemixer)
10. [ドキュメント変換モデル（Granite-Docling）](#ドキュメント変換モデルgranite-docling)
11. [VRAM要件](#vram要件)
12. [プロンプトテンプレート](#プロンプトテンプレート)
13. [モデルファミリーツリー](#モデルファミリーツリー)
14. [技術革新のまとめ](#技術革新のまとめ)
15. [プラットフォーム対応](#プラットフォーム対応)
16. [参考文献](#参考文献)

---

## 概要

**IBM Granite**は、IBMが開発したエンタープライズ向けオープンソースAIモデルファミリーです。2023年9月の発表以来、言語モデル、コードモデル、ビジョンモデル、エンベディングモデル、安全性モデル、時系列予測モデルなど、多様なモダリティとタスクに対応するモデル群に成長しています。

### 主な特徴

- **エンタープライズファースト**: ガバナンス、リスク管理、プライバシー、バイアス軽減を考慮した学習データ
- **完全オープンソース**: Apache 2.0ライセンスで商用利用可能
- **学習データの透明性**: 学習データソースを公開（業界トレンドに逆行）
- **IP補償**: IBM開発モデルに対する無制限のIP補償
- **効率性重視**: 小型・高効率モデルでコスト削減
- **ISO 42001認証**: AI管理システムの国際認証を取得（Granite 4.0）

### Stanford Foundation Model Transparency Index

Graniteは、データソース、データセットサイズ、有害コンテンツフィルタリングなどの透明性評価で**トップ評価**を獲得。

---

## Graniteファミリーの歴史

```
2023年
├── 9月: Granite 発表（watsonx.ai向け、初期モデル13B）
├── 11月: Granite.13b.instruct / Granite.13b.chat 公開

2024年
├── 5月: Granite Code Models オープンソース化（3B〜34B）
├── 10月: Granite 3.0 リリース（1B〜8B、Guardian 3.0含む）
├── 12月: Granite 3.1 リリース（128Kコンテキスト、Embedding）

2025年
├── 2月: Granite 3.2 リリース（推論機能、Vision 3.2）
├── 4月: Granite 3.3 リリース（改良版推論）
├── 5月: Granite 4.0 Tiny Preview（Mamba-2ハイブリッド）
├── 10月: Granite 4.0 Nano リリース（350M〜1.5B）
├── 11月: Granite 4.0 正式リリース（Micro/Tiny/Small）
└── 進行中: Granite-Docling、Vision 3.3 等
```

---

## 言語モデル（Granite 3.x系）

### Granite 3.0

**リリース日**: 2024年10月

**概要**: 第3世代の汎用言語モデル。効率性とエンタープライズ用途に最適化。

| モデル | パラメータ | コンテキスト | 特徴 |
|--------|-----------|------------|------|
| Granite 3.0 8B Instruct | 8B | 4K→128K | フラッグシップ |
| Granite 3.0 2B Instruct | 2B | 4K→128K | 軽量版 |
| Granite 3.0 3B-A800M | 3B (800M活性化) | 4K | MoE、低遅延 |
| Granite 3.0 1B-A400M | 1B (400M活性化) | 4K | MoE、エッジ向け |

**学習データ**: 10Tトークン以上（ライセンス確認済みデータのみ）

**対応言語**: 英語、ドイツ語、スペイン語、フランス語、日本語、ポルトガル語、アラビア語、チェコ語、イタリア語、韓国語、オランダ語、中国語（12言語）

**HuggingFace**: [ibm-granite/granite-3.0-8b-instruct](https://huggingface.co/ibm-granite/granite-3.0-8b-instruct)

---

### Granite 3.1

**リリース日**: 2024年12月18日

**概要**: 128Kコンテキスト対応、Embeddingモデル追加、性能大幅向上。

| モデル | パラメータ | コンテキスト | 新機能 |
|--------|-----------|------------|--------|
| Granite 3.1 8B Instruct | 8B | 128K | OpenLLM Leaderboardトップクラス |
| Granite 3.1 2B Instruct | 2B | 128K | 軽量版 |
| Granite 3.1 3B-A800M | 3B (800M活性化) | 128K | MoE |
| Granite 3.1 1B-A400M | 1B (400M活性化) | 128K | MoE |

**ベンチマーク向上ポイント**:
- IFEval（指示遵守）: 大幅改善
- MuSR（マルチステップ推論）: 長文理解向上

**パートナー導入**:
- Samsung: SDSプラットフォーム統合
- Lockheed Martin: AI Factoryツール統合（10,000+開発者利用）

**HuggingFace**: [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct)

---

### Granite 3.2

**リリース日**: 2025年2月26日

**概要**: Chain-of-Thought推論機能（オン/オフ切替可能）、Vision Language Model初搭載。

| モデル | パラメータ | コンテキスト | 特徴 |
|--------|-----------|------------|------|
| Granite 3.2 8B Instruct | 8B | 128K | 推論ON/OFF切替 |
| Granite 3.2 2B Instruct | 2B | 128K | 推論ON/OFF切替 |

**推論機能**:
- `<think></think>`: 思考プロセス出力
- `<response></response>`: 最終回答出力
- プログラマブルにON/OFF切替可能

**推論スケーリング性能**:

| ベンチマーク | Granite 3.2 8B | 比較 |
|-------------|----------------|------|
| AIME2024 | GPT-4o/Claude 3.5 Sonnet相当 | 推論スケーリング使用時 |
| MATH500 | GPT-4o/Claude 3.5 Sonnet相当 | 推論スケーリング使用時 |
| ArenaHard | +2桁改善（vs 3.1） | 推論機能 |
| AlpacaEval | +2桁改善（vs 3.1） | 推論機能 |

**HuggingFace**: [ibm-granite/granite-3.2-8b-instruct](https://huggingface.co/ibm-granite/granite-3.2-8b-instruct)

---

### Granite 3.3

**リリース日**: 2025年4月〜

**概要**: 推論・指示遵守能力のさらなる改善。

| モデル | パラメータ | コンテキスト |
|--------|-----------|------------|
| Granite 3.3 8B Instruct | 8B | 128K |
| Granite 3.3 2B Instruct | 2B | 128K |

**改善点（vs 3.2）**:
- AlpacaEval-2.0: 大幅向上
- Arena-Hard: 大幅向上
- 数学・コーディング・指示遵守: 改善

**HuggingFace**: [ibm-granite/granite-3.3-8b-instruct](https://huggingface.co/ibm-granite/granite-3.3-8b-instruct)

---

## 最新世代モデル（Granite 4.0系）

### Granite 4.0 アーキテクチャ

**リリース日**: 2025年11月19日（正式版）

**概要**: Mamba-2/Transformerハイブリッドアーキテクチャ採用。70%以上のメモリ削減、2倍の推論速度を実現。

**アーキテクチャ特徴**:
- **ハイブリッド構造**: 9 Mamba-2ブロック : 1 Transformerブロック
- **MoE（一部モデル）**: Fine-grained Mixture of Experts、共有エキスパート採用
- **線形スケーリング**: コンテキスト長に対して線形計算量（Mamba部分）
- **Bamba由来**: IBM Research × Mamba創設者との共同研究成果

### Granite 4.0モデル一覧

| モデル | 総パラメータ | 活性化パラメータ | アーキテクチャ | 用途 |
|--------|-------------|-----------------|---------------|------|
| Granite-4.0-H-Small | 32B | 9B | Hybrid MoE | 高性能タスク |
| Granite-4.0-H-Tiny | 7B | 1B | Hybrid MoE | バランス型 |
| Granite-4.0-H-Micro | 3B | 3B (Dense) | Hybrid Dense | 高速・低コスト |

### Granite 4.0 Nanoファミリー

**リリース日**: 2025年10月28日

**概要**: ブラウザ・エッジデバイス向け超小型モデル。

| モデル | パラメータ | アーキテクチャ | 特徴 |
|--------|-----------|---------------|------|
| Granite-4.0-H-1B | ~1.5B | Hybrid-SSM | エッジ向け |
| Granite-4.0-H-350M | ~350M | Hybrid-SSM | 超軽量 |
| Granite-4.0-1B | ~2B | Transformer | 互換性重視 |
| Granite-4.0-350M | ~350M | Transformer | 互換性重視 |

**Nanoベンチマーク**:

| ベンチマーク | Granite-4.0-H-1B | Qwen3-1.7B |
|-------------|------------------|------------|
| IFEval | 78.5 | 73.1 |
| BFCLv3 | 54.8 | - |
| SALAD/AttaQ (Safety) | 90%+ | - |

**効率性メリット**:
- メモリ使用量: 70%以上削減（vs 同サイズTransformer）
- 推論速度: 2倍高速
- 長文コンテキスト処理: 線形スケーリング
- 複数同時セッション: 効率的なバッチ推論

**ISO 42001認証**: Granite 4.0は初のISO 42001認証取得オープンモデルファミリー

**HuggingFace**: [ibm-granite/granite-4.0-tiny](https://huggingface.co/ibm-granite/granite-4.0-tiny)

---

## コードモデル（Granite Code）

### Granite Code Models

**リリース日**: 2024年5月（オープンソース化）

**概要**: 116プログラミング言語対応のコード生成モデルファミリー。

| モデル | パラメータ | 学習データ | コンテキスト |
|--------|-----------|-----------|------------|
| Granite Code 3B Base | 3B | 4Tトークン | 2K/8K |
| Granite Code 8B Base | 8B | 4Tトークン | 2K/8K |
| Granite Code 20B Base | 20B | 3Tトークン | 8K |
| Granite Code 34B Base | 34B | 1.4Tトークン | 8K |

**学習フェーズ**:

| フェーズ | 内容 | データ比率 |
|---------|------|-----------|
| Phase 1 | コードのみ学習 | 100%コード |
| Phase 2 | コード+言語学習 | 80%コード + 20%言語（500Bトークン） |

**Instructモデル学習データ**:
- CommitPackFT（コードコミット）
- MathInstruct / MetaMathQA（数学）
- Glaive-Code-Assistant-v3
- Self-OSS-Instruct-SC2
- Glaive-Function-Calling-v2
- NL2SQL
- HelpSteer

**ベンチマーク（Granite-8B-Code-Base）**:
- HumanEvalPack: Mistral-7B、Llama-3-8B超
- MBPP: 同規模モデルトップクラス
- MBPP+: 同規模モデルトップクラス

**HuggingFace**: [ibm-granite/granite-8b-code-base](https://huggingface.co/ibm-granite/granite-8b-code-base)

---

## ビジョンモデル（Granite Vision）

### Granite Vision 3.2 2B

**リリース日**: 2025年2月26日

**概要**: ドキュメント理解特化のVision Language Model。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 2B |
| 画像解像度 | 可変 |
| 対象タスク | 表・チャート・図表・インフォグラフィック解析 |
| 学習データ | DocFM（85M PDF + 26M合成QAペア） |

**ベンチマーク**:

| ベンチマーク | 性能 |
|-------------|------|
| DocVQA | Llama 3.2 11B / Pixtral 12B相当 |
| ChartQA | 同上 |
| AI2D | 同上 |
| OCRBench | 同上 |

**特徴**:
- Doclingツールキットで処理したPDFデータ使用
- 5倍大きいモデルと同等性能

**HuggingFace**: [ibm-granite/granite-vision-3.2-2b](https://huggingface.co/ibm-granite/granite-vision-3.2-2b)

---

### Granite Vision 3.3 2B

**リリース日**: 2025年

**概要**: Vision 3.2の改良版。新ビジョンエンコーダ、追加学習データ。

**ランキング**:
- OCRBench Leaderboard: **2位**（2025年10月時点）
- ViDoRe 2 Leaderboard: **5位**（Vision Embedding）

**新機能**:
- 改良されたビジョンエンコーダ
- 多数の高品質データセット追加
- 実験的新機能

**HuggingFace**: [ibm-granite/granite-vision-3.3-2b](https://huggingface.co/ibm-granite/granite-vision-3.3-2b)

---

## エンベディングモデル（Granite Embedding）

### Granite Embedding R1（初代）

**リリース日**: 2024年12月（Granite 3.1と同時）

**概要**: RoBERTa / XLM-RoBERTaベースのエンベディングモデル。

| モデル | パラメータ | 出力次元 | 言語 |
|--------|-----------|---------|------|
| granite-embedding-30m-english | 30M | 384 | 英語 |
| granite-embedding-125m-english | 125M | 768 | 英語 |
| granite-embedding-107m-multilingual | 107M | 384 | 12言語 |
| granite-embedding-278m-multilingual | 278M | 768 | 12言語 |
| granite-embedding-30m-sparse | 30M | Sparse | 英語 |

**対応言語（多言語版）**: 英語、ドイツ語、スペイン語、フランス語、日本語、ポルトガル語、アラビア語、チェコ語、イタリア語、韓国語、オランダ語、中国語

**特徴**:
- CLS Pooling採用（Mean Poolingより高性能）
- MS-MARCO不使用（商用ライセンス非対応のため）
- MTEB Leaderboard: 同サイズモデルトップ10

---

### Granite Embedding R2

**リリース日**: 2025年

**概要**: ModernBERTベースの第2世代エンベディングモデル。

| モデル | パラメータ | 出力次元 | 特徴 |
|--------|-----------|---------|------|
| granite-embedding-english-r2 | 149M | 768 | 125m後継 |
| granite-embedding-small-english-r2 | 47M | 384 | 30m後継 |

**ModernBERT改善点**:
- Alternating Attention Lengths（処理高速化）
- Rotary Position Embeddings（長文対応）
- 新トークナイザー（コード・テキスト最適化）

**ベンチマーク対応**:
- BEIR、ClapNQ（情報検索）
- COIR（コード検索）
- MLDR、LongEmbed（長文検索）
- MTRAG（マルチターン会話）
- NQTables、OTT-QA等（テーブル検索）

**学習インフラ**: IBM BlueVela Cluster（NVIDIA H100 80GB GPU）

**HuggingFace**: [ibm-granite/granite-embedding-english-r2](https://huggingface.co/ibm-granite/granite-embedding-english-r2)

---

## 安全性モデル（Granite Guardian）

### Granite Guardian 概要

**概要**: プロンプト・レスポンスのリスク検出に特化したガードレールモデル。

**検出カテゴリ**:
- Jailbreak（脱獄試行）
- Social Bias（社会的バイアス）
- Violence（暴力）
- Profanity（不適切言語）
- Sexual Content（性的コンテンツ）
- Unethical Behavior（非倫理的行動）
- Harm Engagement（有害関与）
- RAG Hallucination（RAG幻覚）
- Function Call Hallucination（ツール呼び出し幻覚）

**ランキング**: LLM-Aggrefact Leaderboard **トップ3**（2025年10月時点）

---

### Granite Guardian 3.0

**リリース日**: 2024年10月

| モデル | パラメータ | 特徴 |
|--------|-----------|------|
| Granite Guardian 3.0 8B | 8B | フルサイズ |
| Granite Guardian 3.0 2B | 2B | 軽量版 |

**性能**: LlamaGuard 3（全3世代）を上回るF1スコア

---

### Granite Guardian 3.1

**リリース日**: 2024年12月

**新機能**: Function Call Hallucination検出

---

### Granite Guardian 3.2

**リリース日**: 2025年2月

| モデル | パラメータ | 特徴 |
|--------|-----------|------|
| Granite Guardian 3.2 5B | 5B | 30%サイズ削減（8B→5B） |
| Granite Guardian 3.2 3B-A800M | 3B (800M活性化) | MoE、超高効率 |

**新機能**:
- **Verbalized Confidence**: 「High」「Low」のリスク信頼度出力
- **Thinking Mode**: `<think>`タグで詳細推論を出力

**HuggingFace**: [ibm-granite/granite-guardian-3.2-5b](https://huggingface.co/ibm-granite/granite-guardian-3.2-5b)

---

## 時系列モデル（Granite TinyTimeMixer）

### TinyTimeMixer（TTM）

**リリース日**: 2024年（NeurIPS 2024採択）

**概要**: 1M未満パラメータで数十億パラメータモデルを凌駕する時系列予測モデル。

| モデル | パラメータ | 学習データ | コンテキスト長 |
|--------|-----------|-----------|---------------|
| TTM-R1 | <1M | ~250Mサンプル | 512, 1024 |
| TTM-R2 | <1M | ~700Mサンプル | 512, 1024, 1536 |
| TTM-R2.1 | <10M | 拡張版 | 日次・週次対応 |

**アーキテクチャ特徴**:
- **Focused Pre-trained Models**: コンテキスト長×予測長の組み合わせごとに特化
- **Channel-Mixing Decoder**: Fine-tuning時にチャネル間相関学習
- **Exogenous/Categorical Data対応**

**対応解像度**:
- R1/R2: 分単位〜時間単位
- R2.1: 日単位〜週単位（2年先まで予測可能）

**性能比較**:

| モデル | パラメータ | MASE（精度） |
|--------|-----------|-------------|
| Granite TTM | <10M | **1位** |
| Google TimesFM-2.0 | 500M | 2位 |
| Amazon Chronos-Bolt-Base | 205M | 3位 |

**HuggingFace**: [ibm-granite/granite-timeseries-ttm-r2](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2)

---

## ドキュメント変換モデル（Granite-Docling）

### Granite-Docling-258M

**リリース日**: 2025年（ICCV 2025採択）

**概要**: ドキュメントを機械可読形式に変換する超小型VLM。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 258M |
| ビジョンエンコーダ | SigLIP2-base-patch16-512 |
| 言語モデル | Granite 165M LLM |
| ベースアーキテクチャ | Idefics3 |

**DocTags形式**:
- テキストと構造を明確に分離
- 要素間の関係（読み順、階層）を記述
- Markdown/JSON/HTMLに変換可能

**対応要素**:
- テーブル構造
- インライン/フローティング数式
- コードブロック
- チャート・図表
- キャプション-図の関連付け

**多言語対応（実験的）**: アラビア語、中国語、日本語

**特徴**:
- SmolDocling-256M-previewの改良版
- ループ問題等の安定性向上
- Doclingライブラリとの統合

**HuggingFace**: [ibm-granite/granite-docling-258M](https://huggingface.co/ibm-granite/granite-docling-258M)

---

## VRAM要件

### 推論時VRAM要件（FP16/BF16基準）

| モデル | FP16 | INT8 | INT4 |
|--------|------|------|------|
| Granite 3.x 2B | ~5GB | ~3GB | ~2GB |
| Granite 3.x 8B | ~17GB | ~9GB | ~5GB |
| Granite 3.0 1B-A400M (MoE) | ~3GB | ~2GB | ~1GB |
| Granite 3.0 3B-A800M (MoE) | ~7GB | ~4GB | ~2GB |
| Granite Code 3B | ~7GB | ~4GB | ~2GB |
| Granite Code 8B | ~17GB | ~9GB | ~5GB |
| Granite Code 20B | ~42GB | ~22GB | ~12GB |
| Granite Code 34B | ~70GB | ~36GB | ~20GB |
| Granite Vision 3.2 2B | ~5GB | ~3GB | ~2GB |

### Granite 4.0 VRAM要件

| モデル | 総パラメータ | 活性化パラメータ | FP8 |
|--------|-------------|-----------------|-----|
| Granite-4.0-H-Micro | 3B | 3B | ~4GB |
| Granite-4.0-H-Tiny | 7B | 1B | ~8GB（128Kコンテキスト含む） |
| Granite-4.0-H-Small | 32B | 9B | ~35GB |

**注**: Granite 4.0は70%以上のメモリ削減を実現。$350以下のGPUで128K長文タスク実行可能。

---

## プロンプトテンプレート

### Granite 3.x基本形式

```
<|start_of_role|>system<|end_of_role|>{system_prompt}<|end_of_text|>
<|start_of_role|>user<|end_of_role|>{user_message}<|end_of_text|>
<|start_of_role|>assistant<|end_of_role|>{assistant_response}<|end_of_text|>
```

### Granite 3.2/3.3 推論モード

```python
# Thinking Mode有効化
input_ids = tokenizer.apply_chat_template(
    conv, 
    return_tensors="pt", 
    thinking=True,  # 推論モード有効
    return_dict=True, 
    add_generation_prompt=True
)
```

**出力形式**:
```
<think>
[推論プロセス]
</think>
<response>
[最終回答]
</response>
```

### Granite 4.0 Tool Call形式

```
<tool_call>
{"name": "function_name", "arguments": {...}}
</tool_call>
```

```
<tool_response>
{tool_result}
</tool_response>
```

### Granite Guardian形式

```python
# Thinking Mode
guardian_output = model.generate(prompt, thinking=True)
# 出力: <think>...</think><score>High/Low</score>

# Non-Thinking Mode
guardian_output = model.generate(prompt, thinking=False)
# 出力: <score>High/Low</score>
```

---

## モデルファミリーツリー

```
IBM Granite Family (2023-)
│
├── Granite Language Models
│   ├── Granite 1.0 (2023/09)
│   │   ├── Granite.13b.instruct
│   │   └── Granite.13b.chat
│   │
│   ├── Granite 3.0 (2024/10)
│   │   ├── Granite 3.0 8B Instruct
│   │   ├── Granite 3.0 2B Instruct
│   │   ├── Granite 3.0 3B-A800M (MoE)
│   │   └── Granite 3.0 1B-A400M (MoE)
│   │
│   ├── Granite 3.1 (2024/12)
│   │   ├── Granite 3.1 8B Instruct (128K)
│   │   ├── Granite 3.1 2B Instruct (128K)
│   │   └── Granite 3.1 MoE variants
│   │
│   ├── Granite 3.2 (2025/02)
│   │   ├── Granite 3.2 8B Instruct (Reasoning)
│   │   └── Granite 3.2 2B Instruct (Reasoning)
│   │
│   ├── Granite 3.3 (2025/04)
│   │   ├── Granite 3.3 8B Instruct
│   │   └── Granite 3.3 2B Instruct
│   │
│   └── Granite 4.0 (2025/10-11) - Mamba-2 Hybrid
│       ├── Granite-4.0-H-Small (32B/9B MoE)
│       ├── Granite-4.0-H-Tiny (7B/1B MoE)
│       ├── Granite-4.0-H-Micro (3B Dense)
│       └── Granite 4.0 Nano Family
│           ├── Granite-4.0-H-1B
│           ├── Granite-4.0-H-350M
│           ├── Granite-4.0-1B
│           └── Granite-4.0-350M
│
├── Granite Code Models (2024/05)
│   ├── Granite Code 3B Base/Instruct
│   ├── Granite Code 8B Base/Instruct
│   ├── Granite Code 20B Base/Instruct
│   └── Granite Code 34B Base/Instruct
│
├── Granite Vision Models
│   ├── Granite Vision 3.2 2B (2025/02)
│   └── Granite Vision 3.3 2B (2025)
│
├── Granite Embedding Models
│   ├── R1 (2024/12) - RoBERTa/XLM-R Base
│   │   ├── granite-embedding-30m-english
│   │   ├── granite-embedding-125m-english
│   │   ├── granite-embedding-107m-multilingual
│   │   ├── granite-embedding-278m-multilingual
│   │   └── granite-embedding-30m-sparse
│   │
│   └── R2 (2025) - ModernBERT Base
│       ├── granite-embedding-english-r2 (149M)
│       └── granite-embedding-small-english-r2 (47M)
│
├── Granite Guardian Models
│   ├── Guardian 3.0 (2024/10) - 8B, 2B
│   ├── Guardian 3.1 (2024/12) - Function Call検出追加
│   └── Guardian 3.2 (2025/02)
│       ├── Guardian 3.2 5B
│       └── Guardian 3.2 3B-A800M (MoE)
│
├── Granite Time Series Models
│   ├── TTM-R1 (2024) - ~1M params
│   ├── TTM-R2 (2024) - ~1M params
│   └── TTM-R2.1 (2025) - <10M params
│
└── Granite Document Models
    └── Granite-Docling-258M (2025)
```

---

## 技術革新のまとめ

### アーキテクチャ革新

| 技術 | 適用モデル | 効果 |
|------|-----------|------|
| Mamba-2/Transformer Hybrid | Granite 4.0 | 線形スケーリング、70%メモリ削減 |
| Fine-grained MoE | Granite 4.0 Tiny/Small | 効率的パラメータ活用 |
| Shared Experts | Granite 4.0 | パラメータ効率向上 |
| ModernBERT | Embedding R2 | 長文対応、高速処理 |
| DocTags | Granite-Docling | 構造化ドキュメント出力 |

### 学習技術

| 技術 | 効果 |
|------|------|
| Data Prep Kit | 大規模データ処理パイプライン |
| HAP Filtering | Hate/Abuse/Profanityフィルタリング |
| Synthetic Data Generation | 26M QAペア生成（Vision） |
| Knowledge Distillation | 小型モデルへの知識転移 |
| Model Merging | 複数モデルの統合 |

### 推論技術

| 技術 | 適用モデル | 効果 |
|------|-----------|------|
| Chain-of-Thought | Granite 3.2+ | 推論能力向上 |
| Inference Scaling | Granite 3.2+ | 大型モデル相当の推論性能 |
| Process Reward Model | Granite 3.2+ | 誤った推論パスの回避 |
| Thinking/Non-Thinking Toggle | Guardian 3.2+ | 効率的なリスク評価 |

---

## プラットフォーム対応

### APIサービス・クラウド

| プラットフォーム | 対応モデル |
|-----------------|-----------|
| IBM watsonx.ai | 全Graniteモデル |
| Google Vertex AI | Granite 3.x |
| AWS Marketplace | Guardian, Embedding等 |
| NVIDIA NIM | Granite 3.x |

### ローカル推論

| フレームワーク | 対応状況 |
|---------------|---------|
| HuggingFace Transformers | 全モデル対応 |
| Ollama | Granite 3.x, 4.0 |
| LM Studio | Granite 3.x |
| vLLM | Granite 3.x, 4.0（予定） |
| llama.cpp | Granite 4.0 Nano |
| MLX (Apple Silicon) | Granite-Docling |
| Replicate | Granite 3.x |
| Docker (GenAI Catalog) | Granite 3.x |

### エンタープライズ統合

| パートナー | 統合内容 |
|-----------|---------|
| Red Hat (RHEL AI) | Granite 3.x組み込み |
| Samsung SDS | プラットフォーム統合 |
| Lockheed Martin | AI Factoryツール |
| CrushBank | エージェントソリューション |

---

## 参考文献

### 主要論文

1. **Granite Code Models**: Mishra et al. "Granite Code Models: A Family of Open Foundation Models for Code Intelligence" (2024)
   - arXiv: [2405.04324](https://arxiv.org/abs/2405.04324)

2. **TinyTimeMixer**: Ekambaram et al. "Tiny Time Mixers (TTMs): Fast Pre-trained Models for Enhanced Zero/Few-Shot Forecasting of Multivariate Time Series" (NeurIPS 2024)
   - arXiv: [2401.03955](https://arxiv.org/abs/2401.03955)

3. **Granite Guardian**: Padhi et al. "Granite Guardian" (2024)
   - arXiv: [2412.07724](https://arxiv.org/abs/2412.07724)

4. **Granite Embedding**: IBM Granite Team. "Granite Embedding Models" (2025)
   - arXiv: [2502.20204](https://arxiv.org/abs/2502.20204)

5. **SmolDocling / Granite-Docling**: (ICCV 2025)
   - arXiv: [2503.11576](https://arxiv.org/abs/2503.11576)

### 公式リポジトリ

| モデル | GitHub |
|--------|--------|
| Granite Language Models | https://github.com/ibm-granite/granite-models |
| Granite Code Models | https://github.com/ibm-granite/granite-code-models |
| Granite Guardian | https://github.com/ibm-granite/granite-guardian |
| Granite Embedding | https://github.com/ibm-granite/granite-embedding-models |
| Granite Time Series | https://github.com/ibm-granite/granite-tsfm |
| Docling | https://github.com/DS4SD/docling |

### 公式ドキュメント

- IBM Granite Documentation: https://www.ibm.com/granite/docs
- Granite Snack Cookbook: https://github.com/ibm-granite-community/granite-snack-cookbook
- Granite Community: https://github.com/ibm-granite-community

---

## ライセンス情報

| モデル | ライセンス |
|--------|-----------|
| Granite Language Models | Apache 2.0 |
| Granite Code Models | Apache 2.0 |
| Granite Vision Models | Apache 2.0 |
| Granite Embedding Models | Apache 2.0 |
| Granite Guardian Models | Apache 2.0 |
| Granite Time Series (TTM) | Apache 2.0 |
| Granite-Docling | Apache 2.0 |

**全モデルがApache 2.0ライセンス**で、研究・商用利用が完全に自由です。

---

*最終更新: 2026年1月*
*このカタログは公開情報に基づいて作成されています。最新情報は各公式リポジトリ・ドキュメントをご確認ください。*
