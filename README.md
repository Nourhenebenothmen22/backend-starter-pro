# Backend API - Movie Management Service

A robust RESTful API built with **Node.js, Express, and PostgreSQL** (via Prisma ORM), designed to manage movies and user watchlists. This project is containerized using **Docker** for easy deployment.

## 📋 Table of Contents

- [Architecture & Tech Stack](#architecture--tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## 🏗 Architecture & Tech Stack

This project follows a **MVC-like architecture** (Models, Views/Routes, Controllers) to separate concerns and ensure maintainability.

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma (using `@prisma/adapter-pg`)
- **Authentication**: JWT (JSON Web Tokens) with `bcrypt` for password hashing
- **Containerization**: Docker
- **Logging**: Winston & Morgan
- **Security**: Helmet, CORS, Rate Limiting, Express Validator

## ✨ Features

- **User Authentication**: Secure Registration and Login.
- **Movie Management**: CRUD operations for movies (Title, Overview, Ratings, etc.).
- **Watchlist**: Users can add movies to their personal watchlist and track status (Watching, Completed, Plan to Watch, Dropped).
- **Security**: Protected routes, input validation, and rate limiting.
- **Health Checks**: Endpoint to monitor service status.

## 🛠 Prerequisites

Ensure you have the following installed if running locally not using Docker:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (Optional, for containerized run)

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

# Database Configuration
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://user:password@localhost:5432/movies_db?schema=public"

# Security
JWT_SECRET=your_super_secret_jwt_key
```

## 🚀 Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd backend-api-dockerized
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Database Setup (Prisma)**:
    Make sure your PostgreSQL database is running.

    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Push schema to database
    npx prisma db push

    # (Optional) Seed database
    npm run seed:movies
    ```

## ▶️ Running the Application

### Development Mode

Runs the server with `nodemon` for hot-reloading.

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Using Docker 🐳

Build and run the container:

```bash
# Build the image
docker build -t movie-backend-api .

# Run the container
docker run -p 5000:5000 --env-file .env movie-backend-api
```

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Method        | Endpoint          | Description            | Auth Required             |
| :------------ | :---------------- | :--------------------- | :------------------------ |
| **Auth**      |                   |                        |                           |
| `POST`        | `/users/register` | Register a new user    | ❌                        |
| `POST`        | `/users/login`    | Login user & get token | ❌                        |
| `POST`        | `/users/logout`   | Logout user            | ❌                        |
| `GET`         | `/users`          | Get all users          | ❌ (Check implementation) |
| `GET`         | `/users/:id`      | Get user details       | ❌                        |
| **Movies**    |                   |                        |                           |
| `GET`         | `/movies`         | Get all movies         | ❌                        |
| `POST`        | `/movies`         | Add a new movie        | ❌                        |
| `PUT`         | `/movies/:id`     | Update a movie         | ❌                        |
| `DELETE`      | `/movies/:id`     | Delete a movie         | ❌                        |
| **Watchlist** |                   |                        |                           |
| `POST`        | `/watchlist`      | Add movie to watchlist | ✅                        |
| **System**    |                   |                        |                           |
| `GET`         | `/`               | API Documentation Root | ❌                        |
| `GET`         | `/health`         | Health Check           | ❌                        |

## 📂 Project Structure

```
backend-api-dockerized/
├── config/             # Configuration files (DB, Logger)
├── controllers/        # Request handlers
├── middleware/         # Custom middleware (Auth, Validation)
├── prisma/             # Database schema and seeds
├── routes/             # API Route definitions
├── utils/              # specific utility functions
├── index.js            # Entry point
├── Dockerfile          # Docker configuration
└── package.json        # Dependencies and scripts
```
