const router = require("express").Router();
const Grad = require("../models/graduationYear.model");
const IndulgeBaseException = require("../core/IndulgeBaseException");
const auth=require("../utils/auth");

router.put("/", auth.authenticate, auth.verifyAdmin, async (req, res) => {
  try {
    let one=await Grad.find({});
    one=one[0];
    const id=one._id;
    await Grad.findByIdAndUpdate(id, req.body);
    res.send({ success: true });
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});
router.get("/", auth.authenticate, auth.verifyAdmin, async (req, res) => {
  try {
    const result = Grad.findOne({});
    res.send(result);
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
