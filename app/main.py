from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import User, Post, Like
from app.routers import auth, comment, post,like,feed, posts, ws

app = FastAPI(title="Mini Instagram Backend")

# ✅ CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins (OK for dev)
    allow_credentials=True,
    allow_methods=["*"],   # allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],   # allow Authorization header
)

# register routers
app.include_router(auth.router)
app.include_router(post.router)
app.include_router(like.router)
app.include_router(feed.router)  
app.include_router(posts.router) 
app.include_router(comment.router)  
app.include_router(ws.router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def health():
    return {"status": "running"}
