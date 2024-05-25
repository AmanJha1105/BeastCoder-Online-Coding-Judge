const express = require("express");
const { getSolutions, publishSolution, replySolution } = require("../controllers/solutionsController");
const router = express.Router();

router.get("/solutions/:slug",getSolutions);

router.post("/publishSolution/:slug",publishSolution)

router.post("/solution/:slug/reply",replySolution)

module.exports=router;