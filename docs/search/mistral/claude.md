# Mistral AI モデルファミリー完全カタログ

## 概要

Mistral AIは2023年4月にArthur Mensch、Guillaume Lample、Timothée Lacroixによって設立されたフランスのAI企業で、パリに本社を置く。創業者3名はÉcole Polytechniqueで出会い、それぞれGoogle DeepMindとMeta Platformsでの経験を持つ。Mistral AIは効率性重視のアプローチ、オープンソースへのコミットメント、Mixture-of-Experts（MoE）アーキテクチャの革新で知られ、2025年時点で140億ドル以上の評価額を誇る。

**開発元:** Mistral AI SAS  
**設立:** 2023年4月  
**本社:** フランス・パリ  
**主要投資家:** Microsoft、Lightspeed Venture Partners、ASML、General Catalyst

---

## 1. Mistral 7B

### 基本情報
- **リリース日:** 2023年9月27日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** Dense Transformer LLM
- **コンテキスト長:** 8,192トークン（Sliding Window Attention）
- **対応言語:** 英語（主）、多言語対応

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Mistral-7B-v0.1 | 73億 |
| Mistral-7B-v0.2 | 73億 |
| Mistral-7B-v0.3 | 73億（関数呼び出し対応） |

### アーキテクチャ詳細
- **Sliding Window Attention（SWA）:** 効率的な長文処理
- **Grouped-Query Attention（GQA）:** 推論速度向上
- **Byte-fallback BPE tokenizer:** 語彙サイズ32,000
- LLaMA 2 13Bを全ベンチマークで上回り、LLaMA 34Bに匹敵

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 60.1% |
| HellaSwag | 81.3% |
| Arc Challenge | 55.5% |
| WinoGrande | 75.3% |

### HuggingFace
- mistralai/Mistral-7B-v0.1
- mistralai/Mistral-7B-Instruct-v0.1/v0.2/v0.3

### リンク
- **ブログ:** https://mistral.ai/news/announcing-mistral-7b/
- **GitHub:** https://github.com/mistralai/mistral-src

---

## 2. Mixtral 8x7B

### 基本情報
- **リリース日:** 2023年12月11日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** Sparse Mixture-of-Experts（SMoE）
- **コンテキスト長:** 32,768トークン
- **対応言語:** 英語、フランス語、イタリア語、ドイツ語、スペイン語

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| Mixtral-8x7B | 467億 | 130億 |

### アーキテクチャ詳細
- **8エキスパート構成:** 各層に8つのFFNブロック（エキスパート）
- **Top-2ルーティング:** トークンごとに2エキスパートを選択
- Mistral 7Bと同じアーキテクチャベース
- LLaMA 2 70Bを上回り、GPT-3.5に匹敵

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 70.6% |
| HellaSwag | 84.4% |
| Arc Challenge | 66.4% |
| GSM8K | 74.4% |

### HuggingFace
- mistralai/Mixtral-8x7B-v0.1
- mistralai/Mixtral-8x7B-Instruct-v0.1

### リンク
- **論文:** https://arxiv.org/abs/2401.04088
- **ブログ:** https://mistral.ai/news/mixtral-of-experts

---

## 3. Mixtral 8x22B

### 基本情報
- **リリース日:** 2024年4月17日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** Sparse Mixture-of-Experts（SMoE）
- **コンテキスト長:** 65,536トークン
- **対応言語:** 多言語対応

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| Mixtral-8x22B | 1410億 | 390億 |

### アーキテクチャ詳細
- 8エキスパート×22Bパラメータ構成
- ネイティブ関数呼び出し機能
- 制約付き出力モード対応
- ChatGPT 3.5をMMLUとWinoGrandeで上回る

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 77.8% |
| HellaSwag | 88.5% |
| HumanEval | 45.1% |
| GSM8K（maj@8） | 90.8%（Instruct） |
| MATH（maj@4） | 44.6%（Instruct） |

### HuggingFace
- mistralai/Mixtral-8x22B-v0.1
- mistralai/Mixtral-8x22B-Instruct-v0.1

### リンク
- **ブログ:** https://mistral.ai/news/mixtral-8x22b

---

## 4. Mistral Large / Large 2

