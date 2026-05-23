# create_tables.py

from app.db.database import engine, Base
from app.db import models  # make sure all your models are imported

# This will create all tables defined in your SQLAlchemy models
Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully in Supabase!")