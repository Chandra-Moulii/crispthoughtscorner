import { MouseEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import supabase from "../supabase";
import Header from "../components/stateless/Header";
import Pagination from "../components/stateless/Pagination";
import { closeDialog, openDialog } from "../utils/HandleDialogs";
import LinkButton from "../components/stateless/LinkButton";
import Spinner from "../components/stateless/Spinner";
import ToastMessage from "../components/stateless/Toast";

export default function Posts() {
  const ITMESPERPAGE = 15;
  const { user } = useAuth0();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const dialogref = useRef<HTMLDialogElement | null>(null);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery(["userposts", page], fetchAllPosts, {
    refetchOnWindowFocus: false,
  });

  async function fetchAllPosts() {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .range((page - 1) * ITMESPERPAGE, page * ITMESPERPAGE - 1)
      .eq("postAuthor", user?.email)
      .order("createdAt", { ascending: false });
    if (error) throw new Error("Something went wrong");
    return data;
  }

  async function deletePost(postId: string, event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    target.blur();
    target.innerText = "Deleting...";
    target.disabled = true;
    const previousSibling = target.closest("#post") as HTMLDivElement;
    if (previousSibling) {
      previousSibling.style.pointerEvents = "none";
      previousSibling.style.opacity = "0.5";
    }
    await supabase.from("Posts").delete().eq("id", postId);
    queryClient.invalidateQueries({ queryKey: ["userposts", page] });
  }

  async function clearAllPosts() {
    await supabase
      .from("Posts")
      .delete()
      .eq("postAuthor", user?.email);
    closeDialog(dialogref);

    queryClient.invalidateQueries({ queryKey: ["userposts", page] });
  }

  function filterPosts() {
    if (searchValue === "") return data;
    return data?.filter((post) =>
      post.postTitle.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  if (error !== null && !isLoading) {
    toast.error("Oops! Somthing went wrong. Try again later");
  }

  return (
    <div>
      <ToastMessage />
      <Header title={`Your posts (${data?.length})`} />
      <section className="my-1 flex flex-wrap items-center gap-2">
        <LinkButton name="New Post" to="/newpost" />
        {data?.length !== 0 ? (
          <button
            onClick={() => openDialog(dialogref)}
            className="rounded-sm bg-skin-error px-3 py-1 text-white outline-none ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
          >
            Clear all
          </button>
        ) : null}
        <input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search posts"
          className="flex-grow rounded-sm border-2 border-skin-color/40 bg-skin-background px-2 py-1 outline-none ring-skin-color/30 placeholder:text-skin-color/30 focus:ring-2"
        />
      </section>

      <hr className="mt-3 border-skin-color/10" />

      <section
        data-info="No posts Found"
        className="my-2 before:text-skin-color/50 empty:before:content-[attr(data-info)]"
      >
        {searchValue && filterPosts().length === 0 ? (
          <p className="break-all text-sm">
            No posts Found for '{searchValue}'&nbsp;
            <button
              className="cursor-pointer text-skin-error decoration-skin-error decoration-1 underline-offset-4 outline-none ring-skin-accent/30 hover:decoration-2 focus:decoration-2 focus-visible:underline"
              onClick={() => setSearchValue("")}
            >
              Clear search
            </button>
          </p>
        ) : null}
        {error !== null && !isLoading ? (
          <p className="text-skin-error">
            Something went wrong please refresh the page
          </p>
        ) : null}

        {isLoading && !error ? (
          <Spinner info="Fetching posts..." />
        ) : (
          <>
            {filterPosts()?.map((post) => {
              return (
                <div
                  id="post"
                  className="my-1 flex items-center justify-between gap-3"
                  key={post.id}
                >
                  <Link
                    title={post.postTitle}
                    to={`/${post.postAuthor.split("@")[0]}/${post.id}`}
                    className="block truncate font-medium underline decoration-skin-color decoration-1 underline-offset-2 outline-none ring-skin-accent/30 hover:decoration-2 focus:decoration-2"
                  >
                    {post.postTitle}
                  </Link>
                  <div className="flex items-center gap-3">
                    <button className="block font-medium text-skin-accent/90 underline decoration-skin-accent decoration-1 underline-offset-2 outline-none ring-skin-accent/30 hover:decoration-2 focus:decoration-2">
                      Edit
                    </button>
                    <button
                      onClick={(event) => deletePost(post.id, event)}
                      className="block font-medium text-skin-error/90 underline decoration-skin-error decoration-1 underline-offset-2 outline-none ring-skin-accent/30 hover:decoration-2 focus:decoration-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>

      <dialog
        data-state="closed"
        ref={dialogref}
        className=" animate-pop rounded border-0 bg-skin-background px-4 py-3 text-left text-skin-color outline-none backdrop:bg-black/80 sm:max-w-sm md:max-w-sm"
      >
        <header className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-medium">Remove all Posts</h3>
          <button
            className="rounded-sm p-[1px] outline-none ring-skin-error/40 focus-visible:ring"
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
          Do you want to delete all your posts? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => closeDialog(dialogref)}
            className="rounded-sm bg-skin-accent px-3 py-1 text-white outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring"
          >
            Keep
          </button>
          <button
            onClick={clearAllPosts}
            className="rounded-sm bg-skin-error px-3 py-1 text-white outline-none ring-skin-error/60 hover:bg-skin-error/80 focus-visible:ring"
          >
            Clear all
          </button>
        </div>
      </dialog>

      {searchValue === "" && !isLoading && error === null ? (
        <Pagination
          page={page}
          fun={setPage}
          ITMESPERPAGE={ITMESPERPAGE}
          data={data}
        />
      ) : null}
    </div>
  );
}
