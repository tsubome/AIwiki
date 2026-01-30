# Microsoft Phi モデルファミリー完全カタログ

## 概要

Phiは、Microsoft Researchが開発した小型言語モデル（Small Language Models, SLMs）のファミリーである。「Textbooks Are All You Need」というコンセプトのもと、高品質な合成データと教科書品質のデータを使用して学習することで、パラメータ数の数倍大きなモデルに匹敵する性能を実現した。デバイス上での実行、低レイテンシ推論、プライバシー優先のアプリケーションに最適化されている。

**開発元:** Microsoft Research  
**ライセンス:** MIT License（オープンソース）  
**主な特徴:** 高品質合成データによる効率的な学習、オンデバイス実行可能、推論特化

---

## 1. Phi-1

### 基本情報
- **リリース日:** 2023年6月
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer（コード特化）
- **論文:** "Textbooks Are All You Need"

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Phi-1 | 13億 |

### アーキテクチャ詳細
- Dense decoder-only Transformer
- 24層、hidden size 2048
- Pythonコード生成に特化
- 8台のA100 GPUで4日間学習

### 学習データ
- **総トークン数:** 70億
- Webから抽出した「教科書品質」のコードデータ（60億トークン）
- GPT-3.5で生成した合成教科書・演習問題（10億トークン）

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| HumanEval | 50.6% |
| MBPP | 55.5% |

### 特徴
- 小型ながらPythonコード生成で当時の最高水準
- 高品質データキュレーションの重要性を実証

### リンク
- **論文:** https://arxiv.org/abs/2306.11644

---

## 2. Phi-1.5

### 基本情報
- **リリース日:** 2023年9月
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer（汎用）
- **論文:** "Textbooks Are All You Need II"

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Phi-1.5 | 13億 |

### アーキテクチャ詳細
- Phi-1と同じアーキテクチャ
- CodeGenTokenizerを使用
- 語彙サイズ: 51,200

### 学習データ
- Phi-1と同じデータソース
- 新たにNLP合成テキストを追加
- 常識推論、言語理解に焦点

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| WinoGrande | 74.7% |
| ARC-Easy | 76.0% |
| ARC-Challenge | 52.0% |
| HellaSwag | 63.5% |
| PIQA | 78.0% |

### 特徴
- 13Bパラメータでありながら、5倍大きなモデルに匹敵
- LLaMA 2 7Bを多くのベンチマークで上回る
- 毒性・バイアスの低減を重視したデータキュレーション

### HuggingFace
- microsoft/phi-1_5

### リンク
- **論文:** https://arxiv.org/abs/2309.05463

---

## 3. Phi-2

### 基本情報
- **リリース日:** 2023年12月12日（Microsoft Ignite 2023で発表）
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer（汎用）

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Phi-2 | 27億 |

### アーキテクチャ詳細
- Dense decoder-only Transformer
- 32層、hidden size 2560
- next-word predictionを学習目標

### 学習データ
- **総トークン数:** 1.4兆
- Phi-1.5と同じデータソース
- 追加のNLP合成テキスト
- フィルタリングされたWebデータ（Falcon RefinedWeb、SlimPajama）
- GPT-4による品質評価

### 学習環境
- 96台のA100 GPUで2週間学習

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMLU（5-shot） | 56.7% |
| HellaSwag | 73.1% |
| ARC-Challenge | 61.1% |
| WinoGrande | 74.4% |
| HumanEval | 47.6% |
| MBPP（3-shot） | 55.0% |
| GSM8K（8-shot） | 57.2% |
| BBH（3-shot CoT） | 59.3% |

### 特徴
- 2.7Bパラメータで、Mistral 7B、LLaMA 2 13Bを多くのベンチマークで上回る
- LLaMA-2-70Bを多段階推論タスクで上回る
- 知識転移技術によりPhi-1.5の知識を継承

### HuggingFace
- microsoft/phi-2

