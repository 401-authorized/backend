const express = require("express");
const auth = require("../utils/auth");
const HR = require("../models/hr.model");
const Invitation = require("../models/invitation.model");
const IndulgeBaseException = require("../core/IndulgeBaseException");
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const IndulgeValidationException = require("../exceptions/IndulgeValidationException");
const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await HR.findOne({ email });
    if (!user) {
      throw new IndulgeValidationException({
        message: "Invalid email or password",
      });
    }
    const result = await auth.verifyHash(password, user.password);
    if (result) {
      res.send({
        success: true,
        token: auth.generateJWT(user),
        user: user,
      });
    } else {
      throw new IndulgeValidationException({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.get("/register/:hash", auth.verifyInvitation, async (req, res) => {
  try {
    const { hash } = req.params;
    const curInvitation = await Invitation.findOne({ token: hash });
    res.send({
      success: true,
      companyId: curInvitation.companyId,
      hash,
    });
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.post("/register", auth.verifyInvitation, async (req, res) => {
  try {
    const { hash } = req.body;
    const curInvitation = await Invitation.findOne({ token: hash });
    const passwordHash = await auth.hash(req.body.password);
    req.body.password = passwordHash;
    let newHr = new HR(req.body);
    newHr.companyId = curInvitation.companyId;
    await newHr.save();
    await Invitation.findByIdAndDelete(curInvitation._id);
    res.json(newHr);
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.put("/", auth.authenticate, async (req, res) => {
  try {
    const id = req.user._id;
    if(req.body.password)
    {
    const passwordHash = await auth.hash(req.body.password);
    req.body.password = passwordHash;
    }
    await HR.findByIdAndUpdate(id, req.body);
    res.send({
      success: true,
    });
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.get("/index", auth.authenticate, auth.verifyAdmin, async (req, res) => {
  try {
    const hrs = await HR.find({});
    res.send({
      success: true,
      hrs,
    });
  } catch (err) {
    console.log(err);
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.get("/", auth.authenticate, async (req, res) => {
  try {
    const id = req.user._id;
    const hr = await HR.findById(id).populate('companyId');
    if (hr) {
      res.send({
        success: true,
        hr,
      });
    } else {
      throw IndulgeUnauthorisedException({ message: "User Not Found" });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
