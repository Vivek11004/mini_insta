from pydantic import BaseModel

class PostCreate(BaseModel):
    content: str

class PostOut(BaseModel):
    id: int
    content: str
    user_id: int

    class Config:
        from_attributes = True
