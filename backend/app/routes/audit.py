from fastapi import APIRouter
from app.store import store
router = APIRouter()

@router.get("")
def list_audit():
    return store.audit_logs
