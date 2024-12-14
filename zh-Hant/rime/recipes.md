# 配方

配方也記作 ℞，是由 [東風破](https://github.com/rime/plum) 配置管理工具所支持的 Rime 數據分發形式。

配方可以用來安裝輸入方案、修改配置、實現自定義功能。

## 用配方管理自定義配置

將所需輸入方案及自定義配置項全部以配方形式列出，則可以按照列表自動完成各項配置動作，或在全新的用戶文件夾還原輸入法的自定義配置。
（爲最大限度還原使用習慣，還需要另行同步用戶詞典的數據。）

以下示例 bash 腳本爲 [鼠鬚管](https://github.com/rime/squirrel) 安裝輸入方案並修改個人偏好。

配方列表 `recipes` 中的定製內容爲：
  - 安裝「預設方案集」「國際音標」「繪文字」
  - 方案選單設定爲啓用「地球拼音」「雲龍國際音標」
  - 設定在「地球拼音」中列出繪文字候選
  - 設定鼠鬚管的配色方案
  - 設定候選字列表橫排

```bash
#!/bin/bash

recipes=(
  :preset
  ipa
  emoji
  emoji:customize:schema=terra-pinyin
  custom:clear_schema_list
  custom:add:schema=terra_pinyin
  custom:add:schema=ipa_yunlong
  custom:set:config=squirrel,key=style/color_scheme,value=aqua
  custom:set:config=squirrel,key=style/horizontal,value=true
)

bash rime-install "${recipes[@]}" || exit 1
"/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" --reload
```
