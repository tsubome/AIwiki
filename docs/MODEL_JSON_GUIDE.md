# AIwiki モデルデータ JSON ガイド

このドキュメントでは、AIwikiにモデル情報を追加するためのJSONファイルの書き方を説明します。

---

## 多言語対応（LocalizedString）

AIwikiは日本語と英語の両方に対応しています。`description` フィールドは多言語形式で記述します。

### LocalizedString 型

```typescript
type LocalizedString = string | {
  ja?: string  // 日本語
  en?: string  // 英語
}
```

### 記述例

```json
"description": {
  "ja": "日本語の説明文",
  "en": "English description"
}
```

### 後方互換性

従来の単一文字列形式も引き続きサポートされています（日本語として扱われます）：

```json
"description": "日本語の説明文"
```

**推奨**: 新規データは多言語形式で記述してください。

---

## ディレクトリ構造

```
data/
└── models/
    └── {family}/           # ファミリー名（例: llama, gpt, gemini）
        ├── _family.json    # ファミリー情報（必須）
        ├── model-1.json    # モデル情報
        ├── model-2.json
        └── ...
```

---

## 1. ファミリーファイル (`_family.json`)

各ファミリーフォルダに必須。ファミリー全体の情報を定義します。

### 必須フィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `name` | string | ファミリー名（例: "Llama"） |
| `slug` | string | URL用のID（例: "llama"）※フォルダ名と一致 |
| `versions` | string[] | 含まれるモデルのslug一覧 |

### オプションフィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `developer` | string | 開発元（例: "Meta"） |
| `description` | LocalizedString | ファミリーの説明（多言語対応） |
| `website` | string | 公式サイトURL |

### 例

```json
{
  "name": "Llama",
  "slug": "llama",
  "developer": "Meta",
  "description": {
    "ja": "Metaが開発する大規模言語モデルシリーズ。",
    "en": "A large language model series developed by Meta."
  },
  "website": "https://llama.meta.com",
  "versions": [
    "llama-3",
    "llama-3.1",
    "llama-3.2",
    "llama-3.3"
  ]
}
```

---

## 2. モデルファイル (`{model-slug}.json`)

各モデル（バージョン）ごとに1ファイル作成します。

### 必須フィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `name` | string | モデル名（例: "Llama 3.3"） |
| `slug` | string | URL用のID（例: "llama-3.3"）※ファイル名と一致 |
| `modelType` | string | モデルタイプ（下記参照） |
| `variants` | array | バリエーション一覧（最低1つ） |

### modelType の値

| 値 | 説明 |
|----|------|
| `BASE` | ベースモデル（事前学習のみ） |
| `INSTRUCT` | Instruction-tuned モデル |
| `FINETUNE` | ファインチューニング済み |
| `MERGE` | マージモデル |
| `QUANTIZED` | 量子化モデル |

### オプションフィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `releaseDate` | string | リリース日（"YYYY-MM-DD"） |
| `developer` | string | 開発元 |
| `license` | string | ライセンス名 |
| `description` | LocalizedString | モデルの説明（多言語対応） |
| `baseModel` | string | ベースモデル（FINETUNEの場合） |
| `mergedFrom` | string[] | マージ元モデル一覧（MERGEの場合） |
| `tags` | string[] | タグ一覧（下記参照） |
| `benchmarks` | object | ベンチマーク情報（下記参照） |
| `specs` | object | スペック情報（下記参照） |
| `links` | object | 関連リンク（下記参照） |

### baseModel / mergedFrom（派生モデル用）

ファインチューニングやマージモデルの場合、元になったモデルを指定します。

```json
// FINETUNEの場合
"modelType": "FINETUNE",
"baseModel": "meta-llama/Llama-3.1-70B",

// MERGEの場合
"modelType": "MERGE",
"mergedFrom": ["model-a/Model-A-7B", "model-b/Model-B-7B"]
```

### tags（タグ）

モデルの特徴をタグで分類します。フィルタリングや検索に使用されます。

