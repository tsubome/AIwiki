# Meta Llamaモデルファミリー完全ガイド

Meta社のLlamaは、2023年2月の初代リリースから約3年で**15以上のモデルシリーズ**と**100を超えるバリエーション**を持つ、世界最大級のオープンソースLLMエコシステムへと成長した。本レポートでは、AIwiki用JSONファイル作成に必要な全モデルの詳細情報を網羅的に整理する。

---

## LLaMA 1：オープンソースLLM革命の幕開け

Metaが**2023年2月24日**にリリースした初代LLaMA（Large Language Model Meta AI）は、研究用途限定ながらGPT-3クラスの性能を持つ基盤モデルとして公開され、オープンソースAI開発のブレイクスルーとなった。

### 基本仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | LLaMA (Large Language Model Meta AI) |
| リリース日 | 2023-02-24 |
| ライセンス | Non-commercial Research License（研究用途限定・申請制） |
| モデルタイプ | BASE |
| コンテキスト長 | 2,048 tokens |
| 学習トークン数 | 7B: 1T、13B: 1T、33B: 1.4T、65B: 1.4T |
| 対応言語 | 20言語（主に英語、ラテン・キリル文字中心） |
| アーキテクチャ | Decoder-only Transformer（RMSNorm、SwiGLU、RoPE） |
| 語彙サイズ | 32,000 tokens（SentencePiece BPE） |

### バリエーション

| モデル名 | パラメータ数 | タイプ |
|---------|-------------|--------|
| LLaMA-7B | 7B | BASE |
| LLaMA-13B | 13B | BASE |
| LLaMA-33B（30B表記あり） | 33B | BASE |
| LLaMA-65B | 65B | BASE |

### 関連リンク

- arXiv論文: https://arxiv.org/abs/2302.13971
- 公式ブログ: https://ai.meta.com/blog/large-language-model-llama-meta-ai/
- GitHub: https://github.com/meta-llama/llama

---

## Llama 2：商用利用解禁でエコシステム拡大

**2023年7月18日**リリースのLlama 2は、商用利用を許可する**Llama 2 Community License**を採用し、コンテキスト長を4Kに倍増、学習データも**2兆トークン**に拡大した。70Bモデルには**Grouped Query Attention（GQA）**を初採用し、推論効率を大幅に改善。Chat版ではRLHFによる安全性強化も実施された。

### 基本仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Llama 2 |
| リリース日 | 2023-07-18 |
| ライセンス | Llama 2 Community License Agreement |
| モデルタイプ | BASE / CHAT |
| コンテキスト長 | 4,096 tokens |
| 学習トークン数 | 2T tokens |
| 知識カットオフ | 2022年9月（事前学習データ） |
| 対応言語 | 主に英語 |
| アーキテクチャ | Decoder-only Transformer（70BのみGQA使用） |
| 語彙サイズ | 32,000 tokens |

### バリエーション

| モデル名 | パラメータ数 | タイプ | Hugging Face URL |
|---------|-------------|--------|------------------|
| Llama-2-7b | 7B | BASE | https://huggingface.co/meta-llama/Llama-2-7b-hf |
| Llama-2-7b-chat | 7B | CHAT | https://huggingface.co/meta-llama/Llama-2-7b-chat-hf |
| Llama-2-13b | 13B | BASE | https://huggingface.co/meta-llama/Llama-2-13b-hf |
| Llama-2-13b-chat | 13B | CHAT | https://huggingface.co/meta-llama/Llama-2-13b-chat-hf |
| Llama-2-70b | 70B | BASE | https://huggingface.co/meta-llama/Llama-2-70b-hf |
| Llama-2-70b-chat | 70B | CHAT | https://huggingface.co/meta-llama/Llama-2-70b-chat-hf |

### 関連リンク

- arXiv論文: https://arxiv.org/abs/2307.09288
- 公式ブログ: https://about.fb.com/news/2023/07/llama-2/
- 公式サイト: https://www.llama.com/llama2/
- GitHub: https://github.com/meta-llama/llama
- Hugging Face: https://huggingface.co/meta-llama

---

## Llama 3：性能飛躍と新トークナイザー

**2024年4月18日**リリースのLlama 3は、語彙サイズを**128,000トークン**に4倍拡大し、学習データも**15兆トークン以上**と大幅増強。全サイズでGQAを採用し、8BモデルでもLlama 2 70Bに匹敵する性能を実現した。