### リンク
- **ブログ:** https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/

---

## 4. Phi-3シリーズ

### 基本情報
- **リリース日:** 2024年4月23日（Microsoft Build 2024）
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer（初の商用対応SLM）
- **論文:** "Phi-3 Technical Report: A Highly Capable Language Model Locally on Your Phone"

### パラメータサイズ
| モデル | パラメータ数 | コンテキスト長 |
|-------|------------|--------------|
| Phi-3-mini | 38億 | 4K / 128K |
| Phi-3-small | 70億 | 8K / 128K |
| Phi-3-medium | 140億 | 4K / 128K |
| Phi-3-vision | 42億 | 128K |

### アーキテクチャ詳細
- Dense decoder-only Transformer
- Supervised Fine-Tuning（SFT）
- Direct Preference Optimization（DPO）
- RLHF（Reinforcement Learning from Human Feedback）

### 学習データ
- **総トークン数:** 3.3兆（mini）、4.8兆（small/medium）
- 厳選された公開ドキュメント
- 高品質教育データ
- 合成データ

### ベンチマーク（Phi-3-mini）
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 69% |
| MT-Bench | 8.38 |
| HellaSwag | 77.4% |
| ARC-Challenge | 85.7% |
| GPQA | 29.2% |
| HumanEval | 58.5% |

### ベンチマーク（Phi-3-medium）
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 78% |
| MT-Bench | 8.9 |
| Gemini 1.0 Proを上回る |

### 主な特徴
- スマートフォン上で実行可能な初の高性能SLM
- Phi-3-mini: Mixtral 8x7B、GPT-3.5に匹敵
- Phi-3-small: GPT-3.5Tを上回る
- Phi-3-medium: Gemini 1.0 Proを上回る
- Phi-3-vision: マルチモーダル対応、Claude-3 Haikuを上回る

### HuggingFace
- microsoft/Phi-3-mini-4k-instruct
- microsoft/Phi-3-mini-128k-instruct
- microsoft/Phi-3-small-8k-instruct
- microsoft/Phi-3-small-128k-instruct
- microsoft/Phi-3-medium-4k-instruct
- microsoft/Phi-3-medium-128k-instruct
- microsoft/Phi-3-vision-128k-instruct

### リンク
- **論文:** https://arxiv.org/abs/2404.14219
- **ブログ:** https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-slms/

---

## 5. Phi-3.5シリーズ

### 基本情報
- **リリース日:** 2024年8月20日
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer / MoE / マルチモーダル

### パラメータサイズ
| モデル | パラメータ数 | 活性化パラメータ | コンテキスト長 |
|-------|------------|----------------|--------------|
| Phi-3.5-mini-instruct | 38.2億 | 38.2億 | 128K |
| Phi-3.5-MoE-instruct | 419億 | 66億 | 128K |
| Phi-3.5-vision-instruct | 41.5億 | 41.5億 | 128K |

### アーキテクチャ詳細
- **Phi-3.5-mini:** Phi-3-miniの改良版、多言語対応強化
- **Phi-3.5-MoE:** 16エキスパート構成のMixture-of-Experts
- **Phi-3.5-vision:** マルチモーダル（テキスト＋画像）

### 学習データ
- **総トークン数:** 3.4兆
- 学習期間: 10日間（512 H100 GPU）
- データカットオフ: 2023年10月

### 対応言語（テキスト）
アラビア語、中国語、チェコ語、デンマーク語、オランダ語、英語、フィンランド語、フランス語、ドイツ語、ヘブライ語、ハンガリー語、イタリア語、日本語、韓国語、ノルウェー語、ポーランド語、ポルトガル語、ロシア語、スペイン語、スウェーデン語、タイ語、トルコ語、ウクライナ語

### ベンチマーク（Phi-3.5-MoE）
| ベンチマーク | スコア |
|------------|--------|
| Llama 3.1 8B、Mixtralシリーズを上回る |
| Gemini-1.5-Flash、GPT-4o-miniに匹敵 |

