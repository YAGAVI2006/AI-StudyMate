# 📜 AI StudyMate - Project Changelog

All notable changes, architectural milestones, and feature releases for AI StudyMate are documented in this file.

---

## [3.0.0] - Phase 3: AI Study Assistant Integration

### Added
- **Google Gemini API Service**: Integrated REST service with prompt template rendering and fallback tutor.
- **Custom System Prompt**: Enforced response structure containing Definition, Explanation, Example, Analogy, Code Snippet, Key Takeaways, and 3 Practice Questions.
- **ChatGPT-Style UI**: Scrollable message canvas, side-drawer thread list, character counters, auto-scrolling, typing indicators, and suggested prompt chips.
- **Conversation Memory**: `Conversation` schema storing user chat history with JWT protection.

---

## [2.0.0] - Phase 2: Student Dashboard & Study Management

### Added
- **Mongoose Data Models**: Created `Subject`, `StudySession`, and `Goal` collections.
- **CRUD Operations**: Full REST APIs for `/api/subjects`, `/api/sessions`, `/api/goals`, and `/api/dashboard`.
- **Responsive Layout**: Built `Sidebar.jsx`, `Navbar.jsx`, `Modal.jsx`, `Table.jsx`, and `ProgressBar.jsx`.
- **Phase 3 Ready Placeholders**: Clean preview UI for AI tools (*AI Assistant, AI Summarizer, Quiz Generator, Exam Generator, Writing Tutor, Paraphraser, Study Planner*).

---

## [1.0.0] - Phase 1: Authentication & Core Architecture

### Added
- **Authentication Flow**: User Registration, Login, Profile View/Edit with JWT Bearer Token interceptors.
- **Security**: Password hashing using `bcryptjs` and protected routes.
- **Design System**: Tailwind CSS setup with `#2563EB` primary theme.
