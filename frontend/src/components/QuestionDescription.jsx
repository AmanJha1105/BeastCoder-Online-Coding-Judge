import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';
import Solutions from './Solutions';
import Description from './Description';
import Discussions from './Discussions';
import Submissions from './Submissions';

export default function QuestionDescription() {

    const [ques,setques]=useState(20);
    const[description,setDescription]=useState(true);
    const[discussions,setDiscussions]=useState(false);
    const[showSubmissions, setShowSubmissions]=useState(false);
    const[showSolutions,setShowSolutions]=useState(false);
    const {quesID}= useParams();

    const location = useLocation();
    const { showSolutions: showSolutionsProp } = location.state || {};

  useEffect(()=>{
    getQuestionDescription().then((data)=>setques(data));
  },[])

  const getQuestionDescription=async()=>{
      const res= await axios.get(`http://localhost:5000/ques/question/${quesID}`,{
        withCredentials: true,
      })

      const data = await res.data;
      setques(data);
      return data;
  }

  const handleClickonDescription = ()=>{
    setDescription(true);
    setShowSubmissions(false);
    setShowSolutions(false);
    setDiscussions(false);
  }

  const handleClickonSubmissions = async()=>{
    setShowSubmissions(true);
    setDescription(false);
    setShowSolutions(false);
    setDiscussions(false);
  }

const handleClickonSolutions =()=>{
  setShowSolutions(true);
  setShowSubmissions(false);
  setDescription(false);
  setDiscussions(false);
}

  const handleClickonDiscussions =()=>{
    setDiscussions(true);
    setShowSubmissions(false);
    setDescription(false);
    setShowSolutions(false);
  }

  
  return (
    <>
    
      <div className='flex items-center px-4'><img src="https://th.bing.com/th/id/OIP.q0vS1-Y6CkeeDknw8ahLDAHaHa?rs=1&pid=ImgDetMain" alt="page icon" height={15} width={15} onClick={handleClickonDescription}/>
        <button className='px-2'onClick={handleClickonDescription}>Description</button>
        <button className='px-2'onClick={handleClickonSolutions}>🧪Solutions</button>
        <button className='px-2'onClick={handleClickonSubmissions}>▼ Submissions</button>
        <button className='px-2'onClick={handleClickonDiscussions}>🗨️ Discuss</button>
      </div>
    
    <div className="mx-auto flex flex-col lg:flex-row">
      {showSolutions && <div className="flex-1 p-4"><Solutions quesID={ques._id}/></div>}
      {description && <div className="flex-1 p-4"><Description ques={ques}/></div>}
      {discussions && <div className="flex-1 p-4"><Discussions ques={ques}/></div>}
      {showSubmissions && <div className="flex-1 p-4"><Submissions ques={ques}/></div>}
      <div className="flex-1 p-4">
        <Code quesID={quesID} />
      </div>
    </div>
    </>
    
  )
}
