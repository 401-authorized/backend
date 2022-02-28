const router = require("express").Router();
const { QueryBuilder } = require("../helpers/query-builder.class");
const JNF = require("../models/jnf.model");
const auth=require("../utils/auth")

router.get("/",auth.authenticate, async (req, res) => {
  try{
    if(req.role==="admin")
    {
    const queryBuilder = new QueryBuilder(JNF.find(), req.query);
    const infs = await queryBuilder.execAll().query.populate('hrId');
    res.json(infs);
    }
    else{
      const jnfs = await JNF.find({}); // should be changed to that particular user
      if(jnfs)
      {
        res.send({
          success : true,
          jnfs
        })
      }
      res.send({success:false})
    }
  }catch(err){
    res.status(500).send(err);
  }
});
router.post('/', auth.authenticate, async(req,res)=>{
  try{
    const newJnf = new JNF(req.body);
    await newJnf.save();
    res.json(newJnf);
  }catch(err){
    res.status(500).json(err);
  }
})
router.put('/:id',auth.authenticate,async(req,res)=>{
  try{
    const {id}=req.params;
    await JNF.findByIdAndUpdate(id, req.body);
    res.send({success:true});
  }catch(err){
    throw IndulgeBaseException(err);
  }
})

router.get('/:id', auth.authenticate, async(req, res)=>{ // auth.authenticate should be added
  try{
    const {id}=req.params;
    const jnf=await JNF.findById(id);
    if (jnf){
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
