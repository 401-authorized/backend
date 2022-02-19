const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OauthTokenSchema = new Schema({
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: String,
});

module.exports = mongoose.model("oauth_token", OauthTokenSchema);
