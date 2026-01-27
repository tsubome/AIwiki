# **Meta Llamaモデル全系譜の包括的技術分析：アーキテクチャ、進化、および実装仕様に関する詳解報告書 (2023年-2026年)**

## **エグゼクティブサマリー**

本報告書は、Meta AI（旧Facebook AI Research）によって開発・公開された大規模言語モデル（LLM）「Llama（Large Language Model Meta AI）」ファミリーの全貌を、2023年2月の初代モデル公開から2026年1月時点の最新動向まで網羅的に分析したものである。本ドキュメントは、AIwiki等の構造化データベース（JSON等）への正確な情報入力を目的としており、各モデルのパラメータ数、学習トークン数、アーキテクチャの変遷、コンテキストウィンドウ長、およびライセンス条項の微細な差異に至るまで、極めて詳細に記述する。  
Llamaの系譜は、単なるモデルのバージョンアップの歴史ではない。それは、生成AIの民主化、高密度モデルから疎な混合エキスパート（MoE）モデルへの移行、テキスト単一モダリティからネイティブマルチモダリティへの進化、そしてAIガバナンスと地政学的規制への対応という、AI技術史における重要な転換点を如実に反映している。本報告書では、Llama 1からLlama 4、そして関連するセーフティモデル（Llama Guard）に至るまで、技術的な深層と実装上の含意を徹底的に解明する。

## ---

**1\. 序論：Llama以前のパラダイムとオープンウェイト革命**

### **1.1 生成AIのランドスケープとLlamaの登場背景**

2023年初頭まで、最先端のLLM（GPT-3、PaLM、Chinchilla等）は、その巨大なパラメータ数と学習コストゆえに、一部の巨大テック企業によってAPI経由でのみ提供される「ブラックボックス」であった。研究者や開発者は、モデルの内部表現や重みにアクセスできず、科学的な検証やカスタマイズが困難な状況にあった。  
Metaが2023年2月に公開した初代Llamaは、この閉鎖的なパラダイムに対するアンチテーゼとして登場した。Llamaの核心的な設計思想は、DeepMindが提唱した「Chinchillaスケーリング則」の実践にある。すなわち、推論時のコスト（レイテンシとメモリ）を最小化するために、モデルサイズを抑制しつつ、学習データ量を大幅に増やす（オーバー・トレーニングする）というアプローチである1。これにより、Llamaは比較的小規模なハードウェアでも動作しつつ、遥かに巨大なモデルに匹敵する性能を実現し、後の「オープンソースAI（厳密にはオープンウェイトAI）」の爆発的普及の起爆剤となった。

## ---

**2\. Llama 1：効率的基盤モデルの創世記**

### **2.1 概要と歴史的意義**

Llama 1は、推論効率を最優先に設計された基盤モデル（Foundation Model）としてリリースされた。当初は非商用の研究用ライセンス（Research-only license）の下、アカデミア向けに限定公開されたが、リリース直後のBitTorrentによる重み流出事件を経て、事実上のオープンスタンダードとしての地位を確立した2。

### **2.2 アーキテクチャの技術的詳細**

Llama 1は、標準的なTransformerデコーダアーキテクチャを採用しつつ、安定性と性能向上のために3つの重要な改良を加えている。これらの設計は、後のLlama全シリーズ、さらにはMistralやQwenといった他のオープンモデルにも継承されるデファクトスタンダードとなった。

#### **2.2.1 Pre-normalization (RMSNorm)**

従来のTransformer（Vaswani et al., 2017）では、各サブレイヤーの出力後に正規化を行っていた（Post-Norm）。しかし、Llamaでは学習の安定性を高めるため、各Transformerサブレイヤーへの入力前に正規化を行う「Pre-Norm」方式を採用した。さらに、正規化関数として、平均を中心化せずスケーリング不変性のみに注目する\*\*RMSNorm (Root Mean Square Normalization)\*\*を採用している3。

* **技術的利点:** RMSNormはLayerNormと比較して計算コストが低く、特に深層モデルにおいて勾配消失や発散を防ぐ効果が高い。

#### **2.2.2 SwiGLU活性化関数**

FFN（Feed-Forward Network）の活性化関数として、従来のReLUに代わり、PaLMで提案された\*\*SwiGLU (Swish Gated Linear Unit)\*\*を採用した。

* **実装詳細:** FFNの隠れ層の次元数は、通常$4d$（$d$はモデル次元）とされるが、SwiGLUのパラメータ増加を相殺し計算量を一定に保つため、$\\frac{2}{3} \\times 4d$に削減されている3。SwiGLUは非線形性が強く、モデルの表現力を向上させる。

#### **2.2.3 Rotary Positional Embeddings (RoPE)**

位置エンコーディングには、絶対位置埋め込み（Absolute Positional Embedding）や相対位置埋め込み（Relative PE）ではなく、\*\*Rotary Positional Embeddings (RoPE)\*\*を採用した3。

* **数学的メカニズム:** RoPEは、トークンの埋め込みベクトルを複素平面上の回転として扱うことで、絶対位置の情報を保持しつつ、トークン間の相対的な距離関係を自然にモデルに学習させる。  
* **コンテキスト長への影響:** Llama 1では、RoPEのベース周波数（$\\theta$）を10,000に設定し、学習時のコンテキストウィンドウは**2,048トークン**に制限されていた5。

