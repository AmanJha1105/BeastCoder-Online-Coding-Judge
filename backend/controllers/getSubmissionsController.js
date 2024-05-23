const Submission = require("../model/Submissions")
const Question = require('../model/Question');
const user = require("../model/User")

const getSubmissions =async(req,res)=>{
    try {
        console.log("inside get submissions");
        const userId = req.query.userId;
        console.log("req query is",req.query.userId);
        const ques_slug = req.params.slug;
    
        const question = await Question.findOne({ "titleslug": ques_slug });
        const quesID = question._id;
        console.log(quesID);
        console.log("userid is",userId); 
    
        const submissions = await Submission.find({ userId:userId, quesID:quesID});
        console.log(submissions);
        if (submissions.length === 0) {
            return res.status(200).json([]);
        }
    
        return res.status(200).json(submissions);

    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Server error" });
    }

} 

exports.getSubmissions=getSubmissions;