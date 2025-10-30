🎬 Movie Management Dashboard

A full-stack Movie Management application built with React (Vite + TypeScript) on the frontend and Node.js, Express, Prisma, and Zod on the backend.
Users can add, edit, delete, and view movies, with authentication and image URL support.



🏗️ Tech Stack
🖥️ Frontend

React (Vite + TypeScript)

React Hook Form + Zod for validation

Tailwind CSS + Shadcn UI components

React Router DOM

React Toastify for notifications

⚙️ Backend

Node.js + Express.js

Prisma ORM (PostgreSQL)

Zod validation for schema enforcement

JWT authentication

CORS & cookie-based sessions

🚀 Setup Instructions
🔧 Prerequisites

Node.js ≥ 18.x



npm or yarn

git clone https://github.com/yourusername/movie-dashboard.git
cd movie-dashboard

# Backend Setup
cd backend
npm install

Create .env file inside backend

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/moviedb"

JWT_SECRET="your_jwt_secret"

PORT=8000

APP_HOST=frontendhost

Run Prisma migrations and generate client
npx prisma migrate dev --name init
npx prisma generate

Start the backend server
npm run dev


# Frontend Setup
cd ../frontend
npm install

Create .env file inside frontend/
VITE_APP_HOST=backendhost


Run the frontend app
npm run dev

Features

✅ User Authentication (Register / Login)

✅ Add / Edit / Delete Movies

✅ Image URL support

✅ Infinite Scroll Movie List,Search,Sort

✅ Zod + React Hook Form validation

✅ Toast Notifications for actions

✅ Responsive design using Tailwind & Shadcn UI