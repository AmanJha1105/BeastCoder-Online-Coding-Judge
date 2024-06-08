import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaderBoardPage = () => {

  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
    
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/leaderboard`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard data', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-5">
      <h1 className="text-white text-center mb-5"><strong>Leaderboard</strong></h1>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white p-5 rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Solved Problems</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">{user.username}</td>
                  <td className="px-4 py-2 text-center">{user.solvedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardPage;