### 基本仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Meta Llama 3 |
| リリース日 | 2024-04-18 |
| ライセンス | Meta Llama 3 Community License |
| モデルタイプ | BASE / INSTRUCT |
| コンテキスト長 | 8,192 tokens |
| 学習トークン数 | 15T+ tokens |
| 知識カットオフ | 8B: 2023年3月、70B: 2023年12月 |
| 対応言語 | 英語（プライマリ）、30以上の言語で事前学習 |
| アーキテクチャ | Auto-regressive Decoder-only Transformer（全モデルGQA） |
| 語彙サイズ | 128,000 tokens |

### バリエーション

| モデル名 | パラメータ数 | タイプ | Hugging Face URL |
|---------|-------------|--------|------------------|
| Meta-Llama-3-8B | 8B | BASE | https://huggingface.co/meta-llama/Meta-Llama-3-8B |
| Meta-Llama-3-8B-Instruct | 8B | INSTRUCT | https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct |
| Meta-Llama-3-70B | 70B | BASE | https://huggingface.co/meta-llama/Meta-Llama-3-70B |
| Meta-Llama-3-70B-Instruct | 70B | INSTRUCT | https://huggingface.co/meta-llama/Meta-Llama-3-70B-Instruct |

### 関連リンク

- arXiv論文: https://arxiv.org/abs/2407.21783
- 公式ブログ: https://ai.meta.com/blog/meta-llama-3/
- GitHub: https://github.com/meta-llama/llama3
- ライセンス: https://llama.meta.com/llama3/license

---

## Llama 3.1：128Kコンテキストと405Bフラッグシップ

**2024年7月23日**リリースのLlama 3.1は、コンテキスト長を**128K**に16倍拡大し、**405B**という当時最大のオープンソースLLMを投入。8言語の多言語対応と強化されたツール統合機能を実装し、GPT-4やClaude 3.5 Sonnetと同等レベルの性能を達成した。

### 基本仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Llama 3.1 |
| リリース日 | 2024-07-23 |
| ライセンス | Llama 3.1 Community License |
| モデルタイプ | BASE / INSTRUCT |
| コンテキスト長 | 128,000 tokens |
| 学習トークン数 | 15T+（405B: 15.6T） |
| 知識カットオフ | 2023年12月 |
| 対応言語 | 英語、ドイツ語、フランス語、イタリア語、ポルトガル語、ヒンディー語、スペイン語、タイ語（8言語） |
| アーキテクチャ | Optimized Decoder-only Transformer（全モデルGQA） |
| 学習GPU時間 | 合計39.3M GPU時間（H100-80GB） |

### バリエーション

| モデル名 | パラメータ数 | タイプ | 学習GPU時間 | Hugging Face URL |
|---------|-------------|--------|-------------|------------------|
| Llama-3.1-8B | 8B | BASE | 1.46M時間 | https://huggingface.co/meta-llama/Llama-3.1-8B |
| Llama-3.1-8B-Instruct | 8B | INSTRUCT | - | https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct |
| Llama-3.1-70B | 70B | BASE | 7.0M時間 | https://huggingface.co/meta-llama/Llama-3.1-70B |
| Llama-3.1-70B-Instruct | 70B | INSTRUCT | - | https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct |
| Llama-3.1-405B | 405B | BASE | 30.84M時間 | https://huggingface.co/meta-llama/Llama-3.1-405B |
| Llama-3.1-405B-Instruct | 405B | INSTRUCT | - | https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct |

**405Bモデルの特徴**: 16,000以上のH100 GPUで学習、3.8×10²⁵ FLOPs消費、BF16→FP8量子化でシングルノード実行可能、MMLU（5-shot）で**87.3%**達成

### 関連リンク

- arXiv論文: https://arxiv.org/abs/2407.21783
- 公式ブログ: https://ai.meta.com/blog/meta-llama-3-1/
- GitHub: https://github.com/meta-llama/llama-models
- 公式サイト: https://llama.meta.com/

---

## Llama 3.2：軽量モデルとマルチモーダル対応

**2024年9月25日**リリースのLlama 3.2は、エッジ/モバイル向け軽量モデル（**1B/3B**）と、初のマルチモーダル対応Visionモデル（**11B/90B**）を投入。軽量モデルはLlama 3.1 8Bからの**構造化プルーニングと知識蒸留**で開発された。

