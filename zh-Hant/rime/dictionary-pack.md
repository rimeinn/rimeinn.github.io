# 詞典擴展包

## 概述

librime 1.6.0 增加了一種擴展詞典內容的機制——詞典擴展包。可用於爲固定音節表的輸入方案添加詞彙。

固態詞典包含`*.table.bin`和`*.prism.bin`兩個文件。
前者用於存儲來自詞典源文件`*.dict.yaml`的數據，後者綜合了從詞典源文件中提取的音節表和輸入方案定義的拼寫規則。

擴充固態詞典內容，舊有在詞典文件的YAML配置中使用`import_tables`從其他詞典源文件導入碼表的方法。
此法相當於將其他源文件中的碼表內容追加到待編譯的詞典文件中，再將合併的碼表編譯成二進制詞典文件。

詞典擴展包可以達到相似的效果。其實現方式有所不同。
編譯過程中，將額外的詞典源文件`*.dict.yaml`生成對應的`*.table.bin`，其音節表與主碼表的音節表保持一致。
使用輸入方案時，按照`translator/packs`配置列表中的包名加載額外的`*.table.bin`文件，多表並用，從而一併查得擴充的詞彙。

## 示例

我有一例，請諸位靜觀。

```shell
# 在Linux環境做出librime及命令行工具
cd librime
make

# 準備示例文件（有三）
# 做一個構建擴展包專用的方案，以示如何獨立於主詞典的構建流程。
# 如果不需要把擴展包和主詞典分開製備，也可以用原有的輸入方案。
cat > build/bin/luna_pinyin_packs.schema.yaml <<EOF
# Rime schema
schema:
  schema_id: luna_pinyin_packs

translator:
  dictionary: luna_pinyin_packs
  packs:
    - sample_pack
EOF

# 代用的主詞典。因爲本示例只構建擴展包。
# 做這個文件的目的是不必費時地編譯導入了預設詞彙表的朙月拼音主詞典。
# 如果在主詞典的構建流程生成擴展包，則可直接使用主詞典文件。
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

# 擴展包源文件
cat > build/bin/sample_pack.dict.yaml <<EOF
# Rime dict
---
name: sample_pack
version: '1.0'
sort: original
use_preset_vocabulary: false
...

粗鄙之語	cu bi zhi yu
EOF

# 製作擴展包
(cd build/bin; ./rime_deployer --compile luna_pinyin_packs.schema.yaml)
# 構建完成後可丟棄代用的主詞典，只留擴展包
rm build/bin/build/luna_pinyin_packs.*

# 重新配置朙月拼音輸入方案，令其加載先時生成的詞典擴展包
(cd build/bin; ./rime_patch luna_pinyin 'translator/packs' '[sample_pack]')
# 驗證詞典可查到擴展包中的詞語
echo 'cubizhiyu' | (cd build/bin; ./rime_console)
```

## 總結

與編譯詞典時導入碼表的方法相比，使用詞典擴展包有兩項優勢：

  - 擴展包可以獨立於主詞典及其他擴展包單獨構建，增量添加擴展包不必重複編譯完整的主詞典，減少編譯時間及資源開銷；
  - 詞典擴展包的編譯單元與詞典源文件粒度一致，方便組合使用，增減擴展包只須重新配置輸入方案。

需要注意的是，查詢時使用主詞典的音節表，這要求擴展包使用相同的音節表構建。
目前librime並沒有機制保證加載的擴展包與主詞典兼容。用家須充分理解該功能的實現機制，保證數據文件的一致性。
這也意味着二進制擴展包不宜脫離於主詞典而製作和分發。