### 主な特徴
- **mini:** 多言語サポートの大幅強化
- **MoE:** 66億活性化パラメータで高効率推論
- **vision:** 画像理解、OCR、チャート・表解析

### HuggingFace
- microsoft/Phi-3.5-mini-instruct
- microsoft/Phi-3.5-MoE-instruct
- microsoft/Phi-3.5-vision-instruct

### リンク
- **ブログ:** https://azure.microsoft.com/en-us/blog/new-models-added-to-the-phi-3-family-available-on-microsoft-azure/

---

## 6. Phi-4

### 基本情報
- **リリース日:** 2024年12月12日
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer（推論特化）
- **論文:** "Phi-4 Technical Report"

### パラメータサイズ
| モデル | パラメータ数 | コンテキスト長 |
|-------|------------|--------------|
| Phi-4 | 140億 | 16K |

### アーキテクチャ詳細
- Dense decoder-only Transformer
- Supervised Fine-Tuning（SFT）
- iterative Direct Preference Optimization（DPO）
- 複雑な数学的推論に特化

### 学習データ
- **総トークン数:** 9.8兆
- 3週間の学習
- 高品質合成データセット（GPT-4oで生成）
- フィルタリングされた公開ドメインWebサイト
- 学術書籍、Q&Aデータセット
- データカットオフ: 2024年6月

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 84.8% |
| GPQA | 56.1% |
| MATH | 80.4% |
| HumanEval | 82.6% |
| AMC-10 | 高性能（GPT-4o超） |
| AMC-12 | 高性能（GPT-4o超） |

### 特徴
- 14Bパラメータで5倍大きなモデルを数学・推論で上回る
- Gemini Pro 1.5を数学競技問題で上回る
- GPT-4oを一部の推論タスクで上回る
- 2〜4倍高速な推論、メモリ効率
- 単一GPUまたはNPU搭載ラップトップで実行可能

### HuggingFace
- microsoft/phi-4

### リンク
- **論文:** https://arxiv.org/abs/2412.08905
- **ブログ:** https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-phi-4-microsoft%E2%80%99s-newest-small-language-model-specializing-in-comple/4357090

---

## 7. Phi-4-miniシリーズ

### 基本情報
- **リリース日:** 2025年2月26日
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** Dense Transformer
- **論文:** "Phi-4-Mini Technical Report"

### パラメータサイズ
| モデル | パラメータ数 | コンテキスト長 |
|-------|------------|--------------|
| Phi-4-mini-instruct | 38億 | 128K |

### アーキテクチャ詳細
- 32層Transformer
- hidden size: 3,072
- Grouped-Query Attention（GQA）: 24クエリヘッド、8 KVヘッド
- 語彙サイズ: 200,000（多言語対応強化）
- 共有入出力埋め込み（メモリ効率化）
- RoPE（25%がposition-agnostic）

### Phi-3.5-miniからの改善点
- 語彙サイズ: 32K → 200K
- Grouped-Query Attention追加
- 関数呼び出し（Function Calling）対応
- 多言語サポート強化

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| Llama 3.1 8B、Ministral-2410 8Bを上回る |
| 2倍サイズのモデルに匹敵する数学・コーディング性能 |

### 主な特徴
- 関数呼び出し機能（待望の新機能）
- 指示追従の大幅改善
- 長文コンテキスト理解
- 強力な推論能力

### HuggingFace
- microsoft/Phi-4-mini-instruct

### リンク
- **論文:** https://arxiv.org/abs/2503.01743

---

## 8. Phi-4-multimodal

### 基本情報
- **リリース日:** 2025年2月26日
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** マルチモーダル（テキスト＋画像＋音声）
- **論文:** "Phi-4-Mini Technical Report: Compact yet Powerful Multimodal Language Models via Mixture-of-LoRAs"

