import StudySession from '../models/StudySession.js';
import { isMongoConnected } from '../config/db.js';

export const memorySessions = [
  {
    _id: 'sess_1',
    userId: 'mem_user_vignesh',
    subject: 'Java Programming',
    topic: 'Multithreading & Concurrency Locks',
    duration: 45,
    date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    notes: 'Reviewed ReentrantLock, ExecutorService & Callable futures.',
  },
  {
    _id: 'sess_2',
    userId: 'mem_user_vignesh',
    subject: 'Data Structures & Algorithms',
    topic: 'Binary Search Tree Balancing (AVL Trees)',
    duration: 60,
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    notes: 'Solved 4 tree rotation problems on LeetCode.',
  },
  {
    _id: 'sess_3',
    userId: 'mem_user_vignesh',
    subject: 'Database Management Systems (SQL)',
    topic: 'SQL Joins & Index Optimization',
    duration: 30,
    date: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    notes: 'Learned B-Tree index structure and EXPLAIN ANALYZE commands.',
  },
];

// @desc    Get all study sessions for user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res) => {
  try {
    if (isMongoConnected) {
      const sessions = await StudySession.find({ userId: req.user._id }).sort({ date: -1 });
      return res.json(sessions);
    } else {
      const userSessions = memorySessions.filter((s) => s.userId === req.user._id || s.userId === 'mem_user_vignesh');
      return res.json(userSessions);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching sessions' });
  }
};

// @desc    Create a new study session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { subject, topic, duration, date, notes } = req.body;

    if (!subject || !topic || !duration) {
      return res.status(400).json({ message: 'Subject, topic, and duration are required' });
    }

    if (isMongoConnected) {
      const session = await StudySession.create({
        userId: req.user._id,
        subject,
        topic,
        duration: parseInt(duration, 10),
        date: date ? new Date(date) : new Date(),
        notes: notes || '',
      });
      return res.status(201).json(session);
    } else {
      const newSession = {
        _id: 'sess_' + Date.now(),
        userId: req.user._id,
        subject,
        topic,
        duration: parseInt(duration, 10),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        notes: notes || '',
      };
      memorySessions.unshift(newSession);
      return res.status(201).json(newSession);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating study session' });
  }
};

// @desc    Delete a study session
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const session = await StudySession.findOneAndDelete({ _id: id, userId: req.user._id });
      if (!session) {
        return res.status(404).json({ message: 'Study session not found' });
      }
      return res.json({ message: 'Study session deleted successfully' });
    } else {
      const index = memorySessions.findIndex((s) => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Study session not found' });
      }
      memorySessions.splice(index, 1);
      return res.json({ message: 'Study session deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting session' });
  }
};
