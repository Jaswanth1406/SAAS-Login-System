# 📘 Mini SaaS Login System – Backend

A robust backend for a mini SaaS authentication system. This project handles user registration, secure login, JWT token management, and audit logging using Node.js, Express, and PostgreSQL.

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

## 📁 Folder Structure

```
src/
│── index.js             # Entry point
│── app.js               # Express app setup
│── db.js                # Database connection logic
│
├── routes/
│   ├── auth.js          # Auth routes (login/signup)
│   └── user.js          # User data routes
│
├── controllers/
│   ├── authController.js
│   └── userController.js
│
└── middleware/
    └── authMiddleware.js # JWT verification

migrations/
│── 001_init.sql         # SQL Schema setup
```

## 🔧 Setup & Installation

### 1. Clone & Install Dependencies

```
# Clone the repo
git clone <repository-url>

# Install dependencies
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

## 🚀 Running the Server

**Development Mode** (Auto-reloads on save):

```
npm run dev
```

 **Production Mode** :

```
npm start
```

*The server runs on `http://localhost:5000` by default.*

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

Invalidate the current JWT (requires Authorization header). The token will be recorded in the `revoked_tokens` table so it can no longer be used.

**Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Request Body:** None

**Response (example):**

```
{
  "message": "Logout successful"
}
```

## 🧪 Testing with Postman

1. **Signup:** Send a `POST` request to `http://localhost:5000/api/auth/signup`.
2. **Login:** Send a `POST` to `http://localhost:5000/api/auth/login` and copy the `token` from the response.
3. **Access Protected Data:**
   * Open a new tab for `GET http://localhost:5000/api/me`.
   * Go to the **Authorization** tab.
   * Select  **Bearer Token** .
   * Paste your JWT token.
   * Send the request.
