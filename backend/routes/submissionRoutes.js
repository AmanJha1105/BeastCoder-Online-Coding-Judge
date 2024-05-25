const express = require("express");
const router = express.Router();
const{ runprogram, submitProgram } = require("../controllers/submissionController.js");
const { getSubmissions, getAllSubmissions, getSingleSubmission } = require("../controllers/getSubmissionsController.js");

router.post("/run", runprogram);

router.post("/submit",submitProgram);

router.get("/submissions/:slug",getSubmissions);

router.get("/allsubmissions",getAllSubmissions);

router.get("/singleSubmission/:slug",getSingleSubmission)

module.exports=router;