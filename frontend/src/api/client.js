const API_URL = "http://localhost:8000";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // ❌ handle HTTP errors properly
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  // ✅ handle 204 No Content (DELETE)
  if (res.status === 204) {
    return null;
  }

  return res.json();
}