### **2.3 モデルバリエーションとスペック一覧 (Llama 1\)**

JSONデータベース構築のためのLlama 1全モデルの詳細仕様は以下の通りである。

| モデル名 | パラメータ数 | 次元数 (dmodel​) | 層数 | ヘッド数 | 学習率 | バッチサイズ | 学習トークン数 | 推論の特徴 |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Llama 1 7B** | 6.7B | 4,096 | 32 | 32 | $3.0 \\times 10^{-4}$ | 4M | 1.0兆 | 単一GPU推論可 |
| **Llama 1 13B** | 13.0B | 5,120 | 40 | 40 | $3.0 \\times 10^{-4}$ | 4M | 1.0兆 | GPT-3 175Bを凌駕 |
| **Llama 1 33B** | 32.5B | 6,656 | 60 | 52 | $1.5 \\times 10^{-4}$ | 4M | 1.4兆 | マルチGPU推奨 |
| **Llama 1 65B** | 65.2B | 8,192 | 80 | 64 | $1.5 \\times 10^{-4}$ | 4M | 1.4兆 | Chinchilla 70B相当 |

**データソース:** 2

### **2.4 学習データとトークナイザ**

* **データセット:** Llama 1は、一般公開されているデータのみ（CommonCrawl, C4, GitHub, Wikipedia, Books, ArXiv, StackExchange）から構成される計1.4兆トークンのデータセットで学習された2。これは「プロプライエタリなデータなしでもSOTA（State-of-the-Art）は達成可能である」という強力な実証であった。  
* **トークナイザ:** **SentencePiece**ライブラリを用いたByte-Pair Encoding (BPE)を採用。語彙サイズ（Vocabulary Size）は**32,000**である7。特筆すべき点として、数字を個別の桁に分割してトークン化する処理が入っており、これにより数学的推論能力の向上が図られている。

## ---

**3\. Llama 2：商用化への転換とアライメント技術**

### **3.1 戦略的シフトとライセンス変更**

2023年7月、MetaはLlama 2をリリースした。最大の変更点はライセンス条項であり、月間アクティブユーザー数（MAU）が7億人未満のプロダクトであれば、商用利用が無償で許可された6。これにより、Llamaは研究対象から、企業のAIアプリケーション開発におけるデファクトスタンダードへと変貌を遂げた。また、Microsoft AzureやHugging Faceとの提携により、エコシステムへの統合が加速した8。

### **3.2 アーキテクチャの進化：Grouped-Query Attention (GQA)**

Llama 2のアーキテクチャは基本的にLlama 1を踏襲しているが、70Bモデルにおいてのみ、\*\*Grouped-Query Attention (GQA)\*\*という重要な変更が加えられた9。

#### **3.2.1 GQA導入の背景とメカニズム**

大規模モデルの推論、特にデコーディング段階においては、過去のトークンのKey（K）とValue（V）の行列をメモリから読み込む帯域幅（Memory Bandwidth）がボトルネックとなる（Memory Wall問題）。

* **MHA (Multi-Head Attention):** 従来の方式。全てのQueryヘッドに対して独自のK/Vヘッドを持つ。精度は高いが、メモリ消費と転送量が膨大。  
* **MQA (Multi-Query Attention):** 全てのQueryヘッドで単一のK/Vヘッドを共有する。高速だが精度劣化のリスクがある。  
* **GQA (Grouped-Query Attention):** Llama 2 70Bで採用。Queryヘッドをいくつかのグループに分け、グループごとにK/Vヘッドを共有する中間的な手法。これにより、MHAに近い精度を維持しつつ、MQAに近い推論速度とメモリ効率を実現した11。

### **3.3 アライメント：RLHFとGhost Attention**

Llama 2では、基盤モデル（Base）に加え、対話向けに調整された「Llama 2-Chat」が提供された。ここでは、当時のオープンモデルとしては異例の規模で\*\*RLHF (Reinforcement Learning from Human Feedback)\*\*が適用された。

* **プロセス:** 教師あり微調整（SFT）の後、人間のフィードバックに基づく報酬モデル（Reward Model）を作成し、Rejection Sampling（棄却サンプリング）とPPO（Proximal Policy Optimization）を用いてモデルを最適化した6。  
* **Ghost Attention (GAtt):** 複数ターンの対話において、モデルが初期の指示（システムプロンプト等）を忘却する問題を防ぐため、GAttという手法が導入された。これは、対話データセットの全ターンにシステムメッセージを連結して学習させる工夫であり、一貫したペルソナ維持を可能にした13。

### **3.4 モデルバリエーションとスペック一覧 (Llama 2\)**

| モデル名 | パラメータ | コンテキスト長 | GQAの有無 | 学習トークン数 | ライセンス |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Llama 2 7B** | 6.7B | 4,096 | なし (MHA) | 2.0兆 | 商用可 |
| **Llama 2 13B** | 13.0B | 4,096 | なし (MHA) | 2.0兆 | 商用可 |
| **Llama 2 70B** | 68.9B | 4,096 | **あり (GQA)** | 2.0兆 | 商用可 |

