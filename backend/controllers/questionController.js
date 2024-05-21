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
  
exports.getMutipleQuestions= getMutipleQuestions;
exports.addQuestion=addQuestion;
exports.getQuestion=getQuestion;