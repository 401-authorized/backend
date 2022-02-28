const express = require("express");
const auth=require('../utils/auth');
const Admin=require('../models/admin.model');
const IndulgeBaseException=require('../core/IndulgeBaseException');
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const router=express.Router();

router.post('/login', async(req, res)=>{
    try{
        const {email, password}=req.body;
        const user=await Admin.findOne({email});
        if (!user){
            res.send({
                success:false
            })
            return;
        }
        const result=await auth.verifyHash(password, user.password);
        if (!result){
            res.send({
                success:true,
                token: auth.generateJWT(user)
            })
        }
        else{
            res.send({
                success:false
            })
        }
    }
    catch (err) {
        throw new IndulgeBaseException(err);
      }
})



router.post('/register',async(req,res)=>{
    try{
        const hash = await auth.hash(req.body.password);
        req.body.password = hash;
        const newAdmin = new Admin(req.body);
        await newAdmin.save();
        res.json(newAdmin);
    }catch(err){
        throw new IndulgeBaseException(err);
    }
})

router.put('/',auth.authenticate,async(req,res)=>{
    try{
        const id = req.user._id;
        await Admin.findByIdAndUpdate(id,{
            name: req.body.name,
            email: req.body.email,
        })
        res.send({
            success: true
        })
    }catch(err){
        throw new IndulgeBaseException(err);
    }
    res.send({
        success: false
    })
})



router.get('/:id',auth.authenticate,async(req,res)=>{
    try{
        const {id} = req.params;
        const admin = await Admin.findById(id);
        if(admin)
        {
            res.send({
                success:true,
                admin
            })
        }
        else
        {
            res.send({
                success: false
            })
        }
    }catch(err){
        throw new IndulgeBaseException(err);
    }
})


module.exports=router;
