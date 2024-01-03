const express=require('express');

const route=express.Router();

const controller=require('../controller/expense');

const premium=require('../controller/premium');

const userAuthentication=require('../middleware/auth')

const forgot_password=require('../controller/forgot_password')

const services=require('../services/S3services');

const loginAndSignup=require('../controller/logInAndSignUp');

route.post('/signup',loginAndSignup.signup);

route.get('/',loginAndSignup.home);

route.post('/login',loginAndSignup.login);

route.post('/add_expense',userAuthentication.authenticate,controller.addExpense);

route.get('/get_expenses',userAuthentication.authenticate,controller.get_expenses);

route.get('/edit_expense/:id',userAuthentication.authenticate,controller.edit_expense)

route.put('/edit_expense/:id',userAuthentication.authenticate,controller.edit_expense);

route.delete('/delete_expense/:id',userAuthentication.authenticate,controller.delete_expense);

route.get('/purchase_premium',userAuthentication.authenticate,premium.purchage_premium);

route.post("/update_purchase",userAuthentication.authenticate,premium.update_purchase);

route.get('/leaderboard',premium.leader_board);

route.post('/forgot_password',forgot_password.forgot_password);

route.get('/reset_password/:id',forgot_password.resetPassword);

route.get('/update_password/:id',forgot_password.updatePassword);

route.get('/download',userAuthentication.authenticate,services.download_expenses);

module.exports=route;