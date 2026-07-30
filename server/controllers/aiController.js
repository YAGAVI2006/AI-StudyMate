import Conversation from '../models/Conversation.js';
import { generateGeminiResponse } from '../services/geminiService.js';
import { isMongoConnected } from '../config/db.js';

// In-memory conversation fallback store
export const memoryConversations = [];

// @desc    Send a prompt to AI Study Assistant
// @route   POST /api/ai/chat
// @access  Private
export const sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message prompt cannot be empty' });
    }

    const userId = req.user._id;

    // Fetch conversation history for prompt context
    let history = [];
    if (isMongoConnected) {
      history = await Conversation.find({ userId }).sort({ createdAt: 1 }).limit(5);
    } else {
      history = memoryConversations.filter((c) => c.userId === userId);
    }

    // Call Gemini Service
    const aiResponse = await generateGeminiResponse(message, history);

    // Save to Conversation History
    let newEntry;
    if (isMongoConnected) {
      newEntry = await Conversation.create({
        userId,
        question: message,
        response: aiResponse,
      });
    } else {
      newEntry = {
        _id: 'conv_' + Date.now(),
        userId,
        question: message,
        response: aiResponse,
        createdAt: new Date().toISOString(),
      };
      memoryConversations.push(newEntry);
    }

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    res.status(500).json({ message: error.message || 'Server error processing AI chat' });
  }
};

// @desc    Get user conversation history
// @route   GET /api/ai/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    if (isMongoConnected) {
      const history = await Conversation.find({ userId }).sort({ createdAt: 1 });
      return res.json(history);
    } else {
      const history = memoryConversations.filter((c) => c.userId === userId || c.userId === 'mem_user_vignesh');
      return res.json(history);
    }
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ message: error.message || 'Error fetching chat history' });
  }
};

// @desc    Clear user conversation history
// @route   DELETE /api/ai/history
// @access  Private
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    if (isMongoConnected) {
      await Conversation.deleteMany({ userId });
    } else {
      for (let i = memoryConversations.length - 1; i >= 0; i--) {
        if (memoryConversations[i].userId === userId || memoryConversations[i].userId === 'mem_user_vignesh') {
          memoryConversations.splice(i, 1);
        }
      }
    }
    res.json({ message: 'Conversation history cleared successfully' });
  } catch (error) {
    console.error('Error in clearChatHistory:', error);
    res.status(500).json({ message: error.message || 'Error clearing chat history' });
  }
};
