const express = require("express");
const router = express.Router();
const{ runprogram, submitProgram } = require("../controllers/submissionController.js");
const { getSubmissions } = require("../controllers/getSubmissionsController.js");

router.post("/run", runprogram);

router.post("/submit",submitProgram);

router.get("/submissions/:slug",getSubmissions);

module.exports=router;