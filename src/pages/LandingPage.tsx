import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/stateless/Spinner";
import useDarkMode from "../customHooks/useDarkmode";
import supabase from "../supabase";

export default function LandingPage() {
  const navigate = useNavigate();
  const titles = ["Ideas", "Visions", "Insights"];
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  function login() {
    loginWithRedirect();
  }

  const wait = (delay = 1000) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, delay);
    });
  };

  let currentTitleIndex = 0;
  async function startTitleAnimation() {
    const target = spanRef.current;
    if (!target) return;
    const currentTitle = titles[currentTitleIndex];
    let currentCharIndex = 0;

    const forwardAnimationTimer = setInterval(async () => {
      if (currentCharIndex === 0) target.innerText = "";
      target.textContent += currentTitle.charAt(currentCharIndex);
      currentCharIndex++;

      // If the index reaches the end of the word start removing the letters
      if (currentCharIndex === currentTitle.length) {
        // Wait for users to understand and see clearly and then remove
        target.classList.add("before:animate-pulse");
        await wait(4000);

        const reverseAnimationTimer = setInterval(async () => {
          target.classList.remove("before:animate-pulse");
          target.textContent = target.innerText.slice(0, -1);

          if (target.innerText.length === 0) {
            clearInterval(reverseAnimationTimer);
            currentTitleIndex =
              currentTitleIndex < titles.length - 1 ? ++currentTitleIndex : 0;
            startTitleAnimation();
          }
        }, 50);
      }

      if (currentCharIndex >= currentTitle.length) {
        clearInterval(forwardAnimationTimer);
      }
    }, 80);
  }

  useEffect(() => {
    startTitleAnimation();
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  useDarkMode();

  if (isLoading) return <Spinner info="Authenticating..." />;

  return (
    <div className="relative h-screen px-4 py-7">
      <div>
        <h1 className="animate-slideDown300 text-3xl font-black leading-snug opacity-0 [text-wrap:balance] md:text-4xl md:leading-snug">
          CrispThoughtsCorner,
          <br />
          <span className="text-skin-color">
            Where all&nbsp;
            <span
              ref={spanRef}
              className="decoration-3 relative inline-block leading-snug text-skin-accent underline decoration-dashed underline-offset-4 before:absolute before:-right-2 before:top-1/2 before:h-full before:w-1 before:-translate-y-1/2 before:bg-skin-accent after:animate-pulse md:leading-snug"
            ></span>
            &nbsp; Converge.
          </span>
        </h1>
        <p className="my-5 animate-slideDown600 font-medium opacity-0">
          🚀 Open the door to a community driven by shared innovation. At Crisp
          Thoughts Corner, we believe that the journey towards perfection is a
          continuous process, transforming complexity into exceptional results.
        </p>
        <button
          onClick={login}
          disabled={isLoading}
          className="flex animate-slideDown900 items-center justify-center gap-2 rounded-sm bg-skin-accent px-3 py-2 font-medium text-white opacity-0 outline-none ring-skin-accent/60 hover:bg-skin-accent/80 focus-visible:ring disabled:bg-skin-accent/60"
        >
          Continue with Auth0
        </button>
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center">
        <PostCount />
      </div>
    </div>
  );
}

function PostCount() {
  const [postCount, setCount] = useState(0);

  async function countPosts() {
    const { error, count } = await supabase
      .from("Posts")
      .select("*", { count: "exact", head: true });
    if (!error && count) setCount(count);
  }

  useEffect(() => {
    countPosts();
  }, []);

  return (
    <p className="animate-slideDown1200 mt-10 text-sm text-skin-color/50 opacity-0">
      Total of
      <span className="text-2xl font-black text-skin-color">{` ${postCount} `}</span>
      posts created, with more on the way.
    </p>
  );
}
