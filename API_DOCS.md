# 📡 AI StudyMate API Documentation

Comprehensive REST API endpoints documentation for AI StudyMate.

## Base URL
`http://localhost:5000/api`

---

## 🔐 1. Authentication APIs

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Vignesh",
    "email": "vignesh@example.com",
    "password": "password123",
    "course": "Computer Science",
    "year": "3rd Year",
    "subjects": ["Java", "DSA", "SQL"],
    "studyGoals": "Master algorithms"
  }
  ```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "vignesh@example.com",
    "password": "password123"
  }
  ```

---

## 📚 2. Subject Management APIs

- `GET /subjects` - Get user's subjects
- `POST /subjects` - Create new subject
- `PUT /subjects/:id` - Update subject
- `DELETE /subjects/:id` - Delete subject

---

## ⏱ 3. Study Session APIs

- `GET /sessions` - Get study sessions
- `POST /sessions` - Log study session
- `DELETE /sessions/:id` - Delete study session

---

## 🎯 4. Goal Management APIs

- `GET /goals` - Get academic goals
- `POST /goals` - Create new goal
- `PUT /goals/:id` - Update goal / toggle completed
- `DELETE /goals/:id` - Delete goal

---

## 🤖 5. AI Assistant APIs

- `POST /ai/chat` - Send query to Gemini AI Tutor
- `GET /ai/history` - Get user chat history
- `DELETE /ai/history` - Clear user chat history