**注記:** Llama 1にあった33Bと65Bは廃止され、70Bへと統合された。コンテキストウィンドウはLlama 1の2倍となる**4,096トークン**へ拡張された6。

## ---

**4\. Code Llama：ドメイン特化とロングコンテキスト**

### **4.1 コード特化型モデルの展開**

2023年8月、Llama 2をベースにコード生成能力を強化した「Code Llama」ファミリーがリリースされた2。これらは、Llama 2の重みを初期値とし、さらに5,000億トークンのコードデータで追加学習（Continual Pre-training）を行ったものである。

### **4.2 技術的ハイライト**

* **ロングコンテキスト対応 (100k):** Code Llamaは、RoPEのベース周波数$\\theta$を10,000から**1,000,000**に変更することで、最大**100,000トークン**のコンテキストウィンドウを実現した14。これは、大規模なコードベースやドキュメントを一度に処理するための重要な拡張である。  
* **Infilling (FIM):** 7Bおよび13Bモデルでは、コードの途中を補完する機能（Fill-In-The-Middle）に対応するため、学習データの一部を前後の文脈から中間を予測する形式に変換して学習された。これにより、IDE（統合開発環境）でのコード補完が可能となった。

### **4.3 Code Llamaバリエーション**

| モデル名 | 特徴 | サイズ | コンテキスト |
| :---- | :---- | :---- | :---- |
| **Code Llama (Base)** | 標準的なコード生成、補完 | 7B, 13B, 34B, 70B | 100k |
| **Code Llama \- Python** | Python言語に特化して追加学習 (100Bトークン) | 7B, 13B, 34B, 70B | 100k |
| **Code Llama \- Instruct** | 自然言語による指示追従能力を付与 | 7B, 13B, 34B, 70B | 100k |

**注記:** Llama 2で欠番となっていた**34B**サイズが、Code Llamaにおいてのみ復活している点が重要である。

## ---

**5\. Llama 3：計算最適化の限界突破とトークナイザの刷新**

### **5.1 "Compute Optimal"からの逸脱**

2024年4月にリリースされたLlama 3は、Chinchillaスケーリング則が示唆する「計算最適」な学習量（パラメータ数の約20倍のトークン数）を意図的に無視し、**15兆トークン**という圧倒的なデータ量で学習を行った15。

* **分析:** 8Bモデルの場合、理論上の最適学習量は約2,000億トークン程度だが、Llama 3はその75倍以上のデータを学習している。この「オーバー・トレーニング」により、モデルサイズを変えずに推論時の性能（Quality）を極限まで高めることに成功した。結果として、Llama 3 8Bは前世代のLlama 2 70Bに匹敵する性能を示した16。

### **5.2 アーキテクチャの刷新：Tiktokenと全モデルGQA**

Llama 3では、アーキテクチャにいくつかの決定的な変更が加えられた。

#### **5.2.1 トークナイザの変更 (Tiktoken)**

Llama 2までのSentencePieceを廃止し、OpenAIのGPT-4等で使用されている**Tiktoken**ベースのトークナイザを採用した。

* **語彙サイズ:** 32,000から**128,256**へと4倍に拡張された17。  
* **影響:** 語彙サイズの増大は、テキストをより少ないトークン数で表現できることを意味する（圧縮率の向上）。これにより、同じコンテキストウィンドウサイズ（8,192トークン）でも、実質的に扱える情報量が約15%〜20%増加し、特に英語以外の多言語処理やコードの表現効率が劇的に向上した19。

#### **5.2.2 全モデルでのGQA採用**

Llama 2では70BのみであったGQA（Grouped-Query Attention）が、Llama 3では**8Bモデルを含む全サイズ**に採用された15。これにより、8BモデルのKVキャッシュサイズが削減され、エッジデバイスでの推論効率が向上した。

### **5.3 モデルバリエーション (Llama 3\)**

| モデル名 | パラメータ | コンテキスト | 学習データ | ナレッジカットオフ |
| :---- | :---- | :---- | :---- | :---- |
| **Llama 3 8B** | 8.0B | 8,192 | 15兆トークン | 2023年3月 |
| **Llama 3 70B** | 70.6B | 8,192 | 15兆トークン | 2023年12月 |

## ---

**6\. Llama 3.1：405Bフラッグシップとエコシステムの完成**

### **6.1 最大規模のオープンモデル 405B**

2024年7月23日、MetaはLlama 3.1をリリースし、待望の\*\*405B（4050億パラメータ）\*\*モデルを公開した16。これは、GPT-4クラスの性能を持つモデルの重みが初めて公開された歴史的瞬間であり、合成データ生成（Synthetic Data Generation）やモデル蒸留（Distillation）の親モデル（Teacher Model）としての利用が公式に推奨された。

### **6.2 405Bのインフラストラクチャと学習**

405Bモデルの学習には、**16,000基のNVIDIA H100 GPU**が投入された。これほどの規模での学習を安定させるため、Metaは4次元パラレリズム（4D Parallelism）を駆使した16。

* **Tensor Parallelism (TP)**  
* **Pipeline Parallelism (PP)**  
* **Context Parallelism (CP)**  
* **Data Parallelism (DP)**  
  これにより、ハードウェア故障が頻発する環境下でも学習を完遂させた。

