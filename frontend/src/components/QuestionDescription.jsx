import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';

export default function QuestionDescription() {

    const [ques,setques]=useState([]);
    const[description,setDescription]=useState(true);
    const[showSubmissions, setShowSubmissions]=useState(false);
    const [submissions,setSubmissions]=useState([]);
    const [likes, setLikes] = useState(ques.likes);
    const [dislikes, setDislikes] = useState(ques.dislikes);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    console.log(likes);

    const {quesID}= useParams();

  useEffect(()=>{
    setLiked(false);
    setDisliked(false);
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

  const handleClickonDescription = ()=>{
    setDescription(true);
    setShowSubmissions(false);
  }

  const handleClickonSubmissions = async()=>{
    //setDescription(!description);
    try {
      const userId = localStorage.getItem('userId');
      
      console.log(userId);
      const response = await axios.get(`http://localhost:5000/ques/submissions/${quesID}`,{
        params: {
            userId: userId
        }});
      //console.log(response.data);
      setSubmissions(response.data);
      setShowSubmissions(true);
      setDescription(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    //setShowSubmissions(!showSubmissions);
  }

  const handleLike = async () => {
    try {
        const response = await axios.post(`http://localhost:5000/ques/like/${quesID}`);
        setLikes(response.data.likes);
        setLiked(true);
        if (disliked) {
            setDisliked(false);
        }
    } catch (error) {
        console.error('Error liking the question:', error);
    }
};

const handleDislike = async () => {
    try {
        const response = await axios.post(`http://localhost:5000/ques/dislike/${quesID}`);
        setDislikes(response.data.dislikes);
        setDisliked(true);
        if (liked) {
            setLiked(false);
        }
    } catch (error) {
        console.error('Error disliking the question:', error);
    }
};
  
  return (
    <>
      <div className='flex items-center px-4'><img src="https://th.bing.com/th/id/OIP.q0vS1-Y6CkeeDknw8ahLDAHaHa?rs=1&pid=ImgDetMain" alt="page icon" height={15} width={15} onClick={handleClickonDescription}/>
        <button className='px-2'onClick={handleClickonDescription}>Description</button>
        <button className='px-2'onClick={handleClickonSubmissions}>▼ Submissions</button>
      </div>
    
    <div className="mx-auto flex flex-col lg:flex-row">
      {description && <div className="flex-1 p-4">
        <div><strong>{ques.title}</strong></div>
        <div>{ques.content}</div>
        <div>{ques.level}</div>
        <div>
              <button onClick={handleLike} style={{ color: liked ? 'blue' : 'black' }}>
              👍 {likes} {liked && <span>&#x2665;</span>}
              </button>
              <button onClick={handleDislike} style={{ color: disliked ? 'red' : 'black' }}>
              👎 {disliked && <span>&#x1F44E;</span>}
              </button>
          </div>
      </div>}
      {showSubmissions && <div className="flex-1 p-4">
      <div>
        {submissions.length>0 && submissions.map(submission => (
          <div key={submission.id}>
            <h4>{submission.verdict}</h4>
            <h4>{submission.language}</h4>
            <h4>{submission.executionTime.toFixed(2)}</h4>
            <h4>{submission.memoryUsed.toFixed(2)}</h4>
            <h4>{submission.submittedAt}</h4>
          </div>
        ))}
        {showSubmissions && submissions.length===0 && 
          <div>No Submissions yet.</div>
        }
    </div>
      </div>}
      <div className="flex-1 p-4">
        <Code quesID={quesID} />
      </div>
    </div>
    </>
    
  )
}
