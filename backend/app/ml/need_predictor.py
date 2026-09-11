from pathlib import Path
import joblib


MODEL_PATH = Path(__file__).resolve().parent / "resqgrid_need_model.pkl"

CONFIDENCE_THRESHOLD = 0.70

_model = None


def get_model():
    global _model

    if _model is None:
        _model = joblib.load(MODEL_PATH)

    return _model


def predict_need(text: str) -> dict:
    if not text or not text.strip():
        return {
            "need": None,
            "confidence": 0.0,
            "source": "ml",
            "fallback_required": True,
        }

    model = get_model()

    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]

    confidence = float(max(probabilities))

    result = {
        "need": prediction,
        "confidence": round(confidence, 4),
        "source": "ml",
        "fallback_required": confidence < CONFIDENCE_THRESHOLD,
    }

    if confidence < CONFIDENCE_THRESHOLD:
        result["ml_prediction"] = prediction

    return result