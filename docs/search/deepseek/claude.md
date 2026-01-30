# DeepSeek モデルファミリー完全カタログ

## 概要

DeepSeekは2023年7月に梁文鋒（Liang Wenfeng）によって設立された中国のAI企業で、杭州に本社を置く。ヘッジファンドHigh-Flyerが所有・出資している。DeepSeekはMixture-of-Experts（MoE）アーキテクチャ、Multi-head Latent Attention（MLA）、効率的な学習技術において革新を先導し、大幅に低いコストで主要なプロプライエタリモデルに匹敵する性能を達成している。

**開発元:** DeepSeek AI（杭州深度求索人工智能基础技术研究有限公司）  
**設立:** 2023年7月  
**本社:** 中国浙江省杭州市

---

## 1. DeepSeek-LLM（初代）

### 基本情報
- **リリース日:** 2023年11月29日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License（商用利用可）
- **モデルタイプ:** Dense Transformer LLM
- **コンテキスト長:** 4,096トークン
- **学習トークン数:** 2兆トークン（英語＋中国語）
- **対応言語:** 英語、中国語
- **語彙サイズ:** 102,400（byte-level BPE）

### パラメータサイズ
| モデル | パラメータ数 | アーキテクチャ | アテンション |
|-------|------------|--------------|-------------|
| DeepSeek-LLM-7B | 70億 | LLaMA型 | MHA |
| DeepSeek-LLM-67B | 670億 | LLaMA型 | GQA |

### アーキテクチャ詳細
- 自己回帰Transformerデコーダー（LLaMAアーキテクチャ）
- 7B: Multi-Head Attention（MHA）
- 67B: Grouped-Query Attention（GQA）
- Rotary Position Embedding（RoPE）
- RMSNormによる事前正規化

### ベンチマーク（67B-Base）
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 71.9% |
| HumanEval | 73.78%（Chat） |
| GSM8K（0-shot） | 84.1%（Chat） |
| MATH（0-shot） | 32.6%（Chat） |

### HuggingFace
- deepseek-ai/deepseek-llm-7b-base
- deepseek-ai/deepseek-llm-7b-chat
- deepseek-ai/deepseek-llm-67b-base
- deepseek-ai/deepseek-llm-67b-chat

### リンク
- **論文:** https://arxiv.org/abs/2401.02954
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-LLM

---

## 2. DeepSeek-Coder（V1）

### 基本情報
- **リリース日:** 2023年11月2日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** コード特化LLM
- **コンテキスト長:** 16,384トークン
- **学習トークン数:** 2兆トークン（87%コード、13%自然言語）
- **対応言語:** 87プログラミング言語

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| DeepSeek-Coder-1.3B | 13億 |
| DeepSeek-Coder-5.7B | 57億 |
| DeepSeek-Coder-6.7B | 67億 |
| DeepSeek-Coder-33B | 330億 |

### アーキテクチャ詳細
- LLaMA型デコーダーオンリーTransformer
- Fill-in-the-Middle（FIM）学習
- リポジトリレベルのコード理解
- 87プログラミング言語対応

### ベンチマーク（33B）
| ベンチマーク | スコア |
|------------|--------|
| HumanEval | 56.1%（Base）、78.7%（Instruct） |
| MBPP | 70.1%（Base） |

### リンク
- **論文:** https://arxiv.org/abs/2401.14196
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-Coder

---

## 3. DeepSeekMoE

### 基本情報
- **リリース日:** 2024年1月11日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** スパースMixture-of-Experts
- **コンテキスト長:** 4,096トークン
- **革新点:** 細粒度エキスパート分割、共有エキスパート分離

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| DeepSeekMoE-16B | 160億 | 27億 |

### アーキテクチャ詳細
- **細粒度エキスパート分割:** より小さく特化したエキスパート
- **共有エキスパート分離:** 常時活性化の共有エキスパート＋ルーティングエキスパート
- エキスパート間の知識冗長性を削減
- 27億の活性化パラメータで70億Denseモデルに匹敵

### リンク
- **論文:** https://arxiv.org/abs/2401.06066
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-MoE

---

## 4. DeepSeek-Math

### 基本情報
- **リリース日:** 2024年2月6日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** 数学特化LLM
- **コンテキスト長:** 4,096トークン
- **学習:** DeepSeek-Coder-v1.5 7Bから初期化、追加5000億トークン
- **対応言語:** 英語、中国語

