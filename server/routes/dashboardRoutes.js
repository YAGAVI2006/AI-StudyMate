import express from 'express';
import {
  getDashboardData,
  getRecentActivity,
  updateGoal,
  logStudyTime,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', protect, getDashboardData);

// GET /api/dashboard/recent-activity
router.get('/recent-activity', protect, getRecentActivity);

// PUT /api/dashboard/goal
router.put('/goal', protect, updateGoal);

// POST /api/dashboard/study-time
router.post('/study-time', protect, logStudyTime);

export default router;
