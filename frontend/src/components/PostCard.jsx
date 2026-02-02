import { useState } from "react";
import { apiFetch } from "../api/client";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [count, setCount] = useState(post.like_count);

  // 🔐 current logged-in user id
  const currentUserId = Number(localStorage.getItem("user_id"));

  async function toggleLike() {
    if (liked) {
      await apiFetch(`/posts/${post.id}/like`, { method: "DELETE" });
      setCount(c => c - 1);
    } else {
      await apiFetch(`/posts/${post.id}/like`, { method: "POST" });
      setCount(c => c + 1);
    }
    setLiked(!liked);
  }

  async function deletePost() {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    await apiFetch(`/posts/${post.id}`, {
      method: "DELETE",
    });

    // simplest refresh (safe for now)
    window.location.reload();
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
      <p>{post.content}</p>

      <button onClick={toggleLike}>
        {liked ? "Unlike" : "Like"} ({count})
      </button>

      {/* 🔐 Show delete ONLY for owner */}
      {post.user_id === currentUserId && (
        <button
          onClick={deletePost}
          style={{ marginLeft: 10, color: "red" }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
