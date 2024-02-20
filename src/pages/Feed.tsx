import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import supabase from "../supabase";
import Pagination from "../components/stateless/Pagination";
import LinkButton from "../components/stateless/LinkButton";
import Spinner from "../components/stateless/Spinner";
import ToastMessage from "../components/stateless/Toast";

export default function Feed() {
  const ITMESPERPAGE = 20;
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const {
    data = [],
    isLoading,
    error,
  } = useQuery(["allPosts", page], fetchAllPosts, {
    refetchInterval: 5000,
  });

  async function fetchAllPosts() {
    const { data: allPosts, error } = await supabase
      .from("Posts")
      .select()
      .range((page - 1) * ITMESPERPAGE, page * ITMESPERPAGE - 1)
      .order("createdAt", { ascending: false });
    if (error) throw new Error("Something went wrong");
    return allPosts;
  }

  function filterPosts() {
    if (searchValue === "") return data;
    return data?.filter((post: postType) =>
      post.postTitle.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  if (error !== null && !isLoading) {
    toast.error("Oops! Somthing went wrong. Try again later");
  }

  return (
    <div className="px-4">
      <ToastMessage />
      <header className="flex items-center justify-between py-3">
        <a
          href={window.location.origin + window.location.pathname}
          className="text-xl font-semibold underline-offset-2 outline-none hover:underline focus:underline"
        >
          CrispThoughtsCorner
        </a>
        <Link
          to="/settings"
          className="rounded-sm outline-none ring-skin-color/60 focus-visible:ring-2"
        >
          <svg
            viewBox="0 -960 960 960"
            className="aspect-square w-6 cursor-pointer fill-skin-color/60 transition-transform hover:rotate-45"
          >
            <path d="m410.718-120-15.59-114.872q-21.102-6.589-46.115-20.512Q324-269.308 306.59-285.256l-106.026 47.025-69.436-122.41 93.513-69.692q-1.923-11.667-3.154-24.449-1.231-12.782-1.231-24.449 0-10.897 1.231-23.551 1.231-12.654 3.154-26.885l-93.513-70.205 69.436-120.359 105.256 45.744q19.718-16.205 43.231-29.744 23.513-13.538 45.308-20.231L410.718-840h138.564l15.59 115.641q24.436 8.897 45.423 20.82 20.987 11.923 40.808 29.052l108.846-45.744 68.923 120.359-96.59 71.692q3.462 13.359 4.18 25.244.718 11.885.718 22.936 0 10.282-1.103 22.09-1.102 11.808-3.872 26.961l95.565 70.308-69.436 122.41-107.231-47.795q-20.487 17.488-42 30.59-21.513 13.103-44.231 19.795L549.282-120H410.718Zm67.385-263.077q40.718 0 68.82-28.102 28.103-28.103 28.103-68.821 0-40.718-28.103-68.821-28.102-28.102-68.82-28.102-40.283 0-68.603 28.102-28.321 28.103-28.321 68.821 0 40.718 28.321 68.821 28.32 28.102 68.603 28.102Z" />
          </svg>
        </Link>
      </header>

      <section className="my-1 flex flex-wrap items-center gap-2">
        <LinkButton name="New Post" to="/newpost" />
        <LinkButton name="Your Posts" to="/yourposts" />
        <input
          type="search"
          maxLength={100}
          value={searchValue}
          placeholder="Search posts"
          onChange={(event) => setSearchValue(event.target.value)}
          className="flex-grow rounded-sm border-2 border-skin-color/40 bg-skin-background px-2 py-1 outline-none ring-skin-color/30 placeholder:text-skin-color/30 focus-visible:ring-2"
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

        {isLoading && !error ? (
          <Spinner info="Fetching posts..." />
        ) : (
          <>
            {filterPosts()?.map((post: postType) => {
              return (
                <div
                  className="group my-1 flex items-center justify-between gap-x-1 gap-y-1 truncate decoration-skin-color decoration-1 outline-none ring-skin-accent/30"
                  key={post.id}
                >
                  {post.postAuthor === "crispthoughtscorneradmin@gmail.com" && (
                    <Link
                      to={`/${post?.postAuthor?.split("@")[0]}`}
                      className="text-skin-accent decoration-current decoration-2 underline-offset-2 outline-none hover:underline focus-visible:underline focus-visible:decoration-2"
                    >
                      Admin -
                    </Link>
                  )}
                  <Link
                    title={post.postTitle}
                    to={`/${post.postAuthor.split("@")[0]}/${post.id}`}
                    className="flex-grow truncate underline underline-offset-2 outline-none hover:decoration-2 focus-visible:decoration-2"
                  >
                    {post.postTitle}
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </section>

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

export type postType = {
  id: string;
  postTitle: string;
  postDescription: string;
  createdAt: Date;
  postAuthor: string;
};
