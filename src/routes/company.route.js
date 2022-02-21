const express = require("express");
const auth=require('../utils/auth');
const HR=require('../models/hr.model');
const Company=require('../models/company.model');
const Invitation=require('../models/invitation.model');
const IndulgeBaseException=require('../core/IndulgeBaseException');
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const router=express.Router();

router.get('/', async(req, res)=>{
    try{
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
    }catch(err){
        throw new IndulgeBaseException(err);
    }
})
router.post('/', async(req, res)=>{
    const {name}=req.body;
    const newCompany=new Company({name});
    await newCompany.save();
    res.send(newCompany);
})
module.exports=router;