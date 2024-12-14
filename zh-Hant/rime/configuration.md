# Rime 配置文件

Rime 配置文件，用於設置輸入法引擎、輸入法客戶端的運行參數，也包括輸入方案及詞典配置。

## 文件格式

採用 UTF-8 編碼的 [YAML][] 文本。

  [YAML]: http://yaml.org/

## 位置及組織方式

Rime 所使用的配置文件在 [用戶文件夾](user-data) 及 [共享文件夾](shared-data)。

## 語法

在 [YAML][] 語法的基礎上，增設以下編譯指令：

### 包含

`__include:` 指令在當前位置包含另一 YAML 節點的內容。

可寫在配置源文件任一 YAML map 節點下。其語法爲

```yaml
include_example_1:
  __include: local/node

local:
  node: contents to include
```

被引用的節點可以來自另一個配置文件。
目標配置節點的路徑以 `<filename>:/` 開始，可省略擴展名 `.yaml`。

```yaml
include_example_2:
  __include: config:/external/node

include_example_3:
  __include: config.yaml:/external/node
```

包含整個文件，可指定路徑爲目標配置文件的根節點：

```yaml
include_example_4:
  __include: config.yaml:/
```

包含另一個 YAML map 節點後，源文件中 `__include:` 指令所在 map 除編譯指令外的其他數據與被包含的 map 合併：

```yaml
include_example_5:
  __include: some_map
  occupation: journalist # new key and value
  simplicity: very # override value for included key

some_map:
  simplicity: somewhat
  naivety: sometimes
```

合併發生在 `__include:` 指令所在節點，不會修改被引用節點 `some_map` 的內容。

包含 YAML 列表，則指令所在 map 節點替換爲所引用的 YAML 列表。
該 map 節點不應包含任何編譯指令以外的 key-value，因爲不相容於 YAML 列表類型。

也不能直接在該節點下追加列表項，因爲 YAML 語法不允許混合 map 與 list。
在包含列表後追加、修改列表項，必須使用下文介紹的 `__append:` 或 `__patch:` 指令。

```yaml
include_example_6:
  __include: some_list
  __append:
    - someone else

some_list:
  - youngster
  - elder
```

### 補靪

修改某一相對路徑下的配置節點，而非當前節點的整體。
基本語法爲：

```yaml
__patch:
  key/alpha: value A
  key/beta: value B
```

目標節點路徑的寫法爲將各級 map 的 key 用 `/` 分隔。
因此 `key` 如果包含 `/` 字符，則不能作爲節點路徑的一部分。

可在節點路徑末尾添加 `/+` 操作符，表示合併 list 或 map 節點；
或者（可選地）添加 `/=` 表示用指定的值替換目標節點原有的值。
若未指定操作符，`__patch:` 指令的默認操作爲替換。

以下是一些示例：

```yaml
patch_example_1:
  sibling: old value
  append_to_list:
    - existing item
  merge_with_map:
    key: value
  replace_list:
    - item 1
    - item 2
  replace_map:
    a: value
    b: value
  __patch:
    sibling: new value
    append_to_list/+:
      - appended item
    merge_with_map/+:
      key: new value
      new_key: value
    replace_list/=:
      - only item
    replace_map/=:
      only_key: value
```

以上示例僅爲表現 `__patch:` 的作用方式。
實際上在當前節點和補靪內容均爲字面值的情況下，沒有打補靪的必要。
字面值補靪通常用於當前節點包含了其他節點，並需要修改部份配置項的場景：

```yaml
patch_example_2:
  __include: patch_example_1
  __patch:
    sibling: even newer value
    append_to_list/+:
      - another appended item
```

由於 YAML map 的 key 是無序的，書寫順序並不決定編譯指令的先後。

同一節點下，編譯指令的執行順序爲：
`__include:` 包含指定節點 → 合併當前節點下的其他 key-value 數據 → `__patch:` 修改子節點。

`__patch:` 指令的另一種主要用法是引用另一個節點中的補靪內容，並作用於指令所在節點：

```yaml
patch_example_3:
  __patch: changes
  some_list:
    - youngster
    - elder
  some_map:
    simplicity: somewhat
    naivety: sometimes

changes:
  some_list/+:
    - someone else
  some_map/simplicity: too much
```

