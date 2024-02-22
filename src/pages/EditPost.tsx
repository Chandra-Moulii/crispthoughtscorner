import DOMPurify from "dompurify";
import Markdown from "markdown-to-jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../supabase";
import Header from "../components/stateless/Header";
import ImageDecoy from "../components/stateless/ImageDecoy";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/stateless/Spinner";

export default function EditPost() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [previewState, setPreviewState] = useState(false);
  const btnref = useRef<HTMLButtonElement | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");

  const getpost = async () => {
    const { data: Post } = await supabase
      .from("Posts")
      .select("*")
      .eq("id", params.id);
    if (!Post) return;
    return Post;
  };

  const { data: Post, isLoading } = useQuery(
    ["edit_post", params.id],
    getpost,
    {
      refetchOnWindowFocus: false,
    },
  );

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
    const editedPost = {
      postTitle: censoredText(posTitle.value.trim()),
      postDescription: censoredText(DOMPurify.sanitize(postDescription.trim())),
      postAuthor: user?.email,
      postEdited: true,
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

  useEffect(() => {
    if (Post) {
      if (ref.current) {
        setPostTitle(Post[0].postTitle);
        ref.current.value = Post[0].postTitle;
      }
      setPostDescription(Post[0].postDescription);
    }
  }, [Post]);

  if (isLoading) {
    return <Spinner info="Just a sec..." />;
  }

  return (
    <div className="px-4 font-medium">
      <Header title="Edit Post" />
      <form onSubmit={editPost} className="my-2">
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
            className="block w-full py-1 mt-1 border-b-2 rounded-sm outline-none border-skin-color/40 bg-skin-background ring-skin-color/30 placeholder:text-skin-color/40 focus:border-skin-color/70"
          />
          <div className="my-3 text-skin-color/60">
            <p
              className={`text-xs ${postTitle.length > 130 && postTitle.length < 150 ? "text-yellow-500" : postTitle.length >= 150 && "text-skin-error"}`}
            >
              {postTitle.length > 150
                ? `Character limit exceeded !! (${postTitle.length}/150)`
                : `Used ${postTitle.length} characters of 150`}
            </p>
          </div>
        </div>

        <>
          <header className="flex gap-1 mt-3 text-sm text-skin-color/60">
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
                className="w-full p-3 leading-relaxed align-top outline-none resize-none h-80 rounded-b-md bg-skin-accent/10 ring-skin-color/30 placeholder:text-skin-color/40"
              />
            ) : (
              <section className="w-full p-3 overflow-x-hidden prose prose-neutral dark:prose-neutral dark:prose-invert dark:text-skin-color h-80 bg-skin-accent/10">
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

        <div className="flex flex-wrap items-start justify-between gap-2 my-3 gap-y-6">
          <p className="text-xs text-skin-color/50">
            * Changes may take a while to appear after editing.
          </p>
          <div className="flex justify-end flex-grow gap-2 w-ful">
            <button
              type="button"
              onClick={closeNewPost}
              className="px-3 py-1 text-white rounded-sm outline-none bg-skin-error ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              ref={btnref}
              disabled={postTitle.length < 5 || postTitle.length > 150}
              className="px-3 py-1 text-white rounded-sm outline-none bg-skin-accent ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-white/50"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
