import mongoose from 'mongoose';

export let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_studymate',
      {
        serverSelectionTimeoutMS: 2500, // Quick timeout if local mongodb daemon is not running
      }
    );
    isMongoConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(
      `MongoDB Connection Warning: ${error.message}. Running with memory fallback mode.`
    );
  }
};

export default connectDB;
