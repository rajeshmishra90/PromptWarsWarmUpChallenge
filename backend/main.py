from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
import json
from google import genai
from google.genai import types

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MealPlanResponse(BaseModel):
    meals: Dict[str, str]
    grocery_list: List[str]
    substitutions: List[str]
    budget_logic: str

@app.post("/api/plan", response_model=MealPlanResponse)
async def generate_plan(payload: dict):
    day_description = payload.get("day", "")
    
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    prompt = f"Generate a cooking to-do list and meal plan based on the user's day: {day_description}"
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=MealPlanResponse,
        ),
    )
    
    return json.loads(response.text)
