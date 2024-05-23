const TestCases= require("../model/testcases")
const question= require("../model/Question")
const path = require("path");
const fs = require("fs")
const {getCommands, getPaths, unlinkAllFiles}=require("../helper/functions")
const { v4: uuid } = require('uuid');
const { exec} = require("child_process");
const Submission = require("../model/Submissions");

const runprogram = async (req,res) => {

    console.log("inside run program");
    
    const{language,code,input} = req.body;

    const jobID = uuid();
    let outputContent;

    const baseDir = path.join(__dirname, "../");
    const dirCodes = path.join(baseDir, "codes");
    const dirInputs = path.join(baseDir, "inputs");
    const dirOutputs = path.join(baseDir, "outputs");

     [dirCodes, dirInputs, dirOutputs].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    let{codeFilePath,inputFilePath,outputFilePath,execFilePath} = getPaths({dirCodes,dirInputs,dirOutputs,jobID,language});

    fs.writeFileSync(inputFilePath, input);
    fs.writeFileSync(codeFilePath, code);

    let {compileCmd, executeCmd} = getCommands({language,codeFilePath,inputFilePath,outputFilePath,execFilePath});

    try {
        await execPromise(compileCmd);
        await execPromise(executeCmd);
        outputContent = fs.readFileSync(outputFilePath, 'utf-8').trim();
        
    } catch (error) {
        console.error(`Error in executing program: ${error}`);
    }finally{
        unlinkAllFiles({codeFilePath,inputFilePath,outputFilePath,execFilePath,dirCodes,dirOutputs,language});
    }
    return res.json(outputContent);
};

const submitProgram = async (req, res) => {
    console.log("inside submit program");
    const { language = 'cpp', code, quesID ,userId} = req.body;
    console.log(userId);

    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

  try{
    
    // Retrieve question and test cases (pseudo code, replace with actual DB queries)
    const ques = await question.findOne({ titleslug: quesID });
    const { testCase } = await TestCases.findOne({ problemId: ques._id });

    const baseDir = path.join(__dirname, "../");
    const dirCodes = path.join(baseDir, "codes");
    const dirInputs = path.join(baseDir, "inputs");
    const dirOutputs = path.join(baseDir, "outputs");

    // Ensure directories exist
    [dirCodes, dirInputs, dirOutputs].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    const results = [];
    let success = true;
    let finalVerdict = "AC";
    let totalExecutionTime = 0;
    let totalMemoryUsed = 0;

    for (const test of testCase) {
        const jobID = uuid();
        
        let { codeFilePath, inputFilePath, outputFilePath, execFilePath } = getPaths({ dirCodes, dirInputs, dirOutputs, jobID, language });

        fs.writeFileSync(codeFilePath, code);
        fs.writeFileSync(inputFilePath, test.input);

        let { compileCmd, executeCmd } = getCommands({ language, codeFilePath, inputFilePath, outputFilePath, execFilePath });

        try {
            // Compile the code
            await execPromise(compileCmd);

            // Measure execution time and memory usage
            const startTime = process.hrtime();
            await execPromise(executeCmd);
            const endTime = process.hrtime(startTime);

            const executionTime = endTime[0] * 1000 + endTime[1] / 1e6; // in milliseconds
            const memoryUsageInMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

            const outputContent = fs.readFileSync(outputFilePath, 'utf-8').trim();

            const verdict = outputContent === test.output.trim() ? "AC" : "WA";
            if (verdict === "WA") {
                success = false;
                finalVerdict = "WA";
            }

            totalExecutionTime += executionTime;
            totalMemoryUsed += parseFloat(memoryUsageInMB);

            results.push({ 
                testCase: test._id,
                input:test.input,
                yourOutput:outputContent,
                ExpectedOutput:test.output,
                result: verdict, 
                executionTime, 
                memoryUsed:parseFloat(memoryUsageInMB),
                output: outputContent 
            });

        } catch (error) {
            console.error(`Error in executing test case: ${error}`);
            results.push({ 
                testCase: test._id,
                result: "RE", 
                error: error.message 
            });
            success = false;
            finalVerdict = "RE";
        } finally {
            // Cleanup files
            unlinkAllFiles({ codeFilePath, inputFilePath, outputFilePath, execFilePath, dirCodes, dirOutputs, language });
        }
    }

    for (const result of results) {
        totalMemoryUsed += parseFloat(result.memoryUsed);
    }

    // Create a new Submission document
    const newSubmission = new Submission({
        userId,
        quesID:ques._id,
        language,
        code,
        verdict: finalVerdict,
        executionTime: totalExecutionTime,
        memoryUsed: totalMemoryUsed,
        testCases: results.map(result => ({
            testCase: result.testCase,
            input:result.input,
            yourOutput:result.yourOutput,
            ExpectedOutput:result.ExpectedOutput,
            result: result.result,
            executionTime: result.executionTime,
            memoryUsed: parseFloat(result.memoryUsed),
        })),
    });

    // Save the submission
    await newSubmission.save();


    res.json({ finalVerdict, success, results });
  }catch(error){
    console.error(`Error in submitting program: ${error}`);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Helper function to use exec with promises
const execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        try {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.log("error in exec");
                    reject(error);
                } else {
                    resolve(stdout);
                }
                if(stderr)
                    reject(stderr)
            });
        } catch (error) {
            console.log(error);
        }
        
    });
};

exports.runprogram= runprogram;
exports.submitProgram=submitProgram;