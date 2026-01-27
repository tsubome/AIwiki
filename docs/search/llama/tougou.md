# Meta Llama (Large Language Model Meta AI) モデルファミリー包括的技術仕様書

**最終更新日:** 2026年1月26日
**対象範囲:** Llama 1 (2023) ～ Llama 4 (2026)

## 1. 概要と進化の系譜
Meta（旧Facebook AI Research）が開発する「Llama」シリーズは、オープンウェイト（Open Weights）AIのデファクトスタンダードとして進化を続けています。
初期の「高効率なテキストモデル」から、Llama 4における「ネイティブマルチモーダル・MoE（混合エキスパート）」への移行まで、アーキテクチャとライセンス形態は劇的に変化しました。

### 世代別主要変更点サマリー
* **Llama 1 (2023.02):** 研究用ライセンス。Chinchillaスケーリング則に基づく「オーバー・トレーニング」の実践。
* **Llama 2 (2023.07):** 商用利用解禁。GQA（Grouped-Query Attention）の一部導入とRLHFの強化。
* **Llama 3 / 3.1 (2024.04-07):** 128kコンテキスト標準化、405B巨大モデルの投入、多言語対応。
* **Llama 3.2 / 3.3 (2024.09-12):** エッジ向け小型モデル、Vision（画像）対応、推論効率の最適化。
* **Llama 4 (2025.04):** **MoEアーキテクチャ**への完全移行、**Early Fusion**によるネイティブマルチモーダル化、最大**1,000万トークン**のコンテキスト。

---

## 2. 世代別モデル詳細カタログ

### 2.1 Llama 1 (Original LLaMA)
**リリース:** 2023年2月24日
**ライセンス:** Non-commercial Research License（研究用限定）
**アーキテクチャ:** Dense Transformer (Pre-Norm RMSNorm, SwiGLU, RoPE)

| モデル名 | 正確なパラメータ数 | コンテキスト長 | 学習トークン数 | 特記事項 |
| :--- | :--- | :--- | :--- | :--- |
| **LLaMA 7B** | 6.7B | 2,048 | 1.0T | 単一GPU推論が可能 |
| **LLaMA 13B** | 13.0B | 2,048 | 1.0T | GPT-3 (175B) を超える性能を主張 |
| **LLaMA 33B** | 32.5B | 2,048 | 1.4T | 通称30Bまたは33Bと呼ばれる |
| **LLaMA 65B** | 65.2B | 2,048 | 1.4T | 当時のSOTA（Chinchilla 70B相当） |

**技術的特徴:**
* **データセット:** 公開データ（CommonCrawl, GitHub, Wikipedia等）のみを使用。
* **トークナイザ:** SentencePiece (BPE), 語彙サイズ 32,000。

### 2.2 Llama 2 Family
**リリース:** 2023年7月18日
**ライセンス:** Llama 2 Community License（商用可 ※MAU 7億人制限あり）
**進化点:** コンテキスト倍増(4k)、学習データ倍増(2T)、Chatモデル(RLHF)の同時公開。

| モデル名 | パラメータ | GQA採用 | 用途 |
| :--- | :--- | :--- | :--- |
| **Llama 2 7B** | 6.7B | なし | Base / Chat |
| **Llama 2 13B** | 13.0B | なし | Base / Chat |
| **Llama 2 70B** | 68.9B | **あり** | Base / Chat (推論高速化のためGQA採用) |

### 2.3 Code Llama
**リリース:** 2023年8月24日 (70Bは2024年1月)
**ベース:** Llama 2
**特徴:** コンテキスト長を16kで学習（推論時最大100k対応）。FIM (Fill-In-The-Middle) 機能によるコード補完（34Bを除く）。

| サイズ | バリエーション |
| :--- | :--- |
| **7B / 13B / 34B / 70B** | Base, Python特化, Instruct |

### 2.4 Llama 3 / 3.1 / 3.3 Family
**リリース:** 2024年4月(v3) / 7月(v3.1) / 12月(v3.3)
**ライセンス:** Llama 3.x Community License
**共通仕様:** トークナイザ刷新（Tiktoken, 語彙128k）、全モデルでGQA採用、学習データ15T+。

