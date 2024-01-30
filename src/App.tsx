import { HashRouter, Routes, Route } from "react-router-dom";

import Feed from "./pages/Feed";
import Post from "./pages/Post";
import Posts from "./pages/YourPosts";
import NotFound from "./components/stateless/404";
import Protect from "./components/stateful/Protect";
import Settings from "./pages/Settings";
import NewPost from "./pages/NewPost";
import AuthorPosts from "./pages/AuthorPosts";
import LandingPage from "./pages/LandingPage";
import EditPost from "./pages/EditPost";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/home" element={<Protect el={<Feed />} />} />
        <Route path="/:username/:id" element={<Post />} />
        <Route path="/posts" element={<Protect el={<Posts />} />} />
        <Route path="/posts/edit/:id" element={<Protect el={<EditPost />} />} />
        <Route path="/posts/:id" element={<Protect el={<Post />} />} />
        <Route path="/:username" element={<Protect el={<AuthorPosts />} />} />
        <Route path="/newpost" element={<Protect el={<NewPost />} />} />
        <Route path="/settings" element={<Protect el={<Settings />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
