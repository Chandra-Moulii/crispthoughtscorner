import DOMPurify from "dompurify";
import Markdown from "markdown-to-jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../assets/markdown.css";
import supabase from "../supabase";
import Header from "../components/stateless/Header";
import ImageDecoy from "../components/stateless/ImageDecoy";
import { toast } from "sonner";

export default function EditPost() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [previewState, setPreviewState] = useState(false);
  const btnref = useRef<HTMLButtonElement | null>(null);
  const [postDescription, setPostDescription] = useState("");
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

  async function editPost(event: React.FormEvent) {
    event.preventDefault();
    const posTitle = ref.current as HTMLInputElement;
    if (!posTitle.value.trimStart() || posTitle.value.length < 5) {
      posTitle.focus();
      return;
    }
    if (postDescription.trimStart() === "") {
      if (textAreaRef.current) textAreaRef.current.focus();
      return;
    }
    const editedPost = {
      postTitle: censoredText(posTitle.value.trim()),
      postDescription: censoredText(DOMPurify.sanitize(postDescription.trim())),
      postAuthor: user?.email,
    };
    const target = btnref.current as HTMLButtonElement;
    target.innerText = "Posting...";
    target.disabled = true;
    await supabase
      .from("Posts")
      .update(editedPost)
      .eq("id", params.id)
      .select();
    target.innerText = "Post";
    navigate(-1);
    toast.success("successfully edited");
  }

  function closeNewPost() {
    navigate(-1);
  }

  const getpost = useCallback(async () => {
    const { data: Post } = await supabase
      .from("Posts")
      .select("*")
      .eq("id", params.id);
    if (!Post) return;
    if (ref.current) {
      ref.current.value = Post[0].postTitle;
    }
    if (textAreaRef.current) {
      textAreaRef.current.value = Post[0].postDescription;
      setPostDescription(Post[0].postDescription);
    }
  }, [params.id]);

  useEffect(() => {
    getpost();
  }, [getpost]);

  return (
    <div className="font-medium">
      <Header title="Edit Post" />
      <form onSubmit={editPost} className="my-2">
        <label htmlFor="postTitle" className="text-sm text-skin-color/60">
          Post Title
        </label>
        <input
          data-content="Post Title"
          type="text"
          id="postTitle"
          autoFocus
          ref={ref}
          maxLength={100}
          placeholder="Give a title to your post"
          className="mt-1 block w-full rounded-sm border-b-2 border-skin-color/40 bg-skin-background py-1 outline-none ring-skin-color/30 placeholder:text-skin-color/40 focus:border-skin-color/70"
        />

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
            className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring disabled:opacity-50 disabled:hover:border-skin-color/10"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
