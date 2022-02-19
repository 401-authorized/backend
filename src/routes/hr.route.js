const express = require("express");
const auth=require('../utils/auth');
const HR=require('../models/hr.model');
const Invitation=require('../models/invitation.model');
const IndulgeBaseException=require('../core/IndulgeBaseException');
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const router=express.Router();

router.post('/login', async(req, res)=>{
    const {email, password}=req.body;
    const user=await HR.findOne({email});
    try{
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

router.get('/register/:hash',async(req,res)=>{
    const {hash} = req.params;
    const curInvitation = await Invitation.findOne({token:hash});
    if(curInvitation){
        let {token} = curInvitation;
        let decoded;
        try {
            decoded = auth.verifyJWT(token);
        } catch (err) {
            res.send({
                success:false
            })
            return;
        }
    }else{
        res.send({
            success:false
        })
        return;
    }
    res.send({
        success: true,
        companyId: curInvitation.companyId
    })
    return ;
})

router.post('/register',async(req,res)=>{
    const hash = await auth.hash(req.body.password);
    req.body.password = hash;
    const newHr = new HR(req.body);
    await newHr.save();
    res.json(newHr);
})

module.exports=router;
