import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor

CSV_PATH = "data/fruits_vegetables_prices.csv"   # <-- put your file here
MODEL_PATH = "model.joblib"

EXPECTED_NOHEADER_COLS_6 = ["product", "date", "unit", "min_price", "max_price", "avg_price"]
EXPECTED_NOHEADER_COLS_5 = ["product", "date", "unit", "min_price", "max_price"]  # fallback

def looks_like_first_row_became_header(cols):
    """
    If columns look like actual data (product name, date, unit, numbers),
    then pandas used the first row as header incorrectly.
    """
    if len(cols) < 5:
        return False

    c0 = str(cols[0])
    c1 = str(cols[1])
    c2 = str(cols[2])

    # Example: Tomato Big(Nepali), 1/5/2021, Kg
    date_like = ("/" in c1) or ("-" in c1)
    unit_like = c2.lower() in ["kg", "kgs", "ltr", "liter", "piece", "pieces"]
    product_like = any(ch.isalpha() for ch in c0)

    return product_like and date_like and unit_like

def read_with_best_sep(path, header_option):
    for sep in [",", "\t", ";", "|"]:
        try:
            df = pd.read_csv(path, sep=sep, header=header_option)
            # if it read at least 4 columns, good
            if df.shape[1] >= 4:
                return df, sep
        except Exception:
            pass
    # fallback
    return pd.read_csv(path, header=header_option), None

def main():
    # 1) first try normal read (header=0)
    df, used_sep = read_with_best_sep(CSV_PATH, header_option=0)

    # 2) detect your exact problem: first row became header
    if looks_like_first_row_became_header(df.columns):
        # re-read properly with header=None
        df, used_sep = read_with_best_sep(CSV_PATH, header_option=None)

        # assign columns based on count
        if df.shape[1] == 6:
            df.columns = EXPECTED_NOHEADER_COLS_6
        elif df.shape[1] == 5:
            df.columns = EXPECTED_NOHEADER_COLS_5
            # if only 5 columns, we will use max_price as target later
        else:
            raise ValueError(f"CSV has {df.shape[1]} columns; expected 5 or 6 for your market dataset.")

    # 3) If file has headers but different names, normalize
    rename_map = {
        "Product_Name": "product",
        "Product": "product",
        "cropName": "product",
        "Date": "date",
        "Unit": "unit",
        "Min": "min_price",
        "Max": "max_price",
        "Average": "avg_price",
        "Avg": "avg_price",
        "Price": "avg_price",
    }
    df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})

    # 4) choose target column
    target = None
    if "avg_price" in df.columns:
        target = "avg_price"
    elif "max_price" in df.columns:
        target = "max_price"  # fallback if dataset has only 5 cols
    else:
        raise ValueError(
            f"Could not detect required columns.\n"
            f"Found columns: {list(df.columns)}\n\n"
            f"Need: product + date + (avg_price OR max_price).\n"
        )

    # 5) clean
    df[target] = pd.to_numeric(df[target], errors="coerce")
    df = df.dropna(subset=["product", "date", target])

    # parse date + make features
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])
    df["dayofweek"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month

    X = df[["product", "dayofweek", "month"]]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pre = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), ["product"]),
            ("num", "passthrough", ["dayofweek", "month"]),
        ]
    )

    model = Pipeline(
        steps=[
            ("pre", pre),
            ("rf", RandomForestRegressor(n_estimators=200, random_state=42)),
        ]
    )

    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)

    print("✅ Trained and saved:", MODEL_PATH)
    print("✅ Separator used:", used_sep)
    print("✅ Rows used:", len(df))
    print("✅ Columns:", list(df.columns))
    print("✅ Target:", target)

if __name__ == "__main__":
    main()
