from fastapi import APIRouter, Query, HTTPException
from app.database import supabase

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/analytics")
def search_analytics(keyword: str = Query(...)):
    try:
        keyword = keyword.strip().lower()

        orders_response = (
            supabase
            .schema("dashboard_app")
            .table("orders")
            .select("*")
            .execute()
        )

        order_items_response = (
            supabase
            .schema("dashboard_app")
            .table("order_items")
            .select("*")
            .execute()
        )

        products_response = (
            supabase
            .schema("dashboard_app")
            .table("products")
            .select("*")
            .execute()
        )

        orders = orders_response.data or []
        order_items = order_items_response.data or []
        products = products_response.data or []

        matched_orders = [
            order for order in orders
            if keyword in str(order.get("order_status", "")).lower()
        ]

        matched_order_ids = {order.get("id") for order in matched_orders}

        matched_items = [
            item for item in order_items
            if item.get("order_id") in matched_order_ids
        ]

        matched_product_ids = {item.get("product_id") for item in matched_items}
        matched_user_ids = {order.get("user_id") for order in matched_orders}

        quantity_sold = sum(int(item.get("quantity") or 0) for item in matched_items)
        total_sales = sum(float(order.get("total_amount") or 0) for order in matched_orders)

        return {
            "keyword": keyword,
            "products_found": len(matched_product_ids),
            "users_ordered": len(matched_user_ids),
            "orders_count": len(matched_orders),
            "quantity_sold": quantity_sold,
            "total_sales": total_sales,
            "orders": matched_orders,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))