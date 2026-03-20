# How to Run - La Băiatu'

## Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas (already configured in backend/.env)

## Backend (FastAPI + MongoDB)

```bash
cd backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the server
uvicorn server:app --reload --port 8000
```

Backend runs at: http://localhost:8000

## Frontend (React + Tailwind)

```bash
cd frontend

# Install dependencies (first time only)
npm install --legacy-peer-deps

# If you get ajv error, also run:
npm install ajv@8 --legacy-peer-deps

# Start dev server
npm start
```

Frontend runs at: http://localhost:3000

## Seed the Database

After backend is running, seed the menu items:

```bash
curl http://localhost:8000/api/menu-items/seed
```

## Quick Start (both at once)

Open two terminal tabs:

**Tab 1 - Backend:**
```bash
cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8000
```

**Tab 2 - Frontend:**
```bash
cd frontend && npm start
```
