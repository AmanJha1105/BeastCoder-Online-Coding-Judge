const express= require("express");
const {
   addQuestion,
   getMutipleQuestions,
   getQuestion,
   dislikeQuestion,
   likeQuestion,
} = require("../controllers/questionController.js");

const router = express.Router();

router.post("/add", addQuestion);
router.get("/allquestion", getMutipleQuestions);
router.get("/question/:slug", getQuestion);
router.post("/like/:slug",likeQuestion);
router.post("/dislike/:slug",dislikeQuestion);


module.exports=router;