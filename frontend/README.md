# Digital Heroes Frontend

This is a production-grade SaaS frontend for Digital Heroes, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Premium UI/UX**: Modern, emotion-driven design focusing on charity impact.
- **Golf Score Tracking**: Stableford score entry and history.
- **Charity Integration**: Select and support vetted charities.
- **Monthly Draws**: View results and winning numbers.
- **Admin Dashboard**: Comprehensive user and platform management.
- **Secure Auth**: JWT-based authentication with protected routes.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Axios

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `src/app`: Page routes and layouts.
- `src/components`: Reusable UI, layout, and domain-specific components.
- `src/services`: API service layer.
- `src/context`: React Context providers (Auth, etc.).
- `src/hooks`: Custom React hooks.
- `src/types`: TypeScript interfaces.
- `src/utils`: Helper functions and utilities.
- `src/lib`: External library configurations.
