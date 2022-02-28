const express = require("express");
const Company = require("../models/company.model");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Invitation = require("../models/invitation.model");
const auth = require("../utils/auth");
const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const IndulgeInternalServerException = require("../exceptions/IndulgeInternalServerException");

const generateJWT = (company) => {
  try {
    return jwt.sign(
      {
        name: company.name,
        id: company._id,
      },
      process.env.SECRET_KEY || "secret",
      { expiresIn: process.env.JWT_VALIDITY || "10d" }
    );
  } catch (err) {
    throw new IndulgeInternalServerException({
      message: "Invitation link not generated",
    });
  }
};

router.post("/", auth.authenticate, auth.verifyAdmin, async (req, res) => {
  try {
    const { companyName } = req.body;
    const company = await Company.findOne({ name: companyName });
    const token = generateJWT(company);
    const newInvitation = new Invitation({
      companyId: company._id,
      token,
    });
    await newInvitation.save();
    res.send({ company, token });
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});
module.exports = router;
