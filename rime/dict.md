# `dict.yaml` 详解

雪斋 09-Nov-2013

## 开始之前

```yaml
# Rime dict
# encoding: utf-8
〔你还可以在这注释字典来源、变动记录等〕
```

## 描述档

1.  `name` 内部字典名，也即`schema`所引用的字典名，确保与文件名相一致
2.  `version` 如果发布，请确保每次改动升版本号

示例：

```yaml
name: "cangjie6.extended"
version: "0.1"
```

## 配置

1.  `sort` 字典**初始**排序，可选`original`或`by_weight`
2.  `use_preset_vocabulary` 是否引入「八股文」〔含字词频、词库〕
3.  `vocabulary` 引入其他词库〔含字词频、词库〕 (use\_preset\_vocabulary 不可设定为 true)
4.  `max_phrase_length` 配合`use_preset_vocabulary`，设定导入词条最大词长
5.  `min_phrase_weight` 配合`use_preset_vocabulary`，设定导入词条最小词频
6.  `columns` 定义码表以`Tab`分隔出的各列，可设`text`【文本】、`code`【码】、`weight`【权重】、`stem`【造词码】
7.  `import_tables` 加载其它外部码表
8.  `encoder` 形码造词规则
    1.  `exclude_patterns`
    2.  `rules` 可用`length_equal`和`length_in_range`定义。大写字母表示字序，小写字母表示其所跟随的大写字母所以表的字中的编码序
    3.  `tail_anchor` 造词码包含结构分割符〔仅用于仓颉〕
    4.  `exclude_patterns` 取消某编码的造词资格

示例：

```yaml
# cangjie6.extended.dict.yaml

sort: by_weight
use_preset_vocabulary: false
import_tables:
  - cangjie6 #单字码表由cangjie6.dict.yaml导入
columns: #此字典为纯词典，无单字编码，仅有字和词频
  - text #字／词
  - weight #字／词频
encoder:
  exclude_patterns:
    - '^z.*$'
  rules:
    - length_equal: 2 #对于二字词
      formula: "AaAzBaBbBz" #取第一字首尾码、第二字首次尾码
    - length_equal: 3 #对于三字词
      formula: "AaAzBaYzZz" #取第一字首尾码、第二字首尾码、第三字尾码
    - length_in_range: [4, 5] #对于四至五字词
      formula: "AaBzCaYzZz" #取第一字首码，第二字尾码、第三字首码、倒数第二字尾码、最后一字尾码
  tail_anchor: "'"
```

## 码表

以 `Tab` 分隔各列，各列依 `columns` 定义排列。

示例：

```yaml
# cangjie6.dict.yaml
columns:
  - text #第一列字／词
  - code #第二列码
  - weight #第三列字／词频
  - stem #第四列造词码
```

```yaml
# cangjie6.dict.yaml
个	owjr	246268	ow'jr
看	hqbu	245668
中	l	243881
呢	rsp	242970
来	doo	235101
吗	rsqf	221092
为	bhnf	211340
会	owfa	209844
她	vpd	204725
与	xyc	203975
给	vfor	193007
等	hgdi	183340
这	yymr	181787
用	bq	168934	b'q
```
