const mongoose = require("mongoose");
const UserSchema = require("./user.schema");
const Schema = mongoose.Schema;

const AdminSchema = new Schema();
AdminSchema.add(UserSchema);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
