from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.post import Post
from app.models.like import Like
from app.models.user import User
from app.utils.deps import get_current_user, get_db

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

#  GET SINGLE POST (OWNER ONLY — IDOR SAFE)
@router.get("/{post_id}")
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    #  IDOR CHECK
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this post"
        )

    return post


#  DELETE POST (OWNER ONLY — IDOR SAFE)
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    #  IDOR CHECK
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )

    #  Delete related likes first (DB consistency)
    db.query(Like).filter(Like.post_id == post_id).delete()

    #  Delete post
    db.delete(post)
    db.commit()

    return
