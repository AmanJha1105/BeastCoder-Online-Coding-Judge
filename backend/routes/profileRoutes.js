const express= require("express");
const { getDifficultyCounts, getPastYearSubmissions } = require("../controllers/profileController");
const router = express.Router();

router.get("/getSubmissions/:username",getDifficultyCounts);

router.get("/submissions/:username/:currentYear/:currentMonth",getPastYearSubmissions)

module.exports = router;