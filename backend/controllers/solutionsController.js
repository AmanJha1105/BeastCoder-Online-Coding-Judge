const Solution = require('../model/Solutions');
const Submission = require('../model/Submissions');
const User = require('../model/User');
const Question = require('../model/Question');

const getSolutions = async(req,res)=>{
     try {
        const quesId = req.params.slug;
        const solutions = await Solution.find({ quesID: quesId });
        res.status(200).json(solutions);
     } catch (error) {
        console.error('Error fetching solutions:', error);
        res.status(500).json({ message: 'Server error' });
     }
}

const publishSolution =async(req,res)=>{
   try {
        const quesId = req.params.slug;
        const { userId, submissionId, name, code,language, timeOfPublish,likes,topics } = req.body;

        // const submission = await Submission.findById(submissionId);
        // if (!submission) {
        // return res.status(404).json({ message: 'Submission not found' });
        // }

        const newSolution = new Solution({
            userId: userId,
            quesID: quesId,
            submissionId: submissionId,
            name: name,
            code: code,
            language:language,
            timeOfPublish:Date.now(),
            likes:likes,
            topics: topics,
            replies:[],
          });
      
          // Save the solution to the database
          const savedSolution = await newSolution.save();
      
          res.status(201).json(savedSolution);

   } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
   }
}

exports.getSolutions=getSolutions;
exports.publishSolution=publishSolution;