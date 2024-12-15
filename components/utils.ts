import { darkTheme, lightTheme } from "naive-ui";
import { ref } from "vue";

export const theme = ref(darkTheme);

export const sync = () => {
  theme.value = document.documentElement.className.split(" ").includes("dark")
    ? darkTheme
    : lightTheme;
  setTimeout(sync, 100);
};
