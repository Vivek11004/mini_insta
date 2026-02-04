from fastapi import APIRouter, WebSocket
from app.websockets.manager import manager
from app.utils.jwt import decode_token

router = APIRouter()

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close()
        return

    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except Exception:
        await websocket.close()
        return

    await manager.connect(user_id, websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(user_id)
