import { DefaultTheme, defineConfig, LocaleSpecificConfig } from "vitepress";

const rime_zh_Hant: DefaultTheme.SidebarMulti["rime"] = [
  {
    text: "開始",
    items: [
      { text: "說明書", link: "/zh-Hant/rime/" },
      { text: "定製指南", link: "/zh-Hant/rime/customization-guide" },
      { text: "用戶資料夾", link: "/zh-Hant/rime/user-data" },
      { text: "共享文件夾", link: "/zh-Hant/rime/shared-data" },
    ],
  },
  {
    text: "進階",
    items: [
      { text: "輸入方案設計書", link: "/zh-Hant/rime/schema-design" },
      { text: "配置文件", link: "/zh-Hant/rime/configuration" },
      { text: "拼寫運算", link: "/zh-Hant/rime/spelling-algebra" },
      { text: "詞典擴展包", link: "/zh-Hant/rime/dictionary-pack" },
      { text: "配方", link: "/zh-Hant/rime/recipes" },
    ],
  },
  {
    text: "配置項詳解",
    items: [
      { text: "schema.yaml 詳解", link: "/zh-Hant/rime/schema" },
      { text: "dict.yaml 詳解", link: "/zh-Hant/rime/dict" },
    ]
  },
  {
    text: "前端",
    items: [
      { text: "小狼毫", link: "/zh-Hant/rime/weasel" },
      { text: "鼠須管", link: "/zh-Hant/rime/squirrel" },
      { text: "中州韻", link: "/zh-Hant/rime/ibus-rime" },
    ],
  },
];

const config: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "zh-Hant",
  themeConfig: {
    sidebar: {
      "/zh-Hant/rime/": rime_zh_Hant,
    },
    nav: [
      { text: "教程", link: "/zh-Hant/rime" },
      { text: "開發文檔", link: "/zh-Hant/librime" },
      { text: "工具",
        items: [
          { text: "拼寫運算調試", link: "/zh-Hant/debugger" },
          { text: "方案測試工具", link: "https://github.com/rimeinn/mira" },
        ]
      },
    ],
    outlineTitle: "本頁大綱",
    sidebarMenuLabel: "文檔目錄",
    returnToTopLabel: "返回頂部",
    darkModeSwitchLabel: "主題切換",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
};

export default config;
