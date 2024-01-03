const Sequelize=require('sequelize');

const db=require('../util/database');

const expense_table=db.define('Expenses',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    cost:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports=expense_table;