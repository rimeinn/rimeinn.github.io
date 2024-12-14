# `dict.yaml` 詳解

雪齋 09-Nov-2013

## 開始之前

```yaml
# Rime dict
# encoding: utf-8
〔你還可以在這註釋字典來源、變動記錄等〕
```

## 描述檔

1.  `name` 內部字典名，也即`schema`所引用的字典名，確保與文件名相一致
2.  `version` 如果發佈，請確保每次改動陞版本號

示例：

```yaml
name: "cangjie6.extended"
version: "0.1"
```

## 配置

1.  `sort` 字典**初始**排序，可選`original`或`by_weight`
2.  `use_preset_vocabulary` 是否引入「八股文」〔含字詞頻、詞庫〕
3.  `vocabulary` 引入其他詞庫〔含字詞頻、詞庫〕 (use\_preset\_vocabulary 不可設定為 true)
4.  `max_phrase_length` 配合`use_preset_vocabulary`，設定導入詞條最大詞長
5.  `min_phrase_weight` 配合`use_preset_vocabulary`，設定導入詞條最小詞頻
6.  `columns` 定義碼表以`Tab`分隔出的各列，可設`text`【文本】、`code`【碼】、`weight`【權重】、`stem`【造詞碼】
7.  `import_tables` 加載其它外部碼表
8.  `encoder` 形碼造詞規則
    1.  `exclude_patterns`
    2.  `rules` 可用`length_equal`和`length_in_range`定義。大寫字母表示字序，小寫字母表示其所跟隨的大寫字母所以表的字中的編碼序
    3.  `tail_anchor` 造詞碼包含結構分割符〔僅用於倉頡〕
    4.  `exclude_patterns` 取消某編碼的造詞資格

示例：

```yaml
# cangjie6.extended.dict.yaml

sort: by_weight
use_preset_vocabulary: false
import_tables:
  - cangjie6 #單字碼表由cangjie6.dict.yaml導入
columns: #此字典爲純詞典，無單字編碼，僅有字和詞頻
  - text #字／詞
  - weight #字／詞頻
encoder:
  exclude_patterns:
    - '^z.*$'
  rules:
    - length_equal: 2 #對於二字詞
      formula: "AaAzBaBbBz" #取第一字首尾碼、第二字首次尾碼
    - length_equal: 3 #對於三字詞
      formula: "AaAzBaYzZz" #取第一字首尾碼、第二字首尾碼、第三字尾碼
    - length_in_range: [4, 5] #對於四至五字詞
      formula: "AaBzCaYzZz" #取第一字首碼，第二字尾碼、第三字首碼、倒數第二字尾碼、最後一字尾碼
  tail_anchor: "'"
```

## 碼表

以 `Tab` 分隔各列，各列依 `columns` 定義排列。

示例：

```yaml
# cangjie6.dict.yaml
columns:
  - text #第一列字／詞
  - code #第二列碼
  - weight #第三列字／詞頻
  - stem #第四列造詞碼
```

```yaml
# cangjie6.dict.yaml
個	owjr	246268	ow'jr
看	hqbu	245668
中	l	243881
呢	rsp	242970
來	doo	235101
嗎	rsqf	221092
爲	bhnf	211340
會	owfa	209844
她	vpd	204725
與	xyc	203975
給	vfor	193007
等	hgdi	183340
這	yymr	181787
用	bq	168934	b'q
```
