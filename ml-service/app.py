import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pydantic import BaseModel
import pandas as pd
import datetime as dt
import json
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.joblib"
PRODUCTS_PATH = BASE_DIR / "products.json"

# Lazy load to save memory at startup
model = None

def get_model():
    global model
    if model is None:
        model = joblib.load(MODEL_PATH)
    return model

class PredictRequest(BaseModel):
    product: str
    horizonDays: int = 7

@app.get("/")
def root():
    return {"status": "ML service is running"}

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
    pred = float(get_model().predict(X)[0])
    return {
        "ok": True,
        "predicted": round(pred, 2),
        "confidence": 0.6,
        "modelVersion": "RandomForest v1"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)