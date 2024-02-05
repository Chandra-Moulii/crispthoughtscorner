import { useAuth0 } from "@auth0/auth0-react";
import { useLayoutEffect, useState } from "react";

import Header from "../components/stateless/Header";
import ToastMessage from "../components/stateless/Toast";

export default function Settings() {
  const [theme, setTheme] = useState("light");

  const { logout: logoutWithRedirect, user } = useAuth0();

  function logout() {
    logoutWithRedirect();
  }

  function changeTheme() {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setTheme((prev) => {
      localStorage.setItem("theme", prev === "light" ? "dark" : "light");
      return prev === "light" ? "dark" : "light";
    });
  }

  useLayoutEffect(() => {
    document.title = "CrispThoughtsCorner - Settings";
    const theme = localStorage.getItem("theme");
    if (!theme) localStorage.setItem("theme", "light");
    else setTheme(theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
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
      <div className="my-4 flex select-none items-center gap-2">
        <input
          type="checkbox"
          id="darkmode"
          onChange={changeTheme}
          checked={theme === "dark"}
          className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-skin-color/20 p-1 outline-none ring-skin-accent/60 before:block before:aspect-square before:w-[14px] before:-translate-y-[1.2px] before:rounded-full before:bg-white before:transition-transform checked:bg-skin-accent checked:before:translate-x-[14.5px] focus-visible:ring"
        />
        <label htmlFor="darkmode">Dark Mode</label>
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