### パラメータサイズ
| モデル | パラメータ数 | コンテキスト長 |
|-------|------------|--------------|
| Phi-4-multimodal-instruct | 56億 | 128K |

### アーキテクチャ詳細
- **バックボーン:** Phi-4-mini-instruct（38億パラメータ）
- **ビジョンエンコーダー:** SigLIP-400Mベース（4.4億パラメータ）
- **ビジョンLoRAアダプター:** 3.7億パラメータ
- **スピーチエンコーダー:** Conformerベース
- **スピーチLoRAアダプター:** 4.6億パラメータ
- **Mixture-of-LoRAs設計:** モダリティ干渉なしに複数推論モードを実現

### 学習データ・環境
- **テキストトークン:** 5兆
- **音声データ:** 230万時間
- **画像テキストトークン:** 1.1兆
- **GPU:** 512 A100-80G
- **学習期間:** 28日間

### 対応言語
- **テキスト:** 20以上の言語（日本語含む）
- **ビジョン:** 英語
- **オーディオ:** 英語、中国語、ドイツ語、フランス語、イタリア語、日本語、スペイン語、ポルトガル語

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| OpenASR Leaderboard | 1位（WER 6.14%） |
| WhisperV3を上回るASR性能 |
| SeamlessM4T-v2-Largeを上回る音声翻訳 |
| GPT-4oに近い音声要約性能 |

### 主な特徴
- **初のオープンソース音声要約モデル**
- テキスト、画像、音声を同時処理可能
- Mixture-of-LoRAsによる効率的なマルチモーダル統合
- オンデバイス・エッジデバイスで実行可能
- 低レイテンシ推論（0.34秒で最初のトークン、26トークン/秒）

### HuggingFace
- microsoft/Phi-4-multimodal-instruct

### リンク
- **論文:** https://arxiv.org/abs/2503.01743

---

## 9. Phi-4-reasoning / Phi-4-reasoning-plus

### 基本情報
- **リリース日:** 2025年4月30日（Azure AI Foundry）、2025年5月1日（HuggingFace）
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** 推論特化モデル（Chain-of-Thought）
- **論文:** "Phi-4-reasoning Technical Report"

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Phi-4-reasoning | 140億 |
| Phi-4-reasoning-plus | 140億 |

### アーキテクチャ詳細
- Phi-4をベースにSFT（Supervised Fine-Tuning）
- **Phi-4-reasoning-plus:** 強化学習（RL）による追加最適化
- o3-miniの推論デモンストレーションで学習
- 詳細な推論チェーン生成

### ベンチマーク
| ベンチマーク | Phi-4-reasoning | Phi-4-reasoning-plus |
|------------|-----------------|---------------------|
| AIME 2025 | DeepSeek-R1（671B）に匹敵 | DeepSeek-R1超 |
| Math-500 | 高性能 | 高性能 |
| GPQA-Diamond | 高性能 | 高性能 |

### 比較性能
- o1-miniを大半のベンチマークで上回る
- DeepSeek-R1-Distill-Llama-70Bを上回る
- Claude 3.7 Sonnet、Gemini 2 Flash Thinkingを上回る（GPQAとカレンダー計画を除く）
- AIME 2025でDeepSeek-R1（671B）と同等

### 主な特徴
- 14Bパラメータで671Bモデルに匹敵する推論性能
- 並列テスト時間スケーリングで教師モデル（o3-mini）を超える
- 長い推論トレースによる高精度な複雑問題解決

### HuggingFace
- microsoft/Phi-4-reasoning
- microsoft/Phi-4-reasoning-plus

### リンク
- **論文:** https://arxiv.org/abs/2504.21318
- **ブログ:** https://www.microsoft.com/en-us/research/articles/phi-reasoning-once-again-redefining-what-is-possible-with-small-and-efficient-ai/

---

## 10. Phi-4-mini-reasoning / Phi-4-mini-flash-reasoning

