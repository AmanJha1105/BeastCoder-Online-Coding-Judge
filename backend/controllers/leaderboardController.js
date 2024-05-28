const Submission = require('../model/Submissions');
const User = require('../model/User');

const getLeaderboard = async(req,res)=>{
    try {
        console.log("inside getleaderboards");
        const users = await User.find({});
        const leaderboard = [];
    
        for (let user of users) {
          const submissions = await Submission.find({ userId: user._id, verdict: 'AC' });
          const solvedProblems = new Set(submissions.map(sub => sub.quesID.toString()));
          leaderboard.push({ username: user.username, solvedCount: solvedProblems.size });
        }
    
        leaderboard.sort((a, b) => {
          if (b.solvedCount === a.solvedCount) {
            return a.username.localeCompare(b.username);
          }
          return b.solvedCount - a.solvedCount;
        });
    
        return res.json(leaderboard);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard data', error });
      }
}
exports.getLeaderboard = getLeaderboard;