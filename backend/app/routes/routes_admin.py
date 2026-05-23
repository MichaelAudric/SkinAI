from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, DoctorQualification, UserRole
from app.auth.deps import get_current_admin

router = APIRouter()


# =========================
# 1. GET PENDING DOCTORS
# =========================
@router.get("/doctors/pending")
def get_pending_doctors(
    db: Session = Depends(get_db),
    user=Depends(get_current_admin)
):
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not allowed")

    doctors = db.query(User).filter(
        User.role == UserRole.doctor,
        User.is_approved == False
    ).all()

    return [
        {
            "id": d.id,
            "username": d.username,
            "email": d.email,
        }
        for d in doctors
    ]


# =========================
# 2. GET DOCTOR QUALIFICATION
# =========================
@router.get("/doctors/{doctor_id}/qualification")
def get_doctor_qualification(
    doctor_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_admin)
):
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not allowed")

    doc = db.query(DoctorQualification).filter(
        DoctorQualification.user_id == doctor_id
    ).first()

    print(doc)

    if not doc:
        raise HTTPException(status_code=404, detail="Qualification not found")

    return {
        "document_path": doc.document_path
    }


# =========================
# 3. APPROVE DOCTOR
# =========================
@router.post("/doctors/{doctor_id}/approve")
def approve_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_admin)
):
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not allowed")

    doctor = db.query(User).filter(User.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if doctor.role != UserRole.doctor:
        raise HTTPException(status_code=400, detail="User is not a doctor")

    doctor.is_approved = True
    db.commit()

    return {
        "message": "Doctor approved successfully"
    }