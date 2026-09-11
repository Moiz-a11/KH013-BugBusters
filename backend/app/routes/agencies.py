from fastapi import APIRouter
from app.store import store
router = APIRouter()

@router.get("")
def list_agencies():
    return list(store.agencies.values())
