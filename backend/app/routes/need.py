from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.ml.need_predictor import predict_need


router = APIRouter()


class NeedPredictionRequest(BaseModel):
    text: str = Field(min_length=5)


@router.post("/predict")
def predict_need_route(payload: NeedPredictionRequest):
    return predict_need(payload.text)