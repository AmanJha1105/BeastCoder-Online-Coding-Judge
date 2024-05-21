import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';

export default function QuestionDescription() {

    const [ques,setques]=useState([]);

    const {quesID}= useParams();

  useEffect(()=>{
     getQuestionDescription().then((data)=>setques(data));
  },[])

  const getQuestionDescription=async()=>{
      const res= await axios.get(`http://localhost:5000/ques/question/${quesID}`,{
        withCredentials: true,
      })

      const data = await res.data;
      return data;
  }
  
  return (
    <div>
        {ques.title};
         {quesID}
        <Code quesID={quesID}/>
    </div>
  )
}
