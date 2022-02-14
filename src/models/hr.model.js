const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hrSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  contact: {
    countryCode: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
  },
  designation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Hr", hrSchema);
