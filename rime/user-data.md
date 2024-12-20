# 用户文件夹

Rime 从「用户文件夹」读取用家自订的配置。

输入法运行时保存的数据如 *用户词典*、安装信息、选项状态等也放在这里。

## 位置

`librime` 允许输入法指定用户文件夹的位置。

用户文件夹的位置应使用绝对路径。[请勿使用相对路径](https://github.com/rime/weasel/issues/563)。

- **小狼毫：** 用户文件夹的默认路径为 `%APPDATA%\Rime`。也可以通过「开始菜单＼小狼毫输入法＼用户文件夹」打开。
- **鼠须管：** 用户文件夹的路径为 `~/Library/Rime`。也可以通过「系统输入法菜单／鼠须管／用户设定…」打开。
- **ibus-rime:** `~/.config/ibus/rime`
- **fcitx-rime:** `~/.config/fcitx/rime`
- **fcitx5-rime:** `~/.local/share/fcitx5/rime/`

## 内容

用家下载或定制的文件：

- `<输入方案代号>.schema.yaml` - 用户下载或自定义的 *输入方案*。
- `<韵书代号>.dict.yaml` - 用户下载或自定义的 *韵书*。
- `<词典名称>.txt` - 文本格式的词典，如预设词汇表、用户 *自定义词组*。
- `<配置代号>.custom.yaml` - 应用于配置文件 `<配置代号>.schema.yaml` 或 `<配置代号>.yaml` 的 *补靪*。
- `opencc/*` - [OpenCC](https://github.com/BYVoid/OpenCC) 字形转换配置及字典文件。

输入法程序记录的使用习惯等信息：

- `<输入法语言代号>.userdb/` - 输入法程序为保存用户的输入习惯而创建的 *用户词典*。
- `installation.yaml` - 安装信息。输入法程序在首次运行及升级后写入安装、升级时间、程序版本等。
- `user.yaml` - 用户状态信息。包括在 *方案选单* 选取的输入方案、输入法选项状态如「中／西」「简／繁」等。

部署时生成的文件：

- `build/*` - 快取文件。为使输入法程序高效运行，在部署过程中将配置、韵书等编译为机读格式。
- `trash/*` - 失效的文件。因 Rime 升级而不再使用的旧文件会自动移入这个文件夹。用家确认不再需要后可以删除。

注：`librime` 1.3 版本之前，编译后的快取文件（包括应用了补靪的 YAML 配置）直接存放在用户文件夹；`librime` 升级后将其移入 `trash/`。如果某个 YAML 源文件已经找不到了，无法在升级后重新编译，可以从 `trash/` 里面找回一份副本。