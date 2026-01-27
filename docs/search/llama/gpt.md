# Meta社LLaMA（Llama）シリーズ全モデルの系譜・仕様・性能・ライセンス調査レポート

## 調査範囲と方法

本レポートは、Metaが公式に公開・配布した「LLaMA / Llama」系のモデル群を、初期（LLaMA v1）から現時点（日本時間 2026-01-26）で最新の公開世代（Llama 4）まで、系譜（どのモデルが何をベースに生まれたか）を含めて体系的に整理する。根拠は一次情報（Metaのモデルカード、公式GitHub、論文・技術報告）を優先し、補助的にHugging Faceの公式orgページ（meta-llama）や日本語記事も参照した。なお、Metaの一部公式ブログ（ai.meta.com）は、現時点ではログイン要求により本文参照が困難なページが増えているため、同内容を含むモデルカード・論文・リポジトリ記載を主軸にした（例：Llama 3/4のモデルカードはGitHub rawで参照可能）。citeturn28view0turn31view1turn35view1

「公式にリリース」の定義は、(a) Metaが公式配布（Meta公式配布ページ・公式GitHub・meta-llama公式HF org）した重み/チェックポイント、(b) 公式モデルカードが付随するもの、(c) 公式ライセンス（Llama Community License系列、または当該モデルの配布条件）に基づき提供されるもの——とする。citeturn28view0turn7view0turn19view0

---

## モデル系譜とバージョンアップの流れ

### 系譜の要点（世代ごとの「何が変わったか」）

LLaMA/Llamaの進化は大きく **(1)アーキテクチャ（Dense→MoE、GQAの全面化、マルチモーダル化）、(2)コンテキスト長（2k→4k→8k→128k→最大10M）、(3)データ規模・性質（公的データのみ→公的データ＋合成/指示データ拡大→一部Metaプロダクト由来データを含む）、(4)配布条件（研究者向けゲート→商用も含むコミュニティライセンス体系）** の軸で整理できる。LLaMA v1は「公的データのみで高性能」を強調し、SentencePiece BPE＋RoPE＋RMSNorm＋SwiGLUなど当時の強い設計を採用した。citeturn12view3turn11view0  
Llama 2は学習トークンを2Tに増やし、文脈長を4kへ倍増、（特に大モデルで）GQAを導入して推論スケールを意識した。学習データにMetaプロダクト/サービス由来データは含まないと明記している。citeturn15view0turn14view0  
Llama 3は128K語彙・8k学習長・全サイズでGQAを使い、15T+規模の公的データ中心で学習、さらに「事前学習/微調整ともMetaユーザーデータを含まない」とモデルカードで明言した点が重要。citeturn31view1turn31view0  
Llama 3.1は128k文脈を標準化し、8B/70Bに加えて405Bを公開（最大級の公開ウェイト級モデルとして位置づけ）し、微調整データに「公開指示データ＋2,500万超の合成例」を含むと明記している。citeturn32view0  
Llama 3.2はモバイル等の制約環境向けに1B/3Bを追加し、さらにVision（11B/90B）で画像入力を公式ラインに統合した（「テキスト＋画像入力/テキスト出力」）。citeturn28view0turn9search7turn9search2  
Llama 3.3は70Bのinstruction-tuned単独に絞りつつ、従来より強い性能（例：MMLU Pro/IFEval/Math/Codeなど）を主張し、Llama 3.1 405Bに近い一部指標も示している。citeturn34view0  
最新のLlama 4は、MoE（Mixture-of-Experts）＋早期融合（early fusion）によるネイティブマルチモーダルを採用し、**Scout（17B active×16 experts／109B total、最大10M文脈）**と**Maverick（17B active×128 experts／400B total、最大1M文脈）**を公開。学習データには公的・ライセンスデータに加え、Instagram/Facebookの公開投稿やMeta AIとの対話など「Metaプロダクト/サービス由来情報」を含むとモデルカードが明記している。citeturn35view1

### 系譜図（視覚化）

（凡例）**Base**＝事前学習（基盤）モデル、**Instruct/Chat**＝指示追従・対話最適化、**Code**＝コード特化、**Vision**＝画像入力対応、**Guard**＝安全分類/防御用

```mermaid
flowchart TD
  A[LLaMA v1 (2023-02)\n7B/13B/33B/65B\nDense Transformer] --> B[Llama 2 (2023-07)\n7B/13B/70B\n+ 4k context\n+ GQA for large]
  B --> Bc[Llama 2-Chat\n7B/13B/70B\nSFT+RLHF]
  B --> C[Code Llama (2023-08)\n7B/13B/34B/70B\n16k train, <=100k improve\nInfilling/Python/Instruct]
  A --> D[Community surge\nAlpaca/Vicuna etc\n(v1 leak-era)]

  B --> E[Llama 3 (2024-04)\n8B/70B\n128K vocab, 8k ctx, GQA]
  E --> Ei[Llama 3 Instruct\n8B/70B]
  E --> F[Llama 3.1 (2024-07)\n8B/70B/405B\n128k ctx]
  F --> Fi[Llama 3.1 Instruct\n8B/70B/405B]
  F --> G[Llama 3.2 (2024-09)\n1B/3B text\n+ Vision 11B/90B]
  G --> Gi[Llama 3.2 Instruct\n1B/3B]
  G --> Gv[Llama 3.2 Vision\n11B/90B]
  F --> H[Llama 3.3 (2024-12)\n70B Instruct]
  
  H --> I[Llama 4 (2025-04)\nMoE + early fusion\nScout 10M ctx / Maverick 1M ctx]
  I --> Ig[Llama Guard 4 (2025-04)\n12B multimodal safety\n(pruned from Llama 4 Scout)]
  F --> Gg[Llama Guard 3\n1B/8B/11B-Vision]
```