### 基本情報
- **リリース日:** 2025年5月（mini-reasoning）、2025年7月（mini-flash-reasoning）
- **開発元:** Microsoft Research
- **ライセンス:** MIT License
- **モデルタイプ:** 軽量推論モデル

### パラメータサイズ
| モデル | パラメータ数 | コンテキスト長 |
|-------|------------|--------------|
| Phi-4-mini-reasoning | 38億 | 128K |
| Phi-4-mini-flash-reasoning | 38億 | 64K |

### アーキテクチャ詳細（mini-flash-reasoning）
- **Hybrid SambaY:** Transformerベース＋State-space modules
- Differential Attention
- 語彙サイズ: 200,064
- Grouped-Query Attention
- Gated memory sharing
- Shared KV cache with one global-attention layer

### ベンチマーク（mini-flash-reasoning）
| ベンチマーク | スコア |
|------------|--------|
| AIME 2024 | 52.29% |
| AIME 2025 | 33.59% |
| Math-500 | 92.45% |
| GPQA-Diamond | 45.08% |

### 主な特徴
- **mini-flash-reasoning:**
  - 2〜3倍低いレイテンシ
  - 最大10倍高いスループット（vs mini-reasoning）
  - 単一A100-80GBで効率的に実行
  - DeepSeek-R1-Distill-Qwen-7B、DeepSeek-R1-Distill-Llama-8Bに匹敵

### HuggingFace
- microsoft/Phi-4-mini-reasoning
- microsoft/Phi-4-mini-flash-reasoning

---

## VRAM要件（概算）

### BF16/FP16フル精度
| モデルサイズ | 必要VRAM |
|------------|----------|
| 1.3B（Phi-1/1.5） | 約3 GB |
| 2.7B（Phi-2） | 約6 GB |
| 3.8B（Phi-3-mini、Phi-4-mini） | 約8 GB |
| 5.6B（Phi-4-multimodal） | 約12 GB |
| 7B（Phi-3-small） | 約15 GB |
| 14B（Phi-3-medium、Phi-4） | 約30 GB |
| 42B MoE（Phi-3.5-MoE） | 約85 GB（6.6B活性化） |

### 量子化・最適化
- **INT4:** 約75%のVRAM削減
- **ONNX Runtime:** クロスプラットフォーム最適化
- **DirectML:** Windows GPU（AMD、Intel、NVIDIA）対応
- **NPU対応:** Snapdragon Copilot+ PC等

---

## プロンプトテンプレート

### Phi-3 / Phi-4形式
```
<|system|>
You are a helpful assistant.<|end|>
<|user|>
{ユーザーメッセージ}<|end|>
<|assistant|>
{アシスタント応答}<|end|>
```

### Phi-2形式（QA）
```
Instruct: {質問}
Output: {回答}
```

### Phi-4-multimodal（画像入力）
```
<|image_1|>
{画像の説明や質問}
```

### Phi-4-multimodal（音声入力）
```
<|audio_1|>
{音声に関する指示}
```

---

## ファミリーツリー

```
Phi-1 (2023-06) [1.3B, コード特化]
└── 進化 → Phi-1.5 (2023-09) [1.3B, 汎用拡張]
    └── 進化 → Phi-2 (2023-12) [2.7B, 知識転移]

Phi-3 (2024-04) [初の商用対応]
├── Phi-3-mini [3.8B, 4K/128K]
├── Phi-3-small [7B]
├── Phi-3-medium [14B]
└── Phi-3-vision [4.2B, マルチモーダル]

Phi-3.5 (2024-08) [多言語・MoE]
├── Phi-3.5-mini-instruct [3.8B, 多言語強化]
├── Phi-3.5-MoE-instruct [42B/6.6B活性化]
└── Phi-3.5-vision-instruct [4.2B]

Phi-4 (2024-12) [推論特化]
├── Phi-4 [14B, 数学・推論]
├── 派生 → Phi-4-reasoning (2025-04) [14B, o3-mini蒸留]
│   └── Phi-4-reasoning-plus [14B, RL強化]
├── Phi-4-mini-instruct (2025-02) [3.8B, 関数呼び出し]
│   ├── 派生 → Phi-4-mini-reasoning [3.8B]
│   └── 派生 → Phi-4-mini-flash-reasoning (2025-07) [3.8B, Hybrid SambaY]
└── Phi-4-multimodal-instruct (2025-02) [5.6B, テキスト+画像+音声]
```

