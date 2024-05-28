import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log("userid",userId);
        const response = await axios.get('http://localhost:5000/ques/allsubmissions',{
            params: {
                userId: userId
            }},{ withCredentials: true });
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions', error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">All My Submissions</h1>
      {submissions.length>0 && <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
           <th className="py-2 px-4 border-b text-left">Submitted At</th>
            <th className="py-2 px-4 border-b text-left">Question</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Runtime</th>
            <th className="py-2 px-4 border-b text-left">Language</th>
          </tr>
        </thead>
        <tbody>
          { submissions.map((submission) => (
            <tr key={submission._id} className="hover:bg-gray-100 ">
              <td className="py-2 px-4 border-b">{new Date(submission.submittedAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/question/${submission.titleslug}`} className="text-blue-600 hover:underline">
                  {submission.title}
                </Link>
              </td>
              <td className={`py-2 px-4 border-b ${submission.verdict === 'AC' ? 'text-green-600' : 'text-red-600'}`}>
              <Link to={`/submissions/${submission._id}`}>{submission.verdict === 'AC' ? 'Accepted' : 'Wrong Answer'}</Link>
              </td>
              <td className="py-2 px-4 border-b">{submission.executionTime.toFixed(1)+"ms"}</td>
              <td className="py-2 px-4 border-b">{submission.language}</td>
            </tr>
          ))}
        </tbody>
      </table>}
      {submissions.length===0 && <div>No Submissions Yet</div>}
    </div>
  );
  
};

export default AllSubmissions;