YAML 語法不允許 map 有重複的 key。
如果要引用不同位置的多項補靪，可以爲 `__patch:` 指定一個列表，其中每項通過節點引用定義一組補靪：

```yaml
patch_example_4:
  __include: base_config
  __patch:
    - company_standard
    - team_convention
    - personal_preference

base_config:
  actors: []
  company_info:
    based_in: unknown location
  favorites: {}

company_standard:
  company_info/based_in: american san diego

team_convention:
  actors/+:
    - feifei
    - meimei
    - riri

personal_preference:
  favorites/fertilizer: jinkela
```

### 用補靪指令修改列表

補靪指令中，目標節點路徑由各級節點的 key 組成。
若某一節點爲 list 類型，可以 `@<下標>` 形式指定列表項。下標從 0 開始計數。
無論列表長度，末位列表元素可表示爲 `@last`。

```yaml
patch_list_example_1:
  some_list/@0/simplicity: very
  some_list/@last/naivety: always

some_list:
  - simplicity: somewhat
  - naivety: sometimes
```

在指定元素之前、之後插入列表元素，用 `@before <下標>`、`@after <下標>`。
`@after last` 可簡寫爲 `@next`，向列表末尾添加元素：

```yaml
patch_list_example_2:
  'some_list/@before 0/youthfulness': too much
  'some_list/@after last/velocity': greater than westerners
  some_list/@next/questions: no good
```

### 可選的包含與補靪

若包含或補靪指令的目標是以 `?` 結尾的節點路徑，
則當該路徑對應的節點（或所屬外部配置文件）不存在時，不產生編譯錯誤。

如：

```yaml
__patch: default.custom:/patch?

nice_to_have:
  __include: optional_config?
```

### 追加與合併

追加指令 `__append:` 將其下的列表項追加到該指令所在的節點。
合併指令 `__merge:` 將其下的 map 合併到該指令所在的節點。

這兩條指令只能用在 `__include:` 指令所在節點及其（字面值）子節點。

```yaml
append_merge_example_1:
  __include: starcraft
  __merge:
    made_by: blizzard entertainment
    races:
      __append:
        - protoss
        - zerg

starcraft:
  first_release: 1998
  races:
    - terrans
```

實際書寫配置時，`__merge:` 指令往往省略。
因爲 `__include:` 指令自動合併其所在節點下的 key-value 並遞歸地合併所有 map 類型的子節點。

而對於類型爲 list 的子節點，默認操作是替換整個列表。
如果要以向後追加列表項的方式合併，除了 `__append:` 指令之外，還可以採用 `/+` 操作符：

```yaml
append_merge_example_2:
  __include: starcraft
  made_by: blizzard entertainment
  races/+:
    - protoss
    - zerg
```

在 `__include:` 指令自動合併的節點樹中，如果要對某個 map 類型的子節點整體替換，可使用 `/=` 操作符：

```yaml
revealed_map:
  __include: old_map
  terran_command_center/=:
    x: 3.14
    y: 6.28
old_map:
  terran_command_center:
    location: unexplored
  protoss_nexus: {x: 128, y: 256}
  zerg_hatchary: {x -1024, y: 0}
```

案例解析：

- https://github.com/rime/librime/pull/192#issuecomment-371202389

## 配置編譯器插件

自動添加一些隱含的編譯指令，用來實現對原有補靪機制以及導入成套組件配置等語法的兼容。

這些插件的作用是將當前輸入方案所需的全部配置內容在部署期間彙總到一份編譯結果文件裏。使輸入法程序不必在運行時打開衆多的配置文件。

### 自動應用補靪

配置文件的根節點如果沒有使用 `__patch:` 指令，則在源文件編譯完成後，自動插入以下指令：

（註：請將實際的配置名稱代入 `<config>`）

```yaml
# <config>.yaml 或 <config>.schema.yaml 的根節點
__patch: <config>.custom:/patch?
```

如果存在與舊版本 librime 兼容的補靪文件，則從中加載補靪：

```yaml
# <config>.custom.yaml
patch:
  key: value
```

以上插件的效果相當於

