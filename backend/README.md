# Quiz App Backend

Backend API for Quiz App built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User Authentication (Signup/Login)
- JWT-based authentication
- Password hashing with bcrypt
- MongoDB database integration
- Security middlewares (Helmet, CORS, Rate Limiting)
- TypeScript support
- Feature-based folder structure

## Folder Structure

```
backend/
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── controller.ts
│   │       ├── model.ts
│   │       └── routes.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── security.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── types/
│   │   └── index.ts
│   ├── scripts/
│   │   └── seed.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@quizapp.com
ADMIN_PASSWORD=admin123
```

3. Seed admin user:
```bash
npm run seed
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Health Check

- `GET /api/health` - Server health check

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration (default: 7d)
- `ADMIN_EMAIL` - Admin user email for seeding
- `ADMIN_PASSWORD` - Admin user password for seeding

