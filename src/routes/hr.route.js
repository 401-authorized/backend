const express = require("express");
const router = express.router();

const JNF = require('../models/jnf.model');

router.get('/login' ,(req,res)=>{
res.send('login');
})

router.post('/login',(req,res)=>{
    res.send('logged in');
})

router.get('/register',(req,res)=>{
    res.send('sign up form');
})

router.post('/register',(req,res)=>{
    res.send('registered');
})

router.get('/dashboard',async (req,res)=>{
const {id} = req.params;
const jnfs = await JNF.findById(id);


})