| モデル世代 | モデル名 | コンテキスト | 特徴・主な変更点 |
| :--- | :--- | :--- | :--- |
| **Llama 3** | 8B / 70B | 8,192 | Metaユーザーデータ不使用を明言。性能の大幅向上。 |
| **Llama 3.1** | 8B / 70B / **405B** | **128,000** | 405BはGPT-4クラス。多言語対応（8言語）。ツール利用強化。 |
| **Llama 3.3** | **70B Instruct** | 128,000 | 405Bからの蒸留技術を用いた高効率モデル。 |

### 2.5 Llama 3.2 (Edge & Vision)
**リリース:** 2024年9月25日 (GitHub正式更新は10月24日)
**アーキテクチャ:**
* **Text (1B/3B):** Llama 3.1からのPruning（枝刈り）と蒸留。
* **Vision (11B/90B):** テキストモデルにアダプタを追加した構成的アーキテクチャ。

| モデル名 | 入力モダリティ | アーキテクチャ構成 |
| :--- | :--- | :--- |
| **Llama 3.2 1B / 3B** | テキスト | Pruned Dense Transformer (モバイル動作想定) |
| **Llama 3.2 11B** | テキスト+画像 | 8B Text + Vision Adapter |
| **Llama 3.2 90B** | テキスト+画像 | 70B Text + Vision Adapter |

---

## 3. 【最新】Llama 4 Family (2025-2026)
**リリース:** 2025年4月5日
**アーキテクチャ:** **Mixture-of-Experts (MoE)** + **Early Fusion Multimodal**
**学習データ:** 公開データに加え、**Meta製品（Instagram/Facebook等）の画像・動画・テキストデータ**を使用。

### 3.1 モデルラインナップとスペック

Llama 4は「Active（推論時有効）」パラメータと「Total（総）」パラメータの区別が重要です。また、モデルによってコンテキスト長の設計思想が異なります。

| モデル名 | アーキテクチャ | Total Params | Active Params | エキスパート数 | コンテキスト長 | 特性 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Llama 4 Scout** | MoE | 109B | **17B** | 16 | **1,000万 (10M)** | 超長文脈特化。書籍数百冊や動画全体の処理向け。 |
| **Llama 4 Maverick** | MoE | 400B | **17B** | 128 | **100万 (1M)** | 高密度な知識・複雑推論特化。エキスパート細分化。 |

### 3.2 技術的特異点
* **ネイティブマルチモーダル (Early Fusion):** 画像・動画トークンをテキストと同様に学習初期から混合。Llama 3.2のようなアダプタ方式よりも文脈理解が深い。
* **コンテキスト:** Scoutモデルは10Mトークンに対応し、RAG（検索拡張生成）不要で大規模データを処理可能。
* **MoEルーティング:** 入力に応じて必要なエキスパートのみを活性化し、巨大な総パラメータ数に対して推論コスト（Active 17B相当）を低く抑えている。

### 3.3 ライセンスの注意点（ジオフェンシング）
**Llama 4 Community License**には、以下の重要な地域制限が含まれます。
* **EU利用制限:** マルチモーダルモデル（画像・動画処理を含むもの）に関しては、**欧州連合（EU）域内での利用権許諾が行われていません**。
* これはAI ActやGDPRなどの規制リスクに対応するためと推測されます。

---

## 4. エコシステム：Llama Guard & Purple Llama
安全性とセキュリティのためのコンパニオンモデル群です。

| モデル名 | ベースモデル | 機能 |
| :--- | :--- | :--- |
| **Llama Guard 3** | Llama 3.1 8B | 入出力の安全性分類（MLCommons準拠） |
| **Llama Guard 3 Vision** | Llama 3.2 11B | 画像入力に対する安全性判定 |
| **Llama Guard 4** | Llama 4 Scout (Pruned) | **12B**。ネイティブマルチモーダル対応の安全性判定。 |
| **Prompt Guard 2** | mDeBERTa | プロンプトインジェクション、Jailbreak攻撃の検出 |

---

## 5. データソース・参考文献
本ドキュメントは以下のMeta公式リソースおよび技術レポートに基づき統合・作成されました。

1.  **Llama 4 / 3.3 / 3.2 / 3.1 Model Cards** (GitHub: `meta-llama/llama-models`)
2.  **LLaMA 1 Paper:** *LLaMA: Open and Efficient Foundation Language Models* (arXiv:2302.13971)
3.  **Llama 2 Paper:** *Llama 2: Open Foundation and Fine-Tuned Chat Models* (arXiv:2307.09288)
4.  **Hugging Face Official Organization:** `meta-llama` (Model history and specs)