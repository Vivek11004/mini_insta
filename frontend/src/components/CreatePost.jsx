import { useState } from "react";
import { apiFetch } from "../api/client";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);

    await apiFetch("/posts", {
      method: "POST",
      body: JSON.stringify({
        content: content,
      }),
    });

    setContent("");
    setLoading(false);

    // refresh feed
    onPostCreated();
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
        style={{ width: "100%" }}
      />

      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
