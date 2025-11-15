# Quiz App - Monorepo
http://15.222.234.143/
A full-stack quiz application built with React (TypeScript) and Node.js (Express + TypeScript).

## Project Structure

```
quizapp/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # Node.js + Express backend API
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@quizapp.com
ADMIN_PASSWORD=admin123
```

3. Install dependencies and seed admin user:
```bash
npm install
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Features

- User Authentication (Login)
- Create Quizzes (MCQ, Boolean, Text questions)
- Take Quizzes (One question at a time)
- View Results with correct answers
- Protected routes
- JWT-based authentication

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## API Endpoints

- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/quiz` - Create quiz (Protected)
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get quiz by ID
- `POST /api/quiz/:id/submit` - Submit quiz answers

## License

ISC
