import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib

# You will export data from DB into this csv initially:
# columns: cropName, district, date, price
DATA_PATH = "data.csv"

df = pd.read_csv(DATA_PATH)
df["date"] = pd.to_datetime(df["date"])

# feature engineering
df["dayofweek"] = df["date"].dt.dayofweek
df["month"] = df["date"].dt.month

# target = price
X = df[["cropName", "district", "dayofweek", "month"]]
y = df["price"]

categorical = ["cropName", "district"]
numeric = ["dayofweek", "month"]

pre = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
        ("num", "passthrough", numeric),
    ]
)

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

pipe = Pipeline(steps=[("pre", pre), ("model", model)])

pipe.fit(X, y)

joblib.dump(pipe, "model.joblib")
print("✅ Saved model.joblib")
