# 🎓 AI StudyMate - AI-Powered Educational Platform

AI StudyMate is a modern educational web application designed to help students organize their learning journey, manage study targets, track subject progress, and prepare for upcoming AI study integrations.

---

## 🚀 Features

### 🔑 Authentication & Profile (Phase 1)
- **JWT Authentication**: Secure user registration, login, and token session persistence.
- **Protected Routes**: Redirection for unauthenticated users and auto-logout on expired tokens.
- **Academic Profiles**: Complete student profiles detailing Name, Email, Course, Academic Year, Enrolled Subjects, and Study Goals.
- **Responsive UI**: Custom theme built with `#2563EB` primary color, `#F8FAFC` background, white rounded cards, soft drop shadows, and micro-animations.

### 📊 Student Dashboard & Stats (Phase 2)
- **Personalized Welcome**: Displays student greeting (`Welcome, {Student Name}`) and total logged study hours.
- **Today's Goal Tracker**: Interactive daily goal checklist with completion toggle.
- **Study Time & Session Logger**: Tracks study minutes with an interactive start/pause study timer.
- **Quick Action Tools**:
  - 🤖 **Ask AI** (Phase 2 preview card)
  - 📝 **Summarize Notes** (Phase 2 preview card)
  - ❓ **Generate Quiz** (Phase 2 preview card)
  - 📅 **Study Planner** (Phase 2 preview card)
- **Recent Subjects**: Displays active modules (**Java**, **DSA**, **SQL**).
- **Progress Overview**: Visual progress bars showing syllabus mastery percentages.
- **Recent Activity Feed**: Real-time timeline log of study sessions, quiz practice, and note summaries.

---

## 📁 Repository Structure

```text
AI-StudyMate/
├── client/                     # React.js (Vite) Frontend Application
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptors
│   │   ├── components/         # Navbar, Footer, Input, Button, Loader, ProtectedRoute
│   │   ├── context/            # AuthContext global state
│   │   ├── pages/              # Home, Login, Register, Dashboard, Profile, NotFound
│   │   ├── App.jsx             # Main router & page routes
│   │   ├── main.jsx            # Vite entry point
│   │   └── index.css           # Tailwind CSS & custom design system
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     # Node.js + Express.js MVC Backend API
    ├── config/                 # Mongoose DB setup & connection fallback logic
    ├── controllers/            # Auth & Dashboard controllers
    ├── middleware/             # JWT Auth protection & error handling
    ├── models/                 # User Mongoose schema & bcrypt password hashing
    ├── routes/                 # Auth & Dashboard API routes
    ├── utils/                  # JWT token generator
    ├── server.js               # Express application entry point
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS & Vanilla CSS
- **Form Validation**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (Clean MVC Architecture)
- **Database**: MongoDB Atlas / Mongoose
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`
- **Utilities**: `dotenv`, `cors`

---

## 💻 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YAGAVI2006/AI-StudyMate.git
cd AI-StudyMate
```

### 2. Configure Backend Server
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_studymate
JWT_SECRET=ai_studymate_super_secret_jwt_key_2026
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```
> Server runs on `http://localhost:5000`

### 3. Configure Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
> Application runs on `http://localhost:3000`

---

## 📡 API Endpoints Summary

### Authentication APIs
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate student & generate JWT |
| `GET` | `/api/auth/profile` | Private | Retrieve logged-in student profile |
| `PUT` | `/api/auth/profile` | Private | Update student details & goals |

### Dashboard & Analytics APIs
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Private | Retrieve dashboard metrics, goals & progress |
| `GET` | `/api/recent-activity` | Private | Fetch recent learning activity timeline |
| `PUT` | `/api/dashboard/goal` | Private | Toggle today's goal completion status |
| `POST` | `/api/dashboard/study-time` | Private | Log active study session minutes |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.
