const Question = require('../model/Question');

const addQuestion = async (req, res) => {
  console.log(req.body);
  const {level,topics,title,likes,dislikes,content}= req.body;

  try {
    const newQuestion = new Question({
      level,
      topics,
      title,
      likes,
      dislikes,
      content,
    });

    // Save the question to the database
    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
};



const getMutipleQuestions = async (req, res) => {
    try {
      console.log("questions called");
      const questions = await Question.find({});
      res.status(200).json(questions);
      console.log(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `${error}` });
    }
  };
  
exports.getMutipleQuestions= getMutipleQuestions;
exports.addQuestion=addQuestion;