import { useAuth0 } from "@auth0/auth0-react";
import { useLayoutEffect, useRef, useState } from "react";

import Header from "../components/stateless/Header";
import { closeDialog } from "../utils/HandleDialogs";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ToastMessage from "../components/stateless/Toast";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const dialogref = useRef<HTMLDialogElement | null>(null);
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

  function deleteAccount() {
    toast.info("Delete account - Coming soon...");
  }

  function verifyEmail() {
    toast.info("Verify account - Coming soon...");
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
    <div>
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
      {user?.email_verified ? null : (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm bg-skin-accent/10 px-3 py-2 md:flex-nowrap">
          <div>
            <p className="mb-[2px] font-semibold text-skin-accent">
              Verify your email
            </p>
            <p className="text-xs">
              Verify your email address immediately for protection.
            </p>
          </div>
          <button
            onClick={verifyEmail}
            className="rounded-sm border-2 border-skin-accent/40 px-[15px] py-1 text-sm text-skin-accent outline-none ring-skin-accent/60 hover:bg-skin-accent/10 focus-visible:ring-2"
          >
            Verify
          </button>
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 rounded-sm bg-skin-error/5 px-3 py-2 md:flex-nowrap">
        <div>
          <p className="mb-[2px] font-semibold text-skin-error">
            Delete my account
          </p>
          <p className="text-xs">
            Once you delete your account, there is no going back.
          </p>
        </div>
        <button
          onClick={deleteAccount}
          className="rounded-sm border-2 border-skin-error/40 px-3 py-1 text-sm text-skin-error outline-none ring-skin-error/60 hover:bg-skin-error/10 focus-visible:ring-2"
        >
          Delete
        </button>
      </div>
      <dialog
        data-state="closed"
        ref={dialogref}
        className="animate-pop rounded border-0 bg-skin-background px-4 py-3 text-left text-skin-color outline-none backdrop:bg-black/80 sm:max-w-sm md:max-w-sm"
      >
        <header className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Account Deletion</h3>
          <button
            className="rounded-sm p-[1px] outline-none ring-skin-error/40 focus:ring-2"
            onClick={() => closeDialog(dialogref)}
          >
            <svg
              viewBox="0 -960 960 960"
              className="aspect-square w-5 fill-skin-color/70"
            >
              <path d="M256-192.348 192.348-256l224-224-224-224L256-767.652l224 224 224-224L767.652-704l-224 224 224 224L704-192.348l-224-224-224 224Z" />
            </svg>
          </button>
        </header>
        <hr className="my-2 border-skin-color/20" />
        <p className="my-2">
          Are you sure you want to permenantly delete your account?
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => closeDialog(dialogref)}
            className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring"
          >
            Cancel
          </button>
          <Link
            to="/home"
            className="rounded-sm bg-skin-error px-3 py-1 text-white outline-none ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
          >
            Delete
          </Link>
        </div>
      </dialog>
    </div>
  );
}
