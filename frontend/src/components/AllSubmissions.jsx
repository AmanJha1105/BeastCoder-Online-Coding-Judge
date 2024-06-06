import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceStrict, add, differenceInHours } from "date-fns";
import { AuthContext } from "../context/AuthContext";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:5000/ques/allsubmissions",
          {
            params: {
              userId: userId,
            },
          },
          { withCredentials: true }
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions", error);
      }
    };

    fetchSubmissions();
  }, []);

  const formatDetailedDistance = (date) => {
    const now = new Date();
    const distance = formatDistanceStrict(date, now);
    const hoursDifference = differenceInHours(now, date);
    const remainingHours = hoursDifference % 24;

    if (hoursDifference < 24) {
      return `${distance} ago`;
    } else {
      const remainingTime = add(date, {
        days: Math.floor(hoursDifference / 24),
      });
      const remainingDistance = formatDistanceStrict(remainingTime, now, {
        unit: "hour",
      });
      return `${distance}, ${remainingDistance} ago`;
    }
  };

  const handleBtnClick = () => {
    navigate("/login");
  };

  return (
    <>
      {user && (
        <div className="container mx-auto p-5">
          <h1 className="text-2xl font-bold mb-5">All My Submissions</h1>
          {submissions.length > 0 && (
            <table className="min-w-full bg-white border-collapse">
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
                {submissions?.map((submission) => (
                  <tr key={submission?._id} className="hover:bg-gray-100 ">
                    <td className="py-2 px-4 border-b text-gray-700">
                      {formatDetailedDistance(
                        new Date(submission?.submittedAt)
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link
                        to={`/question/${submission?.titleslug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {submission?.title}
                      </Link>
                    </td>
                    <td
                      className={`py-2 px-4 border-b ${
                        submission?.verdict === "AC"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <Link to={`/submissions/${submission?._id}`}>
                        {submission?.verdict === "AC"
                          ? "Accepted"
                          : submission?.verdict === "WA"
                          ? "Wrong Answer"
                          : submission?.verdict === "RE"
                          ? "Runtime Error"
                          : submission?.verdict === "TLE"
                          ? "Time Limit Exceeded"
                          : "Unknown verdict"}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {" "}
                      {submission?.verdict === "AC"
                        ? `${submission?.executionTime.toFixed(1)}ms`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {submission?.language}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {submissions.length === 0 && <div>No Submissions Yet</div>}
        </div>
      )}
      {user === null && (
        <div className="flex items-center justify-center min-h-screen">
          <button
            className="bg-green-500 text-white py-3 px-6 rounded-md text-lg hover:bg-green-600 transition duration-300"
            onClick={handleBtnClick}
          >
            Please login to view all your submissions
          </button>
        </div>
      )}
    </>
  );
};

export default AllSubmissions;
