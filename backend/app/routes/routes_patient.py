import os
import uuid
import cloudinary.uploader
from app.auth.deps import get_current_patient
from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.orm import Session

from app.utils.image_preprocess import preprocess_image
from app.services.predictor import predict_image
from app.db.database import get_db
from app.db.models import Feedback, Prediction, User, Severity, UserRole

router = APIRouter()

UPLOAD_DIR = "app/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SEVERITY_MAP = {
    "nv": Severity.benign,
    "df": Severity.benign,
    "vasc": Severity.benign,
    "bkl": Severity.benign,

    "akiec": Severity.suspicious,
    "bcc": Severity.malignant,
    "mel": Severity.malignant
}

CLASS_LABELS = {
    "nv": "Melanocytic nevus (benign mole)",
    "mel": "Melanoma (malignant skin cancer)",
    "bkl": "Benign keratosis-like lesion",
    "bcc": "Basal cell carcinoma",
    "akiec": "Actinic keratosis",
    "vasc": "Vascular lesion",
    "df": "Dermatofibroma"
}

@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    lesion_name: str = Form(...),   
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_patient)
):
    # ---------------------
    # SAVE IMAGE
    # ---------------------
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()

    with open(file_path, "wb") as f:
        f.write(content)

    # ---------------------
    # PREPROCESS + PREDICT
    # ---------------------
    img_array = preprocess_image(file_path)
    result = predict_image(img_array)
    severity = SEVERITY_MAP.get(result["class"], Severity.suspicious).value

    # ---------------------
    # UPLOAD TO CLOUDINARY
    # ---------------------
    cloud_result = cloudinary.uploader.upload(
        file_path,
        folder="skin-disease-app"
    )

    image_url = cloud_result["secure_url"]

    # ---------------------
    # CLEANUP
    # ---------------------
    os.remove(file_path)

    # ---------------------
    # SAVE TO DB
    # ---------------------
    db_prediction = Prediction(
        user_id=current_user.id,
        image_path=image_url,
        prediction=CLASS_LABELS.get(result["class"]),
        confidence=result["confidence"],
        severity=severity,
        lesion_name=lesion_name.strip().lower(),
    )

    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return {
        "prediction": CLASS_LABELS.get(result["class"]),
        "confidence": result["confidence"],
        "severity": severity,
        "lesion_name": db_prediction.lesion_name,
        "id": db_prediction.id
    }

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_patient)
):
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
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

@router.get("/feedback/{lesion_name}")
def get_patient_feedback(
    lesion_name: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_patient)
):
    feedback = (
        db.query(Feedback, User)
        .join(User, Feedback.doctor_id == User.id)
        .filter(
            Feedback.user_id == user.id,
            Feedback.lesion_name == lesion_name
        )
        .order_by(Feedback.created_at.desc())
        .all()
    )

    return [
        {
            "id": f.id,
            "doctor_id": f.doctor_id,
            "doctor_name": u.username,
            "doctor_email": u.email,
            "comment": f.comment,
            "created_at": f.created_at
        }
        for f, u in feedback
    ]