根拠となる公式整理として、meta-llama公式HF orgは「Current: Llama 4（Scout/Maverick）」、Historyに「Llama 3.3 / 3.2 / 3.2 Vision / 3.1 / Llama 2 / Code Llama」等を列挙している。citeturn28view0  
また、Meta公式GitHub（llama-models）は、Llama 2→3→3.1→3.2→3.2 Vision→3.3→4の主要世代を一覧化している。citeturn7view0

---

## モデル一覧と比較表

### 世代（メジャーリリース）比較

主要世代の「何が違うか」を比較しやすいよう、主な公開世代を縦串で並べる（細かな派生は次章で網羅）。

| 世代 | 代表公開日 | 公開サイズ（公式） | 入出力 | 代表コンテキスト | 学習トークン規模（公表範囲） | 主要特徴 | ライセンス概況 |
|---|---:|---|---|---:|---:|---|---|
| LLaMA v1 | 2023-02下旬 | 7B/13B/33B/65Bciteturn11view0turn12view3 | text→text | 2k（後続論文比較）citeturn15view0 | 1.0T/1.4Tciteturn12view3 | 公的データのみ、RMSNorm/SwiGLU/RoPE、SentencePiece BPEciteturn12view3 | 研究コミュニティ向けゲート配布（当時は厳しめ）※ |
| Llama 2 | 2023-07-18citeturn19view0turn13search10 | 7B/13B/70B（34Bは学習したが未公開）citeturn14view0turn15view0 | text→text | 4kciteturn15view0 | 2.0Tciteturn15view0 | データクリーニング強化、GQA（34B/70B）、Chat（SFT+RLHF）同時公開citeturn15view0turn14view0 | Llama 2 Community License（700M MAU条項等）citeturn19view0 |
| Code Llama | 2023-08-24（70Bは2024-01追補）citeturn38search0turn38search2 | 7B/13B/34B/70Bciteturn38search0turn38search3 | code/text→code/text | 16k学習、最大100kで改善citeturn38search0turn38search1 | （論文/カード内で段階学習を説明） | infilling・Python特化・Instructの3系統、公開モデルで高性能（HumanEval/MBPPなど）citeturn38search0turn38search3 | 論文上は研究・商用を許す「permissive」主張citeturn38search0turn38search2 |
| Llama 3 | 2024-04-18citeturn31view1 | 8B/70B（Base/Instruct）citeturn31view1 | text→text/code | 8kciteturn31view1 | 15T+citeturn31view1turn31view0 | 語彙128k、全モデルGQA、（v3では）Metaユーザーデータ不使用明言citeturn31view1turn31view0 | Llama 3 Community License（リンク提示）citeturn31view1turn37search9 |
| Llama 3.1 | 2024-07-23citeturn32view0 | 8B/70B/405B（Base/Instruct）citeturn32view0 | text→text/code | 128kciteturn32view0 | 15T+、合成例25M+citeturn32view0 | 長文脈標準化、主要ベンチで強化（MMLU/GPQA/HumanEval/GSM8K/MATH等）citeturn32view0 | Llama 3.1 Community Licenseciteturn32view0 |
| Llama 3.2 | 2024-09-25（HF）/ 2024-10-24（GitHubカード）citeturn9search2turn33view1 | text 1B/3B、Vision 11B/90Bciteturn28view0turn9search7turn9search2 | text→text/code、（Visionはtext+image→text）citeturn28view0turn9search7 | 128k（小型量子版は8k記載あり）citeturn33view1 | up to 9Tciteturn33view1 | モバイル想定（1B/3B）、Vision公式化citeturn33view1turn28view0 | Llama 3.2 Community Licenseciteturn33view1 |
| Llama 3.3 | 2024-12-06citeturn34view0 | 70B Instruct中心citeturn34view0 | text→text/code | 128kciteturn34view0 | 15T+citeturn34view0 | 70Bで高性能（MMLU Pro/IFEval/Math/Code等を提示）citeturn34view0 | Llama 3.3 Community Licenseciteturn34view0 |
| Llama 4 | 2025-04-05citeturn35view1 | Scout（17B active×16E / 109B total）、Maverick（17B active×128E / 400B total）citeturn35view1turn28view0 | text+image→text/code | Scout 10M / Maverick 1Mciteturn35view1 | Scout ~40T / Maverick ~22Tciteturn35view1 | MoE＋early fusion、Natively multimodal、学習データにMetaプロダクト情報を含む明記citeturn35view1 | Llama 4 Community Licenseciteturn35view1turn10search22 |

