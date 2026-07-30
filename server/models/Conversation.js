import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    response: {
      type: String,
      required: [true, 'Response is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
