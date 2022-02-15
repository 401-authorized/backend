const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  emailcodeToken: {
    type: String,
    required: false,
  },
};

module.exports = UserSchema;
