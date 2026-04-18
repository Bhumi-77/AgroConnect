from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pydantic import BaseModel
import pandas as pd
import datetime as dt
import json
from pathlib import Path
import os
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")

app = FastAPI()

# allow frontend/backend to call ML service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model.joblib"
model = joblib.load(MODEL_PATH)

PRODUCTS_PATH = BASE_DIR / "products.json"

class PredictRequest(BaseModel):
    product: str
    horizonDays: int = 7

@app.get("/products")
def products():
    return json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))

@app.post("/predict")
def predict(req: PredictRequest):
    future_date = dt.datetime.now() + dt.timedelta(days=req.horizonDays)

    X = pd.DataFrame([{
        "product": req.product,
        "dayofweek": future_date.weekday(),
        "month": future_date.month
    }])

    pred = float(model.predict(X)[0])

    return {
        "ok": True,
        "predicted": round(pred, 2),
        "confidence": 0.6,
        "modelVersion": "RandomForest v1"
    }
# Train model if not found
if not os.path.exists(MODEL_PATH):
    print("Model not found, training now...")
    import train_model  # runs train_model.py
    
model = joblib.load(MODEL_PATH)