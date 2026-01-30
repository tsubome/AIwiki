# GLM（General Language Model）モデルファミリー カタログ

## 目次
1. [概要](#概要)
2. [GLMファミリーの歴史](#glmファミリーの歴史)
3. [基盤モデル](#基盤モデル)
4. [対話モデル（ChatGLM系）](#対話モデルchatglm系)
5. [最新世代モデル（GLM-4.x系）](#最新世代モデルglm-4x系)
6. [マルチモーダルモデル](#マルチモーダルモデル)
7. [コード生成モデル（CodeGeeX系）](#コード生成モデルcodegeex系)
8. [エージェントモデル](#エージェントモデル)
9. [VRAM要件](#vram要件)
10. [プロンプトテンプレート](#プロンプトテンプレート)
11. [モデルファミリーツリー](#モデルファミリーツリー)
12. [技術革新のまとめ](#技術革新のまとめ)
13. [プラットフォーム対応](#プラットフォーム対応)
14. [参考文献](#参考文献)

---

## 概要

GLM（General Language Model）は、**清華大学KEGラボ（Knowledge Engineering Group）**と**智譜AI（Zhipu AI / Z.ai）**が共同開発した大規模言語モデルファミリーです。2022年のGLM-130Bから始まり、現在では対話、マルチモーダル、コード生成、エージェントなど多様なタスクに対応するモデル群に発展しています。

### 主な特徴

- **双方向アーキテクチャ**: GPT系のdecoder-onlyとは異なり、autoregressive blank infilling目的関数を採用
- **バイリンガル対応**: 中国語・英語の両言語で高い性能
- **効率的な量子化**: INT4量子化でも性能低下が最小限
- **オープンソース**: 多くのモデルがMITまたはApache 2.0ライセンスで公開
- **国産チップ対応**: Huawei Ascend、Cambricon等の中国国産チップに対応

### 開発元

| 組織 | 役割 |
|------|------|
| 清華大学KEG | 基礎研究、アーキテクチャ設計 |
| 智譜AI（Z.ai） | 商用化、APIサービス提供 |
| 清華大学PACMAN | 並列計算、最適化 |
| 鵬城実験室 | 計算資源提供 |

---

## GLMファミリーの歴史

```
2022年
├── 7月: GLM-130B リリース（初の100B級オープンソースモデル）
├── 9月: CodeGeeX リリース（13Bコード生成モデル）
└── 10月: GLM-130B ICLR 2023採択

2023年
├── 3月: ChatGLM-6B リリース
├── 5月: VisualGLM-6B リリース
├── 6月: ChatGLM2-6B リリース
├── 7月: CodeGeeX2-6B リリース
├── 10月: ChatGLM3-6B リリース
└── 12月: CogAgent リリース（GUI Agent）

2024年
├── 1月: GLM-4 API公開
├── 5月: CogVLM2 リリース
├── 6月: GLM-4-9B シリーズ オープンソース化
├── 7月: CodeGeeX4-ALL-9B リリース
├── 8月: GLM-4-Plus リリース
└── 11月: CogVideoX オープンソース化

2025年
├── 4月: GLM-4-32B-0414 シリーズ リリース
├── 7月: GLM-4.5 リリース（355B MoE）
├── 8月: GLM-4.5V リリース（106B VLM）
├── 9月-10月: GLM-4.6 リリース
└── 12月: GLM-4.7 リリース（最新フラッグシップ）
```

---

## 基盤モデル

### GLM-130B

**リリース日**: 2022年7月

**概要**: GLMファミリーの起源となるモデル。100B級のオープンソースモデルとしてGPT-3を上回る性能を初めて実現。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 130B |
| アーキテクチャ | 双方向 Dense Transformer |
| 学習データ | 400Bトークン（英語200B + 中国語200B） |
| コンテキスト長 | 2,048トークン |
| 学習基盤 | 96 × DGX-A100 (40G×8) |
| 学習期間 | 約60日 |
| 位置エンコーディング | Rotary Position Embedding (RoPE) |
| 活性化関数 | GeGLU |

**アーキテクチャ詳細**:
- レイヤー数: 70
- Hidden Size: 12,288
- FFN Inner Size: 32,768
- Attention Heads: 96
- Vocabulary Size: 150,000

**ベンチマーク性能**:

| ベンチマーク | GLM-130B | GPT-3 175B | OPT-175B | BLOOM-176B |
|-------------|----------|------------|----------|------------|
| LAMBADA (En) | 80.2% | 76.2% | 74.7% | 67.2% |
| MMLU (5-shot) | 44.8% | 43.9% | - | 38.8% |
| CLUE (Avg) | +24.26% vs ERNIE TITAN 260B | - | - | - |

**量子化対応**:
- INT8: A100 (40G×4) で推論可能
- INT4: RTX 3090 (24G×4) または RTX 2080 Ti (11G×8) で推論可能

**HuggingFace**: [THUDM/glm-130b](https://huggingface.co/THUDM/glm-130b)

---

## 対話モデル（ChatGLM系）

### ChatGLM-6B

**リリース日**: 2023年3月14日

**概要**: コンシューマー向けGPUで動作可能な初のGLM対話モデル。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 6.2B |
| コンテキスト長 | 2,048トークン |
| 言語 | 中国語・英語（バイリンガル） |
| 推論要件 | FP16: 13GB VRAM / INT4: 6GB VRAM |

**ベンチマーク**:

| ベンチマーク | スコア |
|-------------|--------|
| MMLU | 25.2 |
| C-Eval | 23.7 |
| GSM8K | 1.5 |
| HumanEval | 0.0 |

**HuggingFace**: [THUDM/chatglm-6b](https://huggingface.co/THUDM/chatglm-6b)

---

### ChatGLM2-6B

**リリース日**: 2023年6月25日

**概要**: ChatGLM-6Bの第2世代。FlashAttentionによる長文対応、大幅な性能向上を実現。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 6.2B |
| 学習データ | 1.4Tトークン（バイリンガル） |
| コンテキスト長 | 32,768トークン（学習時8K） |
| アテンション | FlashAttention |
| 目的関数 | GLMハイブリッド目的関数 |

**性能向上（vs ChatGLM-6B）**:
- MMLU: +23% (25.2 → 45.2)
- C-Eval: +33% (23.7 → 51.7)
- GSM8K: +571% (1.5 → 25.9)
- BBH: +60% (0.0 → 29.2)

**派生モデル**:
- **ChatGLM2-6B-32K**: 32Kコンテキスト対応版

**HuggingFace**: [THUDM/chatglm2-6b](https://huggingface.co/THUDM/chatglm2-6b)

---

### ChatGLM3-6B

**リリース日**: 2023年10月27日

**概要**: ネイティブFunction Call、Code Interpreter、Agent機能を初搭載。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 6B |
| コンテキスト長 | 8,192トークン（32K/128K版あり） |
| アテンション | Multi-Head Attention |
| 新機能 | Function Call, Code Interpreter, Agent |

**ベンチマーク**:

| ベンチマーク | ChatGLM3-6B | ChatGLM2-6B |
|-------------|-------------|-------------|
| MMLU | 61.4 | 45.2 |
| C-Eval | 69.0 | 51.7 |
| GSM8K | 72.3 | 25.9 |
| MATH | 25.7 | 6.9 |
| BBH | 66.1 | 29.2 |
| HumanEval | 58.5 | 9.8 |

**派生モデル**:
- **ChatGLM3-6B-Base**: ベースモデル
- **ChatGLM3-6B-32K**: 32Kコンテキスト対応
- **ChatGLM3-6B-128K**: 128Kコンテキスト対応

**HuggingFace**: [THUDM/chatglm3-6b](https://huggingface.co/THUDM/chatglm3-6b)

---

## 最新世代モデル（GLM-4.x系）

### GLM-4-9B シリーズ

**リリース日**: 2024年6月5日

**概要**: 多言語対応（26言語）を実現した9Bパラメータモデル。

| モデル | 仕様 |
|--------|------|
| GLM-4-9B | ベースモデル |
| GLM-4-9B-Chat | 対話版（128Kコンテキスト） |
| GLM-4-9B-Chat-1M | 1Mコンテキスト対応（約200万中国語文字） |

**ベンチマーク（GLM-4-9B）**:

| ベンチマーク | GLM-4-9B | Llama-3-8B |
|-------------|----------|------------|
| MMLU | 74.7 | 66.6 |
| C-Eval | 77.1 | - |
| GSM8K | 84.0 | 79.6 |
| MATH | 30.4 | 30.0 |
| HumanEval | 70.1 | 62.2 |
| BBH | 76.3 | - |

**多言語対応**: 日本語、韓国語、ドイツ語、フランス語、スペイン語等26言語

**Berkeley Function Calling Leaderboard**:
- GLM-4-9B-Chat: GPT-4 Turbo (2024-04-09) と同等性能

**HuggingFace**: [THUDM/glm-4-9b-chat](https://huggingface.co/THUDM/glm-4-9b-chat)

---

### GLM-4-32B-0414 シリーズ

**リリース日**: 2025年4月14日

**概要**: 32Bパラメータでエージェント機能を強化。OpenAI GPT系、DeepSeek V3/R1に匹敵する性能。

| モデル | 特徴 |
|--------|------|
| GLM-4-32B-Base-0414 | 15Tデータで事前学習、推論型合成データ含む |
| GLM-4-32B-0414 | 対話・エージェント用、RLHF調整済 |
| GLM-Z1-32B-0414 | 深層推論モデル（数学・コード・論理強化） |
| GLM-Z1-Rumination-32B-0414 | 熟考モデル（Deep Research対抗） |
| GLM-Z1-9B-0414 | 軽量推論モデル |

**技術仕様**:

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 32B |
| 学習データ | 15Tトークン（推論型合成データ含む） |
| コンテキスト長 | 32K（ネイティブ）、YaRN拡張で更に延長可 |
| 学習手法 | Rejection Sampling + RL + RLHF |

**GLM-Z1-Rumination特徴**:
- 検索ツール統合による深層思考
- End-to-end強化学習によるスケーリング
- 研究スタイルの文章執筆に特化

**HuggingFace**: 
- [THUDM/GLM-4-32B-0414](https://huggingface.co/THUDM/GLM-4-32B-0414)
- [THUDM/GLM-Z1-32B-0414](https://huggingface.co/THUDM/GLM-Z1-32B-0414)

---

### GLM-4.5

**リリース日**: 2025年7月28日

**概要**: エージェント・推論・コーディング（ARC）に特化した次世代フラッグシップMoEモデル。

| 項目 | GLM-4.5 | GLM-4.5-Air |
|------|---------|-------------|
| 総パラメータ数 | 355B | 106B |
| 活性化パラメータ数 | 32B | 12B |
| アーキテクチャ | Mixture of Experts | Mixture of Experts |
| コンテキスト長 | 128K | 128K |
| 学習データ | 23Tトークン | 23Tトークン |

**動作モード**:
- **Thinking Mode**: 複雑な推論・ツール使用向け
- **Non-Thinking Mode**: 即座の応答向け

**ベンチマーク（12ベンチマーク平均）**: 63.2点（全モデル中3位）

**ライセンス**: MIT License（商用利用・二次開発可）

**HuggingFace**: [zai-org/GLM-4.5](https://huggingface.co/zai-org/GLM-4.5)

---

### GLM-4.6

**リリース日**: 2025年9月〜10月

**概要**: GLM-4.5の改良版。コンテキスト拡張、コーディング・推論能力強化。

| 項目 | 仕様 |
|------|------|
| 総パラメータ数 | 357B |
| 活性化パラメータ数 | 32B |
| コンテキスト長 | 200K（128K→200Kに拡張） |
| アーキテクチャ | Mixture of Experts |

**GLM-4.5からの改善点**:
- コンテキストウィンドウ: 128K → 200K
- コーディング性能向上（Claude Code、Cline、Roo Code等で検証）
- 推論時ツール使用サポート
- フロントエンドUI生成品質向上
- エージェント能力強化

**ベンチマーク**:

| ベンチマーク | GLM-4.6 |
|-------------|---------|
| GPQA (with tools) | 82.9% |
| LiveCodeBench V6 | 業界トップクラス |

**HuggingFace**: [zai-org/GLM-4.6](https://huggingface.co/zai-org/GLM-4.6)

---

### GLM-4.7

**リリース日**: 2025年12月22日

**概要**: 最新フラッグシップモデル。コーディング・エージェント能力でオープンソース最高峰。

| 項目 | GLM-4.7 | GLM-4.7-Flash |
|------|---------|---------------|
| 総パラメータ数 | 355B〜400B | 同等規模の軽量版 |
| 活性化パラメータ数 | 32B | - |
| コンテキスト長 | 202K〜205K | - |
| 最大出力 | 128Kトークン | - |
| 推論速度 | 55 tokens/s | より高速 |

**思考モード（Thinking Modes）**:
1. **Interleaved Thinking**: 各レスポンス/ツール呼び出し前に推論
2. **Preserved Thinking**: マルチターン対話で推論ブロック保持（キャッシュヒット率向上）
3. **Turn-level Thinking**: リクエストごとに思考深度を制御

**ベンチマーク**:

| ベンチマーク | GLM-4.7 | GLM-4.6比 |
|-------------|---------|-----------|
| HLE (Humanity's Last Exam) | 42.8% | +12.4% |
| AIME 2025 | 95.7% | - |
| SWE-bench Verified | 73.8% | +5.8% |
| SWE-bench Multilingual | 66.7% | +12.9% |
| Terminal Bench 2.0 | 41% | +16.5% |
| LiveCodeBench V6 | 84.9 | オープンソースSOTA |
| GPQA Diamond | 86% | - |

**特徴**:
- オープンソースモデルで初めてClaude Sonnet 4.5に匹敵
- Cerebras上で1500+ tokens/sの高速推論
- Claude Code、Cline、Roo Code等のコーディングツールに最適化

**HuggingFace**: [zai-org/GLM-4.7](https://huggingface.co/zai-org/GLM-4.7)

---

## マルチモーダルモデル

### VisualGLM-6B

**リリース日**: 2023年5月

**概要**: GLMファミリー初のマルチモーダルモデル。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 6B |
| 言語モデル | ChatGLM-6B |
| 画像エンコーダ | BLIP2-Qformer |
| 対応言語 | 中国語・英語 |

---

### CogVLM

**リリース日**: 2023年10月

**概要**: Visual Expert Moduleを導入した強力なVision-Language Model。

| 項目 | 仕様 |
|------|------|
| 総パラメータ数 | 17B |
| ビジョンパラメータ | 10B |
| 言語パラメータ | 7B |
| 画像解像度 | 490×490（基本）/ 1120×1120（CogAgent） |
| ビジョンエンコーダ | EVA-CLIP |

**アーキテクチャ特徴**:
- **Visual Expert Module**: Attention層とFFN層の両方に視覚専門モジュール
- 言語能力を損なわずに深い視覚-言語融合を実現

**ベンチマーク（10ベンチマークでSOTA）**:
- NoCaps, Flicker30k captioning
- RefCOCO, RefCOCO+, RefCOCOg
- Visual7W, GQA, ScienceQA
- VizWiz VQA, TDIUC

**派生モデル**:
- **CogVLM-Chat**: 対話版
- **CogVLM-Grounding**: Visual Grounding特化

**HuggingFace**: [THUDM/cogvlm-chat-hf](https://huggingface.co/THUDM/cogvlm-chat-hf)

---

### CogAgent

**リリース日**: 2023年12月（CVPR 2024 Highlight採択）

**概要**: GUI操作に特化したVision-Language Agent。

| 項目 | 仕様 |
|------|------|
| 総パラメータ数 | 18B |
| ビジョンパラメータ | 11B |
| 言語パラメータ | 7B |
| 画像解像度 | 1120×1120 |
| GUI理解 | PC・Android両対応 |

**能力**:
- GUI要素の認識・操作
- マルチターン画像対話
- Visual Grounding
- 9つのVLMベンチマークでSOTA

**最新版（CogAgent-9B-20241220）**:
- GLM-4V-9Bベース
- ScreenSpot、OmniAct、OSWorldでトップクラス
- GLM-PCプロダクトに採用

**HuggingFace**: [THUDM/cogagent-9b-20241220](https://huggingface.co/THUDM/cogagent-9b-20241220)

---

### CogVLM2

**リリース日**: 2024年5月

**概要**: GPT-4Vに匹敵するマルチモーダルモデル。

| 項目 | 仕様 |
|------|------|
| 言語モデル | Llama-3-8B-Instruct |
| 画像解像度 | 最大1344×1344 |
| 特徴 | 2×2ダウンサンプリング、Visual Expert継承 |

**派生モデル**:
- **CogVLM2**: 画像理解
- **CogVLM2-Video**: 動画理解（タイムスタンプ付きフレーム入力）

**HuggingFace**: [THUDM/cogvlm2-llama3-chat-19B](https://huggingface.co/THUDM/cogvlm2-llama3-chat-19B)

---

### GLM-4V-9B

**リリース日**: 2024年6月

**概要**: CogVLM2と同じ学習レシピでGLM-4-9Bをベースに開発。

| 項目 | 仕様 |
|------|------|
| 言語モデル | GLM-4-9B |
| ビジョンエンコーダ | EVA-E (4B) |
| 画像解像度 | 1120×1120 |
| 言語 | 中国語・英語（バイリンガル） |

**特徴**:
- Visual Expert不採用でモデルサイズ13Bに削減
- 2×2ダウンサンプリング

**HuggingFace**: [THUDM/glm-4v-9b](https://huggingface.co/THUDM/glm-4v-9b)

---

### GLM-4.5V / GLM-4.6V

**リリース日**: 2025年8月〜

**概要**: 大規模VLMファミリー。

| モデル | 総パラメータ | 特徴 |
|--------|-------------|------|
| GLM-4.5V | 106B | ビジョン-言語モデル |
| GLM-4.6V | - | 動画理解強化 |
| GLM-4.1V-Thinking | 9B | Chain-of-Thought推論搭載 |

**GLM-4.1V-9B-Thinking特徴**:
- 任意アスペクト比対応
- 最大4K解像度
- バイリンガル（中国語・英語）
- 28ベンチマーク中23タスクで10Bスケール1位
- Qwen-2.5-VL-72Bを18タスクで上回る

**HuggingFace**: [zai-org/GLM-V](https://huggingface.co/zai-org/GLM-V)

---

## コード生成モデル（CodeGeeX系）

### CodeGeeX

**リリース日**: 2022年9月（KDD 2023採択）

**概要**: 多言語コード生成モデル。Ascend 910で学習。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 13B |
| レイヤー数 | 40 |
| Hidden Size | 5,120 |
| FFN Inner Size | 20,480 |
| 学習データ | 850Bトークン（23言語） |
| 最大シーケンス長 | 2,048 |
| 学習基盤 | 1,536 × Ascend 910 |

**対応言語**: Python, C++, Java, JavaScript, Go等23言語

**機能**:
- 多言語コード生成
- クロスリンガルコード翻訳
- VS Code / JetBrains IDE拡張

**HuggingFace**: [THUDM/codegeex-13b](https://huggingface.co/THUDM/codegeex-13b)

---

### CodeGeeX2-6B

**リリース日**: 2023年7月

**概要**: ChatGLM2-6Bベースの第2世代コードモデル。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 6B |
| ベースモデル | ChatGLM2-6B |
| 追加学習データ | 600Bコードトークン |
| 最大シーケンス長 | 8,192 |
| 推論要件 | INT4: 6GB VRAM |

**性能向上（vs CodeGeeX）**: +107%

**HumanEval-X性能（vs CodeGeeX）**:
- Python: +57%（35.9% Pass@1、StarCoder-15B超）
- C++: +71%
- Java: +54%
- JavaScript: +83%
- Go: +56%
- Rust: +321%

**HuggingFace**: [THUDM/codegeex2-6b](https://huggingface.co/THUDM/codegeex2-6b)

---

### CodeGeeX4-ALL-9B

**リリース日**: 2024年7月

**概要**: 10B以下最強のコード生成モデル。全機能統合版。

| 項目 | 仕様 |
|------|------|
| パラメータ数 | 9B |
| ベースモデル | GLM-4-9B |
| コンテキスト長 | 128K |
| 対応言語 | 300+言語 |

**機能**:
- コード補完・生成
- Code Interpreter
- Web検索
- Function Call（コードモデル唯一のFC実装、成功率90%+）
- リポジトリレベルQ&A

**ベンチマーク**:

| ベンチマーク | CodeGeeX4-ALL-9B |
|-------------|------------------|
| BigCodeBench (Complete) | 48.9（<20Bモデル最高） |
| BigCodeBench (Instruct) | 40.4 |
| NaturalCodeBench | 同規模最高 |
| NIAH (128K) | 100%リトリーバル精度 |

**HuggingFace**: [THUDM/codegeex4-all-9b](https://huggingface.co/THUDM/codegeex4-all-9b)

---

## エージェントモデル

### AutoGLM / GLM-PC

**概要**: GLM-OSコンセプトに基づくエージェントプロダクト。

| モデル | 用途 |
|--------|------|
| AutoGLM | モバイルエージェント |
| GLM-PC | デスクトップエージェント |
| CogAgent-9B-20241220 | GLM-PCの基盤モデル |
| Open-AutoGLM | オープンソース版 |

**CogAgent-9B-20241220のベンチマーク**:

| ベンチマーク | 性能 |
|-------------|------|
| ScreenSpot | GUI Localizationリード |
| OmniAct | シングルステップ操作リード |
| CogAgentBench-basic-cn | 中国語ステップワイズリード |
| OSWorld | マルチステップ操作2位 |

---

## VRAM要件

### 推論時VRAM要件（BF16基準）

| モデル | BF16 | FP16 | INT8 | INT4 |
|--------|------|------|------|------|
| ChatGLM-6B | 13GB | 13GB | 8GB | 6GB |
| ChatGLM2/3-6B | 13GB | 13GB | 8GB | 6GB |
| GLM-4-9B | 19GB | 19GB | 10GB | 6GB |
| CodeGeeX-13B | 27GB | 27GB | 15GB | 10GB |
| CogVLM-17B | 35GB | 35GB | 18GB | 11GB |
| CogAgent-18B | 37GB | 37GB | 19GB | 12GB |
| GLM-4-32B | 65GB | 65GB | 35GB | 20GB |
| GLM-130B | 260GB | 260GB | 140GB | 70GB |

### MoEモデルVRAM要件

| モデル | 総パラメータ | 活性化パラメータ | 推定VRAM (BF16) |
|--------|-------------|-----------------|-----------------|
| GLM-4.5 | 355B | 32B | 〜700GB |
| GLM-4.5-Air | 106B | 12B | 〜220GB |
| GLM-4.6/4.7 | 355B〜400B | 32B | 〜800GB |

---

## プロンプトテンプレート

### ChatGLM3形式

```
<|system|>
You are a helpful assistant.
<|user|>
{user_message}
<|assistant|>
{assistant_response}
```

### GLM-4形式

```
[gMASK]<sop><|system|>
{system_prompt}<|user|>
{user_message}<|assistant|>
{assistant_response}
```

### GLM-4 Function Call形式

```json
{
  "role": "assistant",
  "content": null,
  "function_call": {
    "name": "function_name",
    "arguments": "{\"arg1\": \"value1\"}"
  }
}
```

### GLM-4.7 Thinking Mode

```python
# SGLang設定
"chat_template_kwargs": {
    "enable_thinking": true,  # 思考モード有効化
    "clear_thinking": false   # 思考ブロック保持
}
```

---

## モデルファミリーツリー

```
GLM Architecture (2022)
│
├── GLM-130B (130B, 2022/07)
│   └── ChatGLM-130B (API)
│
├── ChatGLM Series
│   ├── ChatGLM-6B (6B, 2023/03)
│   │   └── VisualGLM-6B (2023/05)
│   ├── ChatGLM2-6B (6B, 2023/06)
│   │   ├── ChatGLM2-6B-32K
│   │   └── CodeGeeX2-6B (2023/07)
│   └── ChatGLM3-6B (6B, 2023/10)
│       ├── ChatGLM3-6B-32K
│       └── ChatGLM3-6B-128K
│
├── GLM-4 Series
│   ├── GLM-4 (API, 2024/01)
│   │   └── GLM-4 All Tools
│   ├── GLM-4-9B Series (2024/06)
│   │   ├── GLM-4-9B-Chat
│   │   ├── GLM-4-9B-Chat-1M
│   │   ├── GLM-4V-9B
│   │   └── CodeGeeX4-ALL-9B (2024/07)
│   └── GLM-4-32B-0414 Series (2025/04)
│       ├── GLM-4-32B-0414
│       ├── GLM-Z1-32B-0414 (Reasoning)
│       ├── GLM-Z1-Rumination-32B-0414
│       └── GLM-Z1-9B-0414
│
├── GLM-4.5+ Series (MoE)
│   ├── GLM-4.5 (355B/32B, 2025/07)
│   │   └── GLM-4.5-Air (106B/12B)
│   ├── GLM-4.5V (106B, 2025/08)
│   ├── GLM-4.6 (357B/32B, 2025/09-10)
│   │   └── GLM-4.6V
│   └── GLM-4.7 (355B-400B/32B, 2025/12)
│       └── GLM-4.7-Flash
│
├── Vision-Language Models
│   ├── CogVLM (17B, 2023/10)
│   │   └── CogVLM-Grounding
│   ├── CogAgent (18B, 2023/12)
│   │   └── CogAgent-9B-20241220
│   ├── CogVLM2 (2024/05)
│   │   └── CogVLM2-Video
│   └── GLM-4.1V-Thinking (2025)
│
├── Code Models
│   ├── CodeGeeX (13B, 2022/09)
│   ├── CodeGeeX2-6B (2023/07)
│   └── CodeGeeX4-ALL-9B (2024/07)
│
└── Media Generation
    ├── CogView Series
    │   ├── CogView3 (2024/09)
    │   ├── CogView-3Plus-3B (2024/10)
    │   └── CogView4-6B (2025/03)
    └── CogVideoX Series
        ├── CogVideoX-2B (2024/08)
        ├── CogVideoX-5B (2024/08)
        └── CogVideoX1.5-5B (2024/11)
```

---

## 技術革新のまとめ

### GLMアーキテクチャ

| 特徴 | 説明 |
|------|------|
| Autoregressive Blank Infilling | ランダムにマスクされたテキストスパンを自己回帰的に予測 |
| 双方向アテンション | マスクされていないコンテキストに対する双方向アテンション |
| 位置エンコーディング | Rotary Position Embedding (RoPE) |
| 活性化関数 | GeGLU / FastGELU |

### 学習技術

| 技術 | 適用モデル | 効果 |
|------|-----------|------|
| FlashAttention | ChatGLM2以降 | 長文コンテキスト対応（2K→32K→128K→200K） |
| Multi-Query Attention | ChatGLM2以降 | 推論効率向上 |
| INT4量子化 | 全モデル | VRAM使用量50%削減、性能低下最小限 |
| DeepNorm | GLM-130B | 学習安定化 |
| Gradient Shrink | GLM-130B | Loss Spike対策 |

### MoEアーキテクチャ

| モデル | 総パラメータ | 活性化パラメータ | エキスパート数 |
|--------|-------------|-----------------|---------------|
| GLM-4.5 | 355B | 32B | - |
| GLM-4.5-Air | 106B | 12B | - |

### 推論技術

| 技術 | 適用モデル | 効果 |
|------|-----------|------|
| Cold Start + Extended RL | GLM-Z1系 | 深層推論能力 |
| Pairwise Ranking Feedback | GLM-Z1系 | 一般能力向上 |
| Interleaved Thinking | GLM-4.5以降 | 複雑指示遵守・コード生成品質向上 |
| Preserved Thinking | GLM-4.7 | キャッシュヒット率向上・コスト削減 |
| Rumination | GLM-Z1-Rumination | 検索統合深層思考 |

### マルチモーダル技術

| 技術 | 適用モデル | 効果 |
|------|-----------|------|
| Visual Expert Module | CogVLM系 | 深い視覚-言語融合、言語能力維持 |
| High-Resolution Cross-Module | CogAgent | 1120×1120解像度対応 |
| 2×2 Downsampling | CogVLM2, GLM-4V | 効率的高解像度処理 |
| Temporal Grounding | CogVLM2-Video | 動画時間情報理解 |
| Chain-of-Thought | GLM-4.1V-Thinking | 推論の精度・解釈性向上 |

---

## プラットフォーム対応

### APIサービス

| プラットフォーム | URL | 対応モデル |
|----------------|-----|-----------|
| Z.ai API Platform (Global) | https://z.ai | GLM-4.5/4.6/4.7, CogView, CogVideoX |
| 智譜AI開放平台 (中国) | https://bigmodel.cn | 全GLMモデル |
| OpenRouter | https://openrouter.ai | GLM-4.6/4.7 |
| SiliconFlow | https://siliconflow.com | GLM-4.5/4.6/4.7 |
| Cerebras | https://cerebras.ai | GLM-4.7（1500+ tokens/s） |
| DeepInfra | https://deepinfra.com | GLM-4.5 |
| Fireworks | https://fireworks.ai | GLM-4.5 |

### ローカル推論フレームワーク

| フレームワーク | 対応バージョン |
|---------------|---------------|
| HuggingFace Transformers | 4.30.2+ |
| vLLM | mainブランチ |
| SGLang | mainブランチ |
| Ollama | 0.2+ |
| FasterTransformer | - |
| TensorRT-LLM | - |

### ハードウェア対応

| ベンダー | チップ/プラットフォーム | 対応状況 |
|---------|----------------------|---------|
| NVIDIA | A100, H100, RTX 30/40系 | 全モデル対応 |
| Huawei | Ascend 910, Ascend 310 | GLM全シリーズ対応 |
| Intel | Xeon, Core Ultra, Arc, Gaudi | 部分対応 |
| Cambricon | MLU系 | GLM-4.6対応（国産チップ） |
| AMD | DirectML経由 | 部分対応 |

---

## 参考文献

### 主要論文

1. **GLM-130B**: Zeng et al. "GLM-130B: An Open Bilingual Pre-trained Model" (ICLR 2023)
   - arXiv: [2210.02414](https://arxiv.org/abs/2210.02414)

2. **ChatGLM**: Team GLM. "ChatGLM: A Family of Large Language Models from GLM-130B to GLM-4 All Tools" (2024)
   - arXiv: [2406.12793](https://arxiv.org/abs/2406.12793)

3. **CogVLM**: Wang et al. "CogVLM: Visual Expert for Pretrained Language Models" (NeurIPS 2024)
   - arXiv: [2311.03079](https://arxiv.org/abs/2311.03079)

4. **CogAgent**: Hong et al. "CogAgent: A Visual Language Model for GUI Agents" (CVPR 2024 Highlight)
   - arXiv: [2312.08914](https://arxiv.org/abs/2312.08914)

5. **CogVLM2**: Hong et al. "CogVLM2: Visual Language Models for Image and Video Understanding" (2024)
   - arXiv: [2408.16500](https://arxiv.org/abs/2408.16500)

6. **CodeGeeX**: Zheng et al. "CodeGeeX: A Pre-Trained Model for Code Generation with Multilingual Benchmarking on HumanEval-X" (KDD 2023)
   - arXiv: [2303.17568](https://arxiv.org/abs/2303.17568)

7. **GLM-4.5**: Team GLM. "GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models" (2025)
   - arXiv: [2508.06471](https://arxiv.org/abs/2508.06471)

### 公式リポジトリ

| モデル | GitHub |
|--------|--------|
| GLM-130B | https://github.com/THUDM/GLM-130B |
| ChatGLM-6B | https://github.com/THUDM/ChatGLM-6B |
| ChatGLM2-6B | https://github.com/THUDM/ChatGLM2-6B |
| ChatGLM3 | https://github.com/THUDM/ChatGLM3 |
| GLM-4 | https://github.com/THUDM/GLM-4 |
| CogVLM | https://github.com/THUDM/CogVLM |
| CogVLM2 | https://github.com/THUDM/CogVLM2 |
| CogAgent | https://github.com/THUDM/CogAgent |
| CodeGeeX | https://github.com/THUDM/CodeGeeX |
| CodeGeeX2 | https://github.com/THUDM/CodeGeeX2 |
| CodeGeeX4 | https://github.com/THUDM/CodeGeeX4 |
| CogVideo | https://github.com/THUDM/CogVideo |
| CogView | https://github.com/THUDM/CogView4 |

### 公式ドキュメント

- Z.ai Developer Documentation: https://docs.z.ai
- 智譜AI技術ドキュメント: https://open.bigmodel.cn/dev/howuse
- CodeGeeX公式サイト: https://codegeex.cn

---

## ライセンス情報

| モデル | ライセンス |
|--------|-----------|
| GLM-130B | Apache 2.0 + Model License |
| ChatGLM系 | Apache 2.0（学術無料、商用登録制） |
| GLM-4-9B系 | Apache 2.0 |
| GLM-4-32B系 | MIT License |
| GLM-4.5/4.6/4.7 | MIT License |
| CogVLM/CogVLM2 | Apache 2.0 + Model License |
| CogAgent | Apache 2.0 + Model License |
| CodeGeeX系 | Apache 2.0（学術無料、商用登録制） |
| CogVideoX | Apache 2.0 |

---

*最終更新: 2026年1月*
*このカタログは公開情報に基づいて作成されています。最新情報は各公式リポジトリ・ドキュメントをご確認ください。*
