---
layout: page

hero:
  name: 欢迎使用
  text: 「仓输入法」
  tagline: "这里是「仓输入法」的使用指南"
  image:
    src: https://ihsiao.com/apps/hamster/docs/_astro/hamster.DmiCuiFR_13JPyb.webp
  actions:
    - theme: brand
      text: 阅读指南 →
      link: ./guide

features:
  - title: 输入方案
    details: 如何在「仓」中使用其它「输入方案」
    link: ./guide
  - title: 文件管理
    details: 理解「仓」中的文件机制
    link: ./guide
  - title: 应用设置
    details: 解锁更多应用配置
    link: ./guide
  - title: 自定义键盘
    details: 个性化你的键盘外观
    link: ./guide
---
<script setup lang="ts">
import { VPHomeContent, VPHomeFeatures, VPHomeHero } from "vitepress/theme";
</script>

<style>
#hamster-root {
  --vp-home-hero-name-color: var(--vp-c-text-1);
  --vp-home-hero-image-background-image: transparent;
}
</style>

<div id="hamster-root">
  <VPHomeHero />
  <VPHomeContent>
    <h2>下一步</h2>
  </VPHomeContent>
  <VPHomeFeatures />
</div>