### テキストモデル（1B/3B）仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Meta Llama 3.2 (1B/3B) |
| リリース日 | 2024-09-25 |
| ライセンス | Llama 3.2 Community License |
| モデルタイプ | BASE / INSTRUCT |
| コンテキスト長 | 128K tokens |
| 学習トークン数 | 最大9T tokens |
| 知識カットオフ | 2023年12月 |
| 対応言語 | 8言語 |
| アーキテクチャ | Auto-regressive Transformer（GQA、Shared Embeddings） |
| 技術特徴 | Llama 3.1 8Bからのpruning + Llama 3.1 8B/70Bからの知識蒸留 |

### Visionモデル（11B/90B）仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Meta Llama 3.2-Vision (11B/90B) |
| リリース日 | 2024-09-25 |
| ライセンス | Llama 3.2 Community License（**EU制限あり**） |
| モデルタイプ | VISION / VISION-INSTRUCT |
| コンテキスト長 | 128K tokens |
| 学習データ | 60億画像-テキストペア（事前学習）、300万以上の合成例（Instruction tuning） |
| 対応言語（テキスト） | 8言語 |
| 対応言語（画像+テキスト） | 英語のみ |
| アーキテクチャ | Llama 3.1テキストモデル + Vision Adapter（Cross-attention layers） |
| 入出力 | テキスト＋画像 → テキスト |

### バリエーション

| モデル名 | パラメータ数 | タイプ | Hugging Face URL |
|---------|-------------|--------|------------------|
| Llama-3.2-1B | 1.23B | BASE | https://huggingface.co/meta-llama/Llama-3.2-1B |
| Llama-3.2-1B-Instruct | 1.23B | INSTRUCT | https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct |
| Llama-3.2-3B | 3.21B | BASE | https://huggingface.co/meta-llama/Llama-3.2-3B |
| Llama-3.2-3B-Instruct | 3.21B | INSTRUCT | https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct |
| Llama-3.2-11B-Vision | 10.6B | VISION | https://huggingface.co/meta-llama/Llama-3.2-11B-Vision |
| Llama-3.2-11B-Vision-Instruct | 10.6B | VISION-INSTRUCT | https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct |
| Llama-3.2-90B-Vision | 88.8B | VISION | https://huggingface.co/meta-llama/Llama-3.2-90B-Vision |
| Llama-3.2-90B-Vision-Instruct | 88.8B | VISION-INSTRUCT | https://huggingface.co/meta-llama/Llama-3.2-90B-Vision-Instruct |

### 関連リンク

- 公式ブログ: https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/
- Hugging Face Collection: https://huggingface.co/collections/meta-llama/llama-32

---

## Llama 3.3：70Bで405B相当の性能を実現

**2024年12月6日**リリースのLlama 3.3 70B Instructは、Llama 3.1 70Bをベースに更なる最適化を施し、**405Bモデル相当の性能をより低コストで実現**した効率特化モデル。特にMATH（CoT）では**77.0%**とLlama 3.1 405Bの73.8%を上回る。

### 基本仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Meta Llama 3.3 70B Instruct |
| リリース日 | 2024-12-06 |
| ライセンス | Llama 3.3 Community License |
| モデルタイプ | INSTRUCT（Instructのみ提供） |
| コンテキスト長 | 128K tokens |
| 学習トークン数 | 15T+ tokens |
| 知識カットオフ | 2023年12月 |
| 対応言語 | 8言語 |
| アーキテクチャ | Auto-regressive Transformer（GQA、SFT + RLHF） |
| ベースモデル | Llama 3.1 70B |

### ベンチマーク性能

| ベンチマーク | Llama 3.3 70B | Llama 3.1 405B |
|--------------|---------------|----------------|
| MMLU (CoT) | 86.0 | 88.6 |
| MATH (CoT) | **77.0** | 73.8 |
| HumanEval | 88.4 | - |
| IFEval | 92.1 | - |
| MGSM（多言語） | 91.1 | - |

### バリエーション

| モデル名 | パラメータ数 | タイプ | Hugging Face URL |
|---------|-------------|--------|------------------|
| Llama-3.3-70B-Instruct | 70B (71B) | INSTRUCT | https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct |

---

## Code Llama：コード特化LLMの決定版

