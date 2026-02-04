# app/routers/comment.py
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.models.post import Post
from app.schemas.comment import CommentCreate, CommentOut
from app.utils.deps import get_current_user, get_db
from app.websockets.manager import manager

router = APIRouter(prefix="/posts/{post_id}/comments", tags=["Comments"])


@router.post("/", response_model=CommentOut)
def add_comment(
    post_id: int,
    data: CommentCreate,
    background_tasks: BackgroundTasks,   # 👈 add this
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = Comment(
        content=data.content,
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    # 🔔 Notify post owner in background (if not commenting on own post)
    if post.user_id != current_user.id:
        background_tasks.add_task(
            manager.send_to_user,
            post.user_id,
            {
                "type": "new_comment",
                "post_id": post.id,
                "comment": comment.content,
                "by_user_id": current_user.id
            }
        )

    return comment


@router.get("/", response_model=list[CommentOut])
def list_comments(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.id.desc())
        .all()
    )
