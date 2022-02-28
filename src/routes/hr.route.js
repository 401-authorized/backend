const express = require("express");
const auth = require("../utils/auth");
const HR = require("../models/hr.model");
const Invitation = require("../models/invitation.model");
const IndulgeBaseException = require("../core/IndulgeBaseException");
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await HR.findOne({ email });
    if (!user) {
      res.send({
        success: false,
      });
      return;
    }
    const result = await auth.verifyHash(password, user.password);
    if (!result) {
      res.send({
        success: true,
        token: auth.generateJWT(user),
      });
    } else {
      res.send({
        success: false,
      });
    }
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
});

router.get("/register/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const curInvitation = await Invitation.findOne({ token: hash });
    if (curInvitation) {
      let { token } = curInvitation;
      let decoded;
      try {
        decoded = auth.verifyJWT(token);
      } catch (err) {
        res.send({
          success: false,
        });
        return;
      }
    } else {
      res.send({
        success: false,
      });
      return;
    }
    res.send({
      success: true,
      companyId: curInvitation.companyId,
    });
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const hash = await auth.hash(req.body.password);
    req.body.password = hash;
    const newHr = new HR(req.body);
    await newHr.save();
    res.json(newHr);
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
});

router.put("/", auth.authenticate, async (req, res) => {
  try {
    const id = req.user._id;
    await HR.findByIdAndUpdate(id, {
      name: req.body.name,
      designation: req.body.designation,
      contact: req.body.contact,
    });
    res.send({
      success: true,
    });
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
  res.send({
    success: false,
  });
});

router.get("/index", auth.authenticate, auth.verifyAdmin, async (req, res) => {
  try {
    const hrs = await HR.find({});
    res.send({
      success: true,
      hrs,
    });
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
  res.send({
    success: false,
  });
});

router.get("/:id", auth.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const hr = await HR.findById(id);
    if (hr) {
      res.send({
        success: true,
        hr,
      });
    } else {
      res.send({
        success: false,
      });
    }
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
});

module.exports = router;
