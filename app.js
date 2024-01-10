const express=require('express');
const cors=require('cors');
const fs=require('fs');
const bodyParser=require('body-parser');
const db=require('./util/database');
const users=require('./model/users');
const expenses=require('./model/expenses');
const route=require('./routes/routes');
const controller=require('./controller/expense');
const orders=require('./model/order');
const path=require('path')
const forgotPasswords=require('./model/forget_passwords')
require('dotenv').config();
//const helmet=require('helmet');
const morgan=require('morgan');
const compression=require('compression');
//const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
const port=process.env.PORT;
const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(route);

app.use(compression());
//app.use(morgan('combined',{stream:accessLogStream}));
app.use(express.static('views'));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://13.127.65.42:9000'); // Replace with your domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE,PUT, OPTIONS',);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


users.hasMany(expenses);
expenses.belongsTo(users);

orders.belongsTo(users);
users.hasMany(orders);

forgotPasswords.belongsTo(users);
users.hasMany(forgotPasswords);

db.sync();
app.listen(port);