### 基本情報
- **リリース日:** Large: 2024年2月26日、Large 2: 2024年7月24日
- **開発元:** Mistral AI
- **ライセンス:** Mistral Research License（MRL）
- **モデルタイプ:** Dense Transformer LLM
- **コンテキスト長:** 128,000トークン
- **対応言語:** 英語、フランス語、ドイツ語、スペイン語、イタリア語、ポルトガル語、アラビア語、ヒンディー語、ロシア語、中国語、日本語、韓国語他

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Mistral Large | 非公開 |
| Mistral Large 2 | 1230億 |
| Mistral Large 2.1（24.11） | 1230億 |

### アーキテクチャ詳細
- 80以上のコーディング言語対応
- ネイティブ関数呼び出し
- 高度な推論、数学、コード生成能力
- Large 2.1: 長文理解、システムプロンプト、関数呼び出しの改善

### ベンチマーク（Large 2）
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 84.0% |
| HumanEval | 92.1% |
| MATH | 76.9% |
| GSM8K | 93.1% |

### HuggingFace
- mistralai/Mistral-Large-Instruct-2407
- mistralai/Mistral-Large-Instruct-2411

### リンク
- **ブログ:** https://mistral.ai/news/mistral-large-2407

---

## 5. Mistral Small シリーズ

### 基本情報
- **リリース日:** Small 2: 2024年9月、Small 3: 2025年1月30日、Small 3.1: 2025年3月17日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0（Small 3以降）
- **モデルタイプ:** Dense Transformer LLM
- **コンテキスト長:** 32,000トークン（Small 3以降は128K）

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Mistral Small 2（2409） | 非公開 |
| Mistral Small 3（2501） | 240億 |
| Mistral Small 3.1（2503） | 240億 |
| Mistral Small 3.2（2506） | 240億 |

### 主な特徴
- **Small 3:** 低レイテンシ、高効率の指示追従
- **Small 3.1:** ビジョン機能追加、より効率的
- **Small 3.2:** テキストとビジョンの両方で最高クラスの性能
- エンタープライズグレードの効率性

### HuggingFace
- mistralai/Mistral-Small-24B-Base-2501
- mistralai/Mistral-Small-24B-Instruct-2501

### リンク
- **ブログ:** https://mistral.ai/news/mistral-small-3-1

---

## 6. Mistral Medium 3

### 基本情報
- **リリース日:** 2025年5月7日
- **開発元:** Mistral AI
- **ライセンス:** 商用ライセンス
- **モデルタイプ:** Dense Transformer LLM
- **説明:** フロンティアレベルの能力を大幅に低い運用コストで提供

### 主な特徴
- エンタープライズ向け高性能モデル
- コスト効率の良いフロンティアモデル
- Mistral Large 2と Mistral Small 3の中間に位置

---

## 7. Codestral

### 基本情報
- **リリース日:** 2024年5月29日（Codestral 25.01: 2025年1月）
- **開発元:** Mistral AI
- **ライセンス:** Mistral AI Non-Production License（MNPL）
- **モデルタイプ:** コード特化LLM
- **コンテキスト長:** 32,768トークン
- **対応言語:** 80以上のプログラミング言語

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Codestral-22B | 220億 |
| Codestral 25.01 | 220億（アーキテクチャ改善） |

### アーキテクチャ詳細
- Fill-in-the-Middle（FIM）対応
- Python、Java、C、C++、JavaScript、Bash、Swift、Fortran対応
- コード補完、テスト生成、コード修正に特化
- Codestral 25.01: 2.5倍高速化、改良トークナイザー

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| HumanEval | 81.1% |
| MBPP | 高性能 |
| RepoBench | 長距離コンテキストで最高性能 |

### HuggingFace
- mistralai/Codestral-22B-v0.1

### リンク
- **ブログ:** https://mistral.ai/news/codestral

---

## 8. Codestral Mamba

### 基本情報
- **リリース日:** 2024年7月16日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** Mamba 2アーキテクチャベースのコードモデル
- **コンテキスト長:** 256,000トークン（理論上無限長対応）

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Codestral-Mamba-7B | 73億 |

### アーキテクチャ詳細
- **Mamba 2アーキテクチャ:** State Space Models（SSM）ベース
- **線形時間推論:** Transformerの二乗計算量を回避
- **理論上無限長シーケンス:** 長いコードベースを効率的に処理
- Codestral 22Bに匹敵する性能を7Bで実現

