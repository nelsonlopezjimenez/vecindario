import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  body:     { type: String, required: true },
  category: {
    type: String,
    enum: ['safety', 'events', 'marketplace', 'services', 'lost_found', 'announcements', 'general'],
    default: 'general',
  },
  author:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  neighborhood: { type: String, required: true },
  city:         { type: String, required: true },
  upvotes:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pinned:       { type: Boolean, default: false },
  resolved:     { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date },
});

export default mongoose.model('Post', postSchema);