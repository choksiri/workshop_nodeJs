const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  password : String,
  is_admin: { type: Boolean, default: false },
  is_approve: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);