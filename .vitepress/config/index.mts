import { DefaultTheme, defineConfig, LocaleSpecificConfig } from "vitepress";
import zh_Hant from "./zh-Hant.mts";

const rime: DefaultTheme.SidebarMulti["rime"] = [
  {
    text: "开始",
    items: [
      { text: "说明书", link: "/rime/" },
      { text: "定制指南", link: "/rime/customization-guide" },
      { text: "用户文件夹", link: "/rime/user-data" },
      { text: "共享文件夾", link: "/rime/shared-data" },
    ],
  },
  {
    text: "进阶",
    items: [
      { text: "输入方案设计书", link: "/rime/schema" },
      { text: "配置文件", link: "/rime/configuration" },
      { text: "拼写运算", link: "/rime/spelling-algebra" },
      { text: "词典扩展包", link: "/rime/dictionary-pack" },
      { text: "配方", link: "/rime/recipes" },
    ],
  },
  {
    text: "前端",
    items: [
      { text: "小狼毫", link: "/rime/weasel" },
      { text: "鼠须管", link: "/rime/squirrel" },
      { text: "中州韵", link: "/rime/ibus-rime" },
    ],
  },
];

const config: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "zh-Hans",
  themeConfig: {
    sidebar: {
      "/rime/": rime,
    },
    nav: [
      { text: "教程", link: "/rime" },
      { text: "开发文档", link: "/librime" },
    ],
    outlineTitle: "本页大纲",
    sidebarMenuLabel: "文档目录",
    returnToTopLabel: "返回顶部",
    darkModeSwitchLabel: "主题切换",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-Hans",
  title: "RimeInn",
  description: "Rime 资源聚合",
  locales: {
    root: {
      label: "简体",
      ...config,
    },
    "zh-Hant": {
      label: "繁體",
      ...zh_Hant,
    },
  },

  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/rimeinn" }],
  },
});