### **6.3 機能拡張：128kコンテキストと多言語・ツール利用**

Llama 3.1では、8B、70B、405Bの全モデルで機能が統一された。

* **コンテキスト長:** 全モデルで**128,000トークン**に対応20。  
* **多言語対応:** 英語に加え、ドイツ語、フランス語、イタリア語、ポルトガル語、ヒンディー語、スペイン語、タイ語を公式サポート21。  
* **ツール利用 (Tool Use):** 検索エンジンやPythonインタプリタを呼び出すための学習が行われており、エージェントとしての能力が大幅に強化された。

### **6.4 モデルスペック詳細 (Llama 3.1)**

| モデル名 | パラメータ | 層数 | Attentionヘッド数 | モデル次元 | FFN次元 | 学習データ |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Llama 3.1 8B** | 8B | 32 | 32 (KV: 8\) | 4,096 | 14,336 | 15兆 |
| **Llama 3.1 70B** | 70B | 80 | 64 (KV: 8\) | 8,192 | 28,672 | 15兆 |
| **Llama 3.1 405B** | 405B | 126 | 128 (KV: 8\) | 16,384 | 53,248 | 15兆 |

**データソース:** 2

## ---

**7\. Llama 3.2：エッジAIとビジョンの統合**

### **7.1 "On-Device"と"Multimodal"の二極化**

2024年9月25日にリリースされたLlama 3.2は、モバイルデバイス向けの超軽量モデル（1B/3B）と、画像認識能力を持つ中規模モデル（11B/90B）という二つの異なるニーズに対応した23。

### **7.2 軽量テキストモデル (1B & 3B)**

これらは単に小さく学習させたモデルではなく、Llama 3.1 8B/70Bからの\*\*枝刈り（Pruning）**と**蒸留（Distillation）\*\*によって作成された。

* **特徴:** 128kコンテキストを維持しつつ、スマートフォン上での動作を想定。3Bモデルは前世代のLlama 2 7Bを凌駕する性能を持つ25。

### **7.3 ビジョンモデル (11B & 90B) のアーキテクチャ**

Llama 3.2 Visionは、既存のLlama 3.1テキストモデル（8B/70B）に、画像処理用のアダプタを追加した**コンポジショナル（構成的）アーキテクチャ**を採用している。

* **Vision Encoder:** 画像をエンコードするためのViT（Vision Transformer）ベースのエンコーダ。  
* **Cross-Attention Adapters:** LLaVAのような単純な射影（Projection）ではなく、テキストモデルの層間に**Gated Cross-Attention**レイヤーを挿入する方式を採用24。これにより、テキスト生成能力を損なうことなく、必要に応じて視覚情報にアクセス（Attend）することが可能となった。  
* **パラメータ構成:**  
  * **11B:** 8B Text Model \+ 3B Vision Adapter  
  * **90B:** 70B Text Model \+ 20B Vision Adapter

## ---

**8\. Llama 3.3：高密度モデルの到達点**

### **8.1 70Bへの集約と最適化**

2024年12月6日、MetaはLlama 3.3をリリースした。ラインナップは**70B Instruct**のみである27。

* **コンセプト:** Llama 3.1 405Bの蒸留技術と、最新のポストトレーニング技術（RLHFの高度化）を70Bサイズに凝縮。405Bに近い性能を、はるかに低い推論コストで提供することを目的としている29。  
* **位置づけ:** 405Bの運用が難しいユーザー向けの「実用的な最高性能モデル」として、Llama 4登場までのブリッジとなるモデルである。  
* **アーキテクチャ:** Llama 3.1と同様のDense Transformerであり、コンテキスト長も128kを維持。

## ---

**9\. Llama 4：MoEとネイティブマルチモーダルへの飛躍（2025年-）**

### **9.1 パラダイムシフト：DenseからSparseへ**

2025年4月にリリースされたLlama 4は、Llama史上最大のアーキテクチャ刷新を行った。これまでの全結合（Dense）モデルから、**混合エキスパート（MoE: Mixture-of-Experts）へと移行し、さらに学習初期からテキスト・画像・動画を同時に扱うネイティブマルチモーダル**設計となった2。

### **9.2 モデルラインナップと「Active vs Total」**

Llama 4では、推論時に計算に使用されるパラメータ（Active）と、メモリ上に保持される総パラメータ（Total）の概念区分が重要となる。

| モデル名 | 総パラメータ (Total) | アクティブパラメータ (Active) | エキスパート数 | コンテキスト長 | アーキテクチャ | リリース日 |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Llama 4 Scout** | 109B | 17B | 16 | **1,000万** | MoE (Sparse) | 2025年4月 |
| **Llama 4 Maverick** | 400B | 17B | 128 | **1,000万** | MoE (Sparse) | 2025年4月 |
| **Llama 4 Behemoth** | \~2 Trillion | 288B | \~320 | \~1,000万 | MoE (Flagship) | (プレビュー) |

**データソース:** 5

### **9.3 Llama 4の技術的革新**

#### **9.3.1 超巨大コンテキスト (10 Million Context)**

ScoutおよびMaverickモデルは、**1,000万トークン**という前例のないコンテキストウィンドウを備えている5。

