# Bloom Bakery — Bakery Management System (PRD)

## Original Problem Statement
Build a Bakery Management System with HTML/JS CRUD patterns, extended into a full React + FastAPI + MongoDB app. Navigation: Products, Orders. Features: add/list/edit/delete products, create orders with cart + auto-total, order history, success/error messages. Visual/animation style inspired by https://www.bloominstudio.com/ — pastel theme, soft background, smooth transitions. Requires authentication (Google sign-in), data persistence, order history, cute product images via URL.

## Architecture
- Frontend: React 19 + React Router 7 + Framer Motion + Tailwind + Shadcn base tokens
- Backend: FastAPI + Motor (MongoDB) — all routes under `/api`
- Database: MongoDB (`test_database`) — collections: `users`, `user_sessions`, `products`, `orders`
- Auth: Emergent-managed Google OAuth (session_token cookie + Bearer fallback)

## User Personas
- Bakery owner / manager who curates a small catalogue and takes orders for their store.

## Core Requirements (static)
1. Google sign-in (Emergent OAuth)
2. Products CRUD (name, price, image URL)
3. Orders: select product → quantity → cart with per-item subtotal → auto grand total → place order
4. Order history (per-user)
5. Toast success/error notifications
6. Responsive, editorial pastel UI with smooth Framer Motion reveals

## What's been implemented (as of 2026-02)
- **Backend** (`/app/backend/server.py`):
  - `POST /api/auth/session`, `GET /api/auth/me`, `POST /api/auth/logout`
  - `GET/POST/PUT/DELETE /api/products` (GET public; write auth-required)
  - `GET /api/orders`, `POST /api/orders` (auth-required, user-scoped)
  - All responses exclude MongoDB `_id`; custom `user_id` UUIDs
- **Frontend** (`/app/frontend/src/`):
  - Landing page (`Landing.jsx`) — bloom.studio-inspired hero, menu strip, marquee
  - Google sign-in split-screen (`Login.jsx`)
  - AuthCallback handler, protected `Layout` with glass nav
  - `Dashboard`, `Products`, `Orders` (cart + auto-total), `OrderHistory`
  - Framer Motion staggered reveals, pastel palette, Cormorant Garamond + Outfit fonts
- **Testing**: 15/15 backend pytest pass; frontend CRUD + cart + order flows verified.

## Backlog / Next Tasks
- **P1**: Order status tracking (pending → fulfilled), inventory stock counts, per-order customer note field
- **P1**: Product categories / tags + filter on Products page
- **P2**: Upload product images (via object storage) instead of URL-only
- **P2**: Revenue chart on Dashboard (daily/weekly)
- **P2**: Share a public menu page (read-only order via link)
- **P3**: Multi-user bakery (staff accounts + roles)
