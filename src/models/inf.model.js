const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const infSchema = new Schema({
  nameOfCompany: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    // required: true,
  },
  hrId: {
    type: Schema.Types.ObjectId,
    ref: "Hr",
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  placeOfPosting: {
    type: String,
    required: true,
  },
  btechStudents: {
    type: [String],
    required: true,
  },
  fiveYrsStudents: {
    type: [String],
    required: true,
  },
  skillBasedStudents: {
    type: [String],
    required: true,
  },
  mscStudents: {
    type: [String],
    required: true,
  },
  msctechStudents: {
    type: [String],
    required: true,
  },
  mtechStudents: {
    type: [String],
    required: true,
  },
  mbaStudents: {
    type: [String],
    required: true,
  },
  shortlistFromResumes: {
    type: Boolean,
    required: true,
  },
  eligibilityCriteria: {
    type: String,
    required: true,
  },
  typeOfTest: {
    type: String,
    required: true,
  },
  otherRounds: {
    type: [String],
    required: true,
  },
  totalRounds: {
    type: Number,
    required: true,
  },
  numberOfOffers: {
    type: Number,
    required: true,
  },
  stipend: {
    type: String,
    required: true,
  },
  provisionForPPO: {
    type: Boolean,
    required: true,
  },
  ctcDetails: {
    type: String,
    required: true,
  },
  documents: [String]
});

module.exports = mongoose.model("INF", infSchema);
