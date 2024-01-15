
window.addEventListener('DOMContentLoaded',async()=>{
    try{
    const objURLParams=new URLSearchParams(window.location.search);
    const page=objURLParams.get('page') || 1;
    token=localStorage.getItem('token')
    const row=localStorage.getItem('no_rows');
    document.getElementById('no_of_expenses').value=row
    
    await axios.get(`http://13.232.211.122:9000/get_expenses?page=${page}&&rows=${row}`,{headers:{'Authorization':token}})
    .then(({data:{products,prime, ...pageData}})=>{
        
        showExpeneseOnScreen(products);
        showPagination(pageData);
        
        const primeUser=prime.isPrimeUser;
        if(primeUser===true){
                    upd_msg=document.getElementById('message')
                    upd_msg.innerHTML=upd_msg.innerHTML+'You are a Prime user    ';
                    const button=document.createElement('button');
                    button.id='leaderboard';
                    button.setAttribute('class',"btn btn-info");
                    button.textContent='Show Leader board'
                    upd_msg.appendChild(button);
                    button.onclick=async()=>{
                    try{
                        
                        const res=await axios.get('http://13.232.211.122:9000/leaderboard')
                        const h4=document.getElementById('h4');
                        h4.innerHTML='Leader board:';
                        for(let i=0;i<res.data.user.length;i++){
                        
                            showLeaderBoard(res.data.user[i]);
                        } 
                    }catch(err){
                        console.log(err)
                    }
                }
                document.getElementById('report-option').innerHTML=`<p>Reports:</p>
                            <select id='report_type'>
                                <option>Select report type</option>
                                <option value='Weekly'>Weekly report</option>
                                <option value='Monthly'>Monthly report</option>
                                <option value='Yearly'>Yearly report</option>
                            </select>`
            
        } else{
            const pre=document.getElementById('primium-button')
            const btn=document.createElement('button');
            btn.textContent='Buy Premium';
            btn.id='buy_premium';
            btn.setAttribute('class',"btn btn-info");
            pre.appendChild(btn);

            btn.onclick=async() =>{
            try{
            const token=localStorage.getItem('token');
            console.log('purchase script',token)
            const res=await axios.get('http://13.232.211.122:9000/purchase_premium',{headers: {'Authorization':token}})
            var options={
                "key":res.data.key_id,
                "order_id":res.data.order.id,
                "handler":async function(res){
                const d1= await axios.post('http://13.232.211.122:9000/update_purchase',{
                        order_id:options.order_id,
                        payment_id:res.razorpay_payment_id,
                    },{ headers:{"Authorization":token}})
                    alert('You are a Premium User now');
                    
                    if(d1.data.isPrimeUser===true){
                        upd_msg=document.getElementById('message')
                        upd_msg.innerHTML='You are a Prime user'
                    }
                }
            }
            const rzp1=new Razorpay(options);
            rzp1.open();
            //e.preventDefault();

            rzp1.on('payment.failed',async function(){
                try{
                    const key=res.data.order.id;
                    const response=await axios.post('http://13.232.211.122:9000/update_purchase',{
                        'order_id':key,
                        'payment_id': null,
                    },{ headers:{"Authorization":token}})
                    alert('Payment failed')
                    
                }catch(err){
                    console.log(err);
                }
            })
                

       

}catch(err){
    console.log(err)
}

}

        }
       
    })
}catch(err){
    console.log(err)
}
})
function showExpeneseOnScreen(exp){
    // console.log(exp)
    const a=document.getElementById('expenses')
    const parentEle=document.getElementById('list');
    parentEle.innerHTML='';
    for(let i=0;i<exp.length;i++){
    const chiledEle=document.createElement('li');
    chiledEle.setAttribute('class','list-group-item');
    chiledEle.textContent=exp[i].cost +' -  '+ exp[i].description +' - '+ exp[i].category+'  ';
    parentEle.appendChild(chiledEle);
    const delButton=document.createElement('input');
    const editButton=document.createElement('input');
    delButton.type='button';
    editButton.type='button';
    delButton.value='Delete';
    editButton.value='Edit'
    delButton.id=exp[i].id;
    editButton.id=exp[i].id;
    delButton.setAttribute('class','btn btn-danger');
    editButton.setAttribute('class','btn btn-info');
    chiledEle.appendChild(editButton);
    chiledEle.appendChild(delButton);
    editButton.onclick=async()=>{
        try{
            const token=localStorage.getItem('token');
            const user=await axios.get(`http://13.232.211.122:9000/edit_expense/${editButton.id}`,{headers:{'Authorization':token}})
            document.getElementById('cost').value=user.data.data.cost;
            document.getElementById('desc').value=user.data.data.description;
            document.getElementById('cate').value=user.data.data.category;
            await axios.delete(`http://13.232.211.122:9000/delete_expense/${editButton.id}`,{headers:{'Authorization':token}})    
            parentEle.removeChild(chiledEle)
        }catch(err){
        console.log(err)
        }
    }
    delButton.onclick=async()=>{
        try{               
        const token=localStorage.getItem('token')
        parentEle.removeChild(chiledEle)
        await axios.delete(`http://13.232.211.122:9000/delete_expense/${delButton.id}`,{headers:{'Authorization':token}})
         .then((resp)=>{
            window.location.reload();
         }).catch(err =>{
            console.log(err)
         })
        }catch(err){
            console.log(err)
        }
    }

    }
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}){ 
    const pagination=document.getElementById('pagination');
    pagination.innerHTML=''
    if(hasPreviousPage){
        const btn2=document.createElement('button');
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=>getProdcuts(previousPage));
        pagination.appendChild(btn2);
    }
    const btn1=document.createElement('button');
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=>getProdcuts(currentPage));
    pagination.appendChild(btn1);
    if(hasNextPage){
        const btn3=document.createElement('button');
        btn3.innerHTML=nextPage;
        btn3.addEventListener('click',()=>getProdcuts(nextPage));
        pagination.appendChild(btn3);
    }
}

