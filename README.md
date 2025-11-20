# 📘 Mini SaaS Login System – Monorepo (Frontend + Backend)

This repository now contains both the **backend** (under `backend/`) and a React **frontend** (under `frontend/`). The backend provides authentication (signup/login/logout), JWT management with token revocation, and audit logging. The frontend consumes these APIs.

## 🚀 Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Password hashing)

## 🎯 Features

* ✅ **User Signup:** Register new users with secure password hashing.
* ✅ **User Login:** Authenticate users and issue JWTs.
* ✅ **Protected Routes:** Middleware to guard sensitive APIs.
* ✅ **Audit Logs:** Tracks the last 5 login timestamps for security auditing.
* ✅ **Database Migrations:** SQL scripts to initialize schema.

## 📁 High-Level Structure

```
backend/
  ├── package.json          # Backend dependencies & scripts
  ├── migrations/           # SQL migrations (001_init.sql, 002_revoked_tokens.sql)
  └── src/
      ├── index.js          # Backend entry
      ├── app.js            # Express app wiring
      ├── db.js             # PostgreSQL connection + timezone setup
      ├── controllers/      # Route handlers
      ├── routes/           # Express routers
      ├── middleware/       # Auth middleware (JWT + revocation)
      └── utils/            # Validation utilities

frontend/
  ├── package.json          # React app dependencies & scripts
  ├── src/                  # React source (components, context, services)
  ├── public/               # Static assets
  └── tailwind.config.js    # Tailwind setup (if used)

.env                        # Shared environment variables (backend reads this)
README.md                   # Documentation
```

## 🔧 Setup & Installation

git clone <repository-url>
### 1. Clone & Install Dependencies

Clone the repo and install dependencies separately for backend and frontend.

```
git clone <repository-url>
cd SAAS-Login-System

# Backend deps
cd backend
npm install

# Frontend deps (in a separate terminal or after going back)
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and add the following:

```
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret

# DATABASE_URL Format: postgres://USER:PASSWORD@HOST:PORT/DB_NAME

# Example for Windows (Default Postgres Installer):
DATABASE_URL=postgres://postgres:MyPassword123@localhost:5432/saas_login

# Example for macOS (Homebrew/Postgres.app often has no password):
DATABASE_URL=postgres://myMacUsername:@localhost:5432/saas_login
```

### 3. Database Setup

Ensure PostgreSQL is running, then create the database and tables.

**Step A: Create Database**

```
createdb -U postgres saas_login
# OR via SQL shell: CREATE DATABASE saas_login;
```

**Step B: Run Migrations**

```
psql -U postgres -d saas_login -f migrations/001_init.sql
```

npm start
## 🚀 Running Apps

Backend (Express API):
```
cd backend
npm run dev
```
Runs at `http://localhost:5000`.

Frontend (React):
```
cd frontend
npm start
```
Runs at `http://localhost:3000` and proxies API calls to port 5000 (see `proxy` in `frontend/package.json`).

## 🔥 API Documentation

### 1️⃣ Authentication

#### **POST** `/api/auth/signup`

Register a new user.

**Request Body:**

```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```
{
  "message": "Signup success",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **POST** `/api/auth/login`

Login and receive an access token.

**Request Body:**

```
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```
{
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2️⃣ Protected Routes 🔒

*All routes below require the `Authorization` header.*

**Header Format:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

#### **GET** `/api/me`

Get current user profile details.

**Response:**

```
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-01-20T10:30:00.000Z"
}
```

#### **GET** `/api/logs`

Get the last 5 login timestamps for the current user.

**Response:**

```
[
  { "login_at": "2025-01-20T10:30:00.000Z" },
  { "login_at": "2025-01-19T16:20:00.000Z" }
]
```
#### **POST** `/api/auth/login`

Login and receive an access token.

**Request Body:**

```
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```
{
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **POST** `/api/auth/logout`

Invalidate current JWT. Token is inserted into `revoked_tokens` and rejected on subsequent requests.

Headers:
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```
Body: none
Response:
```
{ "message": "Logged out successfully" }
```

## 🔒 Token Revocation Strategy

Logout writes the token (and its expiry) into `revoked_tokens`. Middleware checks this table for every authenticated request.

Periodic cleanup (recommended):
```
DELETE FROM revoked_tokens WHERE expires_at IS NOT NULL AND expires_at < now();
```

Alternative approach (not implemented): add `token_version` column in `users` and embed it in JWT to mass-invalidate.

## 🧪 Testing with Postman

1. **Signup:** Send a `POST` request to `http://localhost:5000/api/auth/signup`.
2. **Login:** Send a `POST` to `http://localhost:5000/api/auth/login` and copy the `token` from the response.
3. **Access Protected Data:**
  * Open a new tab for `GET http://localhost:5000/api/me`.
   * Go to the **Authorization** tab.
   * Select  **Bearer Token** .
   * Paste your JWT token.
   * Send the request.

  4. **Logout:**
  ```
  POST http://localhost:5000/api/auth/logout
  Authorization: Bearer <TOKEN>
  ```
  Then retry `GET /api/me` with same token → should return 401.

  5. **Check revocation table (optional):**
  ```
  SELECT token, revoked_at FROM revoked_tokens ORDER BY revoked_at DESC LIMIT 10;
  ```

  ## ✅ Having Two package.json Files

  Yes, this is normal in a full-stack setup:
  - `backend/package.json` manages server dependencies (Express, pg, bcrypt, etc.)
  - `frontend/package.json` manages client dependencies (React, axios, tailwind, etc.)

  They are isolated; run installs and scripts from their respective folders. Environment variables are shared via the root `.env` (backend only). Frontend should never expose secrets like `JWT_SECRET`.

  ## 📦 Deploy Notes (Brief)

  Backend:
  - Provide `DATABASE_URL`, `JWT_SECRET`, `PORT` env vars in hosting platform.

  Frontend:
  - Point API base URL to deployed backend (`REACT_APP_API_BASE=https://your-backend.example.com`).

  ## 🛠 Next Improvements (Suggestions)
  - Refresh token + rotation flow
  - Rate limiting (login, signup)
  - Password reset flow
  - Token versioning for mass invalidation
  - Centralized error handler middleware
