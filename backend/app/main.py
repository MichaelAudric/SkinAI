from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import routes_auth, routes_doctor, routes_patient, routes_admin
from fastapi.middleware.cors import CORSMiddleware
import app.core.cloudinary_config

app = FastAPI(title="Skin Disease AI Backend")
#
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skin-ai-phi.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is running"}


app.include_router(routes_auth.router)
app.include_router(routes_patient.router)
app.include_router(routes_doctor.router, prefix="/doctor", tags=["doctor"])
app.include_router(routes_admin.router, prefix="/admin", tags=["admin"])

app.mount("/static", StaticFiles(directory="app/static"), name="static")


#uvicorn app.main:app --reload