# 🎓 AI StudyMate - AI-Powered Educational Platform

AI StudyMate is a modern educational web application built with **React (Vite)** and **Node.js Express (MVC)**.

## 🚀 Features

- **JWT Authentication**: Secure registration, login, and protected routes.
- **Student Dashboard**: Real-time study metrics, today's goals, recent subjects (Java, DSA, SQL), study timer, progress overview, and activity timeline.
- **Profile Management**: Customizable student profiles with course, academic year, and study goal management.
- **Modern UI**: Styled with Tailwind CSS `#2563EB` primary theme, glassmorphism cards, and micro-animations.

## 📁 Repository Structure

```text
AI StudyMate/
├── client/          # React Vite Frontend Application
└── server/          # Node.js Express MVC Backend API
```

## 🛠️ Quick Start

### 1. Backend Server Setup
```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5000`*

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
*Application runs on `http://localhost:3000`*

## 🔑 Environment Setup

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_studymate
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
