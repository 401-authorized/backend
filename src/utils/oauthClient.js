const { google } = require("googleapis");
const oauthModel = require("../models/oauth.model");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

async function oauthClientValidate() {
  try {
    const tokens = await oauthModel.find({});
    oauth2Client.setCredentials(tokens[0]);
    await oauth2Client.getRequestHeaders();
    return oauth2Client;
  } catch (err) {
    console.log("HI", err);
    throw err;
  }
}

module.exports = {
  oauthClientValidate,
};
