const express = require("express");
const auth = require("../utils/auth");
const Admin = require("../models/admin.model");
const IndulgeBaseException = require("../core/IndulgeBaseException");
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const IndulgeValidationException = require("../exceptions/IndulgeValidationException");
const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      throw new IndulgeUnauthorisedException({
        message: "Invalid email or password",
      });
    }
    const result = await auth.verifyHash(password, user.password);
    console.log(result);
    if (result) {
      res.send({
        success: true,
        token: auth.generateJWT(user),
        admin: user,
      });
    } else {
      throw new IndulgeUnauthorisedException({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.post("/register", async (req, res) => {
  try {
    const hash = await auth.hash(req.body.password);
    req.body.password = hash;
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    res.json(newAdmin);
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.put("/", auth.authenticate, async (req, res) => {
  try {
    const id = req.user._id;
    await Admin.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
    });
    res.send({
      success: true,
    });
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.get("/", auth.authenticate, async (req, res) => {
  try {
    const { id } = req.user;
    const admin = await Admin.findById(id);
    if (admin) {
      res.send({
        success: true,
        admin,
      });
    } else {
      throw new IndulgeUnauthorisedException({ message: "Unauthorised" });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
