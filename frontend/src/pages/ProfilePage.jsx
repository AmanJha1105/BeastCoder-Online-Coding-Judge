import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChart from "../utils/PieChart";
import MonthlySubmissionsHeatmap from "../utils/HeatMap";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUser,FaLinkedinIn ,FaGithub } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";

const ProfilePage = () => {
  const [counts, setCounts] = useState({
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    totalEasyCount: 0,
    totalMediumCount: 0,
    totalHardCount: 0,
  });

  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();
  

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/ques/allsubmissions",
          {
            params: {
              username: username,
            },
          },
          { withCredentials: true }
        );
        const submissions = response.data;

        const acceptedSubmissions = submissions.filter(
          (submission) => submission.verdict === "AC"
        );

        const uniqueQuestionsMap = new Map();
        acceptedSubmissions.forEach((submission) => {
          if (!uniqueQuestionsMap.has(submission.quesID)) {
            uniqueQuestionsMap.set(submission.quesID, submission);
          } else {
            const existingSubmission = uniqueQuestionsMap.get(
              submission.quesID
            );
            if (
              new Date(submission.submittedAt) >
              new Date(existingSubmission.submittedAt)
            ) {
              uniqueQuestionsMap.set(submission.quesID, submission);
            }
          }
        });

        const uniqueAcceptedSubmissions = Array.from(
          uniqueQuestionsMap.values()
        )
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 10);

        setRecentSubmissions(uniqueAcceptedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions", error);
      }
    };

    fetchSubmissions();
  }, [username]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/profile/getSubmissions/${username}`
        );
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching difficulty counts:", error);
      }
    };

    fetchCounts();
  }, [username]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getUser/${username}`,
          {
            params: {
              username: username,
            },
          },
          { withCredentials: true }
        );
        setUserData(response.data);
        console.log("response is ", response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUser();
  }, [username]);

  const handleEditProfile = () => {
    navigate(`/editprofile/${username}`);
  };

  const solvedProblemsData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [counts.easyCount, counts.mediumCount, counts.hardCount],
        backgroundColor: ["#4CAF50", "#FFEB3B", "#F44336"],
      },
    ],
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-normal items-center mb-8">
          {userData && (
            <div className="mb-8 pr-8">
              <div className="flex items-start">
                {userData.profilePicture ? (
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <FaUser size={128} className="text-gray-300" /> // User icon as fallback
                )}
                <div className="flex flex-col justify-start">
                  <h1 className="text-3xl font-bold mb-1">
                    {userData?.fullName}
                  </h1>
                  <p className="text-xl text-gray-500 mb-2">@{username}</p>
                  <button
                    onClick={handleEditProfile}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="mt-4">
                {userData?.location && <p className="text-lg flex items-center">
                <SlLocationPin className="mr-2" />{" "}
                    {userData?.location}
                </p>
                }

                {userData?.githubUsername && <p className="text-lg flex items-center">
                  <a
                    href={`https://github.com/${userData?.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 hover:text-black"
                  >
                    <FaGithub className="mr-2" />{" "}
                    {userData?.githubUsername}
                  </a>
                </p>
                }
                {userData?.linkedinUsername && <p className="text-lg flex items-center">
                  <a
                    href={`https://www.linkedin.com/in/${userData?.linkedinUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 hover:text-black"
                  >
                    <FaLinkedinIn className="mr-2" />{" "}
                    {userData?.linkedinUsername}
                  </a>
                </p>}

                {userData?.education && <p className="text-lg">
                  <strong>Education:</strong> {userData?.education}
                </p>}
                {userData?.skills && <p className="text-lg">
                  <strong>Skills:</strong>
                </p>}
                <ul className="list-disc list-inside">
                  {userData?.skills &&
                    userData?.skills
                      .split(",")
                      .map((skill, index) => (
                        <li key={index}>{skill.trim()}</li>
                      ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div>
                <strong>
                  Solved :
                  {counts.easyCount + counts.mediumCount + counts.hardCount}/
                  {counts.totalEasyCount +
                    counts.totalMediumCount +
                    counts.totalHardCount}
                </strong>
              </div>
              <PieChart data={solvedProblemsData} />
            </div>
            <div className="ml-6">
              <div>
                <p>
                  <span className="text-green-600">Easy</span>
                  <br />
                  {counts.easyCount}/{counts.totalEasyCount}
                </p>
                <p>
                  <span className="text-yellow-600">Medium</span>
                  <br />
                  {counts.mediumCount}/{counts.totalMediumCount}
                </p>
                <p>
                  <span className="text-red-600">Hard</span>
                  <br />
                  {counts.hardCount}/{counts.totalHardCount}
                </p>
              </div>
            </div>
          </div>
        </div>
        <MonthlySubmissionsHeatmap username={username} />
        <div className="flex flex-col items-center mt-8 mb-20">
          <h2 className="text-2xl font-bold mb-4">
            Recent Accepted Submissions
          </h2>
          <ul className="w-3/4 mx-auto">
            {recentSubmissions.map((submission) => (
              <li key={submission._id} className="mb-4 flex justify-between">
                <Link
                  to={`/submissions/${submission._id}`}
                  className="font-bold w-1/2"
                >
                  {submission.title}
                </Link>
                <Link
                  to={`/submissions/${submission._id}`}
                  className="text-gray-500 text-right"
                >
                  {formatDistanceToNow(new Date(submission.submittedAt))} ago
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
