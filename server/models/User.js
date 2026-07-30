import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true,
    },
    subjects: {
      type: [String],
      default: ['Java', 'DSA', 'SQL'],
    },
    studyGoals: {
      type: String,
      default: 'Complete 2 hours of DSA problem solving and review SQL Joins.',
      trim: true,
    },
    // Phase 2 Fields
    studyTime: {
      type: Number,
      default: 165, // in minutes (2h 45m)
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    todaysGoal: {
      text: { type: String, default: 'Solve 5 LeetCode DSA problems & review SQL indexes' },
      completed: { type: Boolean, default: false },
      targetMinutes: { type: Number, default: 120 },
    },
    recentTopics: {
      type: [String],
      default: [
        'Java Streams & Multithreading',
        'DSA Binary Search Trees & Graphs',
        'SQL Joins, Indexing & Aggregations',
      ],
    },
    recentActivity: [
      {
        id: String,
        title: String,
        category: String,
        timestamp: String,
        duration: String,
      },
    ],
    progress: {
      type: Map,
      of: Number,
      default: {
        Java: 85,
        DSA: 70,
        SQL: 90,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
