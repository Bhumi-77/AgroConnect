import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "data" / "fruits_vegetables_prices.csv"

# 👇 IMPORTANT: no header in file
df = pd.read_csv(CSV_PATH, header=None)

# manually assign correct column names
df.columns = [
    "product",
    "date",
    "unit",
    "min_price",
    "max_price",
    "avg_price"
]

print("Columns fixed:", df.columns.tolist())

products = sorted(
    df["product"]
    .dropna()
    .astype(str)
    .str.strip()
    .unique()
    .tolist()
)

out_path = BASE_DIR / "products.json"
pd.Series(products).to_json(out_path, orient="values")

print(f"✅ Found {len(products)} products")
print(f"✅ Saved to: {out_path}")
