from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.deps import get_current_user,get_db

router = APIRouter(tags=["Users"])


@router.get("/users/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
    }
