const mongoose = require("mongoose");
const UserSchema = require("./user.schema");
const Schema = mongoose.Schema;

const hrSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required:true,
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
hrSchema.add(UserSchema);

module.exports = mongoose.model("Hr", hrSchema);
