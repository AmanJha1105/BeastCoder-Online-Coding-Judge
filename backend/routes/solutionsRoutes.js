const express = require("express");
const { getSolutions, publishSolution, replySolution, likeReply, likeSolution, getSolutionsfromName } = require("../controllers/solutionsController");
const router = express.Router();

router.get("/solutions/:slug",getSolutions);

router.get("/solutionsfromName/:titleslug",getSolutionsfromName);

router.post("/publishSolution/:slug",publishSolution)

router.post("/solution/:slug/reply",replySolution)

router.post("/solutions/:solutionId/reply/:replyId/like",likeReply);

router.post("/solution/:solutionId/like",likeSolution);

module.exports=router;