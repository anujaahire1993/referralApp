import mongoose from 'mongoose'
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  referralCode: {
      type: String,
      unique: true
  },
  referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  referralStatus: {
      type: String, // 'pending', 'approved', 'rejected'
      default: 'pending'
  },
  points: {
      type: Number,
      default: 0
  },
  role: {
    type: String,
    enum: ['inverter', 'accepter', 'admin'],
    default: 'accepter'
}
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
  } catch (error) {
      return next(error);
  }
});

const users = mongoose.model('users', userSchema)

export default users
