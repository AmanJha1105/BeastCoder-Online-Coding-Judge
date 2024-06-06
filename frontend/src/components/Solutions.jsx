import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import { HiBeaker } from "react-icons/hi";
import { FaRocketchat } from "react-icons/fa";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Code from "./Code";

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [navigateToSolution, setNavigateToSolution] = useState(false);

  const { titleslug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSolutions();
  }, [titleslug]);

  useEffect(() => {
    if (navigateToSolution && selectedSolution) {
      navigate(`/question/${titleslug}/solutions/${selectedSolution._id}`);
      setNavigateToSolution(false);
    }
  }, [navigateToSolution, selectedSolution, navigate, titleslug]);

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
    setNavigateToSolution(true);
  };

  return (
    <div className="flex">
      <div className="w-1/2 overflow-y-auto h-screen">
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
            <div className="flex items-center space-x-1">
              <HiBeaker className="text-blue-500" />
              <span>Solutions</span>
            </div>
          </Link>
          <Link className="px-2" to={`/question/${titleslug}/submissions`}>
          <div className="flex items-center space-x-1">
              <PiClockCounterClockwiseBold className="text-blue-500" />
              <span>Submissions</span>
          </div>
          </Link>
          <Link className="px-2" to={`/question/${titleslug}/discuss`}>
          <div className="flex items-center space-x-1">
              <FaRocketchat className="text-grey-500" />
              <span>Discuss</span>
            </div>
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
                    <div className="text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">
                      <Link
                        to={`/profile/${solution.username}`}
                        className="hover:underline hover:text-blue-500"
                      >
                        <span>{solution?.username}</span>
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500 ml-2">
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
          {!selectedSolution && solutions.length === 0 && (
            <div>
              <strong>No solutions yet.</strong> <br /> You can start thread by
              publishing your solution.
            </div>
          )}
          {selectedSolution && (
            <button
              onClick={() => setSelectedSolution(null)}
              className="mb-4 text-blue-500 hover:underline"
            >
              All Solutions
            </button>
          )}
        </div>
      </div>

      {/* Right half */}
      <div className="w-1/2 overflow-y-auto h-screen p-4">
        <Code quesID={titleslug} />
      </div>
    </div>
  );
};

export default Solutions;
