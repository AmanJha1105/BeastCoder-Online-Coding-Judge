const mongoose=require("mongoose");

const testCaseResultSchema = new mongoose.Schema({
    testCase: { type: String, required: true },
    input:{type: String,required:true},
    yourOutput:{type: String,required:true},
    ExpectedOutput:{type: String,required:true},
    result: { type: String, required: true }, // e.g., "Passed", "Failed"
    executionTime: { type: Number }, // in milliseconds
    memoryUsed: { type: Number }, // in KB
  }, { _id: false });
  
  const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    quesID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Question' },
    titleslug:{ type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    verdict: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    executionTime: { type: Number }, // in milliseconds 
    memoryUsed: { type: Number }, // in MB
    testCases: [testCaseResultSchema],
  });
  
module.exports= mongoose.model('Submission', submissionSchema);
  