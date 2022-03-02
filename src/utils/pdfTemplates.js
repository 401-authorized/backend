const IndulgeResourceNotFoundException = require("../exceptions/IndulgeResourceNotFoundException");
const ejs = require("ejs");
const { join } = require("path");
class PdfTemplate {
  constructor(type, opts) {
    this.type = type;
    this.opts = opts;
  }

  async getPdfTemplate() {
    try {
      return await ejs.renderFile(
        join(__dirname, "..", "resources", "pdf", this.type + ".ejs"),
        this.opts
      );
    } catch (err) {
      console.log(err);
      throw new IndulgeResourceNotFoundException(this.type + ".ejs");
    }
  }
}

module.exports = {
  PdfTemplate,
};
