from fastapi import FastAPI, APIRouter, HTTPException, Response, Cookie, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import requests
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta

# ================= Load Env =================
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = "mongodb+srv://niksthetic:nikita%232007@cluster.mongodb.net/"
DB_NAME = "bakery_db"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

if not MONGO_URL or not DB_NAME:
    raise RuntimeError("Missing MONGO_URL or DB_NAME environment variables")

# ================= Logging =================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ================= App =================
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ================= Database =================
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ================= Models =================
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    price: float
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    subtotal: float


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[OrderItem]
    total: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    items: List[OrderItem]


class SessionRequest(BaseModel):
    session_id: str

# ================= Auth Helper =================
async def get_current_user(
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None),
):
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "", 1)

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session_doc = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = datetime.fromisoformat(session_doc["expires_at"])
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")

    return User(**user_doc)

# ================= Routes =================
@api_router.get("/")
async def root():
    return {"message": "Bakery Management System API running"}

@api_router.get("/health")
async def health():
    return {"status": "ok"}

@api_router.get("/products", response_model=List[Product])
async def list_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/products", response_model=Product)
async def create_product(payload: ProductCreate):
    product = Product(**payload.model_dump())
    await db.products.insert_one(product.model_dump())
    return product

@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    total = sum(item.subtotal for item in payload.items)
    order = Order(user_id="guest", items=payload.items, total=total)
    await db.orders.insert_one(order.model_dump())
    return order

# ================= Register Router =================
app.include_router(api_router)

# ================= CORS =================
origins = [origin.strip() for origin in CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= Shutdown =================
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
