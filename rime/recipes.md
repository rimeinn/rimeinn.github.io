# 配方

配方也记作 ℞，是由 [东风破](https://github.com/rime/plum) 配置管理工具所支持的 Rime 数据分发形式。

配方可以用来安装输入方案、修改配置、实现自定义功能。

## 用配方管理自定义配置

将所需输入方案及自定义配置项全部以配方形式列出，则可以按照列表自动完成各项配置动作，或在全新的用户文件夹还原输入法的自定义配置。
（为最大限度还原使用习惯，还需要另行同步用户词典的数据。）

以下示例 bash 脚本为 [鼠须管](https://github.com/rime/squirrel) 安装输入方案并修改个人偏好。

配方列表 `recipes` 中的定制内容为：
  - 安装「预设方案集」「国际音标」「绘文字」
  - 方案选单设定为启用「地球拼音」「云龙国际音标」
  - 设定在「地球拼音」中列出绘文字候选
  - 设定鼠须管的配色方案
  - 设定候选字列表横排

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
