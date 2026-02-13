from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import datetime as dt

app = FastAPI()

MODEL_PATH = "model.joblib"
model = joblib.load(MODEL_PATH)

class PredictRequest(BaseModel):
    product: str
    horizonDays: int = 7

@app.post("/predict")
def predict(req: PredictRequest):
    future_date = dt.datetime.now() + dt.timedelta(days=req.horizonDays)

    X = pd.DataFrame([{
        "product": req.product,
        "dayofweek": future_date.weekday(),
        "month": future_date.month
    }])

    predicted = float(model.predict(X)[0])

    return {
        "ok": True,
        "product": req.product,
        "predictedPrice": round(predicted, 2),
        "currency": "NPR",
        "model": "RandomForest v1"
    }
