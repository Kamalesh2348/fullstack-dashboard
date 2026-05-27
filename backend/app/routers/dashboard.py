from fastapi import APIRouter, HTTPException
from app.database import supabase

router = APIRouter()

SCHEMA = "dashboard_app"


def table(name):
    return supabase.schema(SCHEMA).table(name)


def handle_error(e):
    raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard/summary")
def dashboard_summary():
    try:
        users = table("users").select("*").execute().data or []
        products = table("products").select("*").execute().data or []
        orders = table("orders").select("*").execute().data or []

        total_sales = sum(float(order.get("total_amount") or 0) for order in orders)

        return {
            "total_users": len(users),
            "total_products": len(products),
            "total_orders": len(orders),
            "total_sales": total_sales,
        }

    except Exception as e:
        handle_error(e)