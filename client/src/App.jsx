import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import SessionsPage from './pages/SessionsPage';
import GoalsPage from './pages/GoalsPage';
import Profile from './pages/Profile';
import AIAssistantPage from './pages/AIAssistantPage';
import AIPlaceholderPage from './pages/AIPlaceholderPage';
import NotFound from './pages/NotFound';

// Layout wrapper that conditionally renders Sidebar for protected app pages
const MainLayout = ({ children }) => {
  const location = useLocation();
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPage = publicPaths.includes(location.pathname);

  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <SubjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <GoalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Phase 3 AI Study Assistant */}
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AIAssistantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-summarizer"
              element={
                <ProtectedRoute>
                  <AIPlaceholderPage featureId="ai-summarizer" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz-generator"
              element={
                <ProtectedRoute>
                  <AIPlaceholderPage featureId="quiz-generator" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam-generator"
              element={
                <ProtectedRoute>
                  <AIPlaceholderPage featureId="exam-generator" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/writing-tutor"
              element={
                <ProtectedRoute>
                  <AIPlaceholderPage featureId="writing-tutor" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paraphraser"
              element={
                <ProtectedRoute>
                  <AIPlaceholderPage featureId="paraphraser" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study-planner"
              element={
                <ProtectedRoute>
                  <AIPlaceholderPage featureId="study-planner" />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
