import React, { useEffect ,useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import SubmissionCard from './SubmissionCard';

const Submissions = ({ques}) => {

    const [submissions,setSubmissions]=useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const quesID = ques.titleslug;

    useEffect(()=>{
        getSubmissions();
    },[ques]);

    const getSubmissions = async()=>{
        //setDescription(!description);
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.get(`http://localhost:5000/ques/submissions/${quesID}`,{
            params: {
                userId: userId
            }});
            setSubmissions(response.data);
        } catch (error) {
          console.error('Error fetching submissions:', error);
        }
        //setShowSubmissions(!showSubmissions);
      }

      const handleRowClick = (submission) => {
        setSelectedSubmission(submission);

      };

  return (
    <>
    {!selectedSubmission && submissions.length>0 && <div className="flex-1 p-4">
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

       {selectedSubmission!== null && <SubmissionCard selectedSubmission ={selectedSubmission}/>}
       <div className="flex h-1/3 pl-8">
  {/* Left half */}
  <div className="w-1/2 flex items-center justify-center ml-8">
    {submissions.length === 0 && (
      <div className="text-center">
        <div>🔥 Join BeastCoder to Code!</div>
        <div>View your Submission records here</div>
        <div className='pl-10'><Link to="/login">
          <button className="bg-green-500 text-white font-medium py-2 px-4 mt-4 flex items-center cursor-pointer border rounded-lg">
            Register or Login
          </button>
        </Link></div>
      </div>
    )}
  </div>
</div>
    </>
  )
}

export default Submissions