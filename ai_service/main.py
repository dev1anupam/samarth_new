from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from datetime import datetime, timedelta

app = FastAPI(title="AI Forecast Engine", version="1.0.0")

# 1. Setup & Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],  # Allow Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Pydantic Data Models (Dynamic Inputs)
class VelocityData(BaseModel):
    date: str
    velocity_score: float

class VelocityRequest(BaseModel):
    historical_data: List[VelocityData]

class ProjectRiskData(BaseModel):
    budget_variance_pct: float
    days_delayed: int
    contractor_rating: float
    passed_audit: int  # 0 or 1

class NewProjectData(BaseModel):
    budget_variance_pct: float
    days_delayed: int
    contractor_rating: float

class AuditRiskRequest(BaseModel):
    training_data: List[ProjectRiskData]
    target_project: NewProjectData


# 3. Endpoint 1: /api/forecast/velocity (POST)
@app.post("/api/forecast/velocity")
def forecast_velocity(request: VelocityRequest):
    if len(request.historical_data) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 data points for linear regression")
    
    # Convert input to DataFrame
    df = pd.DataFrame([vars(x) for x in request.historical_data])
    
    # Parse dates to get "days since start"
    try:
        df['date'] = pd.to_datetime(df['date'])
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD")
    
    start_date = df['date'].min()
    df['days_since_start'] = (df['date'] - start_date).dt.days
    
    X = df[['days_since_start']]
    y = df['velocity_score']
    
    # Train LinearRegression dynamically
    model = LinearRegression()
    model.fit(X, y)
    
    # Generate 30-day future forecast
    last_date = df['date'].max()
    future_dates = [last_date + timedelta(days=i) for i in range(1, 31)]
    future_days_since_start = [(d - start_date).days for d in future_dates]
    
    X_future = pd.DataFrame({'days_since_start': future_days_since_start})
    predictions = model.predict(X_future)
    
    forecast_results = []
    for date, pred in zip(future_dates, predictions):
        forecast_results.append({
            "date": date.strftime("%Y-%m-%d"),
            "predicted_velocity": max(0.0, float(pred))  # Don't allow negative velocity
        })
        
    return forecast_results


# 4. Endpoint 2: /api/forecast/audit-risk (POST)
@app.post("/api/forecast/audit-risk")
def forecast_audit_risk(request: AuditRiskRequest):
    if len(request.training_data) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 training instances for classification")
        
    # Convert input to DataFrame
    train_df = pd.DataFrame([vars(x) for x in request.training_data])
    
    X_train = train_df[['budget_variance_pct', 'days_delayed', 'contractor_rating']]
    y_train = train_df['passed_audit']
    
    # Check if both classes exist in training data
    if len(y_train.unique()) < 2:
        # Cannot train properly without both classes
        # Just return a simple heuristic based fallback
        prob_fail = 0.5
        if request.target_project.contractor_rating < 3.0:
            prob_fail = 0.8
        elif request.target_project.days_delayed > 10:
            prob_fail = 0.7
    else:
        # Train RandomForestClassifier dynamically
        model = RandomForestClassifier(n_estimators=50, random_state=42)
        model.fit(X_train, y_train)
        
        X_test = pd.DataFrame([vars(request.target_project)])
        # probabilities array: [prob_class_0, prob_class_1] where 0 is failure
        probs = model.predict_proba(X_test)[0]
        prob_fail = float(probs[0])
    
    is_high_risk = prob_fail > 0.4
    
    return {
        "risk_status": "HIGH RISK" if is_high_risk else "LOW RISK",
        "failure_probability_pct": round(prob_fail * 100, 2)
    }

# 5. Command to run:
# uvicorn main:app --reload --port 8000