※LLaMA v1の配布条件は当時「ゲート付きで研究コミュニティ向け」だったことが広く報じられ、後にLlama 2以降で商用含む配布へ移行した、という歴史的整理が多い（例：日本語報道）。citeturn29search5turn37news43turn14view0

---

## 各モデルの詳細カタログ

この章では、ユーザー要件（名称、リリース日、パラメータ、アーキテクチャ、データ、トークナイザ、ベンチマーク、ライセンス、派生）を、**「公式に確認できる範囲」**で世代ごとに網羅する。

### LLaMA v1（LLaMA: Open and Efficient Foundation Language Models）

**モデル名・サイズ（パラメータ）**  
論文（ar5iv）で「7B〜65B」コレクションとされ、70Bではなく **33B** が公式サイズである点に注意（コミュニティでは誤って30B表記が混ざることがある）。citeturn11view0turn12view3  
- LLaMA 7B：6.7B params（表記上）citeturn12view3  
- LLaMA 13B：13.0B paramsciteturn12view3  
- LLaMA 33B：32.5B paramsciteturn12view3  
- LLaMA 65B：65.2B paramsciteturn12view3  

**リリース日（公式一次情報に近い日付の扱い）**  
arXivの投稿日は **2023-02-27**。citeturn29search2  
一方、報道ベースでは2月下旬に「Metaが新言語モデルLLaMAを発表」として動いている（例：Reuters 2023-02-24/25相当、日本語報道も2月下旬）。citeturn29search3turn29search5  
実務上は「2023年2月下旬リリース」と表記し、日付厳密性が必要なら論文投稿日（2023-02-27）を採用すると一貫する。citeturn29search2

**アーキテクチャ特徴**  
Transformerデコーダ型をベースに、(1) Pre-normalization（RMSNorm）、(2) SwiGLU、(3) 絶対位置埋め込みをやめRoPEを採用、などを「主な差分」として列挙している。citeturn12view3  

**トレーニングデータ概要**  
「公開データのみ（publicly available datasets exclusively）」で、データ混合比率とディスク規模をTable 1として提示。主比率は CommonCrawl 67%、C4 15%、GitHub 4.5%、Wikipedia 4.5%、Books 4.5%、ArXiv 2.5%、StackExchange 2%。citeturn11view0turn12view3  
学習トークン数は、トークナイズ後で **約1.4T**（全体）。ただし7B/13Bは1.0T、33B/65Bは1.4Tで学習したことも図注・表で示される。citeturn12view3  

**トークナイザー仕様**  
Byte Pair Encoding（BPE）をSentencePiece実装で使用し、数字を1桁ずつに分割、未知UTF-8文字はバイトへフォールバックする、と明記。citeturn12view3  

**性能指標（例）**  
論文アブストラクトで「LLaMA-13BがGPT-3(175B)を多くのベンチで上回り、LLaMA-65BがChinchilla-70BやPaLM-540B級と競争的」と主張。citeturn11view0  
実際のベンチ表（例：Common Sense Reasoning系）でも、サイズ増加に伴うスコア上昇が提示される。citeturn12view3  
MMLUの詳細表（付録）では、7B/13B/33B/65Bの列が明示される。citeturn11view2  

**ライセンス・利用条件**  
論文自体は「研究コミュニティへリリース」と書くが、Llama 2以降のような“Community License本文”がこの論文ページでは明示されない。citeturn11view0  
歴史的には「ゲート付きで研究者中心に提供」→リーク→Llama 2で商用含む形へ、という移行が広く報じられている。citeturn37news46turn37news43  

---

### Llama 2（Llama 2 / Llama 2-Chat）

**モデル名・リリース日**  
Llama 2 Community License Agreementに「Llama 2 Version Release Date: July 18, 2023」と明記される。citeturn19view0  
同日、MetaはMicrosoftとのパートナーシップ拡大としてLlama 2提供を発表している（公式Newsroom）。citeturn13search10  

**公開サイズ**  
論文（ar5iv）で、公開するのは **7B/13B/70B**（Base）および **7B/13B/70B**（Chat）。34Bも学習したが、当時は十分なレッドチーミング時間不足として「未公開」と明記。citeturn14view0turn15view0  

**アーキテクチャ特徴（v1からの差分）**  
Llama 1の設定を多く踏襲しつつ、**文脈長を2048→4096へ倍増**、大モデルで**GQAを導入**、さらに「より堅牢なデータクリーニング」「データミックス変更」「総トークンを40%増」などを列挙。citeturn15view0turn14view0  
RMSNorm / SwiGLU / RoPEを使う点も明確に再掲。citeturn15view0  