```yaml
# <config>.yaml 或 <config>.schema.yaml 的根節點
__patch:
  key: value
```

如果源文件的根節點使用了 `__patch:` 指令，則不論其是否加載 `<config>.custom:/patch`，都不再添加自動補靪指令。
如果這種情況下仍希望支持補靪文件，須將其列爲 `__patch:` 列表中的一項：

```yaml
# <config>.yaml 或 <config>.schema.yaml 的根節點
__patch:
  - other_patch # ...
  - <config>.custom:/patch?
```

### 應用默認配置

輸入方案中未指定以下配置項時，自動導入默認配置 `default.yaml` 的定義：

```yaml
menu:
  page_size: # ...
```

### 導入成套組件配置

將部份組件配置中的 `<component>/import_preset: <config>` 語法翻譯爲

（註：請將實際的配置名稱和組件名稱代入 `<config>`、`<component>`）

```yaml
<component>:
  __include: <config>:/<component>
  # 以下爲輸入方案覆蓋定義的內容
```

注意：如果指定的配置節點 `<config>:/<component>` 不存在會導致輸入方案編譯錯誤。

### 導入韻書配置

（尚未實現）導入 `*.dict.yaml` 的 YAML 配置部份。

## 加載規則

以上介紹的編譯指令及編譯器插件，僅對交給 *配置編譯器* 處理的 *源文件* 有效。

配置源文件的位置詳見 [用戶文件夾](user-data) 及 [共享文件夾](shared-data)。

輸入法程序運行時讀取的配置文件是 *編譯結果文件*（可能是 YAML 格式或二進制格式）。
編譯結果只包含直接供程序讀取的配置內容，而不再包含有特殊含義的編譯指令。

配置的編譯結果文件與源文件並非一一對應的關係，
而是合併重組爲編譯後的默認配置 `default` 以及各輸入方案的配置。

其他不經過編譯處理而直接在運行時由輸入法程序存取的配置文件有：
`installation.yaml`, `user.yaml` 等。

*韻書* 文件中的 YAML 配置部份目前也不支持配置編譯指令。

TODO(rime/docs): 詳解 YAML 節點樹及編譯指令的解析、執行順序

## 配置組件調用方式

TODO(rime/engine): 完成本節

## 代碼風格

YAML 書寫樣式參照 [yaml.org][YAML] 的示例。推薦以下風格：

配置文件開頭用註釋行簡述文件的內容和使用方法。

縮進：用兩個空格縮進。

字符串值：無特殊字符時不使用引號；
需要使用引號時，優先用單引號，以減少雙引號引起的字符轉義問題。

flow-style list: 僅在節點樹的最內層使用。不嵌套使用。元素較多時不用。

flow-style map: 僅在節點樹的最內層使用。不嵌套使用。元素較多時不用。

僅包含一對 key-value 的 map 作爲列表項時，省略 `{ }` 並與 `-` 寫在同一行。

不推薦使用 YAML 的錨點（`&`）和別名引用（`*`）。請用本文介紹的 `__include:` 編譯指令。

## 錯誤處理

部署後出現錯誤，請查看 `INFO` 日誌（[參考](./#關於調試)），
找到行首字符爲 `E` 的記錄，根據錯誤信息以及上下文排查出錯的配置文件。

未出現錯誤信息，配置亦未達到預期效果，請對照 `<用戶文件夾>/build/` 文件夾內的編譯結果文件，檢查配置源文件與補靪。

## 版本控制

輸入方案及配置的版本可以用文件中的一項 *字符串值* 記錄。如：`version: '3.14'`

版本號習慣以形爲 `X.Y.Z` 的多個數字組成。
爲避免將版本號解析爲 YAML 數值類型而發生錯誤，如 `0.10`（〇點十）不同於 `0.1`（〇點一），
應一律爲版本號加上引號 `'3.14'` 以示其爲字符串類型。

## 分發

輸入方案設計師完成輸入方案及配套韻書後，將源文件發佈在一間 [GitHub][] 代碼庫，
用家便可通過 Rime 配置管理工具 [東風破][plum] 獲取輸入方案的最新版本並安裝到輸入法。

  [GitHub]: https://github.com
  [plum]: https://github.com/rime/plum
