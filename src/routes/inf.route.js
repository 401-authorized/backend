const router = require("express").Router();
const { QueryBuilder } = require("../helpers/query-builder.class");
const InfModel = require("../models/inf.model");

// Example use case for QUeryBuilder class for using sort, limit, filter and paginate
router.get("/", async (req, res) => {
  try{
    const queryBuilder = new QueryBuilder(InfModel.find(), req.query);
    const infs = await queryBuilder.execAll().query.populate('hrId');
    res.json(infs);
  }catch(err){
    res.status(500).send(err);
  }
});

router.post('/',async(req,res)=>{
  try{
    const newInf = new InfModel(req.body);
    await newInf.save();
    res.json(newInf);
  }catch(err){
    res.status(500).json(err);
  }
})

module.exports = router;
