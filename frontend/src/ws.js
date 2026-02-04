let ws = null;

export function connectNotifications() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return ws; // prevent duplicate connections
  }

  const token = localStorage.getItem("token");
  if (!token) return null;

  ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);

  ws.onopen = () => console.log("🔔 WS connected");

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    alert(`🔔 New comment on your post: ${data.comment}`);
  };

  ws.onclose = () => {
    console.log("❌ WS closed");
    ws = null;
  };

  ws.onerror = (e) => {
    console.error("❌ WS error", e);
  };

  return ws;
}