### 特徴
- 10B未満のモデルで最高のコード性能
- 入力長に関係なく高速推論
- 長いコンテキストでも性能劣化なし

### HuggingFace
- mistralai/mamba-codestral-7B-v0.1

### リンク
- **ブログ:** https://mistral.ai/news/codestral-mamba

---

## 9. Mathstral

### 基本情報
- **リリース日:** 2024年7月16日
- **開発元:** Mistral AI（Project Numinaとの共同）
- **ライセンス:** Apache 2.0
- **モデルタイプ:** 数学・STEM特化LLM
- **コンテキスト長:** 32,768トークン

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Mathstral-7B | 73億 |

### アーキテクチャ詳細
- Mistral 7Bベースの命令チューニングモデル
- 複雑な多段階論理推論に特化
- 数学的証明、科学計算に最適化

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MATH | 56.6%（単一）、68.37%（多数決）、74.59%（報酬モデル選択） |
| MMLU | 63.47% |

### HuggingFace
- mistralai/mathstral-7B-v0.1

### リンク
- **ブログ:** https://mistral.ai/news/mathstral

---

## 10. Mistral NeMo

### 基本情報
- **リリース日:** 2024年7月18日
- **開発元:** Mistral AI × NVIDIA
- **ライセンス:** Apache 2.0
- **モデルタイプ:** 多言語LLM
- **コンテキスト長:** 128,000トークン
- **対応言語:** 多言語（中国語処理の大幅改善含む）

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Mistral-NeMo-12B | 122億 |

### アーキテクチャ詳細
- NVIDIAとの共同開発
- **量子化対応学習:** FP8推論で性能劣化なし
- Gemma 2 9B、LLaMA 3 8Bを上回る性能
- Mistral 7Bのドロップイン置き換えとして設計

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| サイズカテゴリで最高水準の推論、世界知識、コーディング精度 |

### HuggingFace
- mistralai/Mistral-Nemo-Base-2407
- mistralai/Mistral-Nemo-Instruct-2407

### リンク
- **ブログ:** https://mistral.ai/news/mistral-nemo

---

## 11. Pixtral 12B

### 基本情報
- **リリース日:** 2024年9月17日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** マルチモーダルモデル（テキスト＋画像）
- **コンテキスト長:** 128,000トークン
- **画像入力:** 可変解像度・アスペクト比対応

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Pixtral-12B | 120億（テキスト）＋4億（ビジョンエンコーダー） |

### アーキテクチャ詳細
- **新規ビジョンエンコーダー:** スクラッチから学習、可変画像サイズ対応
- **マルチモーダルTransformerデコーダー:** テキストと画像を統合処理
- Mistral NeMo 12Bのドロップイン置き換え
- 任意の数の画像を128Kコンテキストで処理可能

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMMU（CoT） | 52.5% |
| MathVista（CoT） | 58.0% |
| ChartQA（CoT） | 81.8% |
| DocVQA（ANLS） | 90.7% |
| VQAv2 | 78.6% |

### HuggingFace
- mistralai/Pixtral-12B-2409

### リンク
- **ブログ:** https://mistral.ai/news/pixtral-12b

---

## 12. Ministral 3B / 8B

### 基本情報
- **リリース日:** 2024年10月16日
- **開発元:** Mistral AI
- **ライセンス:** 3B: 商用ライセンス、8B: Mistral Research License＋商用ライセンス
- **モデルタイプ:** エッジ向け小型LLM
- **コンテキスト長:** 128,000トークン

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Ministral-3B | 30億 |
| Ministral-8B | 80億 |

### アーキテクチャ詳細
- **8B:** インターリーブドSliding Window Attention（高速・メモリ効率的推論）
- オンデバイス、プライバシー優先の推論向け
- エージェントワークフロー、専門タスクに最適化
- LLaMA 3.1 8B、Mistral 7Bを上回る

### ベンチマーク
| ベンチマーク | Ministral 3B | Ministral 8B |
|------------|-------------|-------------|
| MMLU | LLaMA 3.2 3B超 | LLaMA 3.1 8B超 |
| GSM8K | 高性能 | 高性能 |
| Winogrande | 高性能 | 高性能 |

