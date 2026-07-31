import User from '../models/User.js';
import Subject from '../models/Subject.js';
import StudySession from '../models/StudySession.js';
import Goal from '../models/Goal.js';
import Conversation from '../models/Conversation.js';

export const configureDatabaseIndexes = async () => {
  try {
    // Single and compound index configurations for query optimization
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Subject.collection.createIndex({ userId: 1, createdAt: -1 });
    await StudySession.collection.createIndex({ userId: 1, date: -1 });
    await Goal.collection.createIndex({ userId: 1, targetDate: 1 });
    await Conversation.collection.createIndex({ userId: 1, createdAt: 1 });
    console.log('Database indexes configured successfully.');
  } catch (error) {
    console.warn('Database index configuration warning:', error.message);
  }
};
