const express = require("express");
const auth=require('../utils/auth');
const HR=require('../models/hr.model');
const Company=require('../models/company.model');
const Invitation=require('../models/invitation.model');
const IndulgeBaseException=require('../core/IndulgeBaseException');
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const router=express.Router();

router.get('/', auth.authenticate, async(req, res)=>{
    try{
        if (req.role==="admin"){
            const {quer}=req.query;
            if (!quer){
                const companies=await Company.find({});
                res.send(companies);
                return;
            }
            const opt=new RegExp(`^${quer}`);
            const companies=await Company.find(
                { "name": { $regex: opt, $options: 'i'} }
            );
            res.send(companies);
        }else{
            res.status(401).send({success:false});
        }
    }catch(err){
        throw new IndulgeBaseException(err);
    }
})

router.get('/index',auth.authenticate,async(req,res)=>{
    if(req.role==="admin")
    {
        try{
            const companies = await Company.find({});
            res.send({
                success: true,
                companies
            })
        }catch(err){
            throw new IndulgeBaseException(err);
        }
    }
    res.send({
        success: false
    })
})

router.put('/:id',auth.authenticate,async(req,res)=>{
    if(req.role==="admin")
    {
        try{
            const {id} = req.params;
            await Company.findByIdAndUpdate(id,{name: req.body.name});
            res.send({
                success: true
            })
        }catch(err){
            throw new IndulgeBaseException(err);
        }
    }
    res.send({
        success: false
    })
})

router.post('/', async(req, res)=>{
    try{
        const {name}=req.body;
        const newCompany=new Company({name});
        await newCompany.save();
        res.send(newCompany);
    }catch(err){
        throw new IndulgeBaseException(err);
    }
})
module.exports=router;