**トレーニングデータ概要**  
「新しい公開ソースのミックス」で **Meta製品・サービスのデータは含まない**、2T tokensを学習、と明記。citeturn15view0  

**トークナイザー仕様**  
論文内でv1と同一と断言する書き方は薄いが、Hugging Faceのtransformers公式ドキュメントは「SentencePieceに基づくBPE tokenizer」「vocab_size=32000（デフォルト）」等を明記している。citeturn13search3turn13search7  

**性能指標（例）**  
論文は「Llama 2はLlama 1を上回る」とし、**Llama 2 70BはLlama 1 65Bに比べMMLUで+5、BBHで+8**と具体的に述べる。citeturn14view1  
安全性系の自動評価例としてTruthfulQA（truthful+informative比率）やToxiGen（毒性生成率）を載せ、Llama 2-Chat 7B/13B/70Bの値を示す（表形式）。citeturn14view0  

**ライセンス（重要条項）**  
Llama 2 Community Licenseは、(a) 受領者へのライセンス同梱、(b) Acceptable Use Policy遵守、(c) **“他の大規模言語モデルを改善するために出力を使うことを禁止（Llama 2派生を除く）”**、(d) **“リリース時点で700M MAU超の製品/サービスを持つ場合、Metaに追加ライセンス申請が必要”** を明記する。citeturn19view0  

---

### Code Llama（Llama 2派生のコード特化モデル群）

**モデル群の位置づけ（系譜）**  
Code Llama論文は「Llama 2ベースのコード向けLLMファミリー」と定義し、一般コード（Code Llama）、Python特化（Code Llama-Python）、命令追従（Code Llama-Instruct）を提示する。citeturn38search0turn38search3  
meta-llama公式HF orgも、Code Llamaを「Llama 2のコード特化版（base/Python/Instructの3 flavors）」として履歴に記載している。citeturn28view0  

**公開サイズ・派生の構造**  
論文では **7B/13B/34B/70B** を掲げ、特に7B/13B/70Bは「infilling（周辺文脈を埋める）」目的で学習したと説明し、34Bはinfillingなしと述べる。citeturn38search0turn38search3  

**コンテキストと位置表現拡張**  
Code Llama論文アブストラクトは「16kトークン列で学習、最大100k入力で改善が見られる」と述べる。citeturn38search0  
Hugging Faceの解説記事も、RoPEスケーリング等でLlama 2の4k→Code Llamaの16k（かつ最大100kまで安定）を可能にした経緯を説明している。citeturn38search1  

**性能指標（代表例）**  
論文アブストラクトで、HumanEval最大67%、MBPP最大65%等を提示し、公開モデルの中でSOTA級と主張する。citeturn38search0  

**リリース日の扱い**  
arXivの投稿日は **2023-08-24**。citeturn38search0  
またMeta公式ブログ側（当時）は「2024-01-29: Code Llama 70B追加リリース」とアップデート記載がある（ただしai.meta.comは現状ログイン要求が出ることがあるため、本文依存は避け、arXiv・その他公式記述を優先）。citeturn38search2  

**ライセンス**  
論文アブストラクトは「研究・商用を許すpermissive license」と述べ、Llama 2同様に利用可能性を強調している。citeturn38search0  

---

### Llama 3 / 3.1 / 3.2 / 3.3（Llama 3系統の拡張）

#### Llama 3（2024-04-18）

**公開サイズ・形式**  
8B/70Bの「Base（pre-trained）とInstruct」を持つ。citeturn31view1  

**アーキテクチャ・トークナイザー・文脈長**  
モデルカードで「最適化Transformer」「語彙128K tokenizer」「学習シーケンス長8192」「全モデルGQA」を明記。citeturn31view1  

**学習データ**  
「公開オンラインデータの新ミックス」「15T+ tokens」で事前学習、と記載。さらに重要な点として **事前学習・微調整の双方でMetaユーザーデータを含まない** と明記している。citeturn31view0turn31view1  

**ライセンス**  
モデルカードはLlama 3 Community Licenseへのリンクを提示し、カスタム商用ライセンスである旨を記す。citeturn31view1turn37search9  

#### Llama 3.1（2024-07-23）

**公開サイズ**  
8B/70B/405B（Base＋Instruct）を公式モデルカードが列挙。citeturn32view0  

**文脈長・対応言語**  
コンテキスト長 **128k** を全サイズで提示し、公式サポート言語は英・独・仏・伊・葡・ヒンディ・西・タイの8言語。citeturn32view0  

**学習データ**  
事前学習は ~15T tokens（公開ソース）とし、微調整には「公開指示データ＋2,500万超の合成生成例」を含むと明記。citeturn32view0  

**性能指標（ベンチマークの例：公式表から抜粋）**  
Llama 3.1モデルカードは、旧Llama 3（8B/70B）と同一表で比較数値を提示するため、この表が「Llama 3の代表ベンチ」も兼ねる。例えば Base（pretrained）側では MMLU 5-shotで Llama 3 70B=79.5、Llama 3.1 405B=85.2 等。Instruct側では HumanEval pass@1で Llama 3.1 8B Instruct=72.6、405B Instruct=89.0 等を提示している。citeturn32view0  

