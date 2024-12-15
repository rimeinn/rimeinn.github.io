<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { load } from "js-yaml";
import {
  NConfigProvider,
  NFlex,
  NAlert,
  NH2,
  NForm,
  NFormItem,
  NInputGroup,
  NInputGroupLabel,
  NSelect,
  NTag,
} from "naive-ui";
import { Buffer } from "buffer";
import { sync, theme } from "./utils";
import {
  Algebra,
  algebraOptions,
  executeAlgebraList,
  parseAlgebra,
} from "./algebra";
window.Buffer = Buffer;

function handleFileUpload(
  event: Event,
  name: Ref<string | undefined>,
  content: Ref<string | undefined>
) {
  const file = (event.target as any).files[0] as File | undefined;
  if (!file) return;
  name.value = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target?.result !== "string") return;
    content.value = e.target.result;
  };
  reader.readAsText(file);
}

const handleSchemaUpload = (event: Event) => {
  handleFileUpload(event, schemaName, schemaContent);
};

const handleDictUpload = (event: Event) => {
  handleFileUpload(event, dictName, dictContent);
};

const schemaContent = ref<string | undefined>("");
const schemaName = ref<string | undefined>("");
const schema = computed(() => {
  if (schemaContent.value) {
    return load(schemaContent.value) as any;
  }
});
const spellingAlgebra = computed(() => {
  const algebraStringList = schema.value?.speller?.algebra as
    | string[]
    | undefined;
  if (!algebraStringList) return [];
  const algebraList: Algebra[] = [];
  algebraStringList.forEach((algebra) => {
    const parsed = parseAlgebra(algebra);
    if (parsed) algebraList.push(parsed);
  });
  return algebraList;
});

const dictContent = ref<string | undefined>("");
const dictName = ref<string | undefined>("");

const syllables = computed(() => {
  const syllables: Set<string> = new Set();
  if (!dictContent.value) return [];
  const lines = dictContent.value.split("\n").map((line) => line.trim());
  const delimiterIndex = lines.indexOf("...");
  if (delimiterIndex === -1) return [];
  const yamlDoc = lines.slice(0, delimiterIndex).join("\n");
  const yaml = load(yamlDoc) as any;
  const columns: string[] = yaml["columns"] || ["text", "code"];
  const codeIndex = columns.indexOf("code");
  if (codeIndex === -1) return [];
  for (const line of lines.slice(delimiterIndex + 1)) {
    const parts = line.split("\t");
    const code = parts[codeIndex];
    if (!code) continue;
    const syllableList = code.split(" ");
    syllableList.forEach((syllable) => {
      syllables.add(syllable);
    });
  }
  return [...syllables].sort();
});

const syllableOptions = computed(() => {
  return syllables.value.map((syllable) => ({
    value: syllable,
    label: syllable,
  }));
});

const currentSyllables = ref<string[]>([]);
const algebraResults = computed(() =>
  executeAlgebraList(spellingAlgebra.value, currentSyllables.value)
);
onMounted(sync);
</script>
<style scoped>
.hover:hover {
  background-color: var(--vp-c-default-1);
}
</style>
<template>
  <n-config-provider :theme="theme">
    <n-flex vertical :size="'large'">
      <n-alert title="Warning" type="warning">
        目前不支持 librime 对 YAML 语法的扩展，如
        <code>__include</code>、<code>__append</code>
        等等，拼写运算的内容必须为字面量。
      </n-alert>
      <n-form>
        <n-form-item label="方案" label-placement="left">
          <input type="file" @change="handleSchemaUpload" />
        </n-form-item>
        <n-form-item label="词典" label-placement="left">
          <input type="file" @change="handleDictUpload" />
        </n-form-item>
      </n-form>
      <n-select
        v-model:value="currentSyllables"
        :multiple="true"
        :filterable="true"
        :options="syllableOptions"
        :placeholder="'在此输入要用拼写运算处理的音节'"
      />
      <n-h2>运算过程</n-h2>
      <n-flex vertical>
        <n-flex
          v-for="[index, algebra] of spellingAlgebra.entries()"
          :key="index"
          :justify="'space-between'"
          :align="'center'"
          class="hover"
        >
          <n-input-group style="width: auto">
            <n-select
              :options="algebraOptions"
              style="width: 5.5rem"
              :value="algebra.type"
            />
            <n-input-group-label>{{ algebra.from.source }}</n-input-group-label>
            <n-input-group-label>{{ algebra.to }}</n-input-group-label>
          </n-input-group>
          <n-flex>
            <n-tag v-for="result of algebraResults[index]">{{ result }}</n-tag>
          </n-flex>
        </n-flex>
      </n-flex>
    </n-flex>
  </n-config-provider>
</template>
