const router = require("express").Router();
const Grad=require("../models/graduationYear.model");
const IndulgeBaseException = require("../core/IndulgeBaseException");

router.put('/', async(req, res)=>{
    try{
        await Grad.findOneAndUpdate(req.body);
        res.send({success:true});
    }catch(err){
        throw new IndulgeBaseException(err);
    }

})
router.get('/', async(req, res)=>{
    try{
        const result=Grad.findOne({});
        res.send(result);
    }catch(err){
        throw new IndulgeBaseException(err);
    }
})

module.exports=router;