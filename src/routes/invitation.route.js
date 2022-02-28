const express = require("express");
const Company = require("../models/company.model");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Invitation = require("../models/invitation.model");
const auth =require("../utils/auth");

const generateJWT = (company) => {
  try {
    return jwt.sign(
      {
        name: company.name,
        id: company._id,
      },
      process.env.SECRET_KEY || "secret",
      { expiresIn: process.env.JWT_VALIDITY || "360s" }
    );
  } catch (err) {
    const e=new IndulgeExceptionHandler(err);
    res.status(e.code).send(err);
  }
};

router.post("/", auth.authenticate,auth.verifyAdmin, async (req, res) => {
  try {
    const { companyName } = req.body;
    const company = await Company.findOne({ name: companyName });
    const token = generateJWT(company);
    const newInvitation = new Invitation({
      companyId: company._id,
      token,
    });
    await newInvitation.save();
    res.send({ company });
  } catch (err) {
    const e=new IndulgeExceptionHandler(err);
    res.status(e.code).send(err);
  }
});
module.exports = router;
