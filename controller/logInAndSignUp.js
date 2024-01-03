const users=require('../model/users');
const expense_table=require('../model/expenses');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const db=require('../util/database');
const { json } = require('body-parser');
const { response } = require('express');

exports.home=(req,res)=>{
    res.sendFile(process.cwd()+'/views/login.html');
    // res.sendFile('/login.html');
}

exports.signup=async(req,res,next)=>{
    try{
        const name=req.body.name;
        const gmail=req.body.gmail;
        const password=req.body.password;

        if(name==="" || gmail==="" || password===""){
            return res.status(400).json({success:false,message:"please fill all the details of the form"});
        }
        const uniqueGmail=await users.findAll({where:{gmail:gmail}});
        if (uniqueGmail.length!==0){
            return res.status(500).json({success:false,message:"User already exist,Please enter different user id"});
        }
        const saltRounds=10;
        bcrypt.hash(password,saltRounds, async(err,EcyPass)=>{
            console.log(err);

            const data=await users.create({
                name:name,
                gmail:gmail,
                password:EcyPass,
            });
            
        })
        

       return res.status(200).json({success:true,message:'Signup successfull'});

    }catch(err){
        console.log(err);
       return res.json({success:false,message:'user already existed..'});
    }
}

exports.login=async(req,res)=>{
    try{
        //console.log(req.body)
        const gmail=req.body.gmail;
        const password=req.body.password;

        if(gmail.length==='' || password.length===''){
            return res.status(400).json({success:false,message:'Gmail or Password is missing'});
        }
        const uniqueGmail=await users.findAll({where:{gmail:gmail}});
        //console.log("Unique",uniqueGmail[0].gmail)
        if(uniqueGmail.length!==0){
            bcrypt.compare(password,uniqueGmail[0].password, (err,result)=>{
                if (err){
                    throw new error ('Something went wrong')
                }
                if (result === true){
                    const id=generateToken(uniqueGmail[0].id);
                    return res.status(200).json({success:true,message:'User logged in successfully',token:id});
                    
                }else{
                    return res.status(400).json({success:false,message:'Password is incorrect '});
                }
            })
        }else{
            return res.status(400).json({success:false,message:'User does not existed'})
        }

    }catch(err){
        console.log(err)
    }
}

function generateToken(id){
    return jwt.sign({UserId:id},'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
}

