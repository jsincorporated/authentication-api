const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String},
  last_name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  user_role: {type: String, enum: ['ADMIN', 'MEMBER', 'TECHNICIAN']},
  designation: {type: String, default: null},
  company: {type: String, default: null},
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);