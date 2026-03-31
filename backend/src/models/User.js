import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username:           { type: String, required: true, unique: true, trim: true },
  email:              { type: String, required: true, unique: true, lowercase: true },
  neighborhood:       { type: String, required: true },
  city:               { type: String, required: true },
  // Image passphrase
  passphraseImageIds: [{ type: Number }],   // unordered set — shown at login
  passphraseHash:     { type: String, required: true }, // bcrypt of ordered JSON array
  // Gamification
  points:  { type: Number, default: 0 },
  badges:  [{ type: String }],
  role:    { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);