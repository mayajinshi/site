"""Backend API tests for Bakery Management System."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://bread-admin-1.preview.emergentagent.com").rstrip("/")
TOKEN = os.environ.get("TEST_SESSION_TOKEN", "test_session_1776603421322")
USER_ID = os.environ.get("TEST_USER_ID", "test-user-1776603421322")
AUTH_HEADERS = {"Authorization": f"Bearer {TOKEN}"}


# ---------- Root & public ----------
def test_root_hello():
    r = requests.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_products_public_list():
    r = requests.get(f"{BASE_URL}/api/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    for p in data:
        assert "_id" not in p
        assert "id" in p and "name" in p and "price" in p


# ---------- Auth ----------
def test_auth_session_invalid_returns_401():
    r = requests.post(f"{BASE_URL}/api/auth/session", json={"session_id": "invalid-xyz"})
    assert r.status_code == 401


def test_auth_me_without_token_401():
    r = requests.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401


def test_auth_me_with_bearer_token():
    r = requests.get(f"{BASE_URL}/api/auth/me", headers=AUTH_HEADERS)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["user_id"] == USER_ID
    assert "email" in data and "name" in data
    assert "_id" not in data


# ---------- Product CRUD (auth) ----------
def test_products_post_requires_auth():
    r = requests.post(f"{BASE_URL}/api/products", json={"name": "X", "price": 10})
    assert r.status_code == 401


@pytest.fixture(scope="module")
def created_product_id():
    r = requests.post(
        f"{BASE_URL}/api/products",
        json={"name": "TEST_Croissant", "price": 42.5, "image_url": "https://x/y.jpg"},
        headers=AUTH_HEADERS,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == "TEST_Croissant"
    assert data["price"] == 42.5
    assert "_id" not in data
    assert "id" in data
    yield data["id"]
    requests.delete(f"{BASE_URL}/api/products/{data['id']}", headers=AUTH_HEADERS)


def test_product_create_persists(created_product_id):
    r = requests.get(f"{BASE_URL}/api/products")
    assert r.status_code == 200
    ids = [p["id"] for p in r.json()]
    assert created_product_id in ids


def test_product_update(created_product_id):
    r = requests.put(
        f"{BASE_URL}/api/products/{created_product_id}",
        json={"price": 55.0},
        headers=AUTH_HEADERS,
    )
    assert r.status_code == 200, r.text
    assert r.json()["price"] == 55.0
    assert "_id" not in r.json()


def test_product_update_requires_auth(created_product_id):
    r = requests.put(f"{BASE_URL}/api/products/{created_product_id}", json={"price": 1.0})
    assert r.status_code == 401


def test_product_delete_requires_auth(created_product_id):
    r = requests.delete(f"{BASE_URL}/api/products/{created_product_id}")
    assert r.status_code == 401


def test_product_delete_nonexistent():
    r = requests.delete(f"{BASE_URL}/api/products/nonexistent-id-xyz", headers=AUTH_HEADERS)
    assert r.status_code == 404


# ---------- Orders ----------
def test_orders_requires_auth():
    r = requests.get(f"{BASE_URL}/api/orders")
    assert r.status_code == 401
    r2 = requests.post(f"{BASE_URL}/api/orders", json={"items": []})
    assert r2.status_code == 401


def test_orders_empty_items_400():
    r = requests.post(f"{BASE_URL}/api/orders", json={"items": []}, headers=AUTH_HEADERS)
    assert r.status_code == 400


def test_orders_create_and_list():
    items = [
        {"product_id": "p1", "name": "Bun", "price": 50.0, "quantity": 2, "subtotal": 100.0},
        {"product_id": "p2", "name": "Cake", "price": 200.0, "quantity": 1, "subtotal": 200.0},
    ]
    r = requests.post(f"{BASE_URL}/api/orders", json={"items": items}, headers=AUTH_HEADERS)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["total"] == 300.0
    assert data["user_id"] == USER_ID
    assert "_id" not in data
    oid = data["id"]

    lr = requests.get(f"{BASE_URL}/api/orders", headers=AUTH_HEADERS)
    assert lr.status_code == 200
    ids = [o["id"] for o in lr.json()]
    assert oid in ids
    for o in lr.json():
        assert "_id" not in o


def test_logout():
    # use a separate throwaway session so we don't kill the shared test token
    import time
    import pymongo
    from datetime import datetime, timezone, timedelta
    client = pymongo.MongoClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
    db = client[os.environ.get("DB_NAME", "test_database")]
    tmp_token = f"tmp_{int(time.time()*1000)}"
    db.user_sessions.insert_one({
        "user_id": USER_ID, "session_token": tmp_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    cookies = {"session_token": tmp_token}
    r = requests.post(f"{BASE_URL}/api/auth/logout", cookies=cookies)
    assert r.status_code == 200
    # token should be invalid now
    r2 = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {tmp_token}"})
    assert r2.status_code == 401
