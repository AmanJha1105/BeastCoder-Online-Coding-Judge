const Question = require('../model/Question');
const TestCases = require('../model/testcases');

const addQuestion = async (req, res) => {
  let {level,topics,title,likes,testcases,dislikes,content}= req.body;

  const slug= title.split(" ").join("-");

  testcases = JSON.parse(testcases);

  try {
    const newQuestion = new Question({
      level,
      topics,
      title,
      titleslug:slug,
      likes,
      testcases,
      dislikes,
      content,
    });

    // Save the question to the database
    const savedQuestion = await newQuestion.save();

    const testcase = new TestCases({
      problemId: savedQuestion._id,
      testCase: testcases,
    });
  await testcase.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ "titleslug": req.params.slug });

    if (!question) {
      res.status(404).json({ error: "Question not found" });
    } else {
      res.status(200).json(question);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
};


const getMutipleQuestions = async (req, res) => {
    try {
      const questions = await Question.find({});
      res.status(200).json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `${error}` });
    }
  };

  const likeQuestion =async(req,res)=>{
      try {
        const ques_slug = req.params.slug;
        const { userId } = req.body;
        const question = await Question.findOne({ titleslug: ques_slug });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const likedIndex = question.likedBy.indexOf(userId);
        const dislikedIndex = question.dislikedBy.indexOf(userId);

        if (likedIndex === -1) {
          question.likedBy.push(userId);
          question.likes += 1;
          if (dislikedIndex !== -1) {
            question.dislikedBy.splice(dislikedIndex, 1);
            question.dislikes -= 1;
          }
        } else {
          question.likedBy.splice(likedIndex, 1);
          question.likes -= 1;
        }

        await question.save();
        return res.json({ likes: question.likes, dislikes: question.dislikes });

    } catch (error) {
        console.error("Error liking the question:", error);
        return res.status(500).json({ message: "Server error" });
    }
  }

  const dislikeQuestion = async(req,res)=>{
      try {
        const ques_slug = req.params.slug;
        const { userId } = req.body;
        const question = await Question.findOne({ titleslug: ques_slug });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const likedIndex = question.likedBy.indexOf(userId);
        const dislikedIndex = question.dislikedBy.indexOf(userId);

        if (dislikedIndex === -1) {
          question.dislikedBy.push(userId);
          question.dislikes += 1;
          if (likedIndex !== -1) {
            question.likedBy.splice(likedIndex, 1);
            question.likes -= 1;
          }
        } else {
          question.dislikedBy.splice(dislikedIndex, 1);
          question.dislikes -= 1;
        }

        await question.save();
       return res.json({ likes: question.likes, dislikes: question.dislikes });

    } catch (error) {
        console.error("Error disliking the question:", error);
        return res.status(500).json({ message: "Server error" });
    }
  }
  
exports.getMutipleQuestions= getMutipleQuestions;
exports.addQuestion=addQuestion;
exports.getQuestion=getQuestion;
exports.likeQuestion=likeQuestion;
exports.dislikeQuestion=dislikeQuestion;
