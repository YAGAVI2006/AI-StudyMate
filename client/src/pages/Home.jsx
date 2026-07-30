import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, UserCheck, Zap } from 'lucide-react';
import Button from '../components/Button';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Phase 1 Authentication & Student Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Elevate Your Learning with <span className="text-[#2563EB] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI StudyMate</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Your modern academic command center. Organize your courses, set study goals, and manage your student profile with secure JWT authentication.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto">
                    Go to Student Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto">
                      Create Student Account
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Existing Student Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-200/40 to-indigo-200/40 blur-3xl -z-10 rounded-full pointer-events-none" />
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Platform Features (Phase 1)</h2>
          <p className="text-slate-500 text-sm mt-2">Built with industry standard React, Node MVC, Express, and MongoDB</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover-lift space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">JWT Authentication</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Secure user registration and login with bcrypt password hashing and token interceptors in Axios.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover-lift space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Student Dashboard</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Clean dashboard displaying personalized student greetings, course metrics, enrolled subjects, and study goals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover-lift space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Profile Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Full control over academic info including course, academic year, subject list, and target study goals.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Specs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-blue-400 font-semibold text-xs uppercase tracking-wider">Architecture</span>
              <h2 className="text-3xl font-extrabold">Clean MVC & Modern Frontend</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Separated client and server codebases ensuring optimal maintainability, scalability, and seamless integration for upcoming Google Gemini AI features.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['React.js (Vite)', 'Node.js & Express', 'MongoDB Atlas', 'JWT + bcryptjs', 'Tailwind CSS', 'Axios Interceptors'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                <p className="text-blue-400">&gt; npm run start:server</p>
                <p className="text-slate-400">[Express] Listening on port 5000</p>
                <p className="text-slate-400">[MongoDB] Connected to database</p>
                <p className="text-[#2563EB]">&gt; npm run dev:client</p>
                <p className="text-slate-400">[Vite] Ready at http://localhost:3000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
