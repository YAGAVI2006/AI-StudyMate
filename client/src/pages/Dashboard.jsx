import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Flame,
  Plus,
  Play,
  Target,
  User,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Loader from '../components/Loader';
import Table from '../components/Table';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard metrics..." />;
  }

  const studentName = data?.studentName || user?.name || 'Vignesh';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-[#2563EB] to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-200" />
              <span>{currentDate}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {studentName} 👋
            </h1>
            <p className="text-blue-100 text-sm font-medium">
              {getGreeting()} — Ready to conquer today's study goals?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/sessions">
              <button className="flex items-center gap-2 bg-white text-[#2563EB] hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all">
                <Play className="w-4 h-4 fill-[#2563EB]" />
                <span>Start Session</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Subjects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Subjects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">{data?.totalSubjects || 0}</span>
        </div>

        {/* Topics Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Topics Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">{data?.completedTopics || 0}</span>
        </div>

        {/* Total Study Hours */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Study Hours</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">{data?.totalStudyHours || 0}h</span>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Weekly Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">{data?.weeklyStudyHours || 0}h</span>
        </div>

        {/* Current Streak (Placeholder) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Current Streak</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">5</span>
            <span className="text-xs text-slate-500 font-semibold">Days 🔥</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/subjects">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex items-center gap-3.5 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#2563EB]">Add Subject</h4>
                <p className="text-[11px] text-slate-400">Manage courses</p>
              </div>
            </div>
          </Link>

          <Link to="/sessions">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex items-center gap-3.5 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600">Start Session</h4>
                <p className="text-[11px] text-slate-400">Log study time</p>
              </div>
            </div>
          </Link>

          <Link to="/goals">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex items-center gap-3.5 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600">View Goals</h4>
                <p className="text-[11px] text-slate-400">Track objectives</p>
              </div>
            </div>
          </Link>

          <Link to="/profile">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex items-center gap-3.5 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">Edit Profile</h4>
                <p className="text-[11px] text-slate-400">Update info</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid: Recent Study Sessions & Upcoming Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Study Sessions Table (Left 2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2563EB]" /> Recent Study Sessions
            </h3>
            <Link to="/sessions" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Table headers={['Subject', 'Topic', 'Duration', 'Date']}>
            {data?.recentSessions && data.recentSessions.length > 0 ? (
              data.recentSessions.map((sess) => (
                <tr key={sess._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sess.subject}</td>
                  <td className="py-3.5 px-4 text-slate-600">{sess.topic}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] font-bold text-xs">
                      ⏱ {sess.duration} mins
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(sess.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-slate-400 italic">
                  No recent study sessions logged yet.
                </td>
              </tr>
            )}
          </Table>
        </div>

        {/* Upcoming Goals (Right Col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" /> Upcoming Goals
            </h3>
            <Link to="/goals" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>Manage</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.upcomingGoals && data.upcomingGoals.length > 0 ? (
              data.upcomingGoals.map((goal) => (
                <div
                  key={goal._id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{goal.title}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        priorityColors[goal.priority] || priorityColors.Medium
                      }`}
                    >
                      {goal.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    <span className="text-amber-600 font-semibold">Pending</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-400 text-sm italic">No upcoming goals found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