| タグ | 説明 |
|------|------|
| `official` | 公式モデル |
| `uncensored` | 検閲なし |
| `censored` | セーフティフィルタあり |
| `roleplay` | ロールプレイ最適化 |
| `coding` | コード生成特化 |
| `math` | 数学・推論特化 |
| `multilingual` | 多言語対応 |
| `japanese` | 日本語特化 |
| `chinese` | 中国語特化 |
| `vision` | 画像理解 |
| `long-context` | 長コンテキスト（32K以上） |
| `fast` | 高速推論 |
| `moe` | Mixture of Experts |
| `distilled` | 蒸留モデル |
| `merged` | マージモデル |

```json
"tags": ["official", "coding", "math", "multilingual", "long-context"]
```

### benchmarks（ベンチマーク）

モデルの性能をベンチマークスコアで記録します。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `mmlu` | number | MMLU スコア |
| `mmlupro` | number | MMLU-Pro スコア |
| `humaneval` | number | HumanEval（コード）スコア |
| `math` | number | MATH スコア |
| `gpqa` | number | GPQA Diamond スコア |
| `ifeval` | number | IFEval スコア |
| `custom` | object | その他のベンチマーク |
| `source` | string | 情報源（例: "Meta Official 2024-12"） |

```json
"benchmarks": {
  "mmlu": 86.0,
  "mmlupro": 55.0,
  "humaneval": 88.4,
  "math": 77.0,
  "gpqa": 50.5,
  "ifeval": 92.1,
  "custom": {
    "jaquad": 85.3
  },
  "source": "Meta Official Model Card 2024-12"
}

### specs オブジェクト

| フィールド | 型 | 説明 |
|-----------|------|------|
| `contextLength` | number | コンテキスト長（例: 128000） |
| `trainingTokens` | string | 学習トークン数（例: "15T"） |
| `knowledgeCutoff` | string | 知識カットオフ日 |
| `languages` | string[] | 対応言語（例: ["ja", "en"]） |
| `architecture` | string | アーキテクチャ |
| `promptTemplate` | object | プロンプトテンプレート（下記参照） |

### promptTemplate（プロンプトテンプレート）

**ローカルLLMユーザー向けの重要情報**。llama.cpp、Ollama、LM Studioなどでモデルを実行する際に必要なプロンプト形式を定義します。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `format` | string | フォーマット名（例: "llama-3", "chatml", "alpaca"） |
| `system` | string | システムプロンプトテンプレート |
| `user` | string | ユーザープロンプトテンプレート |
| `assistant` | string | アシスタントプロンプトテンプレート |
| `stopTokens` | string[] | 停止トークン |

#### 主なフォーマット例

**Llama 3 形式:**
```json
"promptTemplate": {
  "format": "llama-3",
  "system": "<|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|>",
  "user": "<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>",
  "assistant": "<|start_header_id|>assistant<|end_header_id|>\n\n",
  "stopTokens": ["<|eot_id|>", "<|end_of_text|>"]
}
```

**ChatML 形式:**
```json
"promptTemplate": {
  "format": "chatml",
  "system": "<|im_start|>system\n{system}<|im_end|>",
  "user": "<|im_start|>user\n{prompt}<|im_end|>",
  "assistant": "<|im_start|>assistant\n",
  "stopTokens": ["<|im_end|>"]
}
```

**Alpaca 形式:**
```json
"promptTemplate": {
  "format": "alpaca",
  "system": "Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n",
  "user": "### Instruction:\n{prompt}\n\n",
  "assistant": "### Response:\n"
}
```

### links オブジェクト

| フィールド | 型 | 説明 |
|-----------|------|------|
| `huggingface` | string | Hugging Face URL |
| `paper` | string | 論文URL |
| `github` | string | GitHub URL |
| `website` | string | 公式サイトURL |

### 例（公式モデル）

```json
{
  "name": "Llama 3.3",
  "slug": "llama-3.3",
  "releaseDate": "2024-12-06",
  "developer": "Meta",
  "license": "Llama 3.3 Community License",
  "modelType": "INSTRUCT",

  "baseModel": "meta-llama/Llama-3.1-70B",
  "tags": ["official", "coding", "math", "multilingual", "long-context"],

  "benchmarks": {
    "mmlu": 86.0,
    "humaneval": 88.4,
    "math": 77.0,
    "source": "Meta Official Model Card 2024-12"
  },

  "description": {
    "ja": "70Bパラメータで405Bモデルに匹敵する性能を実現。",
    "en": "Achieves performance comparable to the 405B model with 70B parameters."
  },

  "specs": {
    "contextLength": 128000,
    "languages": ["en", "de", "fr", "it", "pt", "hi", "es", "th"],
    "architecture": "Transformer with GQA",
    "promptTemplate": {
      "format": "llama-3",
      "system": "<|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|>",
      "user": "<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>",
      "assistant": "<|start_header_id|>assistant<|end_header_id|>\n\n",
      "stopTokens": ["<|eot_id|>", "<|end_of_text|>"]
    }
  },

  "links": {
    "huggingface": "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct"
  },

  "variants": [
    {
      "name": "Llama 3.3 70B Instruct",
      "slug": "llama-3.3-70b",
      "parameters": "70B",
      "description": {
        "ja": "70Bパラメータで405Bモデルに匹敵する性能を実現。",
        "en": "Achieves performance comparable to the 405B model with 70B parameters."
      },
      "huggingface": "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct",
      "requirements": {
        "minVram": "40GB",
        "recommendedVram": "48GB",
        "ram": "140GB",
        "notes": "Q4_K_M量子化で24GB×2枚、Q8で48GB推奨"
      },
      "gguf": []
    }
  ]
}
```

### 例（サードパーティFINETUNEモデル）

```json
{
  "name": "Swallow",
  "slug": "swallow",
  "releaseDate": "2023-12-19",
  "developer": "東京工業大学 / 産総研",
  "license": "Llama 2/3 Community License",
  "modelType": "FINETUNE",

  "baseModel": "meta-llama/Llama-2-7b",
  "tags": ["japanese", "multilingual"],

  "description": {
    "ja": "Llamaシリーズをベースに日本語データで継続事前学習を行った日本語特化モデル。",
    "en": "Japanese-specialized model with continued pre-training on Japanese data based on Llama series."
  },

  "specs": {
    "languages": ["ja", "en"],
    "promptTemplate": {
      "format": "llama-3",
      "system": "<|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|>",
      "user": "<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>",
      "assistant": "<|start_header_id|>assistant<|end_header_id|>\n\n",
      "stopTokens": ["<|eot_id|>", "<|end_of_text|>"]
    }
  },

  "links": {
    "huggingface": "https://huggingface.co/tokyotech-llm"
  },

  "variants": [
    {
      "name": "Swallow 8B (Llama 3)",
      "slug": "swallow-8b-llama3",
      "parameters": "8B",
      "description": {
        "ja": "Llama 3 8Bベースの日本語特化モデル。",
        "en": "Japanese-specialized model based on Llama 3 8B."
      },
      "huggingface": "https://huggingface.co/tokyotech-llm/Llama-3-Swallow-8B-v0.1",
      "requirements": {
        "minVram": "6GB",
        "recommendedVram": "8GB",
        "ram": "16GB"
      },
      "gguf": []
    }
  ]
}
```

---

## 3. バリエーション（variants）

同じモデルの異なるパラメータサイズを定義します。

### 必須フィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `name` | string | バリエーション名（例: "Llama 3 8B"） |
| `slug` | string | URL用のID（例: "llama-3-8b"） |
| `parameters` | string | パラメータ数（例: "8B", "70B"） |
| `gguf` | array | GGUFファイル一覧（空配列でOK） |

### オプションフィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `description` | LocalizedString | バリエーションの説明（多言語対応） |
| `huggingface` | string | Hugging Face URL |
| `requirements` | object | ハードウェア要件（下記参照） |
| `parameterDetails` | object | MoEモデル用の詳細情報 |

### requirements（ハードウェア要件）

**ローカルLLMユーザー向けの重要情報**。モデルを実行するために必要なハードウェアスペックを定義します。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `minVram` | string | 最小VRAM（量子化時、例: "6GB"） |
| `recommendedVram` | string | 推奨VRAM（例: "8GB"） |
| `ram` | string | CPU推論時のRAM（例: "16GB"） |
| `notes` | string | 補足情報 |

```json
"requirements": {
  "minVram": "40GB",
  "recommendedVram": "48GB",
  "ram": "140GB",
  "notes": "Q4_K_M量子化で24GB×2枚、Q8で48GB推奨"
}
```

### parameterDetails（MoEモデル用）

| フィールド | 型 | 説明 |
|-----------|------|------|
| `active` | string | アクティブパラメータ（例: "17B"） |
| `total` | string | 総パラメータ（例: "109B"） |
| `experts` | number | エキスパート数（例: 16） |

### 例（複数バリエーション）

```json
"variants": [
  {
    "name": "Llama 3 8B",
    "slug": "llama-3-8b",
    "parameters": "8B",
    "description": {
      "ja": "軽量版。ローカル実行に最適。",
      "en": "Lightweight version. Ideal for local execution."
    },
    "huggingface": "https://huggingface.co/meta-llama/Meta-Llama-3-8B",
    "requirements": {
      "minVram": "6GB",
      "recommendedVram": "8GB",
      "ram": "16GB"
    },
    "gguf": []
  },
  {
    "name": "Llama 3 70B",
    "slug": "llama-3-70b",
    "parameters": "70B",
    "description": {
      "ja": "高性能版。",
      "en": "High-performance version."
    },
    "huggingface": "https://huggingface.co/meta-llama/Meta-Llama-3-70B",
    "requirements": {
      "minVram": "40GB",
      "recommendedVram": "48GB",
      "ram": "140GB",
      "notes": "Q4_K_M量子化で24GB×2枚推奨"
    },
    "gguf": []
  }
]
```

---

## 4. GGUFファイル

量子化されたGGUFファイルの情報を定義します。

### フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `name` | string | Yes | 量子化タイプ（例: "Q4_K_M"） |
| `url` | string | Yes | ダウンロードURL |
| `size` | string | No | ファイルサイズ（例: "4.9GB"） |
| `recommended` | boolean | No | 推奨フラグ |
| `description` | LocalizedString | No | 説明（多言語対応） |

### 例

```json
"gguf": [
  {
    "name": "Q4_K_M",
    "size": "4.9GB",
    "url": "https://huggingface.co/.../model-Q4_K_M.gguf",
    "recommended": true,
    "description": {
      "ja": "バランス型。多くの環境で推奨",
      "en": "Balanced. Recommended for most environments"
    }
  },
  {
    "name": "Q8_0",
    "size": "8.5GB",
    "url": "https://huggingface.co/.../model-Q8_0.gguf",
    "description": {
      "ja": "高品質版",
      "en": "High quality version"
    }
  }
]
```

---

## 5. 新しいファミリーを追加する手順

例：Geminiファミリーを追加する場合

### Step 1: フォルダ作成

```
data/models/gemini/
```

### Step 2: _family.json を作成

```json
{
  "name": "Gemini",
  "slug": "gemini",
  "developer": "Google",
  "description": {
    "ja": "Googleが開発するマルチモーダルAIモデルシリーズ。",
    "en": "A multimodal AI model series developed by Google."
  },
  "website": "https://deepmind.google/technologies/gemini/",
  "versions": [
    "gemini-1.0",
    "gemini-1.5",
    "gemini-2.0"
  ]
}
```

### Step 3: モデルファイルを作成

`gemini-2.0.json`:

```json
{
  "name": "Gemini 2.0",
  "slug": "gemini-2.0",
  "releaseDate": "2024-12-11",
  "developer": "Google",
  "license": "Proprietary",
  "modelType": "BASE",

  "description": {
    "ja": "Googleの最新マルチモーダルAIモデル。",
    "en": "Google's latest multimodal AI model."
  },

  "specs": {
    "contextLength": 1000000,
    "languages": ["en", "ja", "多言語"],
    "architecture": "Transformer"
  },

  "links": {
    "website": "https://deepmind.google/technologies/gemini/"
  },

  "variants": [
    {
      "name": "Gemini 2.0 Flash",
      "slug": "gemini-2.0-flash",
      "parameters": "不明",
      "description": {
        "ja": "高速推論版。",
        "en": "Fast inference version."
      },
      "gguf": []
    },
    {
      "name": "Gemini 2.0 Pro",
      "slug": "gemini-2.0-pro",
      "parameters": "不明",
      "description": {
        "ja": "高性能版。",
        "en": "High-performance version."
      },
      "gguf": []
    }
  ]
}
```

### Step 4: デプロイ

```bash
wsl npm run deploy:cloudflare
```

---

## 6. 既存ファミリーにモデルを追加する手順

例：Llamaファミリーに新モデルを追加

### Step 1: モデルファイルを作成

`data/models/llama/llama-4.1.json`:

```json
{
  "name": "Llama 4.1",
  "slug": "llama-4.1",
  "releaseDate": "2025-xx-xx",
  ...
}
```

### Step 2: _family.json を更新

`data/models/llama/_family.json` の `versions` に追加:

```json
"versions": [
  "llama-3",
  "llama-3.1",
  ...
  "llama-4.1"  // 追加
]
```

### Step 3: デプロイ

```bash
wsl npm run deploy:cloudflare
```

---

## 7. 注意事項

1. **slug はユニーク** - 同じファミリー内で重複不可
2. **ファイル名 = slug** - `llama-3.json` なら `slug: "llama-3"`
3. **フォルダ名 = ファミリーslug** - `llama/` なら `slug: "llama"`
4. **versions の順番** - 表示順に影響するので時系列推奨
5. **多言語対応** - description は `{ "ja": "...", "en": "..." }` 形式で記述（後方互換のため文字列も可）
6. **空配列に注意** - `gguf: []` は必須（空でもOK）

---

## 8. バリデーション

JSONの構文エラーをチェック:

```bash
# PowerShell
Get-Content data/models/llama/llama-3.3.json | ConvertFrom-Json

