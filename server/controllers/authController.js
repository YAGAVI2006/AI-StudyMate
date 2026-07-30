import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { isMongoConnected } from '../config/db.js';
import bcrypt from 'bcryptjs';

// In-Memory Fallback User Store when local MongoDB is not running
export const memoryUsers = [
  {
    _id: 'mem_user_vignesh',
    name: 'Vignesh',
    email: 'vignesh@example.com',
    password: '$2a$10$w09Z4z9sK7qXw3yZgN3O8u6C7U7A1b2c3d4e5f6g7h8i9j0k1l2m', // hashed 'password123'
    course: 'Computer Science & Engineering',
    year: '3rd Year',
    subjects: ['Java', 'DSA', 'SQL'],
    studyGoals: 'Master Java Concurrency, DSA Graph Algorithms & SQL Query Optimization',
    studyTime: 165,
    lastLogin: new Date().toISOString(),
    todaysGoal: {
      text: 'Solve 5 LeetCode DSA problems & review SQL indexes',
      completed: false,
      targetMinutes: 120,
    },
    recentTopics: [
      'Java Streams & Multithreading',
      'DSA Binary Search Trees & Graphs',
      'SQL Joins, Indexing & Aggregations',
    ],
    recentActivity: [
      {
        id: 'act_1',
        title: 'Completed DSA Binary Search Tree Quiz',
        category: 'Quiz',
        timestamp: '10 minutes ago',
        duration: '15 mins',
      },
      {
        id: 'act_2',
        title: 'Summarized SQL Indexing & Joins Lecture Notes',
        category: 'Notes',
        timestamp: '2 hours ago',
        duration: '30 mins',
      },
      {
        id: 'act_3',
        title: 'Studied Java Concurrency & Multithreading',
        category: 'Study Session',
        timestamp: 'Yesterday',
        duration: '45 mins',
      },
    ],
    progress: {
      Java: 85,
      DSA: 70,
      SQL: 90,
    },
  },
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, course, year, subjects, studyGoals } = req.body;

    if (!name || !email || !password || !course || !year) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, email, password, course, and year',
      });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    let processedSubjects = ['Java', 'DSA', 'SQL'];
    if (Array.isArray(subjects) && subjects.length > 0) {
      processedSubjects = subjects.map((s) => s.trim()).filter(Boolean);
    } else if (typeof subjects === 'string' && subjects.trim()) {
      processedSubjects = subjects.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const cleanEmail = email.toLowerCase();

    if (isMongoConnected) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        course,
        year,
        subjects: processedSubjects,
        studyGoals: studyGoals || 'Master core subjects',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        subjects: user.subjects,
        studyGoals: user.studyGoals,
        studyTime: user.studyTime || 165,
        lastLogin: user.lastLogin,
        token: generateToken(user._id),
      });
    } else {
      // Memory Store Fallback
      const userExists = memoryUsers.find((u) => u.email === cleanEmail);
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newId = 'mem_user_' + Date.now();

      const newUser = {
        _id: newId,
        name,
        email: cleanEmail,
        password: hashedPassword,
        course,
        year,
        subjects: processedSubjects,
        studyGoals: studyGoals || 'Master core subjects',
        studyTime: 165,
        lastLogin: new Date().toISOString(),
        todaysGoal: {
          text: 'Solve 5 LeetCode DSA problems & review SQL indexes',
          completed: false,
          targetMinutes: 120,
        },
        recentTopics: [
          'Java Streams & Multithreading',
          'DSA Binary Search Trees & Graphs',
          'SQL Joins, Indexing & Aggregations',
        ],
        recentActivity: [
          {
            id: 'act_1',
            title: 'Registered Student Profile',
            category: 'Account',
            timestamp: 'Just now',
            duration: '0 mins',
          },
        ],
        progress: {
          Java: 85,
          DSA: 70,
          SQL: 90,
        },
      };

      memoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        course: newUser.course,
        year: newUser.year,
        subjects: newUser.subjects,
        studyGoals: newUser.studyGoals,
        studyTime: newUser.studyTime,
        lastLogin: newUser.lastLogin,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });

      if (user && (await user.matchPassword(password))) {
        user.lastLogin = new Date();
        await user.save();

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          course: user.course,
          year: user.year,
          subjects: user.subjects,
          studyGoals: user.studyGoals,
          studyTime: user.studyTime || 165,
          lastLogin: user.lastLogin,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // Memory Store Fallback
      const user = memoryUsers.find((u) => u.email === cleanEmail);
      let match = false;
      if (user) {
        match = await bcrypt.compare(password, user.password);
      }

      if (user && match) {
        user.lastLogin = new Date().toISOString();

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          course: user.course,
          year: user.year,
          subjects: user.subjects,
          studyGoals: user.studyGoals,
          studyTime: user.studyTime,
          lastLogin: user.lastLogin,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (isMongoConnected) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) {
        return res.json(user);
      }
    } else {
      const user = memoryUsers.find((u) => u._id === req.user._id);
      if (user) {
        const { password, ...cleanUser } = user;
        return res.json(cleanUser);
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    if (isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = req.body.name || user.name;
        user.course = req.body.course || user.course;
        user.year = req.body.year || user.year;
        user.studyGoals = req.body.studyGoals !== undefined ? req.body.studyGoals : user.studyGoals;

        if (req.body.subjects !== undefined) {
          if (Array.isArray(req.body.subjects)) {
            user.subjects = req.body.subjects.map((s) => s.trim()).filter(Boolean);
          } else if (typeof req.body.subjects === 'string') {
            user.subjects = req.body.subjects.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }

        if (req.body.password) {
          user.password = req.body.password;
        }

        const updatedUser = await user.save();
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          course: updatedUser.course,
          year: updatedUser.year,
          subjects: updatedUser.subjects,
          studyGoals: updatedUser.studyGoals,
          studyTime: updatedUser.studyTime,
          token: generateToken(updatedUser._id),
        });
      }
    } else {
      const user = memoryUsers.find((u) => u._id === req.user._id);
      if (user) {
        user.name = req.body.name || user.name;
        user.course = req.body.course || user.course;
        user.year = req.body.year || user.year;
        user.studyGoals = req.body.studyGoals !== undefined ? req.body.studyGoals : user.studyGoals;

        if (req.body.subjects !== undefined) {
          if (Array.isArray(req.body.subjects)) {
            user.subjects = req.body.subjects.map((s) => s.trim()).filter(Boolean);
          } else if (typeof req.body.subjects === 'string') {
            user.subjects = req.body.subjects.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }

        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(req.body.password, salt);
        }

        const { password, ...cleanUser } = user;
        return res.json({
          ...cleanUser,
          token: generateToken(user._id),
        });
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};