#### Llama 3.2（2024-09-25前後）

**公開サイズ（テキスト）**  
model cardでは「1B(1.23B)/3B(3.21B)」のテキストモデルを列挙し、量子化版も記載（量子化版はコンテキスト8kの記載がある）。citeturn33view1  

**公開サイズ（Vision）**  
公式HF orgが、Llama 3.2 Visionを「11B/90B（text+images→text）」として履歴に明記。citeturn28view0turn9search7  

**トークン規模・知識カットオフ**  
テキスト1B/3Bについて「最大9T tokens」「knowledge cutoff December 2023」を明記。citeturn33view1  

**リリース日（注意：ソース間差分）**  
Hugging Face側のモデルカードは **“Model Release Date: Sept 25, 2024”** と記載。citeturn9search2  
一方、meta-llama/llama-modelsのMODEL_CARD.md（raw）では **“Model Release Date: Oct 24, 2024”** と書かれている。実務では「初出（公開開始）＝2024-09-25」「文書更新/別配布形態＝2024-10-24」のように注記して扱うのが安全。citeturn33view1turn9search2  

#### Llama 3.3（2024-12-06）

**公開サイズ**  
70B Instructを中心に示す（text-only、128k文脈、15T+ tokens、cutoff Dec 2023）。citeturn34view0  

**性能指標（公式比較表）**  
Llama 3.3モデルカードは、Llama 3.1（8B/70B/405B）との比較で、MMLU Pro(CoT)やIFEval、GPQA Diamond、HumanEval、MATH(CoT)などを提示。例えば MATH(CoT)では Llama 3.3 70B Instruct=77.0、Llama 3.1 405B Instruct=73.8 といった数値が表に含まれる。citeturn34view0  

**日本語情報（補助）**  
AWS関連の国内技術ブログでも「Llama 3.3 70B は 2024-12-06リリース」として整理され、参照先として公式モデルカードを提示している。citeturn22search9  

---

### Llama 4（2025-04-05、現時点で公式“Current”世代）

meta-llama公式HF orgは、Llama 4を「Current」とし、Scout（17B with 16 experts）とMaverick（17B with 128 experts）の2モデルを開始点として明記している。citeturn28view0  

**公開モデル（コア）**  
- **Llama 4 Scout (17B×16E)**：Activated 17B / Total 109B、最大コンテキスト **10M**、token count **~40T**、knowledge cutoff **Aug 2024**citeturn35view1  
- **Llama 4 Maverick (17B×128E)**：Activated 17B / Total 400B、最大コンテキスト **1M**、token count **~22T**、knowledge cutoff **Aug 2024**citeturn35view1  

**アーキテクチャ特徴**  
モデルカードは、Llama 4が **MoE（mixture-of-experts）** を採用し、さらに **early fusion** により「ネイティブマルチモーダル」を実現すると明記。citeturn35view1  

**トレーニングデータの性質（大きな方針転換）**  
Llama 4は「公開・ライセンスデータ」に加え、**Facebook/Instagram上の公開投稿**や、**Meta AIとの対話**など「Metaの製品・サービスからの情報」を学習に含む、とモデルカードが明示している。これがLlama 3（“Metaユーザーデータ不使用”明言）からの大きな差分。citeturn35view1turn31view0  

**対応言語・入出力**  
サポート言語として12言語（アラビア語、英語、仏語、独語、ヒンディー語、インドネシア語、伊語、葡語、西語、タガログ語、タイ語、越語）を列挙し、入力は「多言語テキスト＋画像」、出力は「多言語テキスト＋コード」とする。citeturn35view1  

**性能指標（公式比較表：Llama 4モデルカード）**  
モデルカードは、Llama 3.1（70B/405B）やLlama 3.3（70B Instruct）と比較したベンチ表を掲載する。例えば Pretrained比較で MMLU（5-shot）において Llama 4 Maverick=85.5（vs Llama 3.1 405B=85.2）などを提示し、さらにChartQA/DocVQAなどマルチモーダル評価も提示している。citeturn35view2  

**ライセンス**  
「Llama 4 Community License Agreement」を提示し、Hugging Face上でもLlama Guard 4等のLICENSEファイルが同系列であることが確認できる。citeturn35view1turn10search22  

---

## 派生モデル・フォーク・エコシステム

### Meta公式の派生（“同根”の公式サブファミリー）

公式に「Llama」名で展開される派生は大別すると **(a)対話/指示追従（Chat/Instruct）、(b)用途特化（Code）、(c)モダリティ拡張（Vision / Multimodal）、(d)安全・防御（Guard / Prompt Guard）** である。meta-llama公式HF orgが、Llama本体に加えて「Llama Guard」「Prompt Guard」も公式orgとして運営していること自体が、このサブファミリー群を“公式配布モデル群”として扱う根拠になる。citeturn28view0  

