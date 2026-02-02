from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.utils.deps import get_current_user, get_db

router = APIRouter(tags=["Likes"])

@router.post("/posts/{post_id}/like")
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    try:
        like = Like(
            user_id=current_user.id,
            post_id=post_id
        )
        db.add(like)

        post.like_count += 1
        db.commit()

        return {"message": "Post liked"}

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Post already liked"
        )

@router.delete("/posts/{post_id}/like")
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).delete()

    if deleted == 0:
        raise HTTPException(
            status_code=400,
            detail="Post not liked yet"
        )

    db.query(Post).filter(Post.id == post_id).update(
        {Post.like_count: Post.like_count - 1},
        synchronize_session=False
    )

    db.commit()

    return {"message": "Post unliked"}