* **ユースケース:** 書籍数百冊分、あるいは長時間の動画データを一度に入力し、その内容について対話することが可能。これを実現するために、Ring Attention等の分散アテンション技術が高度に最適化されていると推測される。

#### **9.3.2 混合エキスパート (MoE) の詳細**

* **Scout (16 Experts):** エキスパート数が少なく、各エキスパートが汎用的な知識を持つ設計。推論速度重視。  
* **Maverick (128 Experts):** エキスパート数が極めて多く、知識が細粒度（Fine-grained）に専門化されている。アクティブパラメータはScoutと同じ17Bだが、総パラメータ400B分の知識ベースを持つため、複雑な推論やニッチな知識を要するタスクで圧倒的な性能を発揮する35。

#### **9.3.3 ネイティブマルチモーダルとEarly Fusion**

Llama 3.2のような「後付けアダプタ」ではなく、学習の最初期段階から画像や動画のトークンをテキストトークンと混合して学習させている（Early Fusion）。これにより、視覚情報とテキスト情報のより深い意味的結合が可能となり、動画の文脈理解能力が飛躍的に向上した30。

### **9.4 重要なライセンス変更：EU規制と「ジオフェンシング」**

Llama 4（およびLlama 3.2 Vision）のライセンスには、地政学的な制限条項が含まれている点に最大の注意が必要である。

* **EU利用制限:** 「Llama 4 Community License Agreement」には、**欧州連合（EU）に居住する個人、またはEUに主たる事業所を置く企業に対して、マルチモーダルモデルの利用権許諾を行わない**旨が明記されている37。  
* **背景:** EUのAI法（AI Act）やGDPRによる、AI学習データ（特に画像・動画）に関する厳しい規制リスクを回避するための措置と見られる。テキスト専用モデル（Llama 3.3など）はこの制限の対象外であるが、Llama 4のマルチモーダル機能は事実上「ジオフェンス」されている。これはデータベース構築時に必ずフラグ付けすべき重要項目である。

## ---

**10\. Llama Guard：セーフティエコシステム**

モデル本体に加え、入出力の安全性を判定する「Llama Guard」シリーズもJSONデータベースに含めるべき不可欠なコンポーネントである。

| モデル名 | ベースモデル | リリース時期 | 特徴 |
| :---- | :---- | :---- | :---- |
| **Llama Guard 1** | Llama 2 7B | 2023年12月 | 初代セーフティ分類器。6カテゴリの有害性を判定。 |
| **Llama Guard 2** | Llama 3 8B | 2024年4月 | MLCommonsタクソノミー準拠。11カテゴリに対応。 |
| **Llama Guard 3** | Llama 3.1 8B | 2024年7月 | 誹謗中傷、選挙干渉などのカテゴリを追加。 |
| **Llama Guard 3 Vision** | Llama 3.2 11B | 2024年9月 | 画像入力に対する安全性判定に対応。 |
| **Llama Guard 4** | Llama 4 Scout (Pruned) | 2025年4月 | ネイティブマルチモーダル（画像・動画）の安全性判定。12Bパラメータ40。 |

## ---

**11\. AIwiki用データベース構築のための構造化データ**

以下に、JSONファイルへの入力を想定した、正規化されたデータテーブルを提供する。

### **11.1 全モデル共通比較表**

| 世代 | ベースアーキテクチャ | 語彙サイズ | 位置埋め込み (RoPE) | 主なライセンス | 備考 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Llama 1** | Dense Transformer | 32k (SentencePiece) | $\\theta=10k$ | Non-Commercial Research | 重み流出により事実上のオープン化 |
| **Llama 2** | Dense Transformer | 32k (SentencePiece) | $\\theta=10k$ | Llama 2 Community License | 商用利用解禁 (MAU \< 700M) |
| **Code Llama** | Dense Transformer | 32k (SentencePiece) | $\\theta=1M$ | Llama 2 Community License | 100kロングコンテキスト |
| **Llama 3** | Dense Transformer | 128k (Tiktoken) | $\\theta=500k$ | Llama 3 Community License | 語彙拡張による効率化 |
| **Llama 3.1** | Dense Transformer | 128k (Tiktoken) | Scaled | Llama 3.1 Community License | 128kコンテキスト、405B登場 |
| **Llama 3.2** | Dense / Compositional | 128k (Tiktoken) | Scaled | Llama 3.2 Community License | Edge向けとVision向けに分化 |
| **Llama 3.3** | Dense Transformer | 128k (Tiktoken) | Scaled | Llama 3.3 Community License | 70Bの完成形 |
| **Llama 4** | Sparse MoE | \>128k | Long Context | Llama 4 Community License | **EU利用制限あり** (Multimodalのみ) |

### **11.2 Llama 4 詳細仕様 (JSONスキーマ対応)**

JSON

,  
    "parameters": {  
      "total": "109B",  
      "active": "17B"  
    },  
    "experts": {  
      "count": 16,  
      "routing": "Top-k"  
    },  
    "context\_window": 10000000,  
    "license": {  
      "name": "Llama 4 Community License",  
      "restrictions":  
    }  
  },  
  {  
    "model\_id": "meta-llama/Llama-4-Maverick",  
    "release\_date": "2025-04-05",  
    "architecture": "Mixture-of-Experts",  
    "modalities": \["text", "image", "video"\],  
    "parameters": {  
      "total": "400B",  
      "active": "17B"  
    },  
    "experts": {  
      "count": 128,  
      "routing": "Top-k"  
    },  
    "context\_window": 10000000,  
    "license": {  
      "name": "Llama 4 Community License",  
      "restrictions":  
    }  
  }  
