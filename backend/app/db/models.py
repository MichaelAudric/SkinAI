from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Index, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum


class UserRole(enum.Enum):
    doctor = "doctor"
    patient = "patient"
    admin = "admin"

class Severity(enum.Enum):
    benign = "benign"
    suspicious = "suspicious"
    malignant = "malignant"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    password = Column(String, nullable=False)
    predictions = relationship("Prediction", backref="user")
    is_approved = Column(Boolean, default=False) 
    qualification = relationship("DoctorQualification", uselist=False, backref="user")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    image_path = Column(String, nullable=False)
    prediction = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(Enum(Severity), nullable=False)
    lesion_name = Column(String, index=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)   # patient
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    lesion_name = Column(String, nullable=False)

    comment = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # INDEXES
    __table_args__ = (
        Index("idx_feedback_user_lesion", "user_id", "lesion_name"),
        Index("idx_feedback_lesion_name", "lesion_name"),
        Index("idx_feedback_user_id", "user_id"),
    )

class DoctorQualification(Base):
    __tablename__ = "doctor_qualifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    document_path = Column(String, nullable=False) 

    created_at = Column(DateTime, default=datetime.utcnow)