### HuggingFace
- mistralai/Ministral-8B-Instruct-2410

### リンク
- **ブログ:** https://mistral.ai/news/ministraux

---

## 13. Pixtral Large

### 基本情報
- **リリース日:** 2024年11月18日
- **開発元:** Mistral AI
- **ライセンス:** Mistral Research License（MRL）＋商用ライセンス
- **モデルタイプ:** フロンティアクラスマルチモーダルモデル
- **コンテキスト長:** 128,000トークン
- **画像入力:** 最大30枚の高解像度画像を同時処理

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Pixtral-Large | 1230億（テキスト）＋10億（ビジョンエンコーダー）= 1240億 |

### アーキテクチャ詳細
- Mistral Large 2ベースのマルチモーダル拡張
- ドキュメント、チャート、自然画像の理解
- テキスト性能を損なわずにマルチモーダル能力を追加

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MathVista | 69.4%（GPT-4o、Claude-3.5 Sonnet超） |
| DocVQA | GPT-4o、Gemini-1.5 Pro超 |
| ChartQA | GPT-4o、Gemini-1.5 Pro超 |
| MM-MT-Bench | Claude-3.5 Sonnet、GPT-4o、Gemini-1.5 Pro超 |

### HuggingFace
- mistralai/Pixtral-Large-Instruct-2411

### リンク
- **ブログ:** https://mistral.ai/news/pixtral-large

---

## 14. Mistral Saba

### 基本情報
- **リリース日:** 2025年2月
- **開発元:** Mistral AI
- **モデルタイプ:** 地域特化LLM
- **対応地域:** 中東・南アジア

### 主な特徴
- 中東・南アジアのデータセットで特別に学習
- 地域の言語・文化的コンテキストに最適化
- 地域アプリケーション向けに強化された言語サポート

---

## 15. Magistral（推論モデル）

### 基本情報
- **リリース日:** 2025年6月10日
- **開発元:** Mistral AI
- **ライセンス:** Magistral Small: Apache 2.0、Magistral Medium: 商用ライセンス
- **モデルタイプ:** 推論モデル（Chain-of-Thought）
- **説明:** Mistral AI初のAI推論モデル

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Magistral Small | 240億（Mistral Small 3ベース） |
| Magistral Medium | 非公開 |

### 主な特徴
- 透明で多段階の論理的推論
- 多言語対応
- エンタープライズ向け高忠実度推論
- OpenAI o1のような推論能力を目指す

---

## 16. Voxtral（音声モデル）

### 基本情報
- **リリース日:** 2025年7月
- **開発元:** Mistral AI
- **モデルタイプ:** 音声入力モデル

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Voxtral Mini | 不明 |
| Voxtral Small | 240億 |

### 主な特徴
- **Voxtral Small:** Mistral Small 3に最先端の音声入力機能を追加
- 音声文字起こし、翻訳、音声理解に優れる
- テキスト性能を維持しつつ音声機能を統合

---

## 17. Devstral（開発者向けモデル）

### 基本情報
- **リリース日:** Devstral Small: 2025年5月、Devstral 2: 2025年12月10日
- **開発元:** Mistral AI
- **モデルタイプ:** コーディング・開発特化モデル

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Devstral Small | 不明 |
| Devstral Small 2 | 240億 |
| Devstral Medium | 不明 |

### 主な特徴
- AI支援ソフトウェア開発に最適化
- Devstral Small 2: Qwen 3 Coder Flash（30B）を上回る性能
- Mistral Vibe CLIツールと統合

---

## 18. Mistral Large 3 / Ministral 3

### 基本情報
- **リリース日:** 2025年12月2日
- **開発元:** Mistral AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** マルチモーダルMoEモデル
- **コンテキスト長:** 256,000トークン

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| Mistral Large 3 | 6750億 | 410億 |
| Ministral 3 14B | 140億 | 140億 |
| Ministral 3 8B | 80億 | 80億 |
| Ministral 3 3B | 30億 | 30億 |

### アーキテクチャ詳細
- **Granular MoE:** Mixtralシリーズからの大幅進化
- **ビジョンエンコーダー:** 25億パラメータ
- 3000台のNVIDIA H200 GPUでスクラッチから学習
- マルチモーダル＋多言語能力を単一モデルで実現
- Ministral 3: Base、Instruct、Reasoningバリアント

