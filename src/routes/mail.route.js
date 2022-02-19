const router = require("express").Router();
const { google } = require("googleapis");
const oauthModel = require("../models/oauth.model");
const { sendMail } = require("../utils/mail");
const { templates } = require("../utils/templates");
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

router.get("/", async (req, res) => {
  try {
    console.log("email checking");
    await sendMail(
      templates.REGISTRATION,
      { verify_url: "https://google.com" },
      "kushakjafry1@gmail.com"
    );
    res.status(200).json("email send");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
