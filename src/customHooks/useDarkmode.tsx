import { useLayoutEffect } from "react";

export default function useDarkMode() {
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  });
}
