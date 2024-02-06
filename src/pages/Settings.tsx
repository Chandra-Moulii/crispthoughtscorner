import { useAuth0 } from "@auth0/auth0-react";
import { useLayoutEffect, useState } from "react";

import Header from "../components/stateless/Header";
import ToastMessage from "../components/stateless/Toast";
import { getDeviceTheme } from "../customHooks/useDarkmode";

export default function Settings() {
  const [theme, setTheme] = useState("");

  const { logout: logoutWithRedirect, user } = useAuth0();

  function logout() {
    logoutWithRedirect();
  }

  function changeTheme(theme: string) {
    if (theme === "system") {
      document.documentElement.classList.add(getDeviceTheme());
    } else if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setTheme(() => {
      localStorage.setItem("theme", theme);
      return theme;
    });
  }

  useLayoutEffect(() => {
    document.title = "CrispThoughtsCorner - Settings";
    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "system");
      setTheme("system");
    } else setTheme(theme);
    if (theme === "system") {
      document.documentElement.classList.add(getDeviceTheme());
    } else if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <div className="px-4">
      <ToastMessage />
      <Header title="Settings" />
      <div className="group relative my-2 w-fit select-none">
        <img
          draggable={false}
          src={user?.picture}
          className="aspect-square w-20 rounded border-4 border-skin-accent/30"
        />
        <span className="absolute left-[calc(100%+0.5rem)] top-1/2 z-10 hidden -translate-y-1/2 rounded bg-skin-background/50 p-2 text-xs shadow-md md:group-hover:block">
          {user?.email}
        </span>
      </div>

      <div className="my-3">
        <p className="font-bold">Theme</p>
        <div className="mt-2 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="theme"
              id="theme-light"
              onChange={() => changeTheme("light")}
              checked={theme === "light"}
              className="relative grid aspect-square w-4 appearance-none place-items-center rounded-full border-2 border-skin-color/80 outline-none before:absolute before:hidden before:aspect-square before:w-2 before:rounded-full before:bg-skin-color/80 checked:before:block focus-visible:ring"
            />
            <label htmlFor="theme-light">Light</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="theme"
              id="theme-dark"
              onChange={() => changeTheme("dark")}
              checked={theme === "dark"}
              className="relative grid aspect-square w-4 appearance-none place-items-center rounded-full border-2 border-skin-color/80 outline-none before:absolute before:hidden before:aspect-square before:w-2 before:rounded-full before:bg-skin-color/80 checked:before:block focus-visible:ring"
            />
            <label htmlFor="theme-dark">Dark</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="theme"
              id="theme-system"
              onChange={() => changeTheme("system")}
              checked={theme === "system"}
              className="relative grid aspect-square w-4 appearance-none place-items-center rounded-full border-2 border-skin-color/80 outline-none before:absolute before:hidden before:aspect-square before:w-2 before:rounded-full before:bg-skin-color/80 checked:before:block focus-visible:ring"
            />
            <label htmlFor="theme-system">System</label>
          </div>
        </div>
      </div>
      <section className="my-5 flex gap-2">
        <button
          onClick={logout}
          className="rounded-sm bg-skin-error px-3 py-1 text-white outline-none ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
        >
          Log out
        </button>
      </section>
    </div>
  );
}
