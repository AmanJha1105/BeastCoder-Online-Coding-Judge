import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams ,useLocation} from 'react-router-dom';
import {toast} from 'react-hot-toast';

export default function PublishSolution() {
  const [name, setName] = useState('');
  const [code,setCode]= useState()
  const [topics, setTopics] = useState('');
  const [submission, setSubmission] = useState(null);
  const[lang,setLang]=useState();
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation()
  const{selectedSubmission}= location.state || {};
  console.log(selectedSubmission);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ques/singleSubmission/${selectedSubmission._id}`);
        setSubmission(response.data[0]);
        console.log(response.data);
        setCode(response.data[0].code);
        setLang(response.data[0].language);
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:5000/ques/publishSolution/${selectedSubmission.quesID}`, {
        userId: userId,
        submissionId: submission._id,
        name: name,
        code: code,
        language: lang,
        timeOfPublish: new Date(),
        topics: topics.split(',').map(topic => topic.trim()), // Split and trim topics
      });
      toast.success("Solution Published. Can view in solution section");
      navigate(`/question/${selectedSubmission.titleslug}`, { state: { showSolutions: true } });
      setName('');
      setLang('');
      setTopics('');
      setCode('');
    } catch (error) {
      console.error('Error publishing solution:', error);
    }
  };

  if (!submission) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Publish Solution</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title of Submission</label>
          <input
            type="text"
            value={name}
            placeholder='title'
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Topics</label>
          <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Comma-separated topics"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <textarea 
            value={code}
            onChange={(e)=>setCode(e.target.value)}
            rows="10"
            cols="50"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <input
           value={lang}
           onChange={(e)=>setLang(e.target.value)}
           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
           required
          />
            
          
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Post
        </button>
      </form>
    </div>
 );
}
