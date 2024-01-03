const sequelize=require('sequelize');

const db=require('../util/database');

const forgot=db.define('ForgotPasswordsRequests',{
    id:{
        type:sequelize.UUID,
        primaryKey:true,
    },
    isActive:sequelize.BOOLEAN,
})

module.exports=forgot;