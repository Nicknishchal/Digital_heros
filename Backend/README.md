# Digital Heros Backend (MongoDB Edition)

Production-grade, enterprise-level backend system for Digital Heros platform, powered by MongoDB.

## 🚀 Features
- **FastAPI** for high-performance API development.
- **Beanie ODM** for elegant MongoDB interactions using Pydantic.
- **JWT Authentication** with Access & Refresh tokens and RBAC.
- **Stripe Integration** for monthly/yearly subscriptions and webhooks.
- **Lottery System** with random/algorithmic winning number generation.
- **Golf Score Tracking** (latest 5 scores per user).
- **Charity Contribution System** integrated with draw winnings.

## 🛠️ Tech Stack
- **Framework:** FastAPI
- **Database:** MongoDB
- **ODM:** Beanie
- **Auth:** OAuth2 (JWT), Bcrypt
- **Testing:** Pytest
- **Payments:** Stripe

## 📁 Project Structure
```text
app/
├── api/          # Route handlers
├── core/         # Security & Config
├── db/           # Session management (MongoDB initialization)
├── models/       # Beanie Document models
├── repositories/ # Data access layer
├── schemas/      # Pydantic validation schemas
├── services/     # Business logic (Stripe, Draws, Auth)
└── utils/        # Shared utilities
```

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- MongoDB (Atlas or local)

### Running Locally
1. Clone the repository.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and provide your MongoDB URI and Stripe credentials.
5. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## 📖 API Documentation
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
