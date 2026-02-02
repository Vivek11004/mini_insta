import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login", { replace: true });
  }

  function loadFeed() {
    apiFetch("/feed")
      .then(data => {
        if (data?.items) {
          setPosts(data.items);
        } else {
          setError("Unauthorized or no data");
        }
      })
      .catch(() => setError("Backend not reachable"));
  }

  useEffect(() => {
    loadFeed();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <button onClick={logout}>Logout</button>

      <h2>Feed</h2>

      {/* 🔼 Upload post */}
      <CreatePost onPostCreated={loadFeed} />

      {posts.length === 0 && <p>No posts</p>}

      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
