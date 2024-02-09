import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";

import "../assets/markdown.css";
import supabase from "../supabase";
import { openDialog, closeDialog } from "../utils/HandleDialogs";
import ImageDecoy from "../components/stateless/ImageDecoy";
import Header from "../components/stateless/Header";

export default function NewPost() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [previewState, setPreviewState] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const btnref = useRef<HTMLButtonElement | null>(null);
  const [postDescription, setPostDescription] = useState("");
  const dialogref = useRef<HTMLDialogElement | null>(null);
  const censoredWords = [
    "fuck",
    "bitch",
    "pussy",
    "suck",
    "dick",
    "nigga",
    "sadist",
  ];
  function sanitizePostDescription(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setPostDescription(
      DOMPurify.sanitize(event.target.value, {
        FORBID_TAGS: [
          "style",
          "script",
          "iframe",
          "input",
          "form",
          "body",
          "svg",
        ],
        FORBID_ATTR: ["style", "src", "onerror"],
      }),
    );
  }
  function censoredText(text: string) {
    const regex = new RegExp(censoredWords.join("|"), "gi");
    return text.replace(regex, (item) => item.slice(0, -1) + "*");
  }

  async function addPost(event: React.FormEvent) {
    event.preventDefault();
    const posTitle = ref.current as HTMLInputElement;
    if (
      !posTitle.value.trimStart() ||
      posTitle.value.length < 5 ||
      posTitle.value.length > 150
    ) {
      posTitle.focus();
      return;
    }
    if (postDescription.trimStart() === "") {
      if (textAreaRef.current) textAreaRef.current.focus();
      return;
    }
    const newPost = {
      postTitle: censoredText(posTitle.value.trim()),
      postDescription: censoredText(DOMPurify.sanitize(postDescription.trim())),
      postAuthor: user?.email,
    };
    const target = btnref.current as HTMLButtonElement;
    target.innerText = "Posting...";
    target.disabled = true;
    await supabase.from("Posts").insert(newPost).select();
    target.innerText = "Post";
    navigate(-1);
  }

  function close() {
    const posTitle = ref.current as HTMLInputElement;
    if (postDescription !== "" || posTitle.value !== "") {
      openDialog(dialogref);
      return false;
    }
    return true;
  }

  function closeNewPost() {
    if (!close()) return;
    navigate(-1);
  }

  useEffect(() => {
    document.title = "CrispThoughtsCorner - New Post";
  }, []);

  return (
    <div className="px-4 font-medium">
      <Header title="New Post" fn={close} />
      <form onSubmit={addPost} className="my-2">
        <label htmlFor="postTitle" className="text-sm text-skin-color/60">
          Post Title
        </label>
        <div>
          <input
            data-content="Post Title"
            type="text"
            id="postTitle"
            autoFocus
            ref={ref}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Give a title to your post"
            className="mt-1 block w-full rounded-sm border-b-2 border-skin-color/40 bg-skin-background py-1 outline-none ring-skin-color/30 placeholder:text-skin-color/40 focus:border-skin-color/70"
          />
        </div>
        <div className="my-3 text-skin-color/60">
          <p
            className={`text-xs ${postTitle.length > 130 && postTitle.length < 150 ? "text-yellow-500" : postTitle.length >= 150 && "text-skin-error"}`}
          >
            {postTitle.length > 150
              ? "Character limit exceeded !!!"
              : `Used ${postTitle.length} characters of 150`}
          </p>
        </div>
        <>
          <header className="mt-3 flex gap-1 text-sm text-skin-color/60">
            <button
              type="button"
              className={`cursor-pointer px-4 py-2 outline-none ring-inset ring-skin-accent/50 focus-visible:ring-2 ${
                previewState ? "" : "bg-skin-accent/10"
              }`}
              onClick={() => setPreviewState(false)}
            >
              Description
            </button>
            {postDescription && (
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 outline-none ring-inset ring-skin-accent/50 focus-visible:ring-2 ${
                  previewState ? "bg-skin-accent/10" : ""
                }`}
                onClick={() => setPreviewState(true)}
              >
                Preview
              </button>
            )}
          </header>
          <>
            {!previewState ? (
              <textarea
                ref={textAreaRef}
                value={postDescription}
                onChange={sanitizePostDescription}
                id="postDescription"
                placeholder="Note : Markdown supported"
                className="h-80 w-full resize-none rounded-b-md bg-skin-accent/10 p-3 align-top leading-relaxed outline-none ring-skin-color/30 placeholder:text-skin-color/40"
              />
            ) : (
              <section className="tw-none h-80 w-full overflow-x-hidden bg-skin-accent/10 p-3">
                <Markdown
                  options={{
                    overrides: {
                      img: {
                        component: (props) => <ImageDecoy {...props} />,
                      },
                      a: {
                        component: (props) => (
                          <a {...props} target="_blank"></a>
                        ),
                      },
                    },
                  }}
                >
                  {postDescription}
                </Markdown>
              </section>
            )}
          </>
        </>

        <div className="my-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeNewPost}
            className="rounded-sm bg-skin-error px-3 py-1 text-white outline-none ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
          >
            Cancel
          </button>
          <button
            type="submit"
            ref={btnref}
            disabled={postTitle.length < 5 || postTitle.length > 150}
            className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-white/30"
          >
            Post
          </button>
        </div>
      </form>

      <dialog
        data-state="closed"
        ref={dialogref}
        className="animate-pop rounded border-0 bg-skin-background px-4 py-3 text-left text-skin-color outline-none backdrop:bg-black/80 sm:max-w-sm md:max-w-sm"
      >
        <header className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Unsaved Changes</h3>
          <button
            className="rounded-sm p-[1px] outline-none ring-skin-error/40 focus:ring"
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
          Your Creativity is at Play! Considering Discarding Your Changes?
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => closeDialog(dialogref)}
            className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring"
          >
            Keep
          </button>
          <Link
            to="/home"
            className="rounded-sm bg-skin-error px-3 py-1 text-white outline-none ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
          >
            Discard
          </Link>
        </div>
      </dialog>
    </div>
  );
}
