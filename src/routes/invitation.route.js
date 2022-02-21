const express = require("express");
const Company = require("../models/company.model");
const jwt = require("jsonwebtoken");
const router=express.Router();
const Invitation=require('../models/invitation.model');

const generateJWT = (company) => {
    try {
      return jwt.sign(
        {
            name: company.name,
            id: company._id,
        },
        process.env.SECRET_KEY || "secret",
        { expiresIn: process.env.JWT_VALIDITY || "360s" }
      );
    }   catch (err) {
        throw new IndulgeBaseException(err);
    }
  };
router.post('/', async(req, res)=>{
    const {companyName} =req.body;
    let company=await Company.findOne({name:companyName});
    const token=generateJWT(company);
	const newInvitation= new Invitation({
		companyId: company._id,
		token
	})
	await newInvitation.save();
  console.log(newInvitation.token)
	// console.log(company);
	res.send({company});
})
module.exports=router;