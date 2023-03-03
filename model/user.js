const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  user_role: {type: String },
  designation: {type: String },
  company: {type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);