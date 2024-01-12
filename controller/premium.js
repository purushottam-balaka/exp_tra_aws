const Razorpay = require('razorpay');
const orders=require('../model/order');
const jwt=require('jsonwebtoken');
const Order = require('../model/order');
const users=require('../model/users')
const expense_table=require('../model/expenses')
const sequelize=require('../util/database');
const { RESERVED } = require('mysql2/lib/constants/client');



exports.purchage_premium=async (req,res,next)=>{
try{    
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
                
            key_secret:process.env.RAZORPAY_KEY_SECRET,
        })
        console.log('key_id',rzp.key_id)
        const amount=2500;
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            //console.log(order.id)
            req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id});
            }).catch(err =>{
                throw new Error(err);
            })
        })
    }catch(err){
        console.log(err)
    }
}

exports.update_purchase=async(req,res,next)=>{
    try{
        
        const {payment_id,order_id}=req.body;
        //console.log('payment id:',payment_id)
        if(payment_id===null){
            Order.findOne({where:{ orderid:order_id}}).then(order =>{
                order.update({paymentid:payment_id,status:'FAILED'}).then(() =>{
                    req.user.update({isPrimeUser:false}).then(()=>{
                        return res.status(202).json({success: false,message:'Transaction Failed'});
                    }).catch((err)=>{
                        throw new Error(err)
                    })
                }).catch((err)=>{
                    throw new Error(err)
                })
            }).catch((err)=>{
                throw new Error(err)
            })
        
        }
        else{
        Order.findOne({where:{orderid:order_id}}).then(order =>{
            order.update({paymentid:payment_id,status:'SUCCESSFUL'}).then(() =>{
                req.user.update({isPrimeUser:true}).then(()=>{
                    return res.status(202).json({isPrimeUser:true,success: true,message:'Transaction Successful'});

                }).catch((err)=>{
                    throw new Error(err)
                })
            }).catch((err)=>{
                throw new Error(err)
            })
        }).catch((err)=>{
            throw new Error(err)
        })
    }
    }catch(err){
        console.log(err)
    }


}

exports.leader_board=async(req,res)=>{
    try{
    const leaderBoard=await users.findAll({
        order:[['total_expense','DESC']]
    })
    //console.log(leaderBoard)
    return res.status(200).json({user:leaderBoard})
    }catch(err){
        console.log(err)
    }
}


