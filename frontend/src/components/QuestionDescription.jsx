import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';
import Solutions from './Solutions';
import Description from './Description';
import Discussions from './Discussions';
import { FaRegPenToSquare } from "react-icons/fa6";

export default function QuestionDescription() {

    const [ques,setques]=useState(20);
    const[description,setDescription]=useState(true);
    const[discussions,setDiscussions]=useState(false);
    const[showSubmissions, setShowSubmissions]=useState(false);
    const [submissions,setSubmissions]=useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const[showSolutions,setShowSolutions]=useState(false);
    const navigate = useNavigate();
    const {quesID}= useParams();

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
    setSelectedSubmission(null);
    setShowSolutions(false);
    setDiscussions(false);
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
      setDiscussions(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    //setShowSubmissions(!showSubmissions);
  }

const handleRowClick = (submission) => {
  setSelectedSubmission(submission);
  setShowSubmissions(false);
  setDiscussions(false);
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
  setSelectedSubmission(null);
  setDiscussions(false);
}

  const handleClickonDiscussions =()=>{
    setDiscussions(true);
    setShowSubmissions(false);
    setDescription(false);
    setSelectedSubmission(null);
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
        {selectedSubmission.verdict === "AC" && <button onClick={() => handlePublishSolution(selectedSubmission._id)} className="bg-green-500 text-white font-medium py-2 px-4 flex items-center cursor-pointer border rounded-lg"><FaRegPenToSquare className="mr-2"/>Solution</button>}
      </div>
      )}
      <div className="flex-1 p-4">
        <Code quesID={quesID} />
      </div>
    </div>
    </>
    
  )
}
