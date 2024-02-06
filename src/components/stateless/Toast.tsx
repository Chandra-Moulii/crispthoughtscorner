import { useEffect, useState } from "react";
import { Toaster } from "sonner";

type theme = "light" | "dark" | "system";

export default function ToastMessage() {
  const [theme, setTheme] = useState<theme>("system");
  useEffect(() => {
    const storedTheme: theme = localStorage.getItem("theme") as theme;
    if (!storedTheme) return;
    setTheme(storedTheme);
  }, []);
  return (
    <Toaster
      richColors
      closeButton
      theme={theme}
      position="bottom-right"
      toastOptions={{ classNames: { toast: "!p-3" } }}
    />
  );
}