\]

## **12\. 結論**

Llamaの系譜分析は、AIモデルが「単なるテキスト生成器」から「社会インフラとしての知識エンジン」へと進化していく過程を如実に示している。Llama 1でのオープン化の衝撃から始まり、Llama 2での商用化、Llama 3での性能飽和への挑戦、そしてLlama 4でのMoEとマルチモーダルへの構造転換は、全て計算資源とデータ効率の最適化という一つのベクトルに向かっている。  
特にLlama 4における「1,000万トークンコンテキスト」と「EU利用制限」は、今後のAI開発が技術的な課題だけでなく、法的・地政学的な課題とも不可分であることを示唆している。AIwikiの構築にあたっては、単なるスペックの羅列にとどまらず、モデルが利用可能な地域（Jurisdiction）や、特定のアーキテクチャ（MoE vs Dense）が推論インフラに与える影響（VRAM要件の違い等）も含めた多次元的なデータ構造が求められるだろう。  
---

**参考文献・出典ID:** .1

#### **引用文献**

1. arXiv:2302.13971v1 \[cs.CL\] 27 Feb 2023, 1月 26, 2026にアクセス、 [https://arxiv.org/pdf/2302.13971](https://arxiv.org/pdf/2302.13971)  
2. Llama (language model) \- Wikipedia, 1月 26, 2026にアクセス、 [https://en.wikipedia.org/wiki/Llama\_(language\_model)](https://en.wikipedia.org/wiki/Llama_\(language_model\))  
3. LLAMA Series. — technical evolution of LLAMA models | by Ankit kumar \- Medium, 1月 26, 2026にアクセス、 [https://ankittaxak5713.medium.com/llama-series-02f7786f39ec](https://ankittaxak5713.medium.com/llama-series-02f7786f39ec)  
4. LLama 2 \- Analysis | Continuum Labs, 1月 26, 2026にアクセス、 [https://training.continuumlabs.ai/models/foundation-models/llama-2-analysis](https://training.continuumlabs.ai/models/foundation-models/llama-2-analysis)  
5. Evolution of Meta's LLaMA Models and Parameter-Efficient Fine-Tuning of Large Language Models: A Survey \- arXiv, 1月 26, 2026にアクセス、 [https://arxiv.org/html/2510.12178v1](https://arxiv.org/html/2510.12178v1)  
6. llama/MODEL\_CARD.md at main \- GitHub, 1月 26, 2026にアクセス、 [https://github.com/meta-llama/llama/blob/main/MODEL\_CARD.md](https://github.com/meta-llama/llama/blob/main/MODEL_CARD.md)  
7. To Achieve State-of-the-Art Performance by Training Exclusively on Publicly Available Data, 1月 26, 2026にアクセス、 [https://hackernoon.com/to-achieve-state-of-the-art-performance-by-training-exclusively-on-publicly-available-data](https://hackernoon.com/to-achieve-state-of-the-art-performance-by-training-exclusively-on-publicly-available-data)  
8. Meta's Llama \- Models in Amazon Bedrock \- AWS, 1月 26, 2026にアクセス、 [https://aws.amazon.com/bedrock/meta/](https://aws.amazon.com/bedrock/meta/)  
9. Brief Introduction to Llama 2 \- Medium, 1月 26, 2026にアクセス、 [https://medium.com/@florian\_algo/brief-introduction-to-llama-2-cec2d59fc13f](https://medium.com/@florian_algo/brief-introduction-to-llama-2-cec2d59fc13f)  
10. Thoughts from LLama-2 paper \- Medium, 1月 26, 2026にアクセス、 [https://medium.com/@manavg/thoughts-from-llama-2-paper-b8013bab3a8](https://medium.com/@manavg/thoughts-from-llama-2-paper-b8013bab3a8)  
11. Llama 2: Open Foundation and Fine-Tuned Chat Models \- arXiv, 1月 26, 2026にアクセス、 [https://arxiv.org/pdf/2307.09288](https://arxiv.org/pdf/2307.09288)  
12. Grouped Query Attention (GQA) vs. Multi Head Attention (MHA): LLM Inference Serving Acceleration \- FriendliAI, 1月 26, 2026にアクセス、 [https://friendli.ai/blog/gqa-vs-mha](https://friendli.ai/blog/gqa-vs-mha)  
13. Llama 2: Meta AI's Advanced Open-Source LLM Model \- Viso Suite, 1月 26, 2026にアクセス、 [https://viso.ai/deep-learning/llama-2/](https://viso.ai/deep-learning/llama-2/)  
14. Code Llama: Open Foundation Models for Code \- arXiv, 1月 26, 2026にアクセス、 [https://arxiv.org/html/2308.12950v3](https://arxiv.org/html/2308.12950v3)  
15. llama3/MODEL\_CARD.md at main · meta-llama/llama3 \- GitHub, 1月 26, 2026にアクセス、 [https://github.com/meta-llama/llama3/blob/main/MODEL\_CARD.md](https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md)  
16. Llama 3.1 \- 405B, 70B & 8B with multilinguality and long context \- Hugging Face, 1月 26, 2026にアクセス、 [https://huggingface.co/blog/llama31](https://huggingface.co/blog/llama31)  
17. FareedKhan-dev/Building-llama3-from-scratch: LLaMA 3 is one of the most promising open-source model after Mistral, we will recreate it's architecture in a simpler manner. \- GitHub, 1月 26, 2026にアクセス、 [https://github.com/FareedKhan-dev/Building-llama3-from-scratch](https://github.com/FareedKhan-dev/Building-llama3-from-scratch)  
18. Understand How Llama3.1 Works — A Deep Dive Into the Model Flow | by Xiaojian Yu, 1月 26, 2026にアクセス、 [https://medium.com/@yuxiaojian/understand-how-llama3-1-works-a-deep-dive-into-the-model-flow-b149aba04bed](https://medium.com/@yuxiaojian/understand-how-llama3-1-works-a-deep-dive-into-the-model-flow-b149aba04bed)  
19. Llama-3, A Deep Dive | The Critical Section, 1月 26, 2026にアクセス、 [https://aceofgreens.github.io/llama\_3.html](https://aceofgreens.github.io/llama_3.html)  
20. Meta releases new Llama 3.1 models, including highly anticipated 405B parameter variant | IBM, 1月 26, 2026にアクセス、 [https://www.ibm.com/think/news/meta-releases-llama-3-1-models-405b-parameter-variant](https://www.ibm.com/think/news/meta-releases-llama-3-1-models-405b-parameter-variant)  
21. meta-llama/Llama-3.2-3B-Instruct \- Hugging Face, 1月 26, 2026にアクセス、 [https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)  
22. Architecture difference of llama3 flavors : r/LocalLLaMA \- Reddit, 1月 26, 2026にアクセス、 [https://www.reddit.com/r/LocalLLaMA/comments/1ihd8pm/architecture\_difference\_of\_llama3\_flavors/](https://www.reddit.com/r/LocalLLaMA/comments/1ihd8pm/architecture_difference_of_llama3_flavors/)  
23. Llama 3.2 Overview — NVIDIA NIM for Vision Language Models (VLMs), 1月 26, 2026にアクセス、 [https://docs.nvidia.com/nim/vision-language-models/1.2.0/examples/llama3-2/overview.html](https://docs.nvidia.com/nim/vision-language-models/1.2.0/examples/llama3-2/overview.html)  
24. Introducing Llama 3.2 models from Meta in Amazon Bedrock: A new generation of multimodal vision and lightweight models | AWS News Blog, 1月 26, 2026にアクセス、 [https://aws.amazon.com/blogs/aws/introducing-llama-3-2-models-from-meta-in-amazon-bedrock-a-new-generation-of-multimodal-vision-and-lightweight-models/](https://aws.amazon.com/blogs/aws/introducing-llama-3-2-models-from-meta-in-amazon-bedrock-a-new-generation-of-multimodal-vision-and-lightweight-models/)  
25. Llama 3.2 Instruct 3B Intelligence, Performance & Price Analysis, 1月 26, 2026にアクセス、 [https://artificialanalysis.ai/models/llama-3-2-instruct-3b](https://artificialanalysis.ai/models/llama-3-2-instruct-3b)  
26. Inside Multimodal LLaMA 3.2: Understanding Meta's Vision-Language Model Architecture, 1月 26, 2026にアクセス、 [https://j-qi.medium.com/inside-mllama-3-2-understanding-metas-vision-language-model-architecture-ae12ad24dcbf](https://j-qi.medium.com/inside-mllama-3-2-understanding-metas-vision-language-model-architecture-ae12ad24dcbf)  
27. llama-models/models/llama3\_3/MODEL\_CARD.md at main \- GitHub, 1月 26, 2026にアクセス、 [https://github.com/meta-llama/llama-models/blob/main/models/llama3\_3/MODEL\_CARD.md](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md)  
28. What Does the Llama 3.3 Release Mean for the Customer Support Industry? \- SearchUnify, 1月 26, 2026にアクセス、 [https://www.searchunify.com/resource-center/blog/what-does-the-llama-3-3-release-mean-for-the-customer-support-industry](https://www.searchunify.com/resource-center/blog/what-does-the-llama-3-3-release-mean-for-the-customer-support-industry)  
29. Which Llama 3 Model is Right for You? A Comparison Guide | by Novita AI \- Medium, 1月 26, 2026にアクセス、 [https://medium.com/@marketing\_novita.ai/which-llama-3-model-is-right-for-you-a-comparison-guide-87de6c017c48](https://medium.com/@marketing_novita.ai/which-llama-3-model-is-right-for-you-a-comparison-guide-87de6c017c48)  
30. Llama 4's Architecture Deconstructed: MoE, iRoPE, and Early Fusion Explained \- Medium, 1月 26, 2026にアクセス、 [https://medium.com/@mandeep0405/llama-4s-architecture-deconstructed-moe-irope-and-early-fusion-explained-e58eb9403067](https://medium.com/@mandeep0405/llama-4s-architecture-deconstructed-moe-irope-and-early-fusion-explained-e58eb9403067)  
31. Meta Llama \- Hugging Face, 1月 26, 2026にアクセス、 [https://huggingface.co/meta-llama](https://huggingface.co/meta-llama)  
32. Meta AI All Models Available: Llama‑4, Llama‑3, and Deployment Options \- Data Studios, 1月 26, 2026にアクセス、 [https://www.datastudios.org/post/meta-ai-all-models-available-llama-4-llama-3-and-deployment-options](https://www.datastudios.org/post/meta-ai-all-models-available-llama-4-llama-3-and-deployment-options)  
33. meta-llama/Llama-4-Scout-17B-16E-Instruct \- Hugging Face, 1月 26, 2026にアクセス、 [https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct)  
34. LLMs with largest context windows \- Codingscape, 1月 26, 2026にアクセス、 [https://codingscape.com/blog/llms-with-largest-context-windows](https://codingscape.com/blog/llms-with-largest-context-windows)  
35. Evaluating Meta's Llama 4 Models for Enterprise Content with Box AI, 1月 26, 2026にアクセス、 [https://blog.box.com/evaluating-metas-llama-4-models-enterprise-content-box-ai](https://blog.box.com/evaluating-metas-llama-4-models-enterprise-content-box-ai)  
36. Specializations of Llama 4 Scout & Maverick Models: A Comparative Analysis \- Medium, 1月 26, 2026にアクセス、 [https://medium.com/@rajraftaar3/specializations-of-llama-4-scout-maverick-models-a-comparative-analysis-344b20e7f002](https://medium.com/@rajraftaar3/specializations-of-llama-4-scout-maverick-models-a-comparative-analysis-344b20e7f002)  
37. Breaking the Llama Community License | Hacker News, 1月 26, 2026にアクセス、 [https://news.ycombinator.com/item?id=43676254](https://news.ycombinator.com/item?id=43676254)  
38. Llama 4 is open \- unless you are in the EU : r/LocalLLaMA \- Reddit, 1月 26, 2026にアクセス、 [https://www.reddit.com/r/LocalLLaMA/comments/1jtejzj/llama\_4\_is\_open\_unless\_you\_are\_in\_the\_eu/](https://www.reddit.com/r/LocalLLaMA/comments/1jtejzj/llama_4_is_open_unless_you_are_in_the_eu/)  
39. Using Llama Models in the EU \- Sara Zan, 1月 26, 2026にアクセス、 [https://www.zansara.dev/posts/2025-05-16-llama-eu-ban/](https://www.zansara.dev/posts/2025-05-16-llama-eu-ban/)  
40. Llama Guard – Vertex AI \- Google Cloud Console, 1月 26, 2026にアクセス、 [https://console.cloud.google.com/vertex-ai/publishers/meta/model-garden/llama-guard](https://console.cloud.google.com/vertex-ai/publishers/meta/model-garden/llama-guard)  
41. meta-llama/Meta-Llama-3-8B \- Hugging Face, 1月 26, 2026にアクセス、 [https://huggingface.co/meta-llama/Meta-Llama-3-8B](https://huggingface.co/meta-llama/Meta-Llama-3-8B)  
42. meta-llama/Llama-3.2-1B \- Hugging Face, 1月 26, 2026にアクセス、 [https://huggingface.co/meta-llama/Llama-3.2-1B](https://huggingface.co/meta-llama/Llama-3.2-1B)  
43. \[2302.13971\] LLaMA: Open and Efficient Foundation Language Models \- arXiv, 1月 26, 2026にアクセス、 [https://arxiv.org/abs/2302.13971](https://arxiv.org/abs/2302.13971)  
44. Insight into architecture details of Vision Llama 3.2 \- AI Stack Exchange, 1月 26, 2026にアクセス、 [https://ai.stackexchange.com/questions/47106/insight-into-architecture-details-of-vision-llama-3-2](https://ai.stackexchange.com/questions/47106/insight-into-architecture-details-of-vision-llama-3-2)  
45. llama-3.3-70b-instruct Model by Meta \- NVIDIA NIM APIs, 1月 26, 2026にアクセス、 [https://build.nvidia.com/meta/llama-3\_3-70b-instruct/modelcard](https://build.nvidia.com/meta/llama-3_3-70b-instruct/modelcard)  
46. Build Your Own Llama 3 Architecture from Scratch Using PyTorch | by Milan Tamang, 1月 26, 2026にアクセス、 [https://pub.towardsai.net/build-your-own-llama-3-architecture-from-scratch-using-pytorch-2ce1ecaa901c](https://pub.towardsai.net/build-your-own-llama-3-architecture-from-scratch-using-pytorch-2ce1ecaa901c)  
47. What is Llama? Meta AI's family of large language models explained \- Azalio, 1月 26, 2026にアクセス、 [https://www.azalio.io/what-is-llama-meta-ais-family-of-large-language-models-explained/](https://www.azalio.io/what-is-llama-meta-ais-family-of-large-language-models-explained/)  
48. Meta's LLaMa license is still not Open Source, 1月 26, 2026にアクセス、 [https://opensource.org/blog/metas-llama-license-is-still-not-open-source](https://opensource.org/blog/metas-llama-license-is-still-not-open-source)