async function getProdcuts(page){
    const token=localStorage.getItem('token')
    const row=localStorage.getItem('no_rows')
    await axios.get(`http://13.232.211.122:9000/get_expenses?page=${page}&&rows=${row}`,{headers:{Authorization:token}})
    .then(({data:{products, ...pageData}})=>{
        showExpeneseOnScreen(products);
        showPagination(pageData);
    })
}
    function showLeaderBoard(a){
            const parentEle=document.getElementById('lead')
            chiledEle=document.createElement('li');
            chiledEle.setAttribute('class','list-group-item');
            if (a.total_amount===null){
                a.total_amount=0
            }
            chiledEle.textContent=`Name: ${a.name},  Total expense:${a.total_expense}`
            parentEle.appendChild(chiledEle) 
        } 
    
    async function expense_save(e){
    try{
         
        const expenseDetails={
         cost:e.target.cost.value,
         description:e.target.desc.value,
         category:e.target.cate.value,
            }
        console.log(expenseDetails)
        const token=localStorage.getItem('token');
         await axios.post('http://13.232.211.122:9000/add_expense',expenseDetails,{headers: {'Authorization':token}})
         .then((res)=>{
            window.location.reload();
         }).catch((err)=>{
            console.log(err)
         })
    

        
    }catch(err){
        console.log(err);
    }
}
    async function downloadFile(e){
       axios.get('http://13.232.211.122:9000/download',{headers:{Authorization:token}})
       .then((resp)=>{
        if(resp.status===200){
            var a=document.createElement('a')
            a.href=resp.data.fileURL;
            a.download='myexpense.csv';
            a.click();
        }else{
            throw new Error(resp.data.message)
        }   
       })
    }
function no_of_rows(val){
    localStorage.setItem('no_rows',val)
    getProdcuts()
}