### パラメータサイズ
| モデル | パラメータ数 | 学習方法 |
|-------|------------|---------|
| DeepSeekMath-7B-Base | 70億 | 事前学習 |
| DeepSeekMath-7B-Instruct | 70億 | SFT |
| DeepSeekMath-7B-RL | 70億 | GRPO強化学習 |

### アーキテクチャ詳細
- DeepSeek-Coder-v1.5 7Bベース
- **Group Relative Policy Optimization（GRPO）:** 新しいRL手法
- Process Reward Model（PRM）によるRL学習
- ツール使用による数学問題解決能力

### ベンチマーク（RL）
| ベンチマーク | スコア |
|------------|--------|
| MATH（0-shot） | 51.7%（Base）、約60%（RLツール使用時） |
| 競技数学 | Gemini-Ultra/GPT-4に迫る |

### リンク
- **論文:** https://arxiv.org/abs/2402.03300
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-Math

---

## 5. DeepSeek-VL

### 基本情報
- **リリース日:** 2024年3月11日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** Vision-Languageモデル
- **画像対応:** 最大1024×1024ピクセル
- **対応言語:** 英語、中国語

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| DeepSeek-VL-1.3B | 13億 |
| DeepSeek-VL-7B | 70億 |

### リンク
- **論文:** https://arxiv.org/abs/2403.05525
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-VL

---

## 6. DeepSeek-V2

### 基本情報
- **リリース日:** 2024年5月6日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License（商用利用可）
- **モデルタイプ:** MoE言語モデル
- **コンテキスト長:** 128,000トークン
- **学習トークン数:** 8.1兆トークン
- **対応言語:** 英語、中国語（中国語が12%多い）

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| DeepSeek-V2-Lite | 160億 | 24億 |
| DeepSeek-V2 | 2360億 | 210億 |

### アーキテクチャ詳細
- **Multi-head Latent Attention（MLA）:** KVキャッシュを93.3%圧縮
- **DeepSeekMoE:** 2共有エキスパート＋160ルーティングエキスパート/層
- トークンあたり6エキスパート活性化
- DeepSeek-67Bと比較して5.76倍の生成スループット
- 学習コスト42.5%削減

### ベンチマーク（236B）
| ベンチマーク | スコア |
|------------|--------|
| MT-Bench | 8.97（Chat-RL） |
| AlpacaEval | 38.9%勝率 |
| AlignBench | 7.91（GPT-4評価） |

### HuggingFace
- deepseek-ai/DeepSeek-V2-Lite
- deepseek-ai/DeepSeek-V2-Lite-Chat
- deepseek-ai/DeepSeek-V2
- deepseek-ai/DeepSeek-V2-Chat

### リンク
- **論文:** https://arxiv.org/abs/2405.04434
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-V2

---

## 7. DeepSeek-Coder-V2

### 基本情報
- **リリース日:** 2024年6月17日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** コードMoEモデル
- **コンテキスト長:** 128,000トークン
- **学習:** 追加6兆トークン（60%コード、10%数学、30%自然言語）
- **対応言語:** 338プログラミング言語

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| DeepSeek-Coder-V2-Lite | 160億 | 24億 |
| DeepSeek-Coder-V2 | 2360億 | 210億 |

### ベンチマーク（236B Instruct）
| ベンチマーク | スコア |
|------------|--------|
| HumanEval | 90.2% |
| MBPP+ | 76.2% |
| MATH | 75.7% |
| AIME 2024 | 5/30（maj@64） |

### リンク
- **論文:** https://arxiv.org/abs/2406.11931
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-Coder-V2

---

## 8. DeepSeek-Prover-V1.5

### 基本情報
- **リリース日:** 2024年8月15日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** 定理証明器（Lean 4）
- **パラメータ数:** 70億

### リンク
- **論文:** https://arxiv.org/abs/2408.08152

---

## 9. DeepSeek-V2.5

### 基本情報
- **リリース日:** 2024年9月6日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** MoE言語モデル
- **説明:** DeepSeek-V2-0628とDeepSeek-Coder-V2-0724の長所を統合

---

## 10. DeepSeek-V3

### 基本情報
- **リリース日:** 2024年12月26日
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** MoE言語モデル
- **コンテキスト長:** 128,000トークン
- **学習トークン数:** 14.8兆トークン
- **学習コスト:** 278.8万H800 GPUh（約600万ドル）
- **対応言語:** 英語、中国語、その他

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| DeepSeek-V3 | 6710億（+140億MTP） | 370億 |

