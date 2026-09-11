import joblib

model = joblib.load("app/ml/resqgrid_need_model.pkl")

text = "500 residents urgently need clean drinking water."

prediction = model.predict([text])[0]
probabilities = model.predict_proba([text])[0]

confidence = max(probabilities)

print("Prediction:", prediction)
print("Confidence:", confidence)