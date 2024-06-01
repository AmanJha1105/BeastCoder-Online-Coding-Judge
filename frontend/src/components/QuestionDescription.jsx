import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';
import Description from './Description';

export default function QuestionDescription() {

    const [ques,setques]=useState();
    const {quesID}= useParams();

  useEffect(()=>{
    getQuestionDescription().then((data)=>setques(data));
  },[quesID])

  const getQuestionDescription=async()=>{
      const res= await axios.get(`http://localhost:5000/ques/question/${quesID}`,{
        withCredentials: true,
      })

      const data = await res.data;
      setques(data);
      return data;
  }

  return (
    <>
    
      <div className="flex items-center px-4 mt-3">
          <img
            src="https://th.bing.com/th/id/OIP.q0vS1-Y6CkeeDknw8ahLDAHaHa?rs=1&pid=ImgDetMain"
            alt="page icon"
            height={15}
            width={15}
          />
          <Link className="px-2" to={`/question/${quesID}`}>
            Description
          </Link>
          <Link className="px-2" to={`/question/${quesID}/solutions`}>
            🧪Solutions
          </Link>
          <Link className="px-2" to={`/question/${quesID}/submissions`}>
            ▼ Submissions
          </Link>
          <Link className="px-2" to={`/question/${quesID}/discuss`}>
            🗨️ Discuss
          </Link>
        </div>
    
    <div className="mx-auto flex flex-col lg:flex-row">
      <div className="flex-1 p-4"><Description ques={ques}/></div>
      <div className="flex-1 p-4">
        <Code quesID={quesID} />
      </div>
    </div>
    </>
    
  )
}
