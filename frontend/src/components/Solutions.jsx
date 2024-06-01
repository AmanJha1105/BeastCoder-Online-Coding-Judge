import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import SolutionCard from "./SolutionCard";
import { Link, useParams } from "react-router-dom";
import Code from "./Code";

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);

  const { titleslug } = useParams();

  useEffect(() => {
    fetchSolutions();
  }, [titleslug]);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ques/solutionsfromName/${titleslug}`
      );
      setSolutions(response.data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
  };

  return (
    <div className="flex">
      <div className="w-1/2">
        <div className="flex items-center px-4 mt-3">
          <img
            src="https://th.bing.com/th/id/OIP.q0vS1-Y6CkeeDknw8ahLDAHaHa?rs=1&pid=ImgDetMain"
            alt="page icon"
            height={15}
            width={15}
          />
          <Link className="px-2" to={`/question/${titleslug}`}>
            Description
          </Link>
          <Link className="px-2" to={`/question/${titleslug}/solutions`}>
            🧪Solutions
          </Link>
          <Link className="px-2" to={`/question/${titleslug}/submissions`}>
            ▼ Submissions
          </Link>
          <Link className="px-2" to={`/question/${titleslug}/discuss`}>
            🗨️ Discuss
          </Link>
        </div>
        <div className="p-4">
          {!selectedSolution && (
            <div className="space-y-4">
              {solutions.map((solution) => (
                <div
                  key={solution._id}
                  onClick={() => handleSolutionClick(solution)}
                  className="p-4 bg-white shadow-md rounded cursor-pointer hover:shadow-lg"
                >
                  <div className="flex pr-10 mb-2">
                    <div className="text-sm text-gray-500 w-12">
                      <Link
                        to={`/profile/${solution.username}`}
                        className=" hover:underline hover:text-blue-500"
                      >
                        {solution.username + "   "}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(solution.timeOfPublish).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-bold text-lg mb-2">{solution.name}</div>
                  <div className="flex text-sm text-gray-700">
                    <span className="mr-4">{solution.language}</span>
                    <span>{solution.topics.join(", ")}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {solution.content}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!selectedSolution && solutions.length===0 &&(
            <div><strong>No solutions yet.</strong> <br /> You can start thread by publishing your solution.</div>
          )}
          {selectedSolution && (
            <button
              onClick={() => setSelectedSolution(null)}
              className="mb-4 text-blue-500 hover:underline"
            >
              All Solutions
            </button>
          )}
          {selectedSolution && (
            <SolutionCard selectedSolution={selectedSolution} />
          )}
        </div>
      </div>

      {/* Right half */}
      <div className="w-1/2 p-4">
        <Code quesID={titleslug} />
      </div>
    </div>
  );
};

export default Solutions;
