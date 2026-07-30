import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { memoryUsers } from './authController.js';

// Helper to format minutes into hours & minutes
const formatStudyTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

// @desc    Get complete student dashboard metrics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
  try {
    let studentData;

    if (isMongoConnected) {
      studentData = await User.findById(req.user._id).select('-password');
    } else {
      studentData = memoryUsers.find((u) => u._id === req.user._id);
    }

    if (!studentData) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Default fallback values if missing
    const name = studentData.name || 'Vignesh';
    const studyTimeMinutes = studentData.studyTime !== undefined ? studentData.studyTime : 165;
    const formattedStudyTime = formatStudyTime(studyTimeMinutes);
    const lastLogin = studentData.lastLogin || new Date().toISOString();
    
    const todaysGoal = studentData.todaysGoal || {
      text: 'Solve 5 LeetCode DSA problems & review SQL indexes',
      completed: false,
      targetMinutes: 120,
    };

    const recentSubjects = studentData.subjects && studentData.subjects.length > 0
      ? studentData.subjects
      : ['Java', 'DSA', 'SQL'];

    const recentTopics = studentData.recentTopics && studentData.recentTopics.length > 0
      ? studentData.recentTopics
      : [
          'Java Streams & Multithreading',
          'DSA Binary Search Trees & Graphs',
          'SQL Joins, Indexing & Aggregations',
        ];

    // Progress Overview percentages
    const rawProgress = studentData.progress || { Java: 85, DSA: 70, SQL: 90 };
    const progressObj = rawProgress instanceof Map ? Object.fromEntries(rawProgress) : rawProgress;

    res.json({
      welcomeMessage: `Welcome, ${name}`,
      studentName: name,
      todaysGoal,
      studyTime: {
        minutes: studyTimeMinutes,
        formatted: formattedStudyTime,
        weeklyMinutes: studyTimeMinutes + 420, // 9h 45m weekly sample total
        weeklyFormatted: formatStudyTime(studyTimeMinutes + 420),
      },
      lastLogin,
      recentSubjects,
      recentTopics,
      progressOverview: progressObj,
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
    let studentData;

    if (isMongoConnected) {
      studentData = await User.findById(req.user._id);
    } else {
      studentData = memoryUsers.find((u) => u._id === req.user._id);
    }

    const defaultActivities = [
      {
        id: 'act_1',
        title: 'Completed DSA Binary Search Tree Practice Quiz',
        category: 'Quiz',
        timestamp: '10 minutes ago',
        duration: '15 mins',
        subject: 'DSA',
      },
      {
        id: 'act_2',
        title: 'Summarized SQL Indexing & Joins Lecture Notes',
        category: 'Notes',
        timestamp: '2 hours ago',
        duration: '30 mins',
        subject: 'SQL',
      },
      {
        id: 'act_3',
        title: 'Studied Java Concurrency & Multithreading Concepts',
        category: 'Study Session',
        timestamp: 'Yesterday at 4:30 PM',
        duration: '45 mins',
        subject: 'Java',
      },
      {
        id: 'act_4',
        title: 'Generated Study Plan for Upcoming SQL Semester Exam',
        category: 'Planner',
        timestamp: '2 days ago',
        duration: '20 mins',
        subject: 'SQL',
      },
    ];

    const activities = (studentData && studentData.recentActivity && studentData.recentActivity.length > 0)
      ? studentData.recentActivity
      : defaultActivities;

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: error.message || 'Server error fetching recent activity' });
  }
};

// @desc    Update today's study goal
// @route   PUT /api/dashboard/goal
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const { text, completed } = req.body;
    let studentData;

    if (isMongoConnected) {
      studentData = await User.findById(req.user._id);
      if (studentData) {
        if (!studentData.todaysGoal) {
          studentData.todaysGoal = {};
        }
        if (text !== undefined) studentData.todaysGoal.text = text;
        if (completed !== undefined) studentData.todaysGoal.completed = completed;
        await studentData.save();
        return res.json(studentData.todaysGoal);
      }
    } else {
      studentData = memoryUsers.find((u) => u._id === req.user._id);
      if (studentData) {
        if (!studentData.todaysGoal) {
          studentData.todaysGoal = {};
        }
        if (text !== undefined) studentData.todaysGoal.text = text;
        if (completed !== undefined) studentData.todaysGoal.completed = completed;
        return res.json(studentData.todaysGoal);
      }
    }

    res.status(404).json({ message: 'Student profile not found' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating goal' });
  }
};

// @desc    Log additional study time
// @route   POST /api/dashboard/study-time
// @access  Private
export const logStudyTime = async (req, res) => {
  try {
    const { minutes } = req.body;
    const minutesToAdd = parseInt(minutes, 10) || 15;
    let studentData;

    if (isMongoConnected) {
      studentData = await User.findById(req.user._id);
      if (studentData) {
        studentData.studyTime = (studentData.studyTime || 0) + minutesToAdd;
        await studentData.save();
        return res.json({
          studyTimeMinutes: studentData.studyTime,
          formatted: formatStudyTime(studentData.studyTime),
        });
      }
    } else {
      studentData = memoryUsers.find((u) => u._id === req.user._id);
      if (studentData) {
        studentData.studyTime = (studentData.studyTime || 0) + minutesToAdd;
        return res.json({
          studyTimeMinutes: studentData.studyTime,
          formatted: formatStudyTime(studentData.studyTime),
        });
      }
    }

    res.status(404).json({ message: 'Student profile not found' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error logging study time' });
  }
};
