const router = require("express").Router();
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const { QueryBuilder } = require("../helpers/query-builder.class");
const JNF = require("../models/jnf.model");
const auth = require("../utils/auth");

router.get("/", auth.authenticate, async (req, res) => {
  try {
    if (req.role === "admin") {
      const queryBuilder = new QueryBuilder(JNF.find(), req.query);
      const jnfs = await queryBuilder.execAll().query.populate("hrId");
      res.json(jnfs);
    } else {
      const jnfs = await JNF.find({hrId: req.user._id});
      res.json(jnfs);
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});
router.post("/", auth.authenticate, async (req, res) => {
  try {
    let newJnf = new JNF(req.body);
    newJnf.hrId=req.user._id;
    newJnf.companyId=req.user.companyId;
    await newJnf.save();
    res.json(newJnf);
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});
router.put("/:id", auth.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const jnf=await JNF.findById(id);
    if (userId.equals(jnf.hrId)){
      await JNF.findByIdAndUpdate(id, req.body);
      res.send({ success: true });
    }else{
      throw new IndulgeUnauthorisedException({message: "Unauthorised"});
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
    } else if (!jnf){
      throw new IndulgeResourceNotFoundException({message: "JNF Not Found"});
    }else{
      throw new IndulgeUnauthorisedException({message: "Unauthorised"});
    }
  } catch (err) {
    const e = IndulgeExceptionHandler(err);
    res.status(e.code).json(e);
  }
});

module.exports = router;
