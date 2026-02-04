from fastapi import FastAPI
from mangum import Mangum  

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Serverless handler for Vercel
handler = Mangum(app)
