const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("invitation", invitationSchema);
