import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function QuestionDescription() {

    const {quesID}= useParams();
    console.log("this is param",quesID);

  useEffect(()=>{
     getQuestionDescription();
  },[])

  const getQuestionDescription=async()=>{
      const res= await axios.get(`http://localhost:5000/ques/question/${quesID}`,{
        withCredentials: true,
      })

      const data = await res.data;

      console.log("this is data",data);
      return data;
  }
  
  return (
    <div>Title of Question</div>
  )
}
