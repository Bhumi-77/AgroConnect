from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import datetime as dt

app = FastAPI()
MODEL_PATH = "model.joblib"
model = joblib.load(MODEL_PATH)

class PredictRequest(BaseModel):
    cropName: str
    district: str
    horizonDays: int = 7

@app.post("/predict")
def predict(req: PredictRequest):
    future_date = dt.datetime.now() + dt.timedelta(days=req.horizonDays)

    X = pd.DataFrame([{
        "cropName": req.cropName,
        "district": req.district,
        "dayofweek": future_date.weekday(),
        "month": future_date.month,
    }])

    pred = float(model.predict(X)[0])

    return {
        "ok": True,
        "predicted": round(pred, 2),
        "confidence": 0.75,   # you can improve later using model variance
        "modelVersion": "v1.0"
    }
