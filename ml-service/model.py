import pandas as pd
from sklearn.linear_model import LinearRegression

df = pd.read_csv("data/prices.csv")

X = pd.get_dummies(df[["category", "quality", "district"]])
y = df["price"]

model = LinearRegression()
model.fit(X, y)

def predict_price(category, quality, district):
    row = pd.DataFrame([{
        "category": category,
        "quality": quality,
        "district": district
    }])

    row = pd.get_dummies(row)
    row = row.reindex(columns=X.columns, fill_value=0)

    return int(model.predict(row)[0])
