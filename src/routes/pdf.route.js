const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const IndulgeResourceNotFoundException = require("../exceptions/IndulgeResourceNotFoundException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const INF = require("../models/inf.model");
const JNF = require("../models/jnf.model");
const express = require("express");
const router = express.Router();
const { authenticate } = require("../utils/auth");
const { PdfTemplate } = require("../utils/pdfTemplates");
const Grad = require("../models/graduationYear.model");
const { generatePdf } = require("../utils/pdfGenerator");

router.get("/inf/:id", authenticate, async (req, res) => {
  try {
    const inf = await INF.findById(req.params.id).populate('companyId').populate('hrId');
    if (!inf) {
      throw new IndulgeResourceNotFoundException("INF");
    }
    if (req.role === "hr") {
      if (!(inf.hrId.equals(req.user.id)))
        throw new IndulgeUnauthorisedException({
          message: "You are not the HR of this INF",
        });
    }
    let result = await Grad.find({});
    result = result[0];
    const pdfTemplate = new PdfTemplate("inf", { inf, result });
    const infPage = await pdfTemplate.getPdfTemplate();
    const pdf = await generatePdf(infPage);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  } catch (err) {
    console.log(err);
    const E = IndulgeExceptionHandler(err);
    res.status(E.code).json(E);
  }
});

router.get("/jnf/:id", authenticate, async (req, res) => {
  try {
    const jnf = await JNF.findById(req.params.id).populate('companyId').populate('hrId');
    if (!jnf) {
      throw new IndulgeResourceNotFoundException("JNF");
    }
    if (req.role === "hr") {
      if (!(jnf.hrId.equals(req.user.id)))
        throw new IndulgeUnauthorisedException({
          message: "You are not the HR of this JNF",
        });
    }
    let result = await Grad.find({});
    result = result[0];
    const pdfTemplate = new PdfTemplate("jnf", { jnf, result });
    const jnfPage = await pdfTemplate.getPdfTemplate();
    const pdf = await generatePdf(jnfPage);
    res.writeHead(200, [["Content-Type", "application/pdf"]]);
    res.end(new Buffer(pdf, "base64"));
  } catch (err) {
    console.log(err);
    const E = IndulgeExceptionHandler(err);
    res.status(E.code).json(E);
  }
});

module.exports = router;
