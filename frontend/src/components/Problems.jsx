import React, { useEffect, useState } from 'react'
import axios from 'axios';
axios.defaults.withCredentials=true;
let firstRender=true;

const Problems = () => {


  const [user,setuser]=useState();

  const refreshToken =async()=>{
    const res= await axios.get("http://localhost:8000/refresh",{
      withCredentials:true,
    }).catch(err=>console.log(err));
    const data= await res.data;
    return data;
  }

  const sendRequest= async()=>{
    const res= await axios.get('http://localhost:8000/user',{
      withCredentials:true,
    }).catch(err=>console.log(err));
    const data= await res.data;
    return data;
  }

  useEffect(()=>{
    if(firstRender){
      firstRender=false;
      sendRequest().then((data)=>setuser(data.user))
    }
    let interval =setInterval(()=>{
      refreshToken().then(data=>setuser(data.user))
    },1000*29)

    return ()=>clearInterval(interval);
   
  },[])

  return (
    <div>{user && <h1>{user.name}</h1>}</div>
  )
};


export default Problems;
