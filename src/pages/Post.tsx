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
import { openDialog, closeDialog } from "../utils/HandleDialogs";
import ImageDecoy from "../components/stateless/ImageDecoy";
import Spinner from "../components/stateless/Spinner";
import ToastMessage from "../components/stateless/Toast";

export default function Post() {
  const { id } = useParams();
  const {
    user,
    isAuthenticated,
    isLoading: loading,
    loginWithRedirect,
  } = useAuth0();
  const [alt, setAlt] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const dialogref = useRef<HTMLDialogElement | null>(null);
  const [moveToTopButtonVisible, setMoveToTopButtonStatus] = useState(false);

  const { data, isLoading, error } = useQuery(["post", id], fetchPost, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 1,
  });

  async function fetchPost() {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    return data[0];
  }

  function openImagePreview(event: MouseEvent) {
    const target = (event.target as HTMLImageElement)
      .firstChild as HTMLImageElement;
    openDialog(dialogref);
    setImageSrc(target?.src);
    setAlt(target?.title);
  }

  function copy(text: string, info: string) {
    toast.success(info);
    navigator.clipboard.writeText(text);
  }
  useDarkMode();

  useEffect(() => {
    function findScrolledDistance() {
      // !!! Please throttle this
      const scrolledHeight = Math.round(window.scrollY);
      setMoveToTopButtonStatus(scrolledHeight > 150);
    }
    document.addEventListener("scroll", findScrolledDistance);
    return () => document.removeEventListener("scroll", findScrolledDistance);
  }, []);

  if (error)
    return (
      <ErrorPage info="Hmm...this post doesn’t exist. Try searching for someone else." />
    );

  return (
    <div>
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
          <h1 className="my-1 mb-2 text-2xl font-bold">{data?.postTitle}</h1>
          <p className="text-sm">
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

          <section className="mb-2 mt-1 flex gap-2">
            <span>
              <button
                className="group rounded-sm p-[2.5px] opacity-80 outline-none hover:opacity-100 focus-visible:opacity-100"
                onClick={() => copy(window.location.href, "Post Link copied")}
              >
                <p className="text-xs underline underline-offset-2">
                  Copy Link
                </p>
              </button>
            </span>
            <span>
              <ToastMessage />
              <button
                className="group rounded-sm p-[2.5px] opacity-80 outline-none hover:opacity-100 focus-visible:opacity-100"
                onClick={() => copy(data.postDescription, "Markdown copied")}
              >
                <p className="text-xs underline underline-offset-2">
                  Copy Markdown
                </p>
              </button>
            </span>
          </section>

          <hr className="border-1 my-3 border-skin-color/20" />
          <section className="tw-none relative pb-20 text-sm">
            <Markdown
              options={{
                overrides: {
                  img: {
                    component: (props) => (
                      <ImageDecoy {...props} fn={openImagePreview} />
                    ),
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
          </section>
        </>
      )}

      <dialog
        data-state="closed"
        ref={dialogref}
        className="max-w-2xl border-0 bg-skin-background text-left text-skin-color outline-none backdrop:bg-black/85 md:animate-pop"
      >
        <div
          data-title={alt}
          className="after:from-black-500 relative max-w-3xl select-none after:absolute after:top-0 after:h-16 after:w-full after:bg-gradient-to-b after:from-black/70 after:to-transparent after:px-3 after:py-2 after:font-medium after:text-white/80 after:md:text-lg md:after:content-[attr(data-title)]"
        >
          <button
            autoFocus
            onClick={() => closeDialog(dialogref)}
            className="full absolute right-2 top-2 z-30 rounded-sm outline-none ring-white/50 focus:ring-2"
          >
            <svg
              viewBox="0 -960 960 960"
              className="aspect-square w-5 fill-white/60"
            >
              <path d="m251.333-204.667-46.666-46.666L433.334-480 204.667-708.667l46.666-46.666L480-526.666l228.667-228.667 46.666 46.666L526.666-480l228.667 228.667-46.666 46.666L480-433.334 251.333-204.667Z" />
            </svg>
          </button>
          <img src={imageSrc} draggable={false} />
        </div>
      </dialog>
    </div>
  );
}

const MoveToTopButton = () => {
  return (
    <div className="fixed bottom-5 left-1/2 my-2 -translate-x-1/2 rounded-full bg-skin-color">
      <button
        className="rounded-full p-1 font-semibold text-skin-accent outline-none ring-skin-accent focus-visible:ring-2"
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
