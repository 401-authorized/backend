const router = require("express").Router();
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const { QueryBuilder } = require("../helpers/query-builder.class");
const JNF = require("../models/jnf.model");
const auth = require("../utils/auth");
const { templates } = require("../utils/templates");
const { sendMail } = require("../utils/mail");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./public");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fieldSize: 1024 * 1024 * 20,
  },
});

router.get("/", auth.authenticate, async (req, res) => {
  try {
    if (req.role === "admin") {
      const queryBuilder = new QueryBuilder(JNF.find(), req.query);
      const jnfs = await queryBuilder.execAll().query;
      const count = await new QueryBuilder(JNF.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .query.countDocuments();
      res.json({ jnfs, count });
    } else {
      const queryBuilder = new QueryBuilder(
        JNF.find({ hrId: req.user._id }),
        req.query
      );
      const jnfs = await queryBuilder.execAll().query;
      const count = await new QueryBuilder(
        JNF.find({ hrId: req.user._id }),
        req.query
      )
        .filter()
        .limitFields()
        .sort()
        .query.countDocuments();
      res.json({ jnfs, count });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

router.post(
  "/",
  auth.authenticate,
  upload.array("documents", 5),
  async (req, res) => {
    try {
      let newJnf = new JNF(req.body);
      newJnf.hrId = req.user._id;
      newJnf.companyId = req.user.companyId;
      let documents = [];
      for (let x of req.files) {
        const fileName = x.filename;
        const file = `${process.env.FILE_URL}/${fileName}`;
        documents.push(file);
      }
      newJnf.documents = documents;
      await newJnf.save();
      const url = `${process.env.BASE_URL}jnf/${newJnf._id}`;
      await sendMail(
        templates.JNFSEND,
        { hrName: `${req.user.name}`, jnfUrl: url },
        "tanwirahmad2912@gmail.com"
      );
      res.json(newJnf);
    } catch (err) {
      const e = IndulgeExceptionHandler(err);
      res.status(e.code).json(e);
    }
  }
);
router.put("/:id", auth.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const jnf = await JNF.findById(id);
    if (userId.equals(jnf.hrId)) {
      await JNF.findByIdAndUpdate(id, req.body);
      const url = `${process.env.BASE_URL}jnf/${jnf._id}`;
      await sendMail(
        templates.JNFUPDATE,
        { hrName: `${req.user.name}`, jnfUrl: url },
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
  try {
    const { id } = req.params;
    const jnf = await JNF.findById(id);
    const userId = req.user._id;

    if (jnf && (req.role === "admin" || userId.equals(jnf.hrId))) {
      res.send({
        success: true,
        jnf,
      });
    } else if (!jnf) {
      throw new IndulgeResourceNotFoundException({ message: "JNF Not Found" });
    } else {
      throw new IndulgeUnauthorisedException({ message: "Unauthorised" });
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
