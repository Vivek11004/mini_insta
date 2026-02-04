import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [count, setCount] = useState(post.like_count);

  // 🔐 current logged-in user id
  const currentUserId = Number(localStorage.getItem("user_id"));

  // 💬 comments state
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");

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

    window.location.reload();
  }

  async function loadComments() {
    const data = await apiFetch(`/posts/${post.id}/comments/`);
    setComments(data || []);
  }

  async function addComment() {
    if (!text.trim()) return;

    await apiFetch(`/posts/${post.id}/comments/`, {
      method: "POST",
      body: JSON.stringify({ content: text }),
    });

    setText("");
    loadComments();
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
      <p>{post.content}</p>

      <button onClick={toggleLike}>
        {liked ? "Unlike" : "Like"} ({count})
      </button>

      {/* 🔐 Show delete ONLY for owner */}
      {post.user_id === currentUserId && (
        <button onClick={deletePost} style={{ marginLeft: 10, color: "red" }}>
          Delete
        </button>
      )}

      <div style={{ marginTop: 10 }}>
        <button
          onClick={async () => {
            if (!showComments) await loadComments();
            setShowComments(s => !s);
          }}
        >
          {showComments ? "Hide comments" : "Show comments"}
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: 10 }}>
          {comments.length === 0 && <p>No comments yet</p>}

          {comments.map(c => (
            <p key={c.id}>• {c.content}</p>
          ))}

          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write a comment"
            style={{ marginTop: 6 }}
          />
          <button onClick={addComment} style={{ marginLeft: 6 }}>
            Comment
          </button>
        </div>
      )}
    </div>
  );
}