#### Llama Guard（安全分類）
- **Llama Guard 3**：Llama-3.1-8Bベースの安全分類モデルとして説明され、入力（プロンプト）と出力（応答）の両方を分類可能とする。citeturn9search3  
- **Llama Guard 3-1B**：Llama-3.2-1Bベースの軽量安全分類。citeturn9search14  
- **Llama Guard 3 Vision**：Llama-3.2-11Bベースで、マルチモーダル（画像＋テキスト）安全分類に最適化。citeturn9search20  
- **Llama Guard 4 (12B)**：ネイティブマルチモーダル安全分類で、Llama 4 Scoutから「denseにpruneしたアーキテクチャ」とし、テキスト＋複数画像を扱えるとする。citeturn10search0turn35view1  

#### Prompt Guard / Prompt Guard 2（プロンプト攻撃対策）
Prompt injection / jailbreak等を分類し、LLM呼び出し前段フィルタとして使う設計であることを公式orgが説明している（Prompt GuardはmDeBERTa系の分類器として説明）。citeturn28view0  
Prompt Guard 2は 86M と 22M の2サイズを公開すると明記。citeturn10search2turn10search6  

### コミュニティ派生・フォーク（代表例と性質）

LLaMA v1は（当時の）限定配布やリークを契機に、オープンコミュニティで爆発的に派生が増えたと報じられ、代表例としてAlpacaやVicunaのような指示追従系が生まれた、という文脈がある。citeturn37news46  
また、Meta自身の用語としても「派生（derivative works）」をライセンスで定義し、派生配布時の条件を課している（例：Llama 2ライセンスは派生配布時に合意文面を渡す等）。citeturn19view0  

実務的に重要なコミュニティ派生の分類は次の通り。
- **量子化・実装派生（例：GGUF系）**：同一重みを量子化（INT4等）してローカル推論可能にする派生が多い（HF上に多数存在し、Llama 4やLlama 3.3でもGGUF配布が見られる）。citeturn10search13turn10search18  
- **学習済み派生（SFT/LoRA/蒸留）**：公開モデルをベースに組織・用途特化指示データで微調整した派生。ライセンス上の制約（特に「Acceptable Use」「大規模企業条項」「他LLM改善への出力利用制限」等）を守る必要がある。citeturn19view0turn32view0  

---

## AIwiki追加用JSON

以下は「AIwikiへ追加しやすい」ように、(A) **AIwiki想定の“モデル一覧JSON”**（1ファイルで全体を持つ）と、(B) **詳細情報カタログJSON**（研究・検証用途）を提示する。  
実際のAIwiki側の厳密スキーマが手元で検証できないため、**フィールドは保守的（破壊的に増やしすぎない）**にしつつ、ユーザー要件（トークナイザ仕様、学習データ、ベンチ、ライセンス、派生）を落とさないよう `details` に集約する設計にしている。

### AIwiki向け：llama.family.json（推奨：家系エントリ）

```json
{
  "name": "Llama (LLaMA) Model Family",
  "slug": "llama",
  "developer": "Meta",
  "website": "https://www.llama.com/",
  "description": "MetaのLLaMA/Llama系列（LLaMA v1, Llama 2/3/4と派生：Code Llama, Vision, Guard, Prompt Guardを含む）。公式モデルカード・論文・GitHub・meta-llama公式Hugging Face orgに基づき整理。",
  "versions": [
    "llama-v1",
    "llama-2",
    "llama-2-chat",
    "code-llama",
    "llama-3",
    "llama-3.1",
    "llama-3.2",
    "llama-3.2-vision",
    "llama-3.3",
    "llama-4",
    "llama-guard-3",
    "llama-guard-4",
    "llama-prompt-guard-2"
  ]
}
```

### AIwiki向け：モデル別JSON（主要エントリ）

#### llama-v1.json（LLaMA v1）

```json
{
  "name": "LLaMA (v1)",
  "slug": "llama-v1",
  "developer": "Meta AI",
  "releaseDate": "2023-02-27",
  "modelType": "BASE",
  "description": "公開データのみで学習したDense Transformer基盤モデル。7B/13B/33B/65Bを提供。",
  "links": [
    { "label": "Paper (arXiv HTML)", "url": "https://ar5iv.labs.arxiv.org/html/2302.13971" }
  ],
  "specs": {
    "architecture": "Decoder-only Transformer (Dense), RMSNorm + SwiGLU + RoPE",
    "tokenizer": "SentencePiece BPE (byte fallback, digits split)",
    "trainingTokens": "1.0T (7B/13B) / 1.4T (33B/65B)",
    "contextLength": "2048 (2k, later-paper comparison)",
    "modalities": { "input": ["text"], "output": ["text"] }
  },
  "variants": [
    { "name": "LLaMA 7B", "slug": "llama-v1-7b", "specs": { "parameters": "6.7B" } },
    { "name": "LLaMA 13B", "slug": "llama-v1-13b", "specs": { "parameters": "13.0B" } },
    { "name": "LLaMA 33B", "slug": "llama-v1-33b", "specs": { "parameters": "32.5B" } },
    { "name": "LLaMA 65B", "slug": "llama-v1-65b", "specs": { "parameters": "65.2B" } }
  ],
  "details": {
    "trainingDataMix": {
      "CommonCrawl": "67%",
      "C4": "15%",
      "GitHub": "4.5%",
      "Wikipedia": "4.5%",
      "Books": "4.5%",
      "ArXiv": "2.5%",
      "StackExchange": "2.0%"
    },
    "notes": [
      "論文は『研究コミュニティへリリース』と記載。Llama 2以降のCommunity Licenseのような本文はこの論文ページ上では明示されない。"
    ]
  }
}
```

#### llama-2.json（Llama 2 base）

```json
{
  "name": "Llama 2",
  "slug": "llama-2",
  "developer": "Meta",
  "releaseDate": "2023-07-18",
  "modelType": "BASE",
  "description": "Llama 1を拡張した基盤モデル。2T tokensで学習、文脈長4k、（34B/70Bで）GQA。学習データにMeta製品・サービス由来データを含まないと明記。",
  "links": [
    { "label": "Paper (ar5iv)", "url": "https://ar5iv.labs.arxiv.org/html/2307.09288" },
    { "label": "License (raw)", "url": "https://raw.githubusercontent.com/meta-llama/llama-models/main/models/llama2/LICENSE" }
  ],
  "specs": {
    "architecture": "Decoder-only Transformer (Dense), RMSNorm + SwiGLU + RoPE; +4k context; +GQA for large models",
    "tokenizer": "SentencePiece BPE (vocab 32k; HF docs)",
    "trainingTokens": "2.0T",
    "contextLength": "4096",
    "modalities": { "input": ["text"], "output": ["text"] }
  },
  "variants": [
    { "name": "Llama 2 7B", "slug": "llama-2-7b", "specs": { "parameters": "7B" } },
    { "name": "Llama 2 13B", "slug": "llama-2-13b", "specs": { "parameters": "13B" } },
    { "name": "Llama 2 70B", "slug": "llama-2-70b", "specs": { "parameters": "70B" } }
  ],
  "details": {
    "notReleasedButDocumented": ["Llama 2 34B (trained, not released at the time of the paper)"],
    "licenseHighlights": [
      "AUP遵守",
      "700M MAU条項",
      "他LLM改善への出力利用制限（Llama 2派生除く）"
    ]
  }
}
```

#### llama-2-chat.json（Llama 2-Chat）

```json
{
  "name": "Llama 2-Chat",
  "slug": "llama-2-chat",
  "developer": "Meta",
  "releaseDate": "2023-07-18",
  "modelType": "INSTRUCT",
  "description": "Llama 2をSFT+RLHFで対話最適化したChatモデル（7B/13B/70B）。",
  "links": [
    { "label": "Paper (ar5iv)", "url": "https://ar5iv.labs.arxiv.org/html/2307.09288" },
    { "label": "License (raw)", "url": "https://raw.githubusercontent.com/meta-llama/llama-models/main/models/llama2/LICENSE" }
  ],
  "variants": [
    { "name": "Llama 2-Chat 7B", "slug": "llama-2-chat-7b", "specs": { "parameters": "7B", "contextLength": "4096" } },
    { "name": "Llama 2-Chat 13B", "slug": "llama-2-chat-13b", "specs": { "parameters": "13B", "contextLength": "4096" } },
    { "name": "Llama 2-Chat 70B", "slug": "llama-2-chat-70b", "specs": { "parameters": "70B", "contextLength": "4096" } }
  ]
}
```

#### code-llama.json（Code Llamaファミリー）

```json
{
  "name": "Code Llama",
  "slug": "code-llama",
  "developer": "Meta",
  "releaseDate": "2023-08-24",
  "modelType": "FINETUNE",
  "description": "Llama 2をベースにコード向けに特化したモデル群。Code/Python/Instructの3系統、7B/13B/34B/70B。16kで学習し最大100k入力で改善、infilling対応（主に7B/13B/70B）。",
  "links": [
    { "label": "Paper (arXiv abs)", "url": "https://arxiv.org/abs/2308.12950" },
    { "label": "Paper (arXiv HTML)", "url": "https://arxiv.org/html/2308.12950v3" }
  ],
  "specs": {
    "contextLength": "16k trained; improves up to 100k",
    "modalities": { "input": ["text", "code"], "output": ["text", "code"] }
  },
  "variants": [
    { "name": "Code Llama 7B", "slug": "code-llama-7b", "specs": { "parameters": "7B" } },
    { "name": "Code Llama 13B", "slug": "code-llama-13b", "specs": { "parameters": "13B" } },
    { "name": "Code Llama 34B", "slug": "code-llama-34b", "specs": { "parameters": "34B" } },
    { "name": "Code Llama 70B", "slug": "code-llama-70b", "specs": { "parameters": "70B" } },

    { "name": "Code Llama - Python 7B", "slug": "code-llama-python-7b", "specs": { "parameters": "7B" } },
    { "name": "Code Llama - Python 13B", "slug": "code-llama-python-13b", "specs": { "parameters": "13B" } },
    { "name": "Code Llama - Python 34B", "slug": "code-llama-python-34b", "specs": { "parameters": "34B" } },
    { "name": "Code Llama - Python 70B", "slug": "code-llama-python-70b", "specs": { "parameters": "70B" } },

    { "name": "Code Llama - Instruct 7B", "slug": "code-llama-instruct-7b", "specs": { "parameters": "7B" } },
    { "name": "Code Llama - Instruct 13B", "slug": "code-llama-instruct-13b", "specs": { "parameters": "13B" } },
    { "name": "Code Llama - Instruct 34B", "slug": "code-llama-instruct-34b", "specs": { "parameters": "34B" } },
    { "name": "Code Llama - Instruct 70B", "slug": "code-llama-instruct-70b", "specs": { "parameters": "70B" } }
  ],
  "details": {
    "benchmarkHighlightsFromPaperAbstract": {
      "HumanEval_max": "67%",
      "MBPP_max": "65%"
    }
  }
}
```

