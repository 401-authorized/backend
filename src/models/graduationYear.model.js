const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gradSchema = new Schema({
  placement: Number,
  intern: Number,
});

const graduationYear = mongoose.model("graduationYear", gradSchema);
module.exports = graduationYear;
