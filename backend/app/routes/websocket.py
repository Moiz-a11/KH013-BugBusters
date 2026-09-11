from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.realtime import manager

router = APIRouter()

@router.websocket("/dashboard")
async def dashboard_socket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_json({"event": "CONNECTED", "data": {"message": "Live PS20 dashboard connected"}})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
