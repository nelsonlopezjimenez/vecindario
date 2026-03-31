import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vecindario');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};