**2023年8月24日**リリースのCode Llamaは、Llama 2をベースに**500Bコードトークン**で追加学習した専門モデル。最大**100Kトークン**のコンテキストで長大なコードベースを処理でき、**Infilling（FIM）**機能でコード補完にも対応する。

### 基本仕様

| 項目 | 詳細 |
|------|------|
| 正式名称 | Code Llama |
| リリース日 | 2023-08-24（7B/13B/34B）、2024-01-29（70B） |
| ライセンス | Llama 2 Community License |
| モデルタイプ | CODE |
| ベースモデル | Llama 2 |
| コンテキスト長 | 16K（学習）、最大100K（推論、7B/13B/70B） |
| 学習トークン数 | 500B（基本）、70B: 1T |
| 対応プログラミング言語 | Python, C++, Java, PHP, TypeScript/JavaScript, C#, Bash等 |
| 特殊機能 | Infilling（FIM）- 7B/13B/70Bで対応 |

### バリエーション

| サイズ | Base | Python特化 | Instruct |
|--------|------|------------|----------|
| 7B | codellama/CodeLlama-7b-hf | codellama/CodeLlama-7b-Python-hf | codellama/CodeLlama-7b-Instruct-hf |
| 13B | codellama/CodeLlama-13b-hf | codellama/CodeLlama-13b-Python-hf | codellama/CodeLlama-13b-Instruct-hf |
| 34B | codellama/CodeLlama-34b-hf | codellama/CodeLlama-34b-Python-hf | codellama/CodeLlama-34b-Instruct-hf |
| 70B | codellama/CodeLlama-70b-hf | codellama/CodeLlama-70b-Python-hf | codellama/CodeLlama-70b-Instruct-hf |

**注意**: 34Bモデルのみ**Infilling非対応**

### ベンチマーク性能

| モデル | HumanEval | MBPP |
|--------|-----------|------|
| Code Llama 70B Instruct | 67.8% | - |
| Code Llama 70B Python | - | 65.6% |
| Code Llama 34B | 51.8% | 55% |

### 関連リンク

- arXiv論文: https://arxiv.org/abs/2308.12950
- GitHub: https://github.com/facebookresearch/codellama
- Hugging Face: https://huggingface.co/codellama

---

## Llama Guard：入出力安全性分類の要

Llama Guardシリーズは、LLMの入力（プロンプト）と出力（応答）の安全性を判定する分類器モデル。**Purple Llama**プロジェクトの中核コンポーネントとして、バージョンを重ねるごとにカテゴリ数と機能を拡張している。

### バージョン比較

| 項目 | Llama Guard v1 | Llama Guard 2 | Llama Guard 3 | Llama Guard 4 |
|------|----------------|---------------|---------------|---------------|
| リリース日 | 2023-12-07 | 2024-04-18 | 2024-07-23 | 2025-04-05 |
| ベースモデル | Llama 2-7B | Llama 3-8B | Llama 3.1-8B / 3.2-1B / 3.2-11B Vision | Llama 4 Scout |
| パラメータ数 | 7B | 8B | 8B / 1B / 11B | 12B |
| ライセンス | Llama 2 | Llama 3 | Llama 3.2 | Llama 4 |
| 安全カテゴリ数 | 7 | 11（MLCommons） | 13 + S14 | MLCommons標準 |
| マルチモーダル | ❌ | ❌ | 11B Visionのみ | ✅ ネイティブ |
| 多言語対応 | ❌ | ❌ | 8B: ✅ | 12言語 |

### Llama Guard 3 バリエーション

| モデル名 | パラメータ | 特徴 | Hugging Face URL |
|---------|----------|------|------------------|
| Llama-Guard-3-8B | 8B | 多言語対応、128Kコンテキスト、S14対応 | https://huggingface.co/meta-llama/Llama-Guard-3-8B |
| Llama-Guard-3-1B | 1B | オンデバイス向け、量子化版438MB | https://huggingface.co/meta-llama/Llama-Guard-3-1B |
| Llama-Guard-3-11B-Vision | 11B | マルチモーダル（テキスト+画像） | https://huggingface.co/meta-llama/Llama-Guard-3-11B-Vision |

### 安全カテゴリ（MLCommons 13カテゴリ + S14）

