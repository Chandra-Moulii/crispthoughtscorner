import { toast } from "sonner";
import Markdown from "markdown-to-jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import "../assets/markdown.css";
import supabase from "../supabase";
import Header from "../components/stateless/Header";
import ErrorPage from "../components/stateless/Error";
import useDarkMode from "../customHooks/useDarkmode";
import ImageDecoy from "../components/stateless/ImageDecoy";
import Spinner from "../components/stateless/Spinner";
import ToastMessage from "../components/stateless/Toast";

export default function Post() {
  const [menuState, setMenuState] = useState(false);
  const { id } = useParams();
  const {
    user,
    isAuthenticated,
    isLoading: loading,
    loginWithRedirect,
  } = useAuth0();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [moveToTopButtonVisible, setMoveToTopButtonStatus] = useState(false);

  const { data, isLoading, error } = useQuery(["post", id], fetchPost, {
    retry: 1,
    staleTime: Infinity,
  });

  async function fetchPost() {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    return data[0];
  }

  function handleScroll() {
    const total_height = document.documentElement.scrollHeight;
    const currscroll_position = window.scrollY;
    const per_scrolled = Math.floor(
      (currscroll_position / (total_height - window.innerHeight)) * 100,
    );
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${per_scrolled}%`;
    }
  }

  function handleCtrlKeyPress(event: KeyboardEvent) {
    if (event.ctrlKey) {
      const pressedKey = event.key.toUpperCase();
      switch (pressedKey) {
        case "L":
          event.preventDefault();
          copyLink();
          break;
        case "D":
          event.preventDefault();
          downloadOfflinePdf();
          break;
        case "M":
          event.preventDefault();
          copyMarkDown(data.postDescription);
          break;
        default:
          break;
      }
    }
  }

  function downloadOfflinePdf() {
    setMenuState(false);
    window.print();
  }

  function copyLink() {
    toast.success("Post Link copied to clipboard successfully");
    navigator.clipboard.writeText(window.location.href);
    setMenuState(false);
  }

  function copyMarkDown(markdown: string) {
    toast.success("Markdown copied to clipboard successfully");
    navigator.clipboard.writeText(markdown);
    setMenuState(false);
  }
  useDarkMode();

  useEffect(() => {
    window.addEventListener("keydown", handleCtrlKeyPress);
    window.addEventListener("scroll", handleScroll);
    function findScrolledDistance() {
      // !!! Please throttle this
      const scrolledHeight = Math.round(window.scrollY);
      setMoveToTopButtonStatus(scrolledHeight > 150);
    }
    document.addEventListener("scroll", findScrolledDistance);
    return () => {
      document.removeEventListener("scroll", findScrolledDistance);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleCtrlKeyPress);
    };
  });

  if (error)
    return (
      <ErrorPage info="Hmm...this post doesn’t exist. Try searching for someone else." />
    );

  return (
    <div className="printable relative px-4">
      <div
        ref={progressBarRef}
        className="fixed left-0 top-0 z-20 h-[6px] w-0 bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 text-center text-sm"
      ></div>
      {!isAuthenticated && !loading ? (
        <div className="sticky top-0 z-10 bg-skin-background bg-skin-background/90">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <h1 className="text-lg font-medium">
                Ready to share your thoughts
              </h1>
              <p className="text-sm">Join us at Crisp Thoughts Corner!</p>
            </div>
            <button
              onClick={() => loginWithRedirect()}
              className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring"
            >
              Login
            </button>
          </div>
          <hr className="border-skin-color/10" />
        </div>
      ) : null}
      {isAuthenticated ? (
        <Header title="Post" />
      ) : (
        <Header title="Post" prev="/" />
      )}

      {isLoading ? (
        <Spinner info="Just a sec" />
      ) : (
        <>
          <h1 className="my-1 mb-2 text-2xl font-black">{data?.postTitle}</h1>
          <p className="not-printable text-sm">
            {`Created at ${new Date(data?.createdAt ?? "")
              .toLocaleString()
              .toLowerCase()} by `}
            {data?.postAuthor === user?.email ? (
              <span>you</span>
            ) : (
              <>
                {isAuthenticated ? (
                  <Link
                    to={`/${data?.postAuthor?.split("@")[0]}`}
                    className="truncate rounded font-medium text-skin-accent decoration-1 underline-offset-2 outline-none focus:underline"
                  >
                    @{data?.postAuthor?.split("@")[0]}
                  </Link>
                ) : (
                  <span className="truncate rounded font-medium text-skin-accent decoration-1 underline-offset-2">
                    @{data?.postAuthor?.split("@")[0]}
                  </span>
                )}
              </>
            )}
          </p>

          {/* Dropdown */}
          <ToastMessage />
          <div className="menu relative mt-3 inline-block select-none text-skin-color">
            <div>
              <button
                type="button"
                onClick={() => setMenuState((prev) => !prev)}
                className="flex items-center gap-1 rounded-md border-2 border-skin-color/20 px-2 py-1 text-sm font-medium outline-none ring-skin-color/20 focus-visible:ring-2"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                Options
                <svg
                  className="aspect-square w-5 fill-skin-color/60"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </button>
            </div>

            {menuState && (
              <div
                className="absolute left-0 z-20 mt-2 w-52 origin-top-right animate-pop rounded-md border-2 border-skin-color/10 bg-skin-background p-[2px] py-1 text-sm font-medium ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <button
                  className="flex w-full items-center justify-between rounded p-2 px-3 text-left outline-none ring-inset hover:bg-skin-color/10 focus-visible:ring-2"
                  onClick={copyLink}
                >
                  <p>Copy Link</p>
                  <p className="hidden text-xs text-skin-color/40 md:inline-block lg:inline-block">
                    Ctrl+L
                  </p>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded p-2 px-3 text-left outline-none ring-inset hover:bg-skin-color/10 focus-visible:ring-2"
                  onClick={() => copyMarkDown(data.postDescription)}
                >
                  <p>Copy Markdown</p>
                  <p className="hidden text-xs text-skin-color/40 md:inline-block lg:inline-block">
                    Ctrl+M
                  </p>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded p-2 px-3 text-left outline-none ring-inset hover:bg-skin-color/10 focus-visible:ring-2"
                  onClick={downloadOfflinePdf}
                >
                  <p>Download post</p>
                  <p className="hidden text-xs text-skin-color/40 md:inline-block lg:inline-block">
                    Ctrl+D
                  </p>
                </button>
              </div>
            )}
          </div>

          <p className="printable hidden">
            Live Preview -&nbsp;
            <a className="text-skin-accent" href={window.location.href}>
              {window.location.href}
            </a>
          </p>

          <hr className="border-1 my-3 border-skin-color/20" />
          <article className="tw-none relative pb-20 text-sm">
            <Markdown
              options={{
                overrides: {
                  img: {
                    component: (props) => <ImageDecoy {...props} />,
                  },
                  a: {
                    component: (props) => <a {...props} target="_blank"></a>,
                  },
                },
              }}
            >
              {data?.postDescription ?? ""}
            </Markdown>
            {moveToTopButtonVisible && <MoveToTopButton />}
          </article>
        </>
      )}
    </div>
  );
}

const MoveToTopButton = () => {
  return (
    <div className="fixed bottom-5 left-1/2 my-2 -translate-x-1/2 rounded-full bg-skin-color">
      <button
        className="rounded-full p-1 outline-none ring-skin-accent ring-offset-2 ring-offset-skin-background focus-visible:ring-2"
        onClick={() => (document.documentElement.scrollTop = 0)}
      >
        <svg
          viewBox="0 -960 960 960"
          className="w-8 rotate-180 fill-skin-background"
        >
          <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
      </button>
    </div>
  );
};
