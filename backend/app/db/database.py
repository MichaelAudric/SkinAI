# app/db/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Use the Supabase URL from your .env
DATABASE_URL = os.getenv("DB_URL")
if not DATABASE_URL:
    raise ValueError("DB_URL not set in .env")

# SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)  # echo=True shows SQL queries in logs

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to use in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()