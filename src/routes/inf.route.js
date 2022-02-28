const router = require("express").Router();
const IndulgeBaseException = require("../core/IndulgeBaseException");
const { QueryBuilder } = require("../helpers/query-builder.class");
const INF = require("../models/inf.model");
const auth=require('../utils/auth');


// Example use case for QUeryBuilder class for using sort, limit, filter and paginate
router.get("/", auth.authenticate, async (req, res) => { // auth.authenticate should be added
  try{
    if(req.role==="admin")
    {
    const queryBuilder = new QueryBuilder(INF.find(), req.query);
    const infs = await queryBuilder.execAll().query.populate('hrId');
    res.json(infs);
    }
    else{
      const infs = await INF.find({}); // should be changed to that particular user
      if(infs)
      {
        res.send({
          success : true,
          infs
        })
      }
      res.send({success:false})
    }
  }catch(err){
    res.status(500).send(err);
  }
});

router.post('/',auth.authenticate,async(req,res)=>{
  try{
    const newInf=new INF(req.body);
    await newInf.save();
    res.json(newInf);
  }catch(err){
    throw IndulgeBaseException(err);
  }
})

router.put('/:id',auth.authenticate,async(req,res)=>{
  try{
    const {id}=req.params;
    await INF.findByIdAndUpdate(id, req.body);
    res.send({success:true});
  }catch(err){
    throw IndulgeBaseException(err);
  }
})

router.get('/:id', auth.authenticate, async(req, res)=>{ // auth.authenticate should be added
  try{
    const {id}=req.params;
    const inf=await INF.findById(id);
    if (inf){
      res.send({
        success:true,
        inf
      })
    }else{
      res.send({success:false});
    }
  }catch(err){
    res.status(500).send({success:false});
  }
})

module.exports = router;
