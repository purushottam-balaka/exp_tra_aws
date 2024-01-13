
function login(){
    window.location.href='./login.html';
}
    async function signup_save(event){
    try{
        
        event.preventDefault();
        const signUpDetails={
            name:event.target.name.value,
            gmail:event.target.gmail.value,
            password:event.target.pwd.value
        }
        console.log('signup_details',signUpDetails)

        const res=await axios.post("http://3.111.245.66:9000/signup",signUpDetails);
        
        if(res.status==200){
            window.location.href="./login.html";
            console.log('res',res)
        }
        else{   
            throw new error ('Failed to login');
           }
    }catch(err){
            console.log(err)
        }

    
}
