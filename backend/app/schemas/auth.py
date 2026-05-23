import enum
from pydantic import BaseModel, Field, EmailStr


class UserRole(enum.Enum):
    doctor = "doctor"
    patient = "patient"
    admin = "admin"

# -----------------
# REGISTER SCHEMA
# -----------------
class RegisterRequest(BaseModel):
    username: str = Field(min_length=1, max_length=30)
    email: EmailStr
    password: str = Field(min_length=1, max_length=20)
    role: UserRole


# -----------------
# LOGIN SCHEMA
# -----------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str   