# または VSCode で開けばエラー表示される
```

---

## 9. クイックリファレンス

### 最小構成（モデルファイル）

```json
{
  "name": "Model Name",
  "slug": "model-slug",
  "modelType": "BASE",
  "variants": [
    {
      "name": "Model Name 8B",
      "slug": "model-slug-8b",
      "parameters": "8B",
      "gguf": []
    }
  ]
}
```

### ローカルLLMユーザー向け推奨構成

```json
{
  "name": "Model Name",
  "slug": "model-slug",
  "releaseDate": "2024-01-01",
  "developer": "Developer Name",
  "license": "License Name",
  "modelType": "INSTRUCT",

  "tags": ["official", "multilingual"],

  "description": {
    "ja": "モデルの説明（日本語）",
    "en": "Model description (English)"
  },

  "specs": {
    "contextLength": 8192,
    "languages": ["en", "ja"],
    "promptTemplate": {
      "format": "llama-3",
      "system": "<|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|>",
      "user": "<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>",
      "assistant": "<|start_header_id|>assistant<|end_header_id|>\n\n",
      "stopTokens": ["<|eot_id|>", "<|end_of_text|>"]
    }
  },

  "variants": [
    {
      "name": "Model Name 8B",
      "slug": "model-slug-8b",
      "parameters": "8B",
      "description": {
        "ja": "バリエーションの説明（日本語）",
        "en": "Variant description (English)"
      },
      "huggingface": "https://huggingface.co/...",
      "requirements": {
        "minVram": "6GB",
        "recommendedVram": "8GB",
        "ram": "16GB"
      },
      "gguf": []
    }
  ]
}
```

### 最小構成（ファミリーファイル）

```json
{
  "name": "Family Name",
  "slug": "family-slug",
  "versions": ["model-slug"]
}
```

---

## 10. フィールド重要度（ローカルLLMユーザー向け）

| 重要度 | フィールド | 理由 |
|--------|-----------|------|
| ★★★ | `promptTemplate` | 正しいプロンプト形式なしでは出力が崩れる |
| ★★★ | `requirements` | VRAM/RAM不足でロードできない |
| ★★☆ | `baseModel` | 派生モデルの互換性確認に必要 |
| ★★☆ | `tags` | モデル検索・フィルタリングに便利 |
| ★☆☆ | `benchmarks` | 性能比較の参考情報 |
