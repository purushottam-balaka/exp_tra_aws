const sequelize=require('sequelize');
const db=require('../util/database');

const Order=db.define('order',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:true,
        primaryKey:true,
    },
    paymentid:sequelize.STRING,
    orderid:sequelize.STRING,
    status:sequelize.STRING,
});

module.exports=Order;