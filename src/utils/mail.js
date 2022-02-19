const { google } = require("googleapis");
const oauthModel = require("../models/oauth.model");
const ejs = require("ejs");
const path = require("path");
const { oauthClientValidate } = require("../utils/oauthClient");
const { Template, templates } = require("./templates");
const IndulgeBaseException = require("../core/indulgeBaseException");

async function sendMail(
  templateData,
  opts,
  to,
  from = "testindulge6@gmail.com"
) {
  try {
    const oauth2Client = await oauthClientValidate();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const template = new Template(templateData, opts, to, from);
    const raw = await template.createFullEmail();
    gmail.users.messages.send(
      {
        auth: oauth2Client,
        userId: "me",
        resource: {
          raw: raw,
        },
      },
      (err, response) => {
        if (err) {
          console.log(err);
          throw err;
        }
      }
    );
  } catch (err) {
    throw err;
  }
}

module.exports = {
  sendMail,
};
