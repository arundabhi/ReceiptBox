# RecipeBox – Instagram for Foodies (MERN Stack)

🌐 **Live Demo / Deployment**: [https://receipt-box-client.vercel.app](https://receipt-box-client.vercel.app)

RecipeBox is a modern, responsive, and visual social sharing platform for food enthusiasts. Built on the **MERN Stack** (MongoDB, Express.js, React, Node.js), it combines clean recipe sharing with a social-media-style experience. Users can register accounts, upload food photography, follow other chefs, save recipes to personal cookbooks, and plan weekly meals with an interactive drag-and-drop calendar planner.

---

## Technical Stack & Architecture

### Backend
- **Node.js** & **Express.js** – RESTful routing and API endpoints.
- **MongoDB** with **Mongoose** – Flexible schemas and indexes for fast queries.
- **Mongoose Aggregations** – Powerful search matching for inclusions and exclusions.
- **JWT (JSON Web Tokens)** – Secure token authentication with persistent refresh cookies.
- **Multer** & **Cloudinary** – Image upload stream handler with transparent local disk fallback.

### Frontend
- **React.js (Vite)** – High-performance virtual DOM builder.
- **TanStack React Query (v5)** – Automated caching, pre-fetching, and background data synchronization.
- **Tailwind CSS (v3)** – Slick, custom HSL design tokens, responsive breakpoints, and glassmorphism.
- **React Dropzone** – Drag-and-drop image selection with instant client-side preview.
- **HTML5 Drag & Drop API** – Lightweight, responsive, zero-dependency calendar scheduler.
- **Lucide Icons** – Crisp, modern iconography.

---

## Getting Started (Local Development Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or using MongoDB Atlas)

### 1. Installation
Clone this repository and run the workspace installation command from the root directory:
```bash
npm run install:all
```
This automatically triggers dependency installation in the root folder, the `/server` directory, and the `/client` directory.

### 2. Configuration Setup
Create a `.env` file inside the `server/` directory:
```bash
cd server
cp .env.example .env
```
Fill in the credentials in `server/.env`:
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/recipebox
JWT_ACCESS_SECRET=recipebox_super_secret_access_key_2026_!
JWT_REFRESH_SECRET=recipebox_super_secret_refresh_key_2026_!
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Optional Cloudinary Setup (If not provided, the application will fallback to local folder upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seeding the Database
To populate your local MongoDB with mock foodie accounts, ratings, comments, and 25 realistic recipes (using Unsplash food images), run the seed script from the root directory:
```bash
npm run seed
```

### 4. Running the Application
To run both the Express backend and the Vite frontend concurrently in development mode, run:
```bash
npm run dev
```
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## API Endpoints Listing

### User Authentication (`/api/auth`)
- `POST /api/auth/register` – Register new user (supports avatar image file).
- `POST /api/auth/login` – Login user (returns access token & sets HTTP-Only refresh cookie).
- `POST /api/auth/refresh` – Issue new access token using refresh cookie.
- `POST /api/auth/logout` – Clear refresh token cookie.
- `POST /api/auth/forgot-password` – Generate password reset token.
- `POST /api/auth/reset-password/:token` – Complete password reset using token.

### Recipes & Search (`/api/recipes`)
- `GET /api/recipes` – Get paginated recipes list.
- `GET /api/recipes/search` – Advanced query aggregation:
  - Supports: `query` (title/desc keyword), `include` (ingredients include list), `exclude` (ingredients exclude list), `time` (max minutes), `difficulty`, `author`.
- `GET /api/recipes/:id` – View details (includes comments and ratings counts).
- `POST /api/recipes` – Create recipe (requires image upload).
- `PUT /api/recipes/:id` – Edit recipe (checks authorship ownership).
- `DELETE /api/recipes/:id` – Delete recipe and associated comments.

### User Connections & Profile (`/api/users`)
- `GET /api/users/profile/:username` – Retrieve profile stats and recipes.
- `POST /api/users/follow/:id` – Follow user.
- `POST /api/users/unfollow/:id` – Unfollow user.
- `GET /api/users/:id/followers` – List followers.
- `GET /api/users/:id/following` – List followed users.

### Social Feed (`/api/feed`)
- `GET /api/feed` – Retrieve posts from creators the logged-in user follows. Falls back to popular recipes if empty.

### Interactions (`/api/comments`, `/api/ratings`)
- `POST /api/comments` – Comment on a recipe.
- `DELETE /api/comments/:id` – Remove own comment or comment on owned recipe.
- `POST /api/ratings` – Submit rating (1-5 stars). Updates recipe average rating.

### Cookbooks & Planner (`/api/cookbooks`, `/api/mealplans`)
- `GET /api/cookbooks` – List personal cookbooks.
- `POST /api/cookbooks` – Create cookbook collection.
- `DELETE /api/cookbooks/:id` – Delete cookbook.
- `POST /api/cookbooks/:id/recipes` – Add recipe to collection.
- `DELETE /api/cookbooks/:id/recipes/:recipeId` – Remove recipe from collection.
- `GET /api/mealplans` – Get weekly meal planner grid.
- `POST /api/mealplans` – Add recipe to a day slot.
- `DELETE /api/mealplans/item` – Remove meal from calendar.
- `DELETE /api/mealplans/clear` – Wipe weekly schedule.

---

## Production Deployment Guide

### Backend (Render / Railway)
1. Set the root directory of your deploy to `/server`.
2. Configure build command: `npm install`.
3. Set start command: `node server.js`.
4. Configure environment variables in dashboard settings (`MONGODB_URI`, `JWT_ACCESS_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`).

### Frontend (Vercel)
1. Select the root directory as `/client`.
2. Configure build command: `npm run build`.
3. Set output directory: `dist`.
4. Add proxy redirects mapping if needed, or update Axios baseURL configuration inside `client/src/services/api.js` to point to the production backend URL instead of relative `/api`.