---

## 主要な技術革新まとめ

| 革新技術 | 初導入モデル | 説明 |
|---------|------------|------|
| Textbook-quality Data | Phi-1 (2023-06) | 高品質合成データによる効率学習 |
| Knowledge Transfer | Phi-2 (2023-12) | 小モデルから大モデルへの知識継承 |
| SFT + DPO | Phi-3 (2024-04) | 安全性・指示追従の強化 |
| 128K Context | Phi-3-mini (2024-04) | 長文コンテキスト対応 |
| Mixture-of-Experts | Phi-3.5-MoE (2024-08) | 効率的な大規模モデル |
| Vision Encoder | Phi-3-vision (2024-05) | マルチモーダル画像理解 |
| Math Reasoning Focus | Phi-4 (2024-12) | 数学競技問題での高性能 |
| Function Calling | Phi-4-mini (2025-02) | ツール統合・API呼び出し |
| Mixture-of-LoRAs | Phi-4-multimodal (2025-02) | マルチモーダル効率統合 |
| o3-mini Distillation | Phi-4-reasoning (2025-04) | 推論能力の蒸留 |
| Hybrid SambaY | Phi-4-mini-flash (2025-07) | State-space＋Transformer |

---

## プラットフォーム・サービス

### 利用可能プラットフォーム
- **Azure AI Foundry（旧Azure AI Studio）**
- **HuggingFace**
- **Ollama**
- **NVIDIA NIM**
- **GitHub Models**
- **ONNX Runtime**（クロスプラットフォーム）

### 対応ハードウェア
- **NVIDIA GPU:** A100、H100、RTX シリーズ
- **Intel:** Xeon、Core Ultra、Arc GPU、Gaudi
- **Qualcomm:** Snapdragon Copilot+ PC（NPU）
- **AMD:** DirectML対応GPU
- **Apple:** Metal対応（ONNX Runtime経由）

### 最適化オプション
- ONNX Runtime（CPU/GPU/NPU）
- TensorRT-LLM（NVIDIA）
- OpenVINO（Intel）
- DirectML（Windows）

---

## 参考文献・リンク

**論文:**
- Phi-1: "Textbooks Are All You Need" https://arxiv.org/abs/2306.11644
- Phi-1.5: "Textbooks Are All You Need II" https://arxiv.org/abs/2309.05463
- Phi-3: https://arxiv.org/abs/2404.14219
- Phi-4: https://arxiv.org/abs/2412.08905
- Phi-4-mini/multimodal: https://arxiv.org/abs/2503.01743
- Phi-4-reasoning: https://arxiv.org/abs/2504.21318

**公式リソース:**
- Azure Phi製品ページ: https://azure.microsoft.com/en-us/products/phi
- Phi Cookbook: https://github.com/microsoft/PhiCookBook
- HuggingFace組織: https://huggingface.co/microsoft
- Microsoft Research: https://www.microsoft.com/en-us/research/

**モデルカード:**
- Phi-4: https://huggingface.co/microsoft/phi-4
- Phi-4-mini: https://huggingface.co/microsoft/Phi-4-mini-instruct
- Phi-4-multimodal: https://huggingface.co/microsoft/Phi-4-multimodal-instruct
- Phi-3.5-mini: https://huggingface.co/microsoft/Phi-3.5-mini-instruct
