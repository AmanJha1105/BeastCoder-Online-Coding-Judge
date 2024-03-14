const express= require("express");
const {
   addQuestion,
   getMutipleQuestions,
   getQuestion,
} = require("../controllers/questionController.js");

const router = express.Router();

router.post("/add", addQuestion);
router.get("/allquestion", getMutipleQuestions);
router.get("/question/:slug", getQuestion);

module.exports=router;