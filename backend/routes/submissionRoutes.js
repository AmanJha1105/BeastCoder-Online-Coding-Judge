const express = require("express");
const router = express.Router();
const { getSubmissions, getAllSubmissions, getSingleSubmission, getQuesName } = require("../controllers/getSubmissionsController.js");



router.get("/submissions/:slug",getSubmissions);

router.get("/allsubmissions",getAllSubmissions);

router.get("/singleSubmission/:slug",getSingleSubmission);

router.get("/getQuesName/:submissionId",getQuesName);


module.exports=router;