### アーキテクチャ詳細
- **MLA（Multi-head Latent Attention）:** DeepSeek-V2から継承
- **DeepSeekMoE:** 細粒度エキスパート＋共有エキスパート分離
- **補助損失なしロードバランシング:** 革新的な戦略
- **Multi-Token Prediction（MTP）:** 新しい学習目標
- **FP8混合精度学習:** 6710億スケールで初めて検証
- 256ルーティングエキスパート、1共有エキスパート/層
- トークンあたり8エキスパート活性化

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MMLU | 88.5% |
| MMLU-Pro | 75.9% |
| MATH-500 | 90.2% |
| GPQA | 59.1% |
| Codeforces | 51.6パーセンタイル |
| SWE-Bench Verified | 42.0% |

### HuggingFace
- deepseek-ai/DeepSeek-V3-Base
- deepseek-ai/DeepSeek-V3

### リンク
- **論文:** https://arxiv.org/abs/2412.19437
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-V3

---

## 11. DeepSeek-VL2

### 基本情報
- **リリース日:** 2024年12月13日
- **開発元:** DeepSeek AI
- **ライセンス:** DeepSeek Model License
- **モデルタイプ:** Vision-Language MoEモデル
- **画像入力:** 384×384基本解像度（動的タイリング）
- **対応言語:** 英語、中国語

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| DeepSeek-VL2-Tiny | 33.7億 | 10億 |
| DeepSeek-VL2-Small | 161億 | 28億 |
| DeepSeek-VL2 | 275億 | 45億 |

### ベンチマーク
| ベンチマーク | スコア（Tiny） |
|------------|--------------|
| MMStar | 45.9 |
| OCRBench | 809 |
| DocVQA | 88.9 |
| ChartQA | 81.0 |
| MathVista | 53.6 |

### リンク
- **論文:** https://arxiv.org/abs/2412.10302
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-VL2

---

## 12. DeepSeek-R1

### 基本情報
- **リリース日:** 2025年1月20日
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** 推論モデル（MoE）
- **コンテキスト長:** 128,000トークン
- **最大生成長:** 32,768トークン
- **対応言語:** 英語、中国語

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ | アーキテクチャ |
|-------|------------|----------------|--------------|
| DeepSeek-R1-Zero | 6710億 | 370億 | MoE |
| DeepSeek-R1 | 6710億 | 370億 | MoE |
| DeepSeek-R1-Distill-Qwen-1.5B | 15億 | 15億 | Dense |
| DeepSeek-R1-Distill-Qwen-7B | 70億 | 70億 | Dense |
| DeepSeek-R1-Distill-Llama-8B | 80億 | 80億 | Dense |
| DeepSeek-R1-Distill-Qwen-14B | 140億 | 140億 | Dense |
| DeepSeek-R1-Distill-Qwen-32B | 320億 | 320億 | Dense |
| DeepSeek-R1-Distill-Llama-70B | 700億 | 700億 | Dense |

### アーキテクチャ詳細
- **R1-Zero:** SFTなしの純粋RL学習（RLのみで推論能力を検証した初のモデル）
- **R1:** コールドスタートデータ＋RLで可読性向上
- **学習パイプライン:**
  1. ベースモデル（DeepSeek-V3-Base）に大規模RL
  2. コールドスタートデータSFT
  3. 推論重視RL
  4. 人間嗜好RL
- **蒸留:** R1から80万件の推論サンプルで小型モデルを学習
- 自己検証、リフレクション、長いChain-of-Thought生成

### ベンチマーク（R1）
| ベンチマーク | スコア |
|------------|--------|
| AIME 2024 | 79.8% Pass@1 |
| MATH-500 | 97.3% |

### ベンチマーク（Distill-Qwen-32B）
| ベンチマーク | スコア |
|------------|--------|
| AIME 2024 | 72.6% Pass@1 |
| MATH-500 | 94.3% |
| OpenAI o1-miniを複数ベンチマークで上回る |

### プロンプトテンプレート
```
<｜begin▁of▁sentence｜><｜User｜>{user_message}<｜Assistant｜><｜think｜>
{推論プロセス}
<｜/think｜>

{最終回答}<｜end▁of▁sentence｜>
```

### HuggingFace
- deepseek-ai/DeepSeek-R1-Zero
- deepseek-ai/DeepSeek-R1
- deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B〜32B
- deepseek-ai/DeepSeek-R1-Distill-Llama-8B/70B

### リンク
- **論文:** https://arxiv.org/abs/2501.12948
- **GitHub:** https://github.com/deepseek-ai/DeepSeek-R1
- **ウェブサイト:** https://chat.deepseek.com（DeepThinkモード）

---

## 13. Janus / Janus-Pro

### 基本情報
- **リリース日:** Janus: 2024年10月、Janus-Pro: 2025年1月27日
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** 統合マルチモーダル（理解＋生成）
- **画像解像度:** 384×384入力、VQトークナイザーで生成

### パラメータサイズ
| モデル | パラメータ数 |
|-------|------------|
| Janus-1.3B | 13億 |
| Janus-Pro-1B | 10億 |
| Janus-Pro-7B | 70億 |

### アーキテクチャ詳細
- **分離型ビジュアルエンコーディング:**
  - 理解: SigLIP-Lビジョンエンコーダー（384×384）
  - 生成: VQトークナイザー（ダウンサンプル率16）
- **統合Transformer:** 両タスクに単一バックボーン

### ベンチマーク（Janus-Pro-7B）
| ベンチマーク | スコア |
|------------|--------|
| GenEval | 80.0%（DALL-E 3: 67%） |
| DPG-Bench | 84.2% |
| MMBench | 79.2% |

### リンク
- **論文:** https://arxiv.org/abs/2501.17811
- **GitHub:** https://github.com/deepseek-ai/Janus

---

## 14. DeepSeek-R1-0528

### 基本情報
- **リリース日:** 2025年5月28日
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** 推論モデル（アップグレード版）

### R1からの改善点
- より強力な推論深度（平均23Kトークン/質問）
- ハルシネーション削減
- システムプロンプト対応
- JSON出力対応
- 関数呼び出し対応
- エージェント型AIユースケースに適合

---

## 15. DeepSeek-V3.1

### 基本情報
- **リリース日:** 2025年8月
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** ハイブリッドMoE（思考＋非思考）
- **コンテキスト長:** 128,000トークン

### パラメータサイズ
| モデル | 総パラメータ | 活性化パラメータ |
|-------|------------|----------------|
| DeepSeek-V3.1 | 6710億 | 370億 |

### 主な特徴
- **ハイブリッド思考モード:** 推論（R1風）と直接回答（V3風）を切り替え可能
- ツール呼び出しとエージェント機能強化

---

## 16. DeepSeek-Prover-V2

### 基本情報
- **リリース日:** 2025年4月
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** 形式定理証明器（Lean 4）
- **コンテキスト長:** 163,840トークン

### パラメータサイズ
| モデル | 総パラメータ |
|-------|------------|
| DeepSeek-Prover-V2-7B | 70億 |
| DeepSeek-Prover-V2-671B | 6710億 |

### ベンチマーク
| ベンチマーク | スコア |
|------------|--------|
| MiniF2F | 88.9% |

---

## 17. DeepSeekMath-V2

### 基本情報
- **リリース日:** 2025年11月27日
- **開発元:** DeepSeek AI
- **ライセンス:** Apache 2.0
- **モデルタイプ:** 自己検証型数学推論

### パラメータサイズ
| モデル | 総パラメータ |
|-------|------------|
| DeepSeekMath-V2 | 6850億 |

### ベンチマーク
| 競技会 | スコア |
|-------|--------|
| IMO 2025 | 金メダル（5/6問解決） |
| CMO 2024 | 金メダル |
| Putnam 2024 | 118/120点（人間最高: 90点） |

### リンク
- **論文:** https://arxiv.org/abs/2511.22570

---

## 18. DeepSeek-V3.2

### 基本情報
- **リリース日:** 2025年12月1日
- **開発元:** DeepSeek AI
- **ライセンス:** MIT License
- **モデルタイプ:** スパースアテンション付きMoE
- **性能レベル:** GPT-5 / Gemini-3.0-Pro相当

### パラメータサイズ
| モデル | 総パラメータ |
|-------|------------|
| DeepSeek-V3.2 | 6850億 |

### アーキテクチャ詳細
- **DeepSeek Sparse Attention（DSA）:** より効率的なアテンション機構

### ベンチマーク
| 競技会 | スコア |
|-------|--------|
| IMO 2025 | 金メダル |
| IOI 2025 | 金メダル |

---

## VRAM要件（概算）

### BF16/FP16フル精度
| モデルサイズ | 必要VRAM |
|------------|----------|
| 15億 | 約4 GB |
| 70億 | 約17 GB |
| 160億（MoE、24億活性化） | 約35 GB |
| 670億 | 約135 GB |
| 2360億（MoE、210億活性化） | 約500 GB（8×80GB GPU） |
| 6710億（MoE、370億活性化） | 約1.4 TB（8×H200 141GB） |

