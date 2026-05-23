from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    user_id: int
    lesion_name: str
    comment: str