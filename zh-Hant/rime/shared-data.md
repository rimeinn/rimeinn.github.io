# 共享文件夾

存放由本機多個用戶共享的文件，通常由輸入法安裝程序寫入。

Rime 輸入法在查找一項資源的時候，會優先訪問 [用戶文件夾](user-data) 中的文件。
用戶文件不存在時，再到共享文件夾中尋找。

一些 Linux 發行版可由 `rime-data` 軟件包安裝常用數據文件到這裏。或用 [/plum/][plum-make-install] 編譯安裝。

  [plum-make-install]: https://github.com/rime/plum#install-as-shared-data

## 位置

`librime` 允許輸入法指定共享文件夾的位置。

- **小狼毫：** `<安裝目錄>\data`
- **鼠鬚管：** `"/Library/Input Methods/Squirrel.app/Contents/SharedSupport"`
- **ibus-rime, fcitx-rime:** `/usr/share/rime-data` （編譯時可配置）

## 內容

輸入方案、韻書、默認配置源文件：

- `<輸入方案代號>.schema.yaml`: 用戶下載或自定義的 *輸入方案*。
- `<韻書代號>.dict.yaml`: 用戶下載或自定義的 *韻書*。
- `<詞典名稱>.txt`: 文本格式的詞典，如預設詞彙表。

也可以包含編譯後的機讀格式，從而省去用戶部署時從相同源文件再次編譯的步驟：

- `build/*` 快取文件。爲使輸入法程序高效運行，預先將配置、韻書等編譯爲機讀格式。

註： `librime` 1.3 版本之前，編譯後的快取文件直接存放在共享文件夾，與源文件並列。

其他：

- `opencc/*` - [OpenCC](https://github.com/BYVoid/OpenCC) 字形轉換配置及字典文件。