### 量子化オプション
- INT8: 約50%削減
- INT4: 約75%削減
- FP8: V3以降でネイティブ対応

---

## ファミリーツリー

```
DeepSeek-LLM (2023-11)
├── 進化 → DeepSeek-V2 (2024-05)
│   ├── 公式派生 → DeepSeek-Coder-V2 (2024-06)
│   ├── 公式派生 → DeepSeek-VL2 (2024-12)
│   ├── 進化 → DeepSeek-V2.5 (2024-09)
│   └── 進化 → DeepSeek-V3 (2024-12)
│       ├── 公式派生 → DeepSeek-R1 (2025-01)
│       │   ├── 蒸留 → DeepSeek-R1-Distill-Qwenシリーズ
│       │   ├── 蒸留 → DeepSeek-R1-Distill-Llamaシリーズ
│       │   └── 進化 → DeepSeek-R1-0528 (2025-05)
│       ├── 公式派生 → DeepSeek-Prover-V2 (2025-04)
│       └── 進化 → DeepSeek-V3.1 (2025-08)
│           └── 進化 → DeepSeek-V3.2 (2025-12)
│               └── 公式派生 → DeepSeekMath-V2 (2025-11)

DeepSeek-Coder (2023-11)
├── 進化 → DeepSeek-Coder-V1.5
│   └── 公式派生 → DeepSeek-Math (2024-02)
└── 進化 → DeepSeek-Coder-V2 (2024-06)

DeepSeekMoE (2024-01)
└── アーキテクチャ基盤 → DeepSeek-V2、V3シリーズ

DeepSeek-LLM-1.5B/7B
└── ベース → Janus / Janus-Pro (2024-10, 2025-01)
```

---

## 主要な技術革新まとめ

| 革新技術 | 初導入モデル | 説明 |
|---------|------------|------|
| DeepSeekMoE | DeepSeekMoE (2024-01) | 細粒度エキスパート分割、共有エキスパート分離 |
| MLA | DeepSeek-V2 (2024-05) | Multi-head Latent Attention、KVキャッシュ93.3%削減 |
| GRPO | DeepSeek-Math (2024-02) | Group Relative Policy Optimization強化学習 |
| 補助損失なしバランシング | DeepSeek-V3 (2024-12) | 性能低下なしのロードバランシング |
| Multi-Token Prediction | DeepSeek-V3 (2024-12) | MTP学習目標で性能向上 |
| FP8学習 | DeepSeek-V3 (2024-12) | 6710億スケールで初めて検証 |
| 純粋RL推論 | DeepSeek-R1-Zero (2025-01) | RLのみで推論能力を検証した初のモデル |
| DeepSeek Sparse Attention | DeepSeek-V3.2 (2025-09) | 長文コンテキスト向け効率的アテンション |
| 自己検証 | DeepSeekMath-V2 (2025-11) | メタ検証付きLLMベース証明検証 |

---

## API料金（2025年時点）

| エンドポイント | 入力（100万トークンあたり） | 出力（100万トークンあたり） |
|--------------|-------------------------|--------------------------|
| deepseek-chat（V3） | $1.25 | $1.25 |
| deepseek-reasoner（R1） | $3.00 | $7.00 |

*同等のクローズドモデルと比較して70-90%のコスト削減*

---

## 参考文献

- DeepSeek-LLM: https://arxiv.org/abs/2401.02954
- DeepSeekMoE: https://arxiv.org/abs/2401.06066
- DeepSeek-Math: https://arxiv.org/abs/2402.03300
- DeepSeek-V2: https://arxiv.org/abs/2405.04434
- DeepSeek-Coder-V2: https://arxiv.org/abs/2406.11931
- DeepSeek-V3: https://arxiv.org/abs/2412.19437
- DeepSeek-VL2: https://arxiv.org/abs/2412.10302
- DeepSeek-R1: https://arxiv.org/abs/2501.12948
- Janus-Pro: https://arxiv.org/abs/2501.17811
- DeepSeekMath-V2: https://arxiv.org/abs/2511.22570

**GitHub組織:** https://github.com/deepseek-ai  
**HuggingFace組織:** https://huggingface.co/deepseek-ai  
**ウェブサイト:** https://www.deepseek.com  
**チャットインターフェース:** https://chat.deepseek.com
