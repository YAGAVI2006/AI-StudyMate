import express from 'express';
import {
  getGoals,
  createGoal,
  updateGoalItem,
  deleteGoalItem,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoalItem)
  .delete(deleteGoalItem);

export default router;
