import os
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users
from app.routers import products
from app.routers import orders
from app.routers import order_items
from app.routers import search
from app.routers import dashboard

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI(title="Fullstack Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=
        FRONTEND_URL,
        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "FastAPI backend running successfully",
        "docs": "/docs",
        "frontend_url": FRONTEND_URL,
        "routes": {
            "users": "/users",
            "products": "/products",
            "orders": "/orders",
            "order_items": "/order-items",
            "dashboard_summary": "/dashboard/summary",
            "search_analytics": "/search/analytics?keyword=electronics",
        },
    }


app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(order_items.router)
app.include_router(search.router)
app.include_router(dashboard.router)