from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import exists


from app.models.post import Post
from app.models.like import Like
from app.models.user import User
from app.utils.deps import get_current_user,get_db

router = APIRouter(tags=["Feed"])


@router.get("/feed")
def get_feed(
    cursor: int | None = None,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1️⃣ Base query
    query = db.query(Post)

    # 2️⃣ Cursor condition
    if cursor:
        query = query.filter(Post.id < cursor)

    # 3️⃣ Fetch posts
    posts = (
        query
        .order_by(Post.id.desc())
        .limit(limit)
        .all()
    )

    # 4️⃣ Build response with liked_by_me
    result = []
    for post in posts:
        liked = db.query(
            exists().where(
                Like.user_id == current_user.id,
                Like.post_id == post.id
            )
        ).scalar()

        result.append({
            "id": post.id,
            "user_id": post.user_id,
            "content": post.content,
            "like_count": post.like_count,
            "liked_by_me": liked,
            "created_at": post.created_at,
        })

    # 5️⃣ Next cursor
    next_cursor = posts[-1].id if posts else None

    return {
        "items": result,
        "next_cursor": next_cursor
    }
