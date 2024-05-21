const mongoose = require("mongoose")

const testcaseSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "Please enter Question ID"],
    },
    testCase:[
        {
            input: {
                type: String,
                required: [true, "Please enter input"],
            },
            output: {
                type: String,
                required: [true, "Please enter output"],
            },
        }
    ]
});


module.exports = mongoose.model("TestCases",testcaseSchema);