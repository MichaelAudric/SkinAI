from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, UserRole
from app.auth.auth_utils import SECRET_KEY, ALGORITHM


# -------------------------
# GET CURRENT USER
# -------------------------
def get_current_user(request: Request, db: Session = Depends(get_db)):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def get_current_patient(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.patient:
        raise HTTPException(status_code=403, detail="Patient access only")
    return current_user

def get_current_doctor(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.doctor:
        raise HTTPException(status_code=403, detail="Doctor access only")
    return current_user

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access only")
    return current_user