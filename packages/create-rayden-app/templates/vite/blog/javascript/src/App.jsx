import { Routes, Route } from "react-router-dom";
import BlogLayout from "./components/BlogLayout";
import Home from "./pages/Home";
import Post from "./pages/Post";
import About from "./pages/About";
import "./index.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:slug" element={<Post />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