#### llama-3.json / llama-3.1.json / llama-3.2.json / llama-3.2-vision.json / llama-3.3.json / llama-4.json

（冗長化を避けるため、ここでは“最重要フィールドのみ”の例として `llama-4.json` を掲載し、他は同型で生成できる形にする。必要ならこの型で全ファイル分もそのまま展開可能。）

```json
{
  "name": "Llama 4",
  "slug": "llama-4",
  "developer": "Meta",
  "releaseDate": "2025-04-05",
  "modelType": "BASE",
  "description": "Llama 4はMoE+early fusionを採用したネイティブマルチモーダル世代。Scout（10M文脈）とMaverick（1M文脈）を公開。学習データは公的/ライセンスに加えMeta製品・サービス由来情報を含むと明記。",
  "links": [
    { "label": "Model Card (raw)", "url": "https://raw.githubusercontent.com/meta-llama/llama-models/main/models/llama4/MODEL_CARD.md" }
  ],
  "specs": {
    "architecture": "Decoder-only Transformer, MoE, early fusion multimodality",
    "modalities": { "input": ["text", "image"], "output": ["text", "code"] }
  },
  "variants": [
    {
      "name": "Llama 4 Scout (17B x 16E)",
      "slug": "llama-4-scout-17b-16e",
      "specs": {
        "parameters": { "activated": "17B", "total": "109B" },
        "contextLength": "10M",
        "trainingTokens": "~40T",
        "knowledgeCutoff": "2024-08"
      }
    },
    {
      "name": "Llama 4 Maverick (17B x 128E)",
      "slug": "llama-4-maverick-17b-128e",
      "specs": {
        "parameters": { "activated": "17B", "total": "400B" },
        "contextLength": "1M",
        "trainingTokens": "~22T",
        "knowledgeCutoff": "2024-08"
      }
    }
  ]
}
```

---

### 付録：モデル横断“全バリアント”簡易表（AIwiki入力チェック用）

| グループ | バリアント | params | context | modality |
|---|---|---:|---:|---|
| LLaMA v1citeturn12view3 | 7B / 13B / 33B / 65B | 6.7B / 13.0B / 32.5B / 65.2B | ~2kciteturn15view0 | text→text |
| Llama 2citeturn14view0turn15view0 | 7B / 13B / 70B（+Chat同サイズ） | 7B / 13B / 70B | 4k | text→text |
| Code Llamaciteturn38search0turn38search3 | Code/Python/Instruct × 7B/13B/34B/70B | 7B/13B/34B/70B | 16k（〜100k改善） | code/text→code/text |
| Llama 3citeturn31view1 | Base/Instruct × 8B/70B | 8B/70B | 8k | text→text/code |
| Llama 3.1citeturn32view0 | Base/Instruct × 8B/70B/405B | 8B/70B/405B | 128k | text→text/code |
| Llama 3.2citeturn33view1turn9search7 | text 1B/3B + Vision 11B/90B | 1.23B/3.21B/11B/90B | 128k（量子版8k表記あり） | text→text/code、image+text→text |
| Llama 3.3citeturn34view0 | 70B Instruct | 70B | 128k | text→text/code |
| Llama 4citeturn35view1 | Scout（17B×16E）/ Maverick（17B×128E） | 17B active（109B/400B total） | 10M / 1M | image+text→text/code |
| Llama Guard / Prompt Guardciteturn28view0turn10search0turn10search2 | Guard 3/4、Prompt Guard 2など | 1B〜12B / 22M〜86M等 | — | 分類（安全/攻撃検知） |

---

### 注記（今後の追加リリース可能性）

2025年以降、Llama 4.x（4.1/4.2等）や「Llama 5」の観測・報道は存在するが、少なくともmeta-llama公式HF orgの“Current”はLlama 4であり、公式に重みが広く公開された最新メジャー世代としてはLlama 4（2025-04-05）が確定的に追跡できる。citeturn28view0turn35view1