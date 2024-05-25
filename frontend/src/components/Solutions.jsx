import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css'
import SolutionCard from './SolutionCard';
const Solutions = ({quesID}) => {
  const [solutions, setSolutions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, [quesID]);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ques/solutions/${quesID}`);
      setSolutions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
  };

  return (
    <div className="p-4 w-full">
      {!selectedSolution && (
        <div className="space-y-4">
          {solutions.map((solution) => (
            <div
              key={solution._id}
              onClick={() => handleSolutionClick(solution)}
              className="p-4 bg-white shadow-md rounded cursor-pointer hover:shadow-lg"
            >
              <div className="flex pr-10 mb-2">
                <div className="text-sm text-gray-500 w-12">{solution.username +"   "}</div>
                <div className="text-sm text-gray-500">{new Date(solution.timeOfPublish).toLocaleDateString()}</div>
              </div>
              <div className="font-bold text-lg mb-2">{solution.name}</div>
              <div className="flex text-sm text-gray-700">
                <span className="mr-4">{solution.language}</span>
                <span>{solution.topics.join(', ')}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{solution.content}</div>
            </div>
          ))}
        </div>
      )}
        {selectedSolution && (<button onClick={() => setSelectedSolution(null)} className="mb-4 text-blue-500 hover:underline">
            All Solutions
        </button>)}
      {selectedSolution && <SolutionCard selectedSolution={selectedSolution}/>}
    </div>
  );
};

export default Solutions;
