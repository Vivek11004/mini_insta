from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.models import Post
from app.schemas.post import PostCreate, PostOut
from app.utils.deps import get_current_user, get_db

router = APIRouter(prefix="/posts", tags=["Posts"])

# 🔹 CREATE POST
@router.post("/", response_model=PostOut)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_post = Post(
        content=post.content,
        user_id=current_user.id,
        like_count=0
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


# 🔹 SIMPLE POSTS LIST (NOT main feed)
@router.get("/", response_model=List[PostOut])
def get_posts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Post).order_by(Post.id.desc()).all()
