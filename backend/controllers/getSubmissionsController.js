const Submission = require("../model/Submissions")
const Question = require('../model/Question');
const User = require('../model/User');

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
    let userId = req.query.userId;

    const username = req.query.username;
    if(username!==undefined){
      const user = await User.findOne({username:username});
    
      userId = user._id;
    }

   try {
    const submissions = await Submission.find({ userId: userId }).sort({ submittedAt: -1 });

    if(submissions.length===0)
      return res.json([]);

    const enrichedSubmissions = await Promise.all(submissions.map(async (submission) => {
      const ques = await Question.findById(submission.quesID);
      if (ques) {
        return {
            ...submission.toObject(),
            title: ques.title,
            titleslug: ques.titleslug,
        };
    } else {
        return null;
    }
      
    }));
    const filteredSubmissions = enrichedSubmissions.filter(submission => submission !== null);
    return res.status(200).json(filteredSubmissions);

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

const getQuesName = async(req,res)=>{
  try {

    const {submissionId} = req.params;
    const submission = await Submission.findById(submissionId);

    const ques = await Question.findById(submission.quesID);

    if(!ques)
      return res.status(404).json({ error: 'Question not found' });

    const ques_name = ques?.title;
    return res.status(200).json(ques_name);

  } catch (error) {
    console.error("Error getting question name:",error);
  }
}

exports.getSubmissions=getSubmissions;
exports.getAllSubmissions=getAllSubmissions;
exports.getSingleSubmission=getSingleSubmission;
exports.getQuesName = getQuesName;
 