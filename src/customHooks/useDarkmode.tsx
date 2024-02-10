import { useLayoutEffect } from "react";

export default function useDarkMode() {
  function handleThemeChange() {
    const theme = localStorage.getItem("theme");
    if (theme === "system") {
      document.documentElement.className = "";
      document.documentElement.classList.add(getDeviceTheme());
    }
  }
  useLayoutEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);
    const theme = localStorage.getItem("theme");
    if (theme === "system") {
      document.documentElement.className = getDeviceTheme();
    } else if (theme === "dark") document.documentElement.className = "dark";
    else document.documentElement.classList.remove("dark");
    if (!theme) {
      localStorage.setItem("theme", "system");
      document.documentElement.className = getDeviceTheme();
    }
  }, []);
}

export function getDeviceTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else return "light";
}
