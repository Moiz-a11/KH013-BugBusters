import json
import os
from typing import Dict, Any, List
from app.config import settings

_mongo = None
_mongodb_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "mongodb_store")

class FileMongoCollection:
    def __init__(self, db_dir: str, name: str):
        self.dir = os.path.join(db_dir, name)
        os.makedirs(self.dir, exist_ok=True)
        self.name = name

    def _file_path(self, doc_id: str) -> str:
        safe_id = "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in str(doc_id))
        return os.path.join(self.dir, f"{safe_id}.json")

    def replace_one(self, filter_doc: Dict[str, Any], replacement: Dict[str, Any], upsert: bool = True):
        doc_id = filter_doc.get("_id") or replacement.get("_id")
        if not doc_id:
            return
        filepath = self._file_path(doc_id)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(replacement, f, indent=2)

    def delete_one(self, filter_doc: Dict[str, Any]):
        doc_id = filter_doc.get("_id")
        if doc_id:
            filepath = self._file_path(doc_id)
            if os.path.exists(filepath):
                os.remove(filepath)

    def delete_many(self, filter_doc: Dict[str, Any]):
        if os.path.exists(self.dir):
            for fname in os.listdir(self.dir):
                if fname.endswith(".json"):
                    os.remove(os.path.join(self.dir, fname))

    def find(self, filter_doc: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        docs = []
        if not os.path.exists(self.dir):
            return docs
        for fname in os.listdir(self.dir):
            if fname.endswith(".json"):
                try:
                    with open(os.path.join(self.dir, fname), "r", encoding="utf-8") as f:
                        docs.append(json.load(f))
                except Exception:
                    pass
        return docs

class FileMongoDB:
    def __init__(self, db_dir: str):
        self.db_dir = db_dir
        os.makedirs(db_dir, exist_ok=True)
        self._collections = {}

    def __getitem__(self, name: str) -> FileMongoCollection:
        if name not in self._collections:
            self._collections[name] = FileMongoCollection(self.db_dir, name)
        return self._collections[name]

def get_mongo():
    global _mongo
    if _mongo is not None:
        return _mongo
    if settings.MONGODB_URI:
        try:
            from pymongo import MongoClient
            client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1500)
            client.admin.command("ping")
            _mongo = client[settings.MONGODB_DB]
            return _mongo
        except Exception:
            pass
    _mongo = FileMongoDB(_mongodb_dir)
    return _mongo

def save_entity(table: str, item_id: str, data: Dict[str, Any]):
    mongo = get_mongo()
    doc = {"_id": item_id, **data}
    mongo[table].replace_one({"_id": item_id}, doc, upsert=True)

def delete_entity(table: str, item_id: str):
    mongo = get_mongo()
    mongo[table].delete_one({"_id": item_id})

def clear_entities(table: str):
    mongo = get_mongo()
    mongo[table].delete_many({})

def load_all_entities(table: str) -> List[Dict[str, Any]]:
    mongo = get_mongo()
    docs = list(mongo[table].find({}))
    items = []
    for d in docs:
        d_copy = dict(d)
        d_copy.pop("_id", None)
        items.append(d_copy)
    return items


