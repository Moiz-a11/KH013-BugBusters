from fastapi import APIRouter
from app.store import store
router = APIRouter()

@router.get("")
def list_missions():
    return list(store.missions.values())
