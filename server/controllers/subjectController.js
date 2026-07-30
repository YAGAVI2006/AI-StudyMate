import Subject from '../models/Subject.js';
import { isMongoConnected } from '../config/db.js';

// Memory store fallback for subjects
export const memorySubjects = [
  {
    _id: 'subj_1',
    userId: 'mem_user_vignesh',
    subjectName: 'Java Programming',
    color: '#2563EB',
    totalTopics: 12,
    completedTopics: 10,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'subj_2',
    userId: 'mem_user_vignesh',
    subjectName: 'Data Structures & Algorithms',
    color: '#4F46E5',
    totalTopics: 15,
    completedTopics: 9,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'subj_3',
    userId: 'mem_user_vignesh',
    subjectName: 'Database Management Systems (SQL)',
    color: '#059669',
    totalTopics: 10,
    completedTopics: 8,
    createdAt: new Date().toISOString(),
  },
];

// @desc    Get all subjects for logged-in user
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    if (isMongoConnected) {
      const subjects = await Subject.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.json(subjects);
    } else {
      const userSubjects = memorySubjects.filter((s) => s.userId === req.user._id || s.userId === 'mem_user_vignesh');
      return res.json(userSubjects);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching subjects' });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
export const createSubject = async (req, res) => {
  try {
    const { subjectName, color, totalTopics, completedTopics } = req.body;

    if (!subjectName) {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    if (isMongoConnected) {
      const subject = await Subject.create({
        userId: req.user._id,
        subjectName,
        color: color || '#2563EB',
        totalTopics: parseInt(totalTopics, 10) || 10,
        completedTopics: parseInt(completedTopics, 10) || 0,
      });
      return res.status(201).json(subject);
    } else {
      const newSubject = {
        _id: 'subj_' + Date.now(),
        userId: req.user._id,
        subjectName,
        color: color || '#2563EB',
        totalTopics: parseInt(totalTopics, 10) || 10,
        completedTopics: parseInt(completedTopics, 10) || 0,
        createdAt: new Date().toISOString(),
      };
      memorySubjects.unshift(newSubject);
      return res.status(201).json(newSubject);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating subject' });
  }
};

// @desc    Update an existing subject
// @route   PUT /api/subjects/:id
// @access  Private
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName, color, totalTopics, completedTopics } = req.body;

    if (isMongoConnected) {
      const subject = await Subject.findOne({ _id: id, userId: req.user._id });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      if (subjectName !== undefined) subject.subjectName = subjectName;
      if (color !== undefined) subject.color = color;
      if (totalTopics !== undefined) subject.totalTopics = parseInt(totalTopics, 10);
      if (completedTopics !== undefined) subject.completedTopics = parseInt(completedTopics, 10);

      const updated = await subject.save();
      return res.json(updated);
    } else {
      const index = memorySubjects.findIndex((s) => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      if (subjectName !== undefined) memorySubjects[index].subjectName = subjectName;
      if (color !== undefined) memorySubjects[index].color = color;
      if (totalTopics !== undefined) memorySubjects[index].totalTopics = parseInt(totalTopics, 10);
      if (completedTopics !== undefined) memorySubjects[index].completedTopics = parseInt(completedTopics, 10);

      return res.json(memorySubjects[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating subject' });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const subject = await Subject.findOneAndDelete({ _id: id, userId: req.user._id });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      return res.json({ message: 'Subject deleted successfully' });
    } else {
      const index = memorySubjects.findIndex((s) => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      memorySubjects.splice(index, 1);
      return res.json({ message: 'Subject deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting subject' });
  }
};
