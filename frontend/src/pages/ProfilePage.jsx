import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from '../utils/PieChart';
import { useParams } from 'react-router-dom';
import MonthlySubmissionsHeatmap from '../utils/HeatMap';
import { format } from 'date-fns';

const ProfilePage = ({ userId }) => {
  const [counts, setCounts] = useState({
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    totalEasyCount: 0,
    totalMediumCount: 0,
    totalHardCount: 0,
  });

  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const {username} = useParams();
  console.log("username is",username);

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ques/allsubmissions',{
            params: {
                username: username,
            }
        },{ withCredentials: true });
        setSubmissions(response.data);
        console.log(response.data);

        const acceptedSubmissions = response.data.filter(submission => submission.verdict === 'AC');
        
        // Create a map to store unique questions
        const uniqueQuestionsMap = new Map();
        acceptedSubmissions.forEach(submission => {
          if (!uniqueQuestionsMap.has(submission.quesID)) {
            uniqueQuestionsMap.set(submission.quesID, submission);
          } else {
            const existingSubmission = uniqueQuestionsMap.get(submission.quesID);
            if (new Date(submission.submittedAt) > new Date(existingSubmission.submittedAt)) {
              uniqueQuestionsMap.set(submission.quesID, submission);
            }
          }
        });

        // Convert map back to array and sort by submission date
        const uniqueAcceptedSubmissions = Array.from(uniqueQuestionsMap.values())
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 10);

        setRecentSubmissions(uniqueAcceptedSubmissions);

      } catch (error) {
        console.error('Error fetching submissions', error);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    // Fetch the counts from the backend
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/getSubmissions/${username}`);
        setCounts(response.data);
        //console.log("response is",response.data);
      } catch (error) {
        console.error('Error fetching difficulty counts:', error);
      }
    };

    fetchCounts();
  }, [userId]);


  // Prepare data for the PieChart
  const solvedProblemsData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [counts.easyCount, counts.mediumCount, counts.hardCount],
        backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336'], // Green for easy, yellow for medium, red for hard
      },
    ],
  };

  return (
    <>
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="flex items-center justify-center w-full">
        <div className="mr-14"> {/* Increased margin-right for a larger gap */}
          <PieChart data={solvedProblemsData} />
        </div>
        <div className="flex flex-col space-y-4 text-lg mt-6"> {/* Added margin-top to push it down */}
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
    <MonthlySubmissionsHeatmap username={username} />
    <h2 className="text-2xl font-bold mt-8 mb-4">Recent 10 Accepted Submissions of Unique Questions</h2>
      <ul className="list-disc pl-5">
        {recentSubmissions.map((submission, index) => (
          <li key={index}>
            <span className="font-semibold">{submission.title}</span> - {format(new Date(submission.submittedAt), 'd MMM yyyy')}
          </li>
        ))}
      </ul>

    </>
  );
};

export default ProfilePage;

