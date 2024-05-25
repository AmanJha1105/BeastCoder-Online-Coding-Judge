import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';
import Solutions from './Solutions';

export default function QuestionDescription() {

    const [ques,setques]=useState([]);
    const[description,setDescription]=useState(true);
    const[showSubmissions, setShowSubmissions]=useState(false);
    const [submissions,setSubmissions]=useState([]);
    const [likes, setLikes] = useState(ques.likes);
    const [dislikes, setDislikes] = useState(ques.dislikes);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const[showSolutions,setShowSolutions]=useState(false);
    const navigate = useNavigate();
    //console.log(likes);

    const {quesID}= useParams();

  useEffect(()=>{
    setLiked(false);
    setDisliked(false);
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
    setSelectedSubmission(null);
    setShowSolutions(false);
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
      setSelectedSubmission(null);
      setShowSolutions(false);
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

const handleRowClick = (submission) => {
  setSelectedSubmission(submission);
  setShowSubmissions(false);
  console.log(submission);
};

const handlePublishSolution = () => {
  navigate(`/pubhlishSolution/${selectedSubmission._id}`,{
    state:{
      selectedSubmission,
    }
  });
};

const handleClickonSolutions =()=>{
  setShowSolutions(true);
  setShowSubmissions(false);
  setDescription(false);
}

  
  return (
    <>
    
      <div className='flex items-center px-4'><img src="https://th.bing.com/th/id/OIP.q0vS1-Y6CkeeDknw8ahLDAHaHa?rs=1&pid=ImgDetMain" alt="page icon" height={15} width={15} onClick={handleClickonDescription}/>
        <button className='px-2'onClick={handleClickonDescription}>Description</button>
        <button className='px-2'onClick={handleClickonSolutions}>🧪Solutions</button>
        <button className='px-2'onClick={handleClickonSubmissions}>▼ Submissions</button>
      </div>
    
    <div className="mx-auto flex flex-col lg:flex-row">
      {showSolutions && <div className="flex-1 p-4"><Solutions quesID={ques._id}/></div>}
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
       <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50">Verdict</th>
            <th className="px-6 py-3 bg-gray-50">Date</th>
            <th className="px-6 py-3 bg-gray-50">Language</th>
            <th className="px-6 py-3 bg-gray-50">Execution Time (ms)</th>
            <th className="px-6 py-3 bg-gray-50">Memory Used (MB)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission) => (
            <tr key={submission._id} onClick={() => handleRowClick(submission)} className="cursor-pointer">
              <td className={`px-6 py-4 ${submission.verdict === "AC" ? "text-green-500" : "text-red-500"}`}>
                {submission.verdict === "AC" ? "Accepted" : "Wrong Answer"}</td>
              <td className="px-6 py-4">{new Date(submission.submittedAt).toLocaleString()}</td>
              <td className="px-6 py-4">{submission.language}</td>
              <td className="px-6 py-4">⏱{submission.executionTime.toFixed(1)}</td>
              <td className="px-6 py-4">🖥️{submission.memoryUsed.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>}

      {selectedSubmission!=null && (
        <div className="mt-4 p-4 w-1/2 bg-gray-100 rounded">
        <h2 className={`text-lg font-semibold mb-2 ${selectedSubmission.verdict === "AC" ? "text-green-500" : "text-red-500"}`}>
          {selectedSubmission.verdict === "AC" ? "Accepted" : "Wrong Answer"}
        </h2>
        {selectedSubmission.verdict !== "AC" && selectedSubmission.testCases.length > 0 && (
          <div>
            <h3>Failed Test Case</h3>
            {selectedSubmission.testCases.map((testCase, index) => {
              if (testCase.result !== "AC") {
                return (
                  <div key={index}>
                    <div><p>Input </p> <p><strong>{testCase.input}</strong></p></div>
                    <div><p>Output</p> <p><strong>{testCase.yourOutput}</strong></p></div>
                    <div><p>Expected</p> <p><strong>{testCase.ExpectedOutput}</strong></p></div>
                  </div>
                );
              }
              return null;
            }).find(testCase => testCase !== null)}
            
          </div>
      )}
        <h3 className="text-lg font-semibold mb-2">Code</h3>
        {selectedSubmission.verdict === "AC" && <div className="mb-4 flex justify-between">
          <div className="flex-1 mr-2">
            <div className="font-bold">⏱Runtime</div>
            <div>{selectedSubmission.executionTime.toFixed(1)} ms</div>
          </div>
          <div className="flex-1 ml-2">
            <div className="font-bold">🖥️ Memory</div>
            <div>{selectedSubmission.memoryUsed.toFixed(0)} MB</div>
          </div>
        </div>}

        <pre className="bg-gray-100 p-4 rounded">
          {selectedSubmission.code}
        </pre>
        <div><button onClick={() => handlePublishSolution(selectedSubmission._id)}>Publish</button></div>
      </div>
      )}
      <div className="flex-1 p-4">
        <Code quesID={quesID} />
      </div>
    </div>
    </>
    
  )
}
