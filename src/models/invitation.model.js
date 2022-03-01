const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
    required: true
  },
  token: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required : true
  }
});

module.exports = mongoose.model("invitation", invitationSchema);
