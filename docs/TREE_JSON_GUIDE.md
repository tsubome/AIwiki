# モデル家系図 (_tree.json) 仕様書

## 概要

`_tree.json`ファイルは、モデルファミリー内の親子関係を明示的に定義します。
各ファミリーディレクトリに配置します。

```
data/models/
└── llama/
    ├── _family.json      # ファミリー情報
    ├── _tree.json        # 家系図の関係定義 ★新規
    ├── llama-1.json
    ├── llama-2.json
    └── ...
```

## ファイル構造

```json
{
  "description": "Llamaファミリーのモデル関係図",
  "relationships": [
    {
      "child": "llama-2",
      "parent": "llama-1",
      "type": "evolution"
    },
    {
      "child": "swallow",
      "parent": "llama-2",
      "type": "finetune"
    }
  ]
}
```

## フィールド説明

### ルートオブジェクト

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `description` | string | × | ファイルの説明 |
| `relationships` | array | ○ | 関係の配列 |

### relationships配列の各要素

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `child` | string | ○ | 子モデルのslug |
| `parent` | string | ○ | 親モデルのslug（ファミリールートの場合は `null` または省略） |
| `type` | string | ○ | 関係の種類（下記参照） |

### 関係の種類 (type)

| type | 説明 | 例 |
|------|------|-----|
| `evolution` | 公式の次世代バージョン | Llama 1 → Llama 2 → Llama 3 |
| `official-derivative` | 公式の派生モデル（同じ開発者） | Llama 2 → Code Llama |
| `finetune` | サードパーティによるファインチューニング | Llama 2 → Swallow |
| `distill` | 蒸留モデル | Llama 3.1 405B → Llama 3.3 70B |
| `merge` | マージモデル | Model A + Model B → Merged Model |
| `quantize` | 量子化版 | Llama 3 → Llama 3 GGUF |

## 例：Llamaファミリー

```json
{
  "description": "Meta Llamaファミリーのモデル関係図",
  "relationships": [
    // === メインの進化ライン ===
    { "child": "llama-1", "parent": null, "type": "evolution" },
    { "child": "llama-2", "parent": "llama-1", "type": "evolution" },
    { "child": "llama-3", "parent": "llama-2", "type": "evolution" },
    { "child": "llama-3.1", "parent": "llama-3", "type": "evolution" },
    { "child": "llama-3.2", "parent": "llama-3.1", "type": "evolution" },
    { "child": "llama-3.3", "parent": "llama-3.1", "type": "distill" },
    { "child": "llama-4", "parent": "llama-3.1", "type": "evolution" },

    // === 公式派生モデル（Meta製） ===
    { "child": "code-llama", "parent": "llama-2", "type": "official-derivative" },
    { "child": "llama-guard", "parent": "llama-2", "type": "official-derivative" },
    { "child": "spirit-lm", "parent": "llama-2", "type": "official-derivative" },

    // === サードパーティFT ===
    { "child": "swallow", "parent": "llama-2", "type": "finetune" },
    { "child": "elyza", "parent": "llama-2", "type": "finetune" },

    // === 蒸留モデル ===
    { "child": "deepseek-r1-distill", "parent": "llama-3.1", "type": "distill" }
  ]
}
```

## 関係の優先順位

モデルJSONファイルの`baseModel`フィールドと`_tree.json`の両方に情報がある場合：

1. **`_tree.json`を優先**
2. `_tree.json`に定義がない場合は`baseModel`を使用
3. どちらもない場合はファミリールート直下に配置

## 家系図の描画ルール

1. **ルートノード**: `parent: null` のモデル（通常は最初のバージョン）
2. **進化ライン**: `type: evolution` は縦に並べる
3. **派生モデル**: `type: finetune`, `official-derivative` は親の横に表示
4. **蒸留モデル**: `type: distill` は親から分岐して表示

## 調査依頼用テンプレート

以下のプロンプトをLLMに送信して、正確な関係を調査できます：

---

**プロンプト例：**

```
以下のLLMモデルの親子関係を調査してください。

対象モデル:
- LLaMA 1 (Meta, 2023-02)
- Llama 2 (Meta, 2023-07)
- Llama 3 (Meta, 2024-04)
- Llama 3.1 (Meta, 2024-07)
- Llama 3.2 (Meta, 2024-09)
- Llama 3.3 (Meta, 2024-12)
- Llama 4 (Meta, 2025-04)
- Code Llama (Meta, 2023-08)
- Llama Guard (Meta, 2023-12)
- Spirit-LM (Meta, 2024-02)
- Swallow (東工大/産総研, 2023-12)
- ELYZA (ELYZA, 2023-12)
- DeepSeek-R1-Distill-Llama (DeepSeek, 2025-01)

以下のJSON形式で回答してください：

{
  "relationships": [
    { "child": "モデルslug", "parent": "親モデルslug", "type": "関係タイプ" }
  ]
}

関係タイプ:
- evolution: 公式の次世代（Llama 1→2→3）
- official-derivative: 公式派生（同じ開発者による特化モデル）
- finetune: サードパーティFT
- distill: 蒸留モデル

注意:
- 各モデルの公式ドキュメント/論文を参照
- 不明な場合は「不明」と記載
- 親がない（ルート）の場合は parent: null
```

---

## 注意事項

- slugはモデルJSONのファイル名（拡張子なし）と一致させる
- 循環参照は禁止（A→B→A など）
- 1つのモデルが複数の親を持つ場合は、主要な親を1つ選ぶ
