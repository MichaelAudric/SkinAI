from datetime import datetime
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.auth.deps import get_current_doctor
from app.db.models import User, Prediction, Feedback, UserRole, DoctorQualification
from app.schemas.doctor import FeedbackCreate

router = APIRouter()
UPLOAD_DIR = "app/static/uploads/qualifications"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/patients")
def get_patients(db: Session = Depends(get_db), user=Depends(get_current_doctor)):
    
    patients = db.query(User).filter(User.role == UserRole.patient).all()

    return [
        {
            "id": p.id,
            "username": p.username,
            "email": p.email
        }
        for p in patients
    ]


@router.get("/patient/{user_id}/lesion/{lesion_name}")
def get_lesion_history(
    user_id: int,
    lesion_name: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_doctor)
):
    if user.role != UserRole.doctor:
        raise HTTPException(status_code=403, detail="Not allowed")

    predictions = (
        db.query(Prediction)
        .filter(
            Prediction.user_id == user_id,
            Prediction.lesion_name == lesion_name
        )
        .order_by(Prediction.created_at.asc())
        .all()
    )

    feedback = (
        db.query(Feedback, User)
        .join(User, Feedback.doctor_id == User.id)
        .filter(
            Feedback.user_id == user_id,
            Feedback.lesion_name == lesion_name
        )
        .all()
    )

    return {
        "predictions": [
            {
                "id": p.id,
                "image_path": p.image_path,
                "prediction": p.prediction,
                "confidence": p.confidence,
                "severity": p.severity,
                "created_at": p.created_at
            }
            for p in predictions
        ],
        "feedback": [
            {
                "id": f.id,
                "doctor_id": f.doctor_id,
                "doctor_name": u.username,   
                "comment": f.comment,
                "created_at": f.created_at
            }
            for f, u in feedback
        ]
    }


@router.post("/feedback")
def create_feedback(
    data: FeedbackCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_doctor)
):
    fb = Feedback(
        user_id=data.user_id,
        doctor_id=user.id,
        lesion_name=data.lesion_name,
        comment=data.comment
    )

    db.add(fb)
    db.commit()

    return {"message": "Feedback added"}

@router.get("/history/{user_id}")
def get_user_history(
    user_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_doctor)
):
    # -------------------------
    # FETCH USER HISTORY
    # -------------------------
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "prediction": r.prediction,
            "confidence": r.confidence,
            "severity": r.severity,
            "image_path": r.image_path,
            "created_at": r.created_at,
            "lesion_name": r.lesion_name
        }
        for r in records
    ]

@router.post("/qualification")
def upload_qualification(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_doctor)
):
    import uuid
    from datetime import datetime
    from app.db.models import DoctorQualification
    from app.db.database import get_db
    from fastapi import HTTPException
    from app.core.supabase import supabase

    # -----------------------
    # Check if already uploaded
    # -----------------------
    existing = db.query(DoctorQualification).filter(
        DoctorQualification.user_id == user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Qualification already uploaded")

    # -----------------------
    # Validate PDF
    # -----------------------
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDFs are allowed.")

    # -----------------------
    # Upload to Supabase Storage
    # -----------------------
    file.file.seek(0)
    file_bytes = file.file.read()

    filename = f"{user.id}/{uuid.uuid4()}.pdf"

    try:
        supabase.storage.from_("doctor-docs").upload(
            filename,
            file_bytes,
            file_options={"content-type": "application/pdf"}
        )

        document_url = supabase.storage.from_("doctor-docs").get_public_url(filename)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase upload failed: {str(e)}")

    # -----------------------
    # Save record to DB
    # -----------------------
    qualification = DoctorQualification(
        user_id=user.id,
        document_path=document_url,
        created_at=datetime.utcnow()
    )
    db.add(qualification)
    db.commit()
    db.refresh(qualification)

    return {
        "message": "Qualification uploaded successfully",
        "document_url": qualification.document_path
    }