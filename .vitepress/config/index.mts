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
      { text: "输入方案设计书", link: "/rime/schema-design" },
      { text: "配置文件", link: "/rime/configuration" },
      { text: "拼写运算", link: "/rime/spelling-algebra" },
      { text: "词典扩展包", link: "/rime/dictionary-pack" },
      { text: "配方", link: "/rime/recipes" },
    ],
  },
  {
    text: "配置项详解",
    items: [
      { text: "schema.yaml 详解", link: "/rime/schema" },
      { text: "dict.yaml 详解", link: "/rime/dict" },
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

const hamster: DefaultTheme.SidebarMulti["hamster"] = [
  { text: "仓输入法", link: "/frontend/hamster/" },
  { text: "指南", items: [] },
  { text: "应用更新", items: [] },
];

const plugin: DefaultTheme.SidebarMulti["plugin"] = [
  {
    text: "Lua",
    items: [
      { text: "快速上手", link: "/plugin/lua/Scripting" },
      {
        text: "编程接口",
        link: "/plugin/lua/API",
      },
      {
        text: "对象接口",
        link: "/plugin/lua/Objects",
      },
    ],
  },
];

const config: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "zh-Hans",
  themeConfig: {
    sidebar: {
      "/rime/": rime,
      "/frontend/hamster/": hamster,
      "/plugin/": plugin,
    },
    nav: [
      { text: "教程", link: "/rime" },
      { text: "开发文档", link: "/librime" },
      { text: "工具", items: [{ text: "拼写运算调试", link: "/debugger" }] },
      {
        text: "前端",
        items: [
          { text: "仓输入法", link: "/frontend/hamster" },
          { text: "同文输入法", link: "/frontend/trime" },
        ],
      },
      {
        text: "插件",
        items: [{ text: "Lua", link: "/plugin/lua/Scripting" }],
      },
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
  vite: {
    ssr: {
      noExternal: ["naive-ui", "vueuc"],
    },
  },
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/rimeinn" }],
  },
  ignoreDeadLinks: true,
});
