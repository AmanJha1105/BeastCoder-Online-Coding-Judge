const Solution = require('../model/Solutions');
const Submission = require('../model/Submissions');
const User = require('../model/User');
const Question = require('../model/Question');

const getSolutions = async(req,res)=>{
     try {
        const quesId = req.params.slug;
        const solutions = await Solution.find({ quesID: quesId }).sort({timeOfPublish:-1});
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

         const user = await User.findById(userId);
         const username = user.username;
         console.log(username);

        const newSolution = new Solution({
            userId: userId,
            username:username,
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

const replySolution = async(req,res)=>{

    console.log("inside reply solution ");

    const  solutionId  = req.params.slug;
    const { userId, username, content } = req.body;
  
    try {

      const solution = await Solution.findById(solutionId);
      if (!solution) {
        return res.status(404).json({ message: 'Solution not found' });
      }
  
      const newReply = {
        userId,
        username,
        content,
      };
  
      solution.replies.push(newReply);
      await solution.save();

      solution.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      return res.status(201).json(solution);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
}

exports.getSolutions=getSolutions;
exports.publishSolution=publishSolution;
exports.replySolution = replySolution;