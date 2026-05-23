from app.auth.deps import get_current_user
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, UserRole
from app.auth.auth_utils import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter()


# -----------------
# REGISTER
# -----------------
@router.post("/register")
def register(
    data: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db)
):

    existing_email = db.query(User).filter(User.email == data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already used")

    new_user = User(
        username= data.username,
        email= data.email,
        password= hash_password(data.password),
        role= data.role.value
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # -------------------------
    # AUTO LOGIN (CREATE TOKEN)
    # -------------------------
    token = create_access_token({
        "user_id": new_user.id,
        "username": new_user.username,
        "role": new_user.role.value
    })

    # -------------------------
    # SET COOKIE
    # -------------------------
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,   # set True in production (HTTPS)
        samesite="lax"
    )

    return {
        "message": "User created and logged in"
    }


# -----------------
# LOGIN
# -----------------
@router.post("/login")
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({
        "user_id": user.id,
        "username": user.username,
        "role": user.role.value
    })

    # -------------------------
    # SET HTTP-ONLY COOKIE
    # -------------------------
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,   
        samesite="lax"
    )

    return {"message": "Login successful"}


# -----------------
# GET USER INFO
# -----------------
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role.value,
        "is_approved": current_user.is_approved
    }


# -----------------
# LOGOUT
# -----------------
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}