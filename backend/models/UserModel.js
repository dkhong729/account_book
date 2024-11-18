const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // 确保用户名唯一
  },
  gmail: {
    type: String,
    required: true,
    unique: true, // 确保Gmail唯一
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', UserSchema); // 确保集合名称统一
