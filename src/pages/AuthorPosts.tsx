import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import supabase from "../supabase";
import ErrorPage from "../components/stateless/Error";
import Header from "../components/stateless/Header";
import Spinner from "../components/stateless/Spinner";
import Pagination from "../components/stateless/Pagination";

export default function AuthorPosts() {
  const ITMESPERPAGE = 15;
  const { username } = useParams();
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const {
    data = [],
    isLoading,
    error,
  } = useQuery(["userposts", page, username], fetchAllPosts, {
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    retry: 1,
  });

  async function fetchAllPosts() {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("postAuthor", `${username}@gmail.com`)
      .order("createdAt", { ascending: false });
    if (error) throw new Error("Something went wrong");
    if (data.length === 0) throw new Error("User doesn't exist");
    return data;
  }

  function filterPosts() {
    if (searchValue === "") return data;
    return data?.filter((post) =>
      post.postTitle.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  if (isLoading) return <Spinner info="Just a sec" />;

  if (error)
    return (
      <ErrorPage info="Hmm...this user doesn’t exist. Try searching for someone else." />
    );

  return (
    <div>
      <Header title={`@${username}'s posts`} />
      <input
        type="search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search posts"
        className="w-full flex-grow rounded-sm border-2 border-skin-color/40 bg-skin-background px-2 py-1 outline-none ring-skin-color/30 placeholder:text-skin-color/30 focus:ring-2"
      />
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
          <Spinner info="" />
        ) : (
          <>
            {filterPosts()?.map((post) => {
              return (
                <Link
                  title={post.postTitle}
                  to={`/${post.postAuthor.split("@")[0]}/${post.id}`}
                  key={post.id}
                  className="my-1 block truncate font-medium underline decoration-skin-color decoration-1 underline-offset-2 outline-none ring-skin-accent/30 hover:decoration-2 focus:decoration-2"
                >
                  {post.postTitle}
                </Link>
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
