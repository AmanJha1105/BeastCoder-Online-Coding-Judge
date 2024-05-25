import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const { quesID } = useParams();

  useEffect(() => {
    fetchSolutions();
  }, [quesID]);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ques/solutions/${quesID}`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
  };

  return (
    <div className="solutions-container">
      {!selectedSolution && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50">Name</th>
              <th className="px-6 py-3 bg-gray-50">Author</th>
              <th className="px-6 py-3 bg-gray-50">Language</th>
              <th className="px-6 py-3 bg-gray-50">Time of Publish</th>
              <th className="px-6 py-3 bg-gray-50">Likes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solutions.map((solution) => (
              <tr key={solution._id} onClick={() => handleSolutionClick(solution)} className="cursor-pointer">
                <td className="px-6 py-4">{solution.name}</td>
                <td className="px-6 py-4">{solution.userId.username}</td>
                <td className="px-6 py-4">{solution.language}</td>
                <td className="px-6 py-4">{new Date(solution.timeOfPublish).toLocaleString()}</td>
                <td className="px-6 py-4">{solution.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedSolution && (
        <div className="solution-details mt-4 p-4 w-full bg-gray-100 rounded">
          <button onClick={() => setSelectedSolution(null)}>Back to Solutions</button>
          <h3 className="text-lg font-semibold">{selectedSolution.name}</h3>
          <p><strong>Author:</strong> {selectedSolution.userId.username}</p>
          <p><strong>Language:</strong> {selectedSolution.language}</p>
          <p><strong>Topics:</strong> {selectedSolution.topics.join(', ')}</p>
          <p><strong>Time of Publish:</strong> {new Date(selectedSolution.timeOfPublish).toLocaleString()}</p>
          <p><strong>Likes:</strong> {selectedSolution.likes}</p>
          <h4 className="text-md font-semibold">Code:</h4>
          <pre className="bg-gray-100 p-4 rounded"><code>{selectedSolution.code}</code></pre>
          <h4 className="text-md font-semibold">Replies:</h4>
          {selectedSolution.replies.map((reply) => (
            <div key={reply._id} className="reply bg-white p-2 mb-2 rounded shadow">
              <p><strong>{reply.username}:</strong> {reply.content}</p>
              <p><small>{new Date(reply.createdAt).toLocaleString()}</small></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Solutions;