### ベンチマーク（Large 3）
| ベンチマーク | スコア |
|------------|--------|
| LMArena Non-Reasoning | トップクラス |
| GPT-4o、Gemini 2に匹敵 |
| 多言語・マルチモーダルで最高水準のオープンモデル |

### ベンチマーク（Ministral 3 14B Reasoning）
| ベンチマーク | スコア |
|------------|--------|
| AIME '25 | 85% |

### HuggingFace
- mistralai/Mistral-Large-3-675B-Base-2512
- mistralai/Mistral-Large-3-675B-Instruct-2512
- mistralai/Ministral-3-14B-Instruct-2512
- mistralai/Ministral-3-8B-Instruct-2512
- mistralai/Ministral-3-3B-Instruct-2512

### リンク
- **ブログ:** https://mistral.ai/news/mistral-3

---

## 特殊モデル・サービス

### Mistral Embed
- **用途:** テキスト埋め込み生成
- **対応言語:** 英語
- **説明:** セマンティック検索、RAG、コンテンツ整理向け

### Codestral Embed
- **リリース日:** 2025年5月
- **用途:** コード埋め込み生成
- **説明:** コードデータベース、リポジトリの埋め込みに最適化

### Mistral Moderation
- **用途:** コンテンツ安全性
- **説明:** 有害テキストの検出・管理、多言語対応

### Mistral OCR
- **リリース日:** 2025年3月（OCR 2: 2025年5月）
- **用途:** 文書からのテキスト・画像抽出
- **説明:** Document AIスタックの基盤

---

## VRAM要件（概算）

### BF16/FP16フル精度
| モデルサイズ | 必要VRAM |
|------------|----------|
| 7B（Mistral 7B、Mathstral等） | 約17 GB |
| 12B（Mistral NeMo、Pixtral 12B） | 約28 GB |
| 22B（Codestral） | 約50 GB |
| 24B（Mistral Small 3） | 約55 GB |
| 47B MoE（Mixtral 8x7B） | 約100 GB |
| 123B（Mistral Large 2） | 約250 GB |
| 141B MoE（Mixtral 8x22B） | 約300 GB |
| 675B MoE（Mistral Large 3） | 約1.4 TB |

### 量子化・最適化
- **FP8:** Mistral NeMo、Large 3でネイティブ対応
- **NVFP4:** Large 3で8×A100/H100ノードで実行可能
- **INT8/INT4:** 約50%/75%のVRAM削減

---

## プロンプトテンプレート

### Mistral Instruct形式
```
<s>[INST] {ユーザーメッセージ} [/INST] {アシスタント応答}</s>[INST] {フォローアップ} [/INST]
```

### Pixtral Large / Mistral Large 2.1形式
```
<s>[SYSTEM_PROMPT] {システムプロンプト}[/SYSTEM_PROMPT][INST] {ユーザーメッセージ}[/INST] {アシスタント応答}</s>[INST] {フォローアップ}[/INST]
```

### Codestral FIM形式
```
[PREFIX]{接頭辞}[SUFFIX]{接尾辞}[MIDDLE]{中間コード}
```

---

## ファミリーツリー

```
Mistral 7B (2023-09)
├── 進化 → Mistral 7B v0.2/v0.3
├── 派生 → Mathstral 7B (2024-07)
└── 派生 → Mistral NeMo 12B (2024-07, NVIDIAと共同)
    └── 派生 → Pixtral 12B (2024-09)

Mixtral 8x7B (2023-12)
└── 進化 → Mixtral 8x22B (2024-04)

Mistral Large (2024-02)
├── 進化 → Mistral Large 2 (2024-07)
│   ├── 派生 → Pixtral Large (2024-11)
│   └── 進化 → Mistral Large 2.1 (2024-11)
└── 進化 → Mistral Large 3 (2025-12) [MoEに回帰]

Mistral Small (2024-02)
├── 進化 → Mistral Small 2 (2024-09)
└── 進化 → Mistral Small 3 (2025-01)
    ├── 進化 → Mistral Small 3.1 (2025-03) [ビジョン追加]
    ├── 進化 → Mistral Small 3.2 (2025-06)
    ├── 派生 → Magistral Small (2025-06) [推論]
    └── 派生 → Voxtral Small (2025-07) [音声]

Mistral Medium 3 (2025-05)
├── 派生 → Magistral Medium (2025-06) [推論]
└── 進化 → Mistral Medium 3.1 (2025-08)

Codestral (2024-05)
├── 進化 → Codestral 25.01 (2025-01)
└── 進化 → Codestral 25.08 (2025-08)

Codestral Mamba (2024-07) [Mamba 2アーキテクチャ]

Ministral 3B/8B (2024-10)
└── 進化 → Ministral 3 3B/8B/14B (2025-12) [ビジョン対応]

Devstral Small (2025-05)
├── 進化 → Devstral Small 1.1 (2025-07)
└── 進化 → Devstral Small 2 (2025-12)
```

