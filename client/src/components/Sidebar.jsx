import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Target,
  User,
  LogOut,
  Sparkles,
  Bot,
  FileText,
  HelpCircle,
  Award,
  PenTool,
  RotateCw,
  Calendar,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', path: '/subjects', icon: BookOpen },
    { label: 'Study Sessions', path: '/sessions', icon: Clock },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const aiNavItems = [
    { label: 'AI Study Assistant', path: '/ai-assistant', icon: Bot, badge: 'Phase 3' },
    { label: 'AI Summarizer', path: '/ai-summarizer', icon: FileText, badge: 'Phase 3' },
    { label: 'Quiz Generator', path: '/quiz-generator', icon: HelpCircle, badge: 'Phase 3' },
    { label: 'Exam Generator', path: '/exam-generator', icon: Award, badge: 'Phase 3' },
    { label: 'Writing Tutor', path: '/writing-tutor', icon: PenTool, badge: 'Phase 3' },
    { label: 'Paraphraser', path: '/paraphraser', icon: RotateCw, badge: 'Phase 3' },
    { label: 'Study Planner', path: '/study-planner', icon: Calendar, badge: 'Phase 3' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:text-[#2563EB]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200/80 shadow-sm flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                AI <span className="text-[#2563EB]">StudyMate</span>
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                MERN Edition
              </span>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
              Main Menu
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    active
                      ? 'bg-blue-50 text-[#2563EB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* AI Tools Navigation (Phase 3 Ready) */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                AI Modules
              </p>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            {aiNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-50 text-[#2563EB]'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer User Info & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
              {user?.name ? user.name.charAt(0) : 'V'}
            </div>
            <div className="flex flex-col min-w-0 flex-grow">
              <span className="text-xs font-bold text-slate-900 truncate">
                {user?.name || 'Vignesh'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">{user?.email || 'Student'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
