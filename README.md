# 🎬 Movie Site Project

This project is a simple **movie catalog + admin panel** with a **Node.js + Express + MongoDB backend**.

## 📂 Files
- `index.html` → Public user page (browse & watch movies)
- `admin.html` → Admin panel (login, add, edit, delete movies)
- `server.js` → Backend API server with MongoDB

## 🚀 Setup Guide

### 1. Install Requirements
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/try/download/community)

Check installation:
```sh
node -v
npm -v
mongod --version
```

### 2. Extract and Install Dependencies
Unzip the project, then in terminal:
```sh
cd movie_site_project_v2
npm init -y
npm install express mongoose cors bcrypt jsonwebtoken
```

### 3. Start MongoDB
Start your local MongoDB server (default: `mongodb://127.0.0.1:27017`):
```sh
mongod
```

### 4. Run Server
```sh
node server.js
```
If you see:
```
✅ Default admin created: username=admin, password=admin123
API running at http://localhost:4000
```
👉 Everything is working!

### 5. Open the Website
- Open `index.html` in browser → public movie catalog
- Open `admin.html` in browser → login as admin:
  - **Username:** `admin`
  - **Password:** `admin123`

### 6. Admin Features
- Add movies (title, poster URL, video URL, category)
- Edit movies
- Delete movies

### 🔑 Notes
- Movies are stored in **MongoDB** (not browser storage)
- API base URL: `http://localhost:4000/api`
- Default admin is only created if no `admin` user exists

---
Enjoy your movie site! 🎬