---

## API料金（2025年時点）

| モデル | 入力（100万トークン） | 出力（100万トークン） |
|-------|---------------------|---------------------|
| Ministral 3B | $0.04 | $0.04 |
| Ministral 8B | $0.10 | $0.10 |
| Mistral Small | $0.10 | $0.30 |
| Codestral | $0.30 | $0.90 |
| Mistral Large 2 | $2.00 | $6.00 |
| Pixtral Large | $2.00 | $6.00 |

---

## 主要な技術革新まとめ

| 革新技術 | 初導入モデル | 説明 |
|---------|------------|------|
| Sliding Window Attention | Mistral 7B (2023-09) | 効率的な長文処理 |
| Sparse MoE | Mixtral 8x7B (2023-12) | 効率的なパラメータ活用 |
| Mamba Architecture | Codestral Mamba (2024-07) | 線形時間推論、無限長シーケンス |
| Variable Image Size | Pixtral 12B (2024-09) | 可変解像度画像処理 |
| Interleaved SWA | Ministral 8B (2024-10) | エッジ向け効率化 |
| Granular MoE | Mistral Large 3 (2025-12) | 細粒度エキスパートルーティング |
| Reasoning Models | Magistral (2025-06) | Chain-of-Thought推論 |
| Audio Integration | Voxtral (2025-07) | テキスト＋音声統合 |

---

## プラットフォーム・サービス

### Le Chat
- Mistral AIのチャットボットサービス（ChatGPT相当）
- 2024年2月26日ベータ開始
- 2025年2月6日iOS/Androidアプリリリース
- Pro tier: $14.99/月（高度なモデル、無制限メッセージ、ウェブ検索）
- Flux Proによる画像生成機能

### La Plateforme
- 開発・デプロイAPI提供プラットフォーム
- ファインチューニング、評価、プロトタイピング機能
- Agents API（2025年5月）: エージェントワークフロー構築

### クラウドパートナー
- Microsoft Azure
- Google Cloud Platform（Vertex AI）
- Amazon Bedrock
- IBM WatsonX

---

## 参考文献・リンク

- Mistral 7B: https://mistral.ai/news/announcing-mistral-7b/
- Mixtral 8x7B: https://mistral.ai/news/mixtral-of-experts
- Mixtral 8x22B: https://mistral.ai/news/mixtral-8x22b
- Mistral Large 2: https://mistral.ai/news/mistral-large-2407
- Codestral: https://mistral.ai/news/codestral
- Codestral Mamba: https://mistral.ai/news/codestral-mamba
- Mathstral: https://mistral.ai/news/mathstral
- Mistral NeMo: https://mistral.ai/news/mistral-nemo
- Pixtral 12B: https://mistral.ai/news/pixtral-12b
- Pixtral Large: https://mistral.ai/news/pixtral-large
- Mistral Small 3.1: https://mistral.ai/news/mistral-small-3-1
- Mistral 3: https://mistral.ai/news/mistral-3

**論文:**
- Mixtral of Experts: https://arxiv.org/abs/2401.04088

**GitHub組織:** https://github.com/mistralai  
**HuggingFace組織:** https://huggingface.co/mistralai  
**ウェブサイト:** https://mistral.ai  
**Le Chat:** https://chat.mistral.ai  
**La Plateforme:** https://console.mistral.ai  
**ドキュメント:** https://docs.mistral.ai
