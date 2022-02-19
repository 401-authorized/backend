const router = require("express").Router();
const { google } = require("googleapis");
const oauthModel = require("../models/oauth.model");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);
const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

// create oauth route
router.get("/", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log(url);
  res.redirect(url);
});

router.get("/gmail", async (req, res) => {
  const { code, scope } = req.query;
  // login google
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // delete and single databaase entry
    await oauthModel.deleteMany({});
    // save new entry
    await oauthModel.create({
      ...tokens,
    });
    return res.json(tokens);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
