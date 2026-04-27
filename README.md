# 🏆 Digital Heroes - Impact Through Competition

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-05998b?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Beanie-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Digital Heroes** is a premium, enterprise-grade SaaS platform that bridges the gap between competitive performance and charitable giving. Users participate in monthly draws based on their performance metrics (like Stableford golf scores) while directly supporting vetted charities.

---

## ✨ Features

-   **🎯 Score-Based Draws**: Submit your performance scores (e.g., Stableford golf scores) to enter exclusive monthly prize draws.
-   **🎗️ Charity Integration**: A percentage of every subscription and win-share is automatically routed to your chosen charity.
-   **💳 Subscription Engine**: Powered by Stripe for seamless monthly and yearly membership management.
-   **📊 Real-time Analytics**: Beautiful dashboards for both users and administrators to track impact and draw results.
-   **🔐 Enterprise Security**: JWT-based authentication with Role-Based Access Control (RBAC).
-   **🚀 Algorithmic Fair Play**: Transparent winning number generation using verifiable random or algorithmic modes.

---

## 🧩 Core Modules

| Module | Description | Tech Highlight |
| :--- | :--- | :--- |
| **User Dashboard** | Personal impact tracking and score entry. | Framer Motion & React Query |
| **Draw Engine** | Automated prize draws and winner verification. | FastAPI Background Tasks |
| **Charity Portal** | Management of vetted charities and donation routing. | Beanie Link Models |
| **Payment Gateway** | Robust subscription management and webhooks. | Stripe API Integration |
| **Admin Suite** | High-level platform monitoring and draw controls. | Next.js Server Components |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User((User)) -->|Interacts| Frontend[Next.js Frontend]
    Admin((Admin)) -->|Manages| Frontend
    
    Frontend -->|API Requests| Backend[FastAPI Backend]
    
    subgraph "Backend Services"
        Backend -->|Auth| JWT[JWT & Passlib]
        Backend -->|Data| Beanie[Beanie ODM]
        Backend -->|Payments| Stripe[Stripe API]
        Backend -->|Logic| DrawService[Draw & Prize Engine]
    end
    
    subgraph "Storage"
        Beanie -->|Async| MongoDB[(MongoDB Atlas)]
    end
    
    subgraph "External"
        Stripe -->|Webhooks| Backend
    end
```

---

## 📊 Data Relationship Graph

```mermaid
erDiagram
    USER ||--o{ SUBSCRIPTION : "has"
    USER ||--o{ SCORE : "submits"
    USER ||--o{ CHARITY_CONTRIBUTION : "makes"
    USER }|--|| CHARITY : "supports"
    
    DRAW ||--o{ DRAW_RESULT : "produces"
    DRAW_RESULT ||--|| USER : "belongs to"
    DRAW_RESULT ||--o| WINNER : "leads to"
    
    CHARITY_CONTRIBUTION }|--|| CHARITY : "benefits"
    CHARITY_CONTRIBUTION }|--o| DRAW : "associated with"
```

---

## 🔄 User Journey

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant S as Stripe
    participant C as Charity

    U->>F: Sign Up & Select Charity
    F->>B: Register User
    U->>F: Subscribe to Plan
    F->>S: Checkout Session
    S-->>B: Webhook (Payment Success)
    B->>U: Subscription Activated
    
    Note over U, B: Monthly Cycle
    U->>F: Submit Score (1-45)
    F->>B: Save Score
    B->>B: Execute Draw
    B->>C: Disburse Donation
    B-->>U: Notify Draw Results
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Beanie ODM](https://beanie-odm.dev/)
- **Task Scheduling**: Async logic for draw simulations
- **Payments**: [Stripe SDK](https://stripe.com/docs/api)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/latest/)

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB & Stripe keys
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

---

## 📁 Project Structure

```text
Digital_heros/
├── Backend/
│   ├── app/
│   │   ├── api/          # Route handlers (v1)
│   │   ├── models/       # Beanie Document models
│   │   ├── services/     # Business logic (Stripe, Draw logic)
│   │   └── schemas/      # Pydantic data validation
│   └── tests/            # Pytest suite
└── frontend/
    ├── src/
    │   ├── app/          # Next.js App Router pages
    │   ├── components/   # Atomic UI components
    │   └── services/     # Axios API abstraction
    └── public/           # Static assets
```

---

## 📄 License & Contribution

This project is proprietary. For contribution guidelines or licensing inquiries, please contact the development team.

---
<p align="center">Made with ❤️ for the Digital Heroes Community</p>
