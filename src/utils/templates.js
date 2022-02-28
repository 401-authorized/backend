const IndulgeResourceNotFoundException = require("../exceptions/IndulgeResourceNotFoundException");
const ejs = require("ejs");
const { join } = require("path");

class Template {
  constructor({ name, subject }, opts, to, from) {
    this.name = name;
    this.subject = subject;
    this.opts = opts;
    this.to = to;
    this.from = from;
  }
  async getTemplateString() {
    try {
      return await ejs.renderFile(
        join(__dirname, "..", "resources", "templates", this.name + ".ejs"),
        this.opts
      );
    } catch (err) {
      throw new IndulgeResourceNotFoundException(this.name + ".ejs");
    }
  }

  async createFullEmail() {
    const message = await this.getTemplateString();
    let str = [
      'Content-Type: text/html; charset="UTF-8"\n',
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ",
      this.to,
      "\n",
      "from: ",
      this.from,
      "\n",
      "subject: ",
      this.subject,
      "\n\n",
      message,
    ].join("");

    let encodedMail = new Buffer(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return encodedMail;
  }
}

const templates = {
  REGISTRATION: {
    name: "verifyEmail",
    subject: "Welcome to Indulge CDC Portal",
  },
  INFSEND: {
    name: "infSend",
    subject: "New INF created",
  },
};

module.exports = {
  templates,
  Template,
};
