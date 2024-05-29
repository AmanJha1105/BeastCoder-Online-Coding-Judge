const Submission = require("../model/Submissions")
const Question = require('../model/Question');
const user = require("../model/User");

const getSubmissions =async(req,res)=>{
    try {
        const userId = req.query.userId;
        const ques_slug = req.params.slug;
    
        const question = await Question.findOne({ "titleslug": ques_slug });
        const quesID = question._id;
    
        const submissions = await Submission.find({ userId:userId, quesID:quesID}).sort({submittedAt:-1})
        ;
        if (submissions.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(submissions);

    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Server error" });
    }

} 

const getAllSubmissions = async(req,res)=>{
    const userId = req.query.userId;
   try {
    const submissions = await Submission.find({ userId: userId }).sort({ submittedAt: -1 });

    if(submissions.length===0)
        return res.json([]);

    // Use Promise.all to fetch question details for each submission
    const enrichedSubmissions = await Promise.all(submissions.map(async (submission) => {
      const ques = await Question.findById(submission.quesID);
      return {
        ...submission.toObject(), // Convert the Mongoose document to a plain object
        title: ques.title,
        titleslug: ques.titleslug,
      };
    }));
    return res.json(enrichedSubmissions);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getSingleSubmission = async(req,res)=>{
   try {
    const submissionId = req.params.slug;

    const submission = await Submission.find({_id : submissionId});

    return res.json(submission);

   } catch (error) {
     console.error("Error getting submission:",error);
   }
}

exports.getSubmissions=getSubmissions;
exports.getAllSubmissions=getAllSubmissions;
exports.getSingleSubmission=getSingleSubmission;