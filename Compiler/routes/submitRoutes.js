const express = require("express");
const { submitProgram, runprogram } = require("../controllers/submitController.js");
const router = express.Router();

router.post("/run", runprogram);

router.post("/submit",submitProgram);

module.exports = router;