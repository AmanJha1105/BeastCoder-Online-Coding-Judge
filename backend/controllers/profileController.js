const Submission = require("../model/Submissions");
const Question = require("../model/Question");
const User = require('../model/User');

const getDifficultyCounts = async (req,res) => {
    try {

        console.log("inside get counts level");

        // Retrieve submissions made by the user
        const {username} = req.params;
        console.log(username);

        const user = await User.findOne({username:username});

        const userId = user._id;
        console.log("here user is",userId);

        const submissions = await Submission.find({ userId,verdict: "AC" });

        //console.log("submissions is",submissions);

        // Initialize counts for each difficulty level
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;

        // Get total number of questions for each difficulty level
        const { easyCount: totalEasyCount, mediumCount: totalMediumCount, hardCount: totalHardCount } = await getTotalDifficultyCounts();

        const uniqueQuestionIds = new Set();

        // Iterate over each submission
        for (const submission of submissions) {
            if (!uniqueQuestionIds.has(submission.quesID.toString())) {
                uniqueQuestionIds.add(submission.quesID.toString());

                // Retrieve the associated question
                const question = await Question.findById(submission.quesID);

                // Determine the difficulty level of the question
                const difficulty = question.level;

                // Increment the count for the corresponding difficulty level
                if (difficulty === "easy") {
                    easyCount++;
                } else if (difficulty === "medium") {
                    mediumCount++;
                } else if (difficulty === "hard") {
                    hardCount++;
                }
            }
        }

        return res.json({ 
            easyCount, 
            mediumCount, 
            hardCount, 
            totalEasyCount, 
            totalMediumCount, 
            totalHardCount 
        }) ;
    } catch (error) {
        console.error(`Error in getting difficulty counts: ${error}`);
        return res.status(500).json({message:"Error getting submissions by level"})
    }
};

const getTotalDifficultyCounts = async () => {
    try {
        // Count the number of questions for each difficulty level
        const easyCount = await Question.countDocuments({ level: "easy" });
        const mediumCount = await Question.countDocuments({ level: "medium" });
        const hardCount = await Question.countDocuments({ level: "hard" });

        return { easyCount, mediumCount, hardCount };
    } catch (error) {
        console.error(`Error in getting total difficulty counts: ${error}`);
        throw error;
    }
};

const getPastYearSubmissions = async(req,res)=>{
    try {
        console.log("inside past year submissions");
        const { username, currentYear, currentMonth } = req.params;
    
        const user = await User.findOne({ username: username });
    
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        const userID = user._id;
    
        const yearNum = parseInt(currentYear);
        const monthNum = parseInt(currentMonth);
    
        // Calculate start date for the previous year in UTC
        const startDate = new Date(Date.UTC(yearNum - 1, monthNum - 1, 1));
    
        // Calculate end date as the current date in UTC
        const endDate = new Date();
    
        // Fetch submissions for the specified user within the date range
        const submissions = await Submission.find({
            userId: userID,
            submittedAt: { $gte: startDate, $lte: endDate }
        });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getDifficultyCounts = getDifficultyCounts;
exports.getPastYearSubmissions = getPastYearSubmissions;
