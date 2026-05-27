from fastapi import APIRouter, HTTPException
from app.database import supabase

router = APIRouter()

SCHEMA = "dashboard_app"


def table(name):
    return supabase.schema(SCHEMA).table(name)


def handle_error(e):
    raise HTTPException(status_code=500, detail=str(e))


@router.get("/users")
def get_users():
    try:
        return table("users").select("*").order("id").execute().data or []
    except Exception as e:
        handle_error(e)