from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Mockly API",
    description="Backend API for Mockly AI Interview Platform",
    version="1.0.0"
)

# Configure CORS so React frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Mockly API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
