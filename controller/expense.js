const users=require('../model/users');
const expense_table=require('../model/expenses');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const db=require('../util/database');
const { json } = require('body-parser');
const { response } = require('express');

exports.addExpense=async(req,res)=>{
    const t=await db.transaction();
    try{
        const cost=req.body.cost;
        const description=req.body.description;
        const category=req.body.category;

        await expense_table.create({
            cost:cost,
            description:description,
            category:category,
            UserId:req.user.id,
        },
        {transaction:t})
        const ur=await users.findOne({where:{id:req.user.id}})
        const old_total=ur.total_expense
        const new_total=Number(old_total)+Number(cost)
        //console.log(new_total)
        users.update({total_expense:new_total,transaction:t},{where:{id:req.user.id}})
        await t.commit();
    }catch(err){
        await t.rollback();
        return res.status(500).json({err:err});
    }
}



exports.get_expenses=async(req,res,next)=>{
    try{
    
    const ITEMS_PER_PAGE=+req.query.rows
    console.log(req.query.rows)
    const page= +req.query.page || 1;
    let totalItems;
    const user=await users.findOne({where:{id:req.user.id}})
    expense_table.count( {where:{UserId:req.user.id}})
    .then((total)=>{
        totalItems=total;
        return expense_table.findAll({
            offset: (page-1)*ITEMS_PER_PAGE,
            limit:ITEMS_PER_PAGE,
            where:{UserId:req.user.id},
        })
         
    })
    .then((item)=>{
        res.json({ 
            products:item,
            prime:user,
            currentPage:page,
            hasNextPage:page*ITEMS_PER_PAGE<totalItems,
            nextPage:page + 1,
            hasPreviousPage:page>1,
            previousPage:page - 1,
            lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE),
 
        })
    })
    }catch(err){
        console.log(err);
    }
}

exports.delete_expense=async(req,res,next)=>{
    try{
    const del_id=req.params.id;
    //console.log('del Id',del_id)
    const del_exp=await expense_table.findOne({where:{id:del_id}})
    const data=await expense_table.destroy({where:{id:del_id, UserId:req.user.id}})

    const ur=await users.findOne({where:{id:req.user.id}})
    const old_total=ur.total_expense
    
    const new_total=Number(old_total)-Number(del_exp.cost)
    //console.log(new_total)
    req.user.update({total_expense:new_total})

    }catch(err){
        console.log(err);
    }
}

exports.edit_expense=async(req,res)=>{
    try{
        const edit_id=req.params.id;
        const data=await expense_table.findOne({where:{id:edit_id}})
        return res.status(200).json({data});
    }catch(err){
        console.log(err)
    }

}


