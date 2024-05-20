const express = require("express");
const router = express.Router();
const{ runprogram, submitProgram } = require("../controllers/submissionController.js")

router.post("/run", runprogram);

router.post("/submit",submitProgram);

module.exports=router;