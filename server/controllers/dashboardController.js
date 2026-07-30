import User from '../models/User.js';
import Subject from '../models/Subject.js';
import StudySession from '../models/StudySession.js';
import Goal from '../models/Goal.js';
import { isMongoConnected } from '../config/db.js';
import { memoryUsers } from './authController.js';
import { memorySubjects } from './subjectController.js';
import { memorySessions } from './sessionController.js';
import { memoryGoals } from './goalController.js';

// @desc    Get complete student dashboard metrics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
  try {
    let studentName = req.user?.name || 'Vignesh';
    let totalSubjects = 0;
    let completedTopics = 0;
    let totalStudyHours = 0;
    let weeklyStudyHours = 0;
    let recentSessions = [];
    let upcomingGoals = [];

    if (isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (user) studentName = user.name;

      const subjects = await Subject.find({ userId: req.user._id });
      totalSubjects = subjects.length;
      completedTopics = subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0);

      const sessions = await StudySession.find({ userId: req.user._id }).sort({ date: -1 });
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      totalStudyHours = parseFloat((totalMinutes / 60).toFixed(1));

      // Calculate weekly study hours (past 7 days)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklySessions = sessions.filter((s) => new Date(s.date) >= oneWeekAgo);
      const weeklyMinutes = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      weeklyStudyHours = parseFloat((weeklyMinutes / 60).toFixed(1));

      recentSessions = sessions.slice(0, 5);

      const goals = await Goal.find({ userId: req.user._id }).sort({ targetDate: 1 });
      upcomingGoals = goals.filter((g) => !g.completed).slice(0, 5);
    } else {
      const user = memoryUsers.find((u) => u._id === req.user._id) || memoryUsers[0];
      if (user) studentName = user.name;

      const subjects = memorySubjects.filter((s) => s.userId === req.user._id || s.userId === 'mem_user_vignesh');
      totalSubjects = subjects.length;
      completedTopics = subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0);

      const sessions = memorySessions.filter((s) => s.userId === req.user._id || s.userId === 'mem_user_vignesh');
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      totalStudyHours = parseFloat((totalMinutes / 60).toFixed(1));

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklySessions = sessions.filter((s) => new Date(s.date) >= oneWeekAgo);
      const weeklyMinutes = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      weeklyStudyHours = parseFloat((weeklyMinutes / 60).toFixed(1));

      recentSessions = sessions.slice(0, 5);

      const goals = memoryGoals.filter((g) => g.userId === req.user._id || g.userId === 'mem_user_vignesh');
      upcomingGoals = goals.filter((g) => !g.completed).slice(0, 5);
    }

    res.json({
      studentName,
      totalSubjects,
      completedTopics,
      totalStudyHours,
      weeklyStudyHours,
      recentSessions,
      upcomingGoals,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: error.message || 'Server error fetching dashboard' });
  }
};

// @desc    Get recent activities timeline
// @route   GET /api/recent-activity
// @access  Private
export const getRecentActivity = async (req, res) => {
  try {
    if (isMongoConnected) {
      const sessions = await StudySession.find({ userId: req.user._id }).sort({ date: -1 }).limit(10);
      return res.json(sessions);
    } else {
      const sessions = memorySessions.filter((s) => s.userId === req.user._id || s.userId === 'mem_user_vignesh');
      return res.json(sessions);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching activity' });
  }
};

// @desc    Update today's study goal
// @route   PUT /api/dashboard/goal
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const { text, completed } = req.body;
    res.json({ message: 'Goal updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log additional study time
// @route   POST /api/dashboard/study-time
// @access  Private
export const logStudyTime = async (req, res) => {
  try {
    const { minutes } = req.body;
    res.json({ minutesLogged: minutes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
