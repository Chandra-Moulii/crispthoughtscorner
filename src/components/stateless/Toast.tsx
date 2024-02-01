import { useEffect, useState } from "react";
import { Toaster } from "sonner";

type theme = "light" | "dark";

export default function ToastMessage() {
  const [theme, setTheme] = useState<theme>("light");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);
  return (
    <Toaster
      richColors
      closeButton
      theme={theme}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "!p-3 !-my-1",
        },
      }}
    />
  );
}
