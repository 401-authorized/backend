const router = require("express").Router();
const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const IndulgeResourceNotFoundException = require("../exceptions/IndulgeResourceNotFoundException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const { QueryBuilder } = require("../helpers/query-builder.class");
const INF = require("../models/inf.model");
const auth = require("../utils/auth");
const { templates } = require("../utils/templates");
const { sendMail } = require("../utils/mail");

// Example use case for QUeryBuilder class for using sort, limit, filter and paginate
router.get("/", auth.authenticate, async (req, res) => {
  try {
    if (req.role === "admin") {
      const queryBuilder = new QueryBuilder(INF.find(), req.query);
      const infs = await queryBuilder.execAll().query;
      const count = await new QueryBuilder(INF.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .query.countDocuments();
      res.json({ count, infs });
    } else {
      const queryBuilder = new QueryBuilder(
        INF.find({ hrId: req.user._id }),
        req.query
      );
      const infs = await queryBuilder.execAll().query;
      const count = await new QueryBuilder(
        INF.find({ hrId: req.user._id }),
        req.query
      )
        .filter()
        .limitFields()
        .sort()
        .query.countDocuments();
      res.json({ count, infs });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.post("/", auth.authenticate, async (req, res) => {
  try {
    let newInf = new INF(req.body);
    newInf.hrId = req.user._id;
    console.log(req.user);
    newInf.companyId = req.user.companyId;
    await newInf.save();
    // console.log(template);
    const url = `${process.env.BASE_URL}${newInf._id}`;
    await sendMail(
      templates.INFSEND,
      { hrName: `${req.user.name}`, infUrl: url },
      "tanwirahmad2912@gmail.com"
    );
    res.json(newInf);
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.put("/:id", auth.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const inf = await INF.findById(id);
    const userId = req.user._id;
    if (userId.equals(inf.hrId)) {
      await INF.findByIdAndUpdate(id, req.body);
      const url = `https://localhost:8080/api/v1/inf/${inf._id}`;
      await sendMail(
        templates.INFUPDATE,
        { hrName: `${req.user.name}`, infUrl: url },
        "tanwirahmad2912@gmail.com"
      );
      res.send({ success: true });
    } else {
      throw new IndulgeUnauthorisedException({ message: "Unauthorised" });
    }
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
    if (inf && (req.role === "admin" || userId.equals(inf.hrId))) {
      res.send({
        success: true,
        inf,
      });
    } else if (!inf) {
      throw new IndulgeResourceNotFoundException({ message: "INF Not Found" });
    } else {
      throw new IndulgeUnauthorisedException({ message: "Unauthorised" });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
