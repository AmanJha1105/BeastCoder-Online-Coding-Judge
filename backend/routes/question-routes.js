const express= require("express");
const {
   addQuestion,
   getMutipleQuestions
} = require("../controllers/questionController.js");

const router = express.Router();

router.post("/add", addQuestion);
router.get("/allquestion", getMutipleQuestions);

module.exports=router;