const router = require("express").Router();
const IndulgeBaseException = require("../core/IndulgeBaseException");
const IndulgeResourceNotFoundException = require("../exceptions/IndulgeResourceNotFoundException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const { QueryBuilder } = require("../helpers/query-builder.class");
const INF = require("../models/inf.model");
const auth = require("../utils/auth");
const { sendMail } = require("../utils/mail");

// Example use case for QUeryBuilder class for using sort, limit, filter and paginate
router.get("/", auth.authenticate, async (req, res) => {
  try {
    if (req.role === "admin") {
      const queryBuilder = new QueryBuilder(INF.find(), req.query);
      const infs = await queryBuilder.execAll().query.populate("hrId");
      res.json(infs);
    } else {
      const infs = await INF.find({ hrId: req.user._id });
      res.json(infs);
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.post("/", auth.authenticate, async (req, res) => {
  try {
    let newInf = new INF(req.body);
    newInf.hrId=req.user._id;
    await newInf.save();
    await sendMail(template.INFSEND, {}, "kushakjafry@gmail.com");
    res.json(newInf);
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.put("/:id", auth.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await INF.findByIdAndUpdate(id, req.body);
    res.send({ success: true });
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.get("/:id", auth.authenticate, async (req, res) => {
  // auth.authenticate should be added
  try {
    const { id } = req.params;
    const inf = await INF.findById(id);
    const userId = req.user._id;

    if (inf && (req.role === "admin" || userId === inf.hrId)) {
      res.send({
        success: true,
        inf,
      });
    } else if (!inf){
      throw new IndulgeResourceNotFoundException({message: "INF Not Found"});
    }else{
      throw new IndulgeUnauthorisedException({message: "Unauthorised"});
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
