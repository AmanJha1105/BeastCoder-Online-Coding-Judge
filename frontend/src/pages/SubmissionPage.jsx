import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const SubmissionPage = () => {
  const { submissionID } = useParams();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [quesname, setQuesName] = useState(" ");
  const [titleslug,setTitleSlug] = useState(" ");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getSubmission();
    getQuestionName();
  }, [submissionID]);

  const getSubmission = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ques/singleSubmission/${submissionID}`
      );
      setSelectedSubmission(response.data[0]);
    } catch (error) {
      console.error("Error getting submissions", error);
    }
  };

  const getQuestionName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ques/getQuesName/${submissionID}`
      );
      setQuesName(response.data);
      const quesId = response.data.replace(/\s+/g, '-');
      setTitleSlug(quesId);

    } catch (error) {
      console.error("Error getting question name", error);
    }
  };

  return (
    <>
      {selectedSubmission !== null && (
        <div className="mt-4 p-4 w-1/2 bg-gray-100 rounded">
          <Link to={`/question/${titleslug}`}>
            <h2 className="text-lg text-blue-500 font-bold">{quesname}</h2>
          </Link>
          <h2
            className={`text-lg font-semibold mb-2 ${
              selectedSubmission.verdict === "AC"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {selectedSubmission?.verdict === "AC"
              ? "Accepted"
              : selectedSubmission?.verdict === "WA"
              ? "Wrong Answer"
              : selectedSubmission?.verdict === "RE"
              ? "Runtime Error"
              : selectedSubmission?.verdict === "TLE"
              ? "Time Limit Exceeded"
              : "Unknown verdict"}
          </h2>
          {selectedSubmission.verdict !== "AC" &&
            selectedSubmission.testCases.length > 0 && (
              <div>
                {selectedSubmission?.verdict === "RE" && (
                  <div>All testcases failed.</div>
                )}
                {selectedSubmission?.verdict !== "RE" && (
                  <h3>Failed Test Case</h3>
                )}
                {selectedSubmission.testCases
                  .map((testCase, index) => {
                    if (testCase.result !== "AC" && testCase.result !== "RE") {
                      return (
                        <div key={index}>
                          <div>
                            <p>Input </p>{" "}
                            <p>
                              <strong>{testCase.input}</strong>
                            </p>
                          </div>
                          <div>
                            <p>Output</p>{" "}
                            <p>
                              <strong>{testCase.yourOutput}</strong>
                            </p>
                          </div>
                          <div>
                            <p>Expected</p>{" "}
                            <p>
                              <strong>{testCase.ExpectedOutput}</strong>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                  .find((testCase) => testCase !== null)}
                <br />
              </div>
            )}
          <h3 className="text-lg font-semibold mb-2">Code</h3>
          <h3 className="mb-2">
            <strong>Language:</strong>{" "}
            <span className="px-1">{selectedSubmission.language}</span>{" "}
          </h3>
          {selectedSubmission.verdict === "AC" && (
            <div className="mb-4 flex justify-between">
              <div className="flex-1 mr-2">
                <div className="font-bold">⏱Runtime</div>
                <div>{selectedSubmission.executionTime.toFixed(1)} ms</div>
              </div>
              <div className="flex-1 ml-2">
                <div className="font-bold">🖥️ Memory</div>
                <div>{selectedSubmission.memoryUsed.toFixed(0)} MB</div>
              </div>
            </div>
          )}

          <pre className="bg-gray-100 p-4 rounded">
            {selectedSubmission.code}
          </pre>
        </div>
      )}
    </>
  );
};

export default SubmissionPage;
