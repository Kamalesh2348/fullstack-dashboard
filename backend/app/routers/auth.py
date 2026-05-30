from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import supabase

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):

    result = (
        supabase.table("users_login")
        .select("*")
        .eq("username", data.username)
        .eq("password", data.password)
        .execute()
    )

    if len(result.data) == 0:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "success": True,
        "message": "Login successful"
    }
