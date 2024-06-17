import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SubmissionCard from "./SubmissionCard";
import Code from "./Code";
import { AuthContext } from "../context/AuthContext";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { FaRocketchat } from "react-icons/fa";
import { HiBeaker } from "react-icons/hi";

const Submissions = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { titleslug } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getSubmissions();
  }, [titleslug]);

  const getSubmissions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BackendUrl}/ques/submissions/${titleslug}`,
        {
          params: {
            userId: userId,
          },
        }
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <>
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

      <div className="mx-auto flex flex-col lg:flex-row">
        <div className="flex-1 lg:w-1/2 p-4 overflow-y-auto max-h-screen">
          {selectedSubmission === null && user !== null ? (
            <div className="flex-1 p-4">
              {submissions.length > 0 && (
                <div className="flex-1 p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50">Verdict</th>
                        <th className="px-6 py-3 bg-gray-50">Date</th>
                        <th className="px-6 py-3 bg-gray-50">Language</th>
                        <th className="px-6 py-3 bg-gray-50">
                          Execution Time (ms)
                        </th>
                        <th className="px-6 py-3 bg-gray-50">
                          Memory Used (MB)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr
                          key={submission._id}
                          onClick={() => handleRowClick(submission)}
                          className="cursor-pointer"
                        >
                          <td
                            className={`px-6 py-4 ${
                              submission.verdict === "AC"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {submission?.verdict === "AC"
                              ? "Accepted"
                              : submission?.verdict === "WA"
                              ? "Wrong Answer"
                              : submission?.verdict === "RE"
                              ? "Runtime Error"
                              : submission?.verdict === "TLE"
                              ? "Time Limit Excedded"
                              : "Unknown verdict"}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">{submission.language}</td>
                          <td className="px-6 py-4">
                            {submission?.verdict === "AC"
                              ? `⏱${submission.executionTime.toFixed(1)}`
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {submission?.verdict === "AC"
                              ? `🖥️${submission.memoryUsed.toFixed(0)}`
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {submissions.length === 0 && user !== null && (
                <div>No Submissions Yet</div>
              )}
            </div>
          ) : (
            <div className="flex-1 p-4">
              {selectedSubmission && user !== null && (
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="mb-4 text-blue-500 hover:underline"
                >
                  All Submissions
                </button>
              )}
              {user !== null && (
                <SubmissionCard selectedSubmission={selectedSubmission} />
              )}
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          {user === null && (
            <div className=" items-center flex flex-col mr-10">
              <div>🔥 Join BeastCoder to Code!</div>
              <div>View your Submission records here</div>
              <div className="">
                <Link to="/login">
                  <button className="bg-green-500 text-white font-medium py-2 px-4 mt-4 flex items-center cursor-pointer border rounded-lg">
                    Register or Login
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 lg:w-1/2 overflow-y-auto max-h-screen">
          <Code quesID={titleslug} />
        </div>
      </div>
    </>
  );
};

export default Submissions;