S1: 暴力犯罪、S2: 非暴力犯罪、S3: 性犯罪、S4: 児童搾取、S5: 名誉毀損、S6: 専門的アドバイス、S7: プライバシー、S8: 知的財産、S9: 無差別兵器、S10: ヘイト、S11: 自傷行為、S12: 性的コンテンツ、S13: 選挙関連、**S14: Code Interpreter Abuse**（Llama Guard 3で追加）

### 関連リンク

- arXiv論文: https://arxiv.org/abs/2312.06674
- Hugging Face: https://huggingface.co/meta-llama/LlamaGuard-7b

---

## Purple Llama：責任あるAI開発のためのツール群

**2023年12月7日**発表のPurple Llamaプロジェクトは、「Purple Teaming」（Red Team攻撃 + Blue Team防御）の統合アプローチを採用したAI安全性ツール群。

### 主要コンポーネント

| ツール | ライセンス | 説明 |
|--------|----------|------|
| CyberSecEval | MIT | LLMのサイバーセキュリティ安全性評価ベンチマーク（v1〜v4） |
| Llama Guard | Llama Community | 入出力安全性分類器 |
| Code Shield | MIT | 推論時の不安全コードフィルタリング |
| Prompt Guard | Llama 3.2 | プロンプトインジェクション/ジェイルブレイク検出 |
| LlamaFirewall | - | エージェントシステム向けセキュリティガードレール |

### Prompt Guard バリエーション

| モデル | パラメータ | ベース | Hugging Face URL |
|--------|----------|--------|------------------|
| Prompt Guard 2 86M | 86M | mDeBERTa-base | https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-86M |
| Prompt Guard 2 22M | 22M | DeBERTa-xsmall | https://huggingface.co/meta-llama/Llama-Prompt-Guard-2-22M |

### 関連リンク

- GitHub: https://github.com/meta-llama/PurpleLlama
- 公式サイト: https://ai.meta.com/llama/purple-llama
- CyberSecEval論文: https://arxiv.org/abs/2312.04724

---

## ライセンス体系の進化

Llamaファミリーのライセンスは世代ごとに変遷し、オープン化が進んでいる。

| ライセンス | 適用モデル | 商用利用 | 主な制限 |
|------------|----------|----------|----------|
| Non-commercial Research License | LLaMA 1 | ❌ | 研究目的のみ、申請制 |
| Llama 2 Community License | Llama 2, Code Llama | ✅ | MAU 7億以上は要許可、他LLM改良への使用禁止 |
| Llama 3 Community License | Llama 3, Llama Guard 2 | ✅ | MAU 7億以上は要許可 |
| Llama 3.1/3.2 Community License | Llama 3.1〜3.3 | ✅ | MAU 7億以上は要許可、**Llama 3.2 VisionはEU制限あり** |

---

## リリース年表

| 日付 | モデル/イベント |
|------|-----------------|
| 2023-02-24 | LLaMA 1（7B/13B/33B/65B） |
| 2023-07-18 | Llama 2（7B/13B/70B + Chat版） |
| 2023-08-24 | Code Llama（7B/13B/34B） |
| 2023-12-07 | Purple Llama、Llama Guard v1、CyberSecEval v1 |
| 2024-01-29 | Code Llama 70B |
| 2024-04-18 | Llama 3（8B/70B）、Llama Guard 2、CyberSecEval 2 |
| 2024-07-23 | Llama 3.1（8B/70B/405B）、Llama Guard 3-8B |
| 2024-09-25 | Llama 3.2（1B/3B/11B Vision/90B Vision）、Llama Guard 3-1B/11B Vision |
| 2024-12-06 | Llama 3.3 70B Instruct |
| 2025-04-05 | Llama Guard 4、Prompt Guard 2 |

---

## 結論：Llamaエコシステムの全体像

Meta社のLlamaファミリーは、**基盤モデル**（Llama 1〜3.3）、**コード特化**（Code Llama）、**安全性**（Llama Guard、Purple Llama）の3軸で展開される包括的なエコシステムを形成している。特筆すべきは、世代を重ねるごとにコンテキスト長（2K→4K→8K→128K）、学習データ（1T→2T→15T+）、対応言語（英語のみ→8言語）が飛躍的に拡大している点である。

Llama 3.2でのマルチモーダル対応、Llama 3.3での効率性向上は、オープンソースLLMが商用モデルに迫る性能を実現できることを示した。今後はLlama 4世代への移行とともに、さらなる機能拡張が期待される。