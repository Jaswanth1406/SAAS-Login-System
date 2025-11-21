# 📘 Mini SaaS Login System – Monorepo (Frontend + Backend)

This repository now contains both the **backend** (under `backend/`) and a React **frontend** (under `frontend/`). The backend provides authentication (signup/login/logout), JWT management with token revocation, and audit logging. The frontend consumes these APIs.

## 🚀 Tech Stack

**Backend:**
* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Password hashing)

**Frontend:**
* **Framework:** React 18
* **Routing:** React Router v6
* **HTTP Client:** Axios
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Context API

## 🎯 Features

**Backend:**
* ✅ **User Signup:** Register new users with secure password hashing
* ✅ **User Login:** Authenticate users and issue JWTs
* ✅ **User Logout:** Token revocation with blacklist table
* ✅ **Protected Routes:** Middleware to guard sensitive APIs
* ✅ **Audit Logs:** Tracks login timestamps for security auditing
* ✅ **Database Migrations:** SQL scripts to initialize schema
* ✅ **IST Timezone:** All timestamps stored in Indian Standard Time
* ✅ **CORS:** Configured for cross-origin requests

**Frontend:**
* ✅ **Modern UI:** Clean, responsive design with Tailwind CSS
* ✅ **Authentication Flow:** Login, signup, and logout pages
* ✅ **Protected Dashboard:** Access control with route guards
* ✅ **User Profile:** View account details and login history
* ✅ **Toast Notifications:** Real-time feedback for user actions
* ✅ **Error Handling:** Graceful error messages and validation
* ✅ **Token Management:** Automatic token storage and refresh
* ✅ **Loading States:** Visual feedback during API calls

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
  ├── public/               # Static assets (favicon, index.html)
  ├── tailwind.config.js    # Tailwind CSS configuration
  ├── postcss.config.js     # PostCSS configuration
  └── src/
      ├── index.js          # React entry point
      ├── App.jsx           # Main app component with routing
      ├── index.css         # Global styles + Tailwind imports
      ├── components/       # React components
      │   ├── auth/         # Login, Signup pages
      │   ├── dashboard/    # Dashboard, Profile pages
      │   ├── common/       # Shared components (Toast, etc.)
      │   └── ProtectedRoute.jsx  # Route guard component
      ├── context/          # React Context providers
      │   ├── AuthContext.jsx     # Authentication state
      │   └── ToastContext.jsx    # Toast notifications
      ├── services/         # API service layer
      │   └── api.js        # Axios instance + API methods
      └── utils/            # Utility functions

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

**Backend:** Create a `.env` file in the root directory and add the following:

```
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret

# DATABASE_URL Format: postgres://USER:PASSWORD@HOST:PORT/DB_NAME

# Example for Windows (Default Postgres Installer):
DATABASE_URL=postgres://postgres:MyPassword123@localhost:5432/saas_login

# Example for macOS (Homebrew/Postgres.app often has no password):
DATABASE_URL=postgres://myMacUsername:@localhost:5432/saas_login
```

**Frontend:** No environment variables needed for local development. For production deployment, set:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

The frontend defaults to `http://localhost:5000` if not set.

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

## 🎨 Frontend Features & Pages

### Pages

**Public Routes:**
- **`/login`** - User login with email and password
- **`/signup`** - New user registration with name, email, and password

**Protected Routes** (require authentication):
- **`/dashboard`** - Main dashboard with user overview
- **`/profile`** - User profile with account details and login history

### Components

**Auth Components:**
- `Login.jsx` - Login form with validation and error handling
- `Signup.jsx` - Signup form with password strength validation

**Dashboard Components:**
- `Dashboard.jsx` - Main dashboard view with user stats
- `Profile.jsx` - User profile with audit logs display

**Common Components:**
- `ProtectedRoute.jsx` - Route guard for authenticated pages
- `Toast.jsx` - Toast notification system

### Context Providers

**AuthContext:**
- Manages user authentication state
- Provides `login`, `signup`, `logout` functions
- Handles token storage in localStorage
- Auto-checks authentication on app load

**ToastContext:**
- Manages toast notifications
- Provides `showToast(message, type)` function
- Auto-dismisses after 3 seconds

### API Service

The `api.js` service provides:
- Axios instance with base URL configuration
- Request interceptor to add JWT token
- Response interceptor for error handling
- API methods: `signup`, `login`, `getProfile`, `getLogs`

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

## 📦 Deployment Guide

### Deploy Backend on Render

1. **Create PostgreSQL Database:**
   - Dashboard → New → PostgreSQL
   - Copy **Internal Database URL** (for backend)
   - Copy **External Database URL** (for migrations)

2. **Run Migrations:**
   ```bash
   psql "EXTERNAL_DB_URL" -f backend/migrations/001_init.sql
   psql "EXTERNAL_DB_URL" -f backend/migrations/002_revoked_tokens.sql
   ```

3. **Deploy Backend:**
   - Dashboard → New → Web Service
   - Connect GitHub repo
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     DATABASE_URL = <Internal Database URL>
     JWT_SECRET = <generate strong secret>
     PORT = 5000
     NODE_ENV = production
     ```

### Deploy Frontend on Vercel

1. **Import from GitHub:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

2. **Add Environment Variable:**
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com
   ```

3. **Deploy:** Click Deploy button

4. **Update Backend CORS** (after getting Vercel URL):
   ```javascript
   // backend/src/app.js
   const allowedOrigins = [
     'http://localhost:3000',
     'https://your-frontend.vercel.app'
   ];
   app.use(cors({ origin: allowedOrigins }));
   ```

### Alternative: Deploy Both on Render

Both backend and frontend can be deployed on Render:
- Backend: Web Service (as above)
- Frontend: Static Site
  - **Build Command:** `npm install && npm run build`
  - **Publish Directory:** `build`  ## 🛠 Next Improvements (Suggestions)

**Backend:**
- Refresh token + rotation flow
- Rate limiting (login, signup)
- Password reset flow via email
- Token versioning for mass invalidation
- Centralized error handler middleware
- Input sanitization for XSS prevention
- API request logging

**Frontend:**
- Password strength indicator
- Remember me functionality
- Email verification flow
- Two-factor authentication (2FA)
- Dark mode toggle
- Progressive Web App (PWA) support
- Internationalization (i18n)
- User settings page
- Profile picture upload
