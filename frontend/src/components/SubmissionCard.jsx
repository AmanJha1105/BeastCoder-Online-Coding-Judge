import React from 'react'
import { FaRegPenToSquare } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const SubmissionCard = ({selectedSubmission}) => {

    const navigate = useNavigate();

    const handlePublishSolution = () => {
        try {
          const userId = localStorage.getItem('userId'); // Assume user ID is stored in localStorage
          if (!userId) {
            toast.error("Please login to publish solution.");
            return;
          }
          navigate(`/pubhlishSolution/${selectedSubmission._id}`,{
            state:{
              selectedSubmission,
            }
          });

        } catch (error) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.message || "An error occurred");
          } else if (error.message) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred");
          }
        }
      };

  return (
    <>
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
    </>
  )
}

export default SubmissionCard