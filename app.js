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
const helmet=require('helmet');
const morgan=require('morgan');
const compression=require('compression');
//const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
const port=process.env.PORT;
const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(route);

// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net",
//     "checkout.razorpay.com","ajax.googleapis.com","maxcdn.bootstrapcdn.com"],
//     scriptSrcAttr:["'self'", "'unsafe-inline'"],
//     frameSrc: ["'self'","api.razorpay.com"],
//     }
// }))
app.use(compression());
//app.use(morgan('combined',{stream:accessLogStream}));
app.use(express.static('views'));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

users.hasMany(expenses);
expenses.belongsTo(users);

orders.belongsTo(users);
users.hasMany(orders);

forgotPasswords.belongsTo(users);
users.hasMany(forgotPasswords);

db.sync();
app.listen(port);
