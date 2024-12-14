import * as OpenCC from "opencc-js";
import { globSync } from "glob";
import { readFileSync, writeFileSync } from "fs";

const converter = OpenCC.Converter({ from: "t", to: "cn" });

const files = globSync("zh-Hant/**/*.md");
for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const simplified = converter(content);
  writeFileSync(file.replace("zh-Hant/", ""), simplified);
}
