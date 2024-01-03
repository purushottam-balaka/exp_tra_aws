const users=require('../model/users')
const forgetPasswords=require('../model/forget_passwords')
const bcrypt=require('bcrypt');
exports.forgot_password=async(req,res)=>{
    try{

        const mail=req.body.gmail;
        const user=await users.findOne({where:{gmail:mail}})
        if(user){

        const uuid=require('uuid').v4
        const uid=uuid()
        
        await forgetPasswords.create({
            id:uid,
            isActive:true,
            UserId:user.id,

        })

        const Sib=require('sib-api-v3-sdk')
        require('dotenv').config()
        const client=Sib.ApiClient.instance
        const apiKey=client.authentications['api-key']
        apiKey.apiKey=process.env.SEND_IN_BLUE_KEY

        const tranEmailApi=new Sib.TransactionalEmailsApi()

        const sender={
            email:'purushottam.balaka@gmail.com',
            name:'Purushottam'
        }
        const receivers=[
            {
                email:mail,
            },
        ]
        tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:'Forget password',
            textContent:'To change your password,use given link below',
            htmlContent:`
            <b>Reset password</b>
            <a href="http://3.111.170.41:9000/reset_password/${uid}">http://3.111.170.41:9000/reset_password/${uid}</a>
            `
        })
         res.json({success:true,message:'Reset link sent successfully'})
        // .then(console.log)
        
        // .catch(console.log)
    }else{
         res.json({success:false,message:'user does not existed'})
    }
}catch(err){
    console.log(err)
}
}


exports.resetPassword=async(req,res)=>{
    try{
        const id=req.params.id;
        const forgotUser=await forgetPasswords.findOne({where:{id:id}})
        // console.log(forgotUser)
        if(forgotUser){
            forgotUser.update({where:{isActive:false}})
            res.send(`
            <html>
                <body>
                    <h1>Enter your passowrd</h1>
                    <form action='/update_password/${id}' method='get'>
                    <input type='password' id='upd_pwd' name='upd_pwd' required></input>
                    <button>Reset password</button> 
                    </form>
                </body>
            </html>
            `);
            res.end()
        }
    }
    catch(err){
        console.log(err)
    }
}

exports.updatePassword=async(req,res)=>{
    try{
        const id=req.params.id;
        const newPassword=req.query.upd_pwd;
        console.log(id,newPassword)

        const user_id= await forgetPasswords.findOne({where:{id:id}})

        const user=await users.findOne({where:{id:user_id.UserId}})

        if(user){
            bcrypt.hash(newPassword,10,async(err,hash)=>{
                if(err){
                    res.json({err:err})
                }
                await user.update({password:hash})
                await user_id.update({isActive:false})
                res.status(200).json({success:true,Message:'Password updated successfully.'})
            })
        }
    }catch(err){
        console.log(err)
    }
    
}