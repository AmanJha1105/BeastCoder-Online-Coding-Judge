const express = require("express");
const { getSolutions, publishSolution } = require("../controllers/solutionsController");
const router = express.Router();

router.get("/solutions/:slug",getSolutions);

router.post("/publishSolution/:slug",publishSolution)

module.exports=router;