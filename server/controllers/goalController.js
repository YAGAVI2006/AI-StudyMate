import Goal from '../models/Goal.js';
import { isMongoConnected } from '../config/db.js';

export const memoryGoals = [
  {
    _id: 'goal_1',
    userId: 'mem_user_vignesh',
    title: 'Solve 50 Advanced LeetCode DSA Problems',
    targetDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    completed: false,
    priority: 'High',
  },
  {
    _id: 'goal_2',
    userId: 'mem_user_vignesh',
    title: 'Complete SQL Subqueries & Indexing Revision',
    targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    completed: true,
    priority: 'High',
  },
  {
    _id: 'goal_3',
    userId: 'mem_user_vignesh',
    title: 'Review Java Multithreading & Spring Boot Fundamentals',
    targetDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    completed: false,
    priority: 'Medium',
  },
];

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    if (isMongoConnected) {
      const goals = await Goal.find({ userId: req.user._id }).sort({ targetDate: 1 });
      return res.json(goals);
    } else {
      const userGoals = memoryGoals.filter((g) => g.userId === req.user._id || g.userId === 'mem_user_vignesh');
      return res.json(userGoals);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching goals' });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const { title, targetDate, completed, priority } = req.body;

    if (!title || !targetDate) {
      return res.status(400).json({ message: 'Title and target date are required' });
    }

    if (isMongoConnected) {
      const goal = await Goal.create({
        userId: req.user._id,
        title,
        targetDate: new Date(targetDate),
        completed: completed !== undefined ? completed : false,
        priority: priority || 'Medium',
      });
      return res.status(201).json(goal);
    } else {
      const newGoal = {
        _id: 'goal_' + Date.now(),
        userId: req.user._id,
        title,
        targetDate: new Date(targetDate).toISOString(),
        completed: completed !== undefined ? completed : false,
        priority: priority || 'Medium',
      };
      memoryGoals.unshift(newGoal);
      return res.status(201).json(newGoal);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating goal' });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoalItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetDate, completed, priority } = req.body;

    if (isMongoConnected) {
      const goal = await Goal.findOne({ _id: id, userId: req.user._id });
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      if (title !== undefined) goal.title = title;
      if (targetDate !== undefined) goal.targetDate = new Date(targetDate);
      if (completed !== undefined) goal.completed = completed;
      if (priority !== undefined) goal.priority = priority;

      const updated = await goal.save();
      return res.json(updated);
    } else {
      const index = memoryGoals.findIndex((g) => g._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      if (title !== undefined) memoryGoals[index].title = title;
      if (targetDate !== undefined) memoryGoals[index].targetDate = new Date(targetDate).toISOString();
      if (completed !== undefined) memoryGoals[index].completed = completed;
      if (priority !== undefined) memoryGoals[index].priority = priority;

      return res.json(memoryGoals[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating goal' });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoalItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const goal = await Goal.findOneAndDelete({ _id: id, userId: req.user._id });
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      return res.json({ message: 'Goal deleted successfully' });
    } else {
      const index = memoryGoals.findIndex((g) => g._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      memoryGoals.splice(index, 1);
      return res.json({ message: 'Goal deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting goal' });
  }
};
