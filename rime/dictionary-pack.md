# 词典扩展包

## 概述

librime 1.6.0 增加了一种扩展词典内容的机制——词典扩展包。可用于为固定音节表的输入方案添加词汇。

固态词典包含`*.table.bin`和`*.prism.bin`两个文件。
前者用于存储来自词典源文件`*.dict.yaml`的数据，后者综合了从词典源文件中提取的音节表和输入方案定义的拼写规则。

扩充固态词典内容，旧有在词典文件的YAML配置中使用`import_tables`从其他词典源文件导入码表的方法。
此法相当于将其他源文件中的码表内容追加到待编译的词典文件中，再将合并的码表编译成二进制词典文件。

词典扩展包可以达到相似的效果。其实现方式有所不同。
编译过程中，将额外的词典源文件`*.dict.yaml`生成对应的`*.table.bin`，其音节表与主码表的音节表保持一致。
使用输入方案时，按照`translator/packs`配置列表中的包名加载额外的`*.table.bin`文件，多表并用，从而一并查得扩充的词汇。

## 示例

我有一例，请诸位静观。

```shell
# 在Linux环境做出librime及命令行工具
cd librime
make

# 准备示例文件（有三）
# 做一个构建扩展包专用的方案，以示如何独立于主词典的构建流程。
# 如果不需要把扩展包和主词典分开制备，也可以用原有的输入方案。
cat > build/bin/luna_pinyin_packs.schema.yaml <<EOF
# Rime schema
schema:
  schema_id: luna_pinyin_packs

translator:
  dictionary: luna_pinyin_packs
  packs:
    - sample_pack
EOF

# 代用的主词典。因为本示例只构建扩展包。
# 做这个文件的目的是不必费时地编译导入了预设词汇表的朙月拼音主词典。
# 如果在主词典的构建流程生成扩展包，则可直接使用主词典文件。
cat > build/bin/luna_pinyin_packs.dict.yaml <<EOF
# Rime dict
---
name: luna_pinyin_packs
version: '1.0'
sort: original
use_preset_vocabulary: false
import_tables:
  - luna_pinyin
...

EOF

# 扩展包源文件
cat > build/bin/sample_pack.dict.yaml <<EOF
# Rime dict
---
name: sample_pack
version: '1.0'
sort: original
use_preset_vocabulary: false
...

粗鄙之语	cu bi zhi yu
EOF

# 制作扩展包
(cd build/bin; ./rime_deployer --compile luna_pinyin_packs.schema.yaml)
# 构建完成后可丢弃代用的主词典，只留扩展包
rm build/bin/build/luna_pinyin_packs.*

# 重新配置朙月拼音输入方案，令其加载先时生成的词典扩展包
(cd build/bin; ./rime_patch luna_pinyin 'translator/packs' '[sample_pack]')
# 验证词典可查到扩展包中的词语
echo 'cubizhiyu' | (cd build/bin; ./rime_console)
```

## 总结

与编译词典时导入码表的方法相比，使用词典扩展包有两项优势：

  - 扩展包可以独立于主词典及其他扩展包单独构建，增量添加扩展包不必重复编译完整的主词典，减少编译时间及资源开销；
  - 词典扩展包的编译单元与词典源文件粒度一致，方便组合使用，增减扩展包只须重新配置输入方案。

需要注意的是，查询时使用主词典的音节表，这要求扩展包使用相同的音节表构建。
目前librime并没有机制保证加载的扩展包与主词典兼容。用家须充分理解该功能的实现机制，保证数据文件的一致性。
这也意味着二进制扩展包不宜脱离于主词典而制作和分发。
