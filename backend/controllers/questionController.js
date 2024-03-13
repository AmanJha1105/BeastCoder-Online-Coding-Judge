const Question = require('../model/Question');

const addQuestion = async (req, res) => {
  console.log(req.body);
  try {
    // Create instances of CodeSnippet and TestCases using the request body
    const codeSnippets = req.body.codeSnippets.map(
      (snippet) => new CodeSnippet(snippet)
    );
    const testCases = new TestCases(req.body.testCases);
    // Create a new question instance using the request body, including CodeSnippet and TestCases
    const newQuestion = new Question({
      ...req.body,
      codeSnippets,
      testCases,
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