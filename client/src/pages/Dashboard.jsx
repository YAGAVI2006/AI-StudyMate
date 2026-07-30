import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Sparkles,
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Circle,
  Activity,
  BookOpen,
  ArrowRight,
  Plus,
  Play,
  Pause,
  Award,
  Layers,
  Info,
  TrendingUp,
} from 'lucide-react';
import Loader from '../components/Loader';
import Button from '../components/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalFeature, setModalFeature] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Fetch Phase 2 Dashboard Data & Recent Activity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, activityRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/recent-activity'),
        ]);

        setDashboardData(dashRes.data);
        setRecentActivity(activityRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Timer interval logic for study time tracker
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleGoal = async () => {
    if (!dashboardData) return;
    const newCompleted = !dashboardData.todaysGoal?.completed;
    try {
      const res = await api.put('/dashboard/goal', { completed: newCompleted });
      setDashboardData((prev) => ({
        ...prev,
        todaysGoal: { ...prev.todaysGoal, completed: newCompleted },
      }));
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const logStudySession = async () => {
    const minutesToLog = Math.max(1, Math.floor(timerSeconds / 60));
    try {
      const res = await api.post('/dashboard/study-time', { minutes: minutesToLog });
      setDashboardData((prev) => ({
        ...prev,
        studyTime: {
          ...prev.studyTime,
          minutes: res.data.studyTimeMinutes,
          formatted: res.data.formatted,
        },
      }));
      setTimerSeconds(0);
      setIsTimerRunning(false);
    } catch (err) {
      console.error('Failed to log study session:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading student dashboard data..." />;
  }

  const studentName = dashboardData?.studentName || user?.name || 'Vignesh';
  const studyTimeFormatted = dashboardData?.studyTime?.formatted || '2h 45m';
  const todaysGoal = dashboardData?.todaysGoal || {
    text: 'Solve 5 LeetCode DSA problems & review SQL indexes',
    completed: false,
  };
  const subjectsList = dashboardData?.recentSubjects || ['Java', 'DSA', 'SQL'];
  const progressOverview = dashboardData?.progressOverview || { Java: 85, DSA: 70, SQL: 90 };

  const quickActions = [
    {
      id: 'ask_ai',
      title: 'Ask AI',
      description: 'Instant answers & concept explanations powered by Gemini AI.',
      icon: Bot,
      color: 'bg-blue-600 text-white',
      badge: 'Phase 2',
    },
    {
      id: 'summarize_notes',
      title: 'Summarize Notes',
      description: 'Convert lengthy lecture PDFs into bulleted key summaries.',
      icon: FileText,
      color: 'bg-indigo-600 text-white',
      badge: 'Phase 2',
    },
    {
      id: 'generate_quiz',
      title: 'Generate Quiz',
      description: 'Auto-generate revision cards and practice multiple-choice quizzes.',
      icon: HelpCircle,
      color: 'bg-emerald-600 text-white',
      badge: 'Phase 2',
    },
    {
      id: 'study_planner',
      title: 'Study Planner',
      description: 'Create optimized exam prep timelines and subject schedules.',
      icon: Calendar,
      color: 'bg-amber-600 text-white',
      badge: 'Phase 2',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-[#2563EB] to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Phase 2 Dashboard Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {studentName} 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Track your daily study time, manage targets, and monitor your subject mastery progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Total Study Time</span>
              <span className="text-xl font-black">{studyTimeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Decorative ambient lighting */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Metrics Grid: Today's Goal & Study Time Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Goal */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover-lift">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Today's Goal</h3>
                <p className="text-xs text-slate-400">Daily target checklist</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                todaysGoal.completed
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {todaysGoal.completed ? 'Completed ✓' : 'In Progress'}
            </span>
          </div>

          <div
            onClick={toggleGoal}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
              todaysGoal.completed
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:border-blue-300'
            }`}
          >
            <button type="button" className="mt-0.5 text-[#2563EB] focus:outline-none">
              {todaysGoal.completed ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <div className="space-y-1">
              <p
                className={`text-sm font-semibold leading-snug ${
                  todaysGoal.completed ? 'line-through text-slate-500' : 'text-slate-800'
                }`}
              >
                {todaysGoal.text}
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Click to toggle completion status
              </p>
            </div>
          </div>
        </div>

        {/* Study Time Card & Live Session Logger */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover-lift">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Study Time</h3>
                <p className="text-xs text-slate-400">Logged learning duration</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {studyTimeFormatted}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Active Study Timer</span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                {String(timerSeconds % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                    : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              {timerSeconds > 0 && (
                <button
                  onClick={logStudySession}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  Log Time
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <span className="text-xs font-semibold text-slate-400">Interactive Student Tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const IconComp = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => setModalFeature(action)}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover-lift cursor-pointer flex flex-col justify-between space-y-4 group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center shadow-md`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{action.description}</p>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-[#2563EB] group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Subjects & Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Subjects */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 hover-lift">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2563EB]" /> Recent Subjects
            </h3>
            <span className="text-xs text-slate-400 font-medium">Core Modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subjectsList.map((subject, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    {subject.charAt(0)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <span className="font-extrabold text-slate-900 text-base">{subject}</span>
                <span className="text-[11px] text-slate-400">
                  {progressOverview[subject] ? `${progressOverview[subject]}% Mastered` : 'Enrolled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 hover-lift">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2563EB]" /> Progress Overview
            </h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Syllabus Completion
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(progressOverview).map(([subject, percent], idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{subject}</span>
                  <span className="text-[#2563EB]">{percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2563EB]" /> Recent Activity
          </h3>
          <span className="text-xs font-semibold text-slate-400">Timeline Log</span>
        </div>

        <div className="space-y-4">
          {recentActivity.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {act.category === 'Quiz' && <HelpCircle className="w-5 h-5" />}
                {act.category === 'Notes' && <FileText className="w-5 h-5" />}
                {act.category === 'Study Session' && <Clock className="w-5 h-5" />}
                {act.category === 'Planner' && <Calendar className="w-5 h-5" />}
                {act.category === 'Account' && <Award className="w-5 h-5" />}
              </div>

              <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{act.title}</span>
                    {act.subject && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB]">
                        {act.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{act.timestamp}</p>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                  ⏱ {act.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Preview Modal */}
      {modalFeature && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${modalFeature.color} flex items-center justify-center`}
                >
                  {React.createElement(modalFeature.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{modalFeature.title}</h3>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase">
                    {modalFeature.badge} Feature
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalFeature(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info className="w-4 h-4 text-[#2563EB]" /> Phase 2 Quick Action
              </div>
              <p>{modalFeature.description}</p>
              <p className="text-slate-500 pt-2 border-t border-slate-200">
                Connected to backend APIs <code>GET /api/dashboard</code> and <code>GET /api/recent-activity</code>.
              </p>
            </div>

            <Button onClick={() => setModalFeature(null)} className="w-full">
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
