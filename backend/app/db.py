from app.config import settings

_mongo = None

def get_mongo():
    global _mongo
    if not settings.MONGODB_URI:
        return None
    try:
        from pymongo import MongoClient
        if _mongo is None:
            _mongo = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1500)
        _mongo.admin.command("ping")
        return _mongo[settings.MONGODB_DB]
    except Exception:
        return None
