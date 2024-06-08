const TestCases = require("../model/testcases");
const question = require("../model/Question");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { getCommands, getPaths, unlinkAllFiles } = require("../helper/functions");
const { v4: uuid } = require('uuid');
const { exec,execSync } = require("child_process");
const Submission = require("../model/Submissions");

const TIME_LIMIT = 1700;

const runprogram = async (req, res) => {
    let codeFilePath, execFilePath, inputFilePath, outputFilePath;
    const { language, code, input } = req.body;

    const baseDir = path.join(__dirname, "../");
    const dirCodes = path.join(baseDir, "codes");
    const dirInputs = path.join(baseDir, "inputs");
    const dirOutputs = path.join(baseDir, "outputs");

    let outputContent, result,errorMessage="";

    try {
        const jobID = uuid();

        if (!input) {
            outputContent = "Please provide valid input.";
            return res.json({ outputContent, result,errorMessage });
        }

        [dirCodes, dirInputs, dirOutputs].forEach(dir => {
            if (!fs.existsSync(dir)) { 
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        ({ codeFilePath, execFilePath } = getPaths({ dirCodes, dirOutputs, jobID, language }));

         inputFilePath = path.join(dirInputs, `${jobID}_input.txt`);
         outputFilePath = path.join(dirOutputs, `${jobID}_output.txt`);



        fs.writeFileSync(inputFilePath, input);
        fs.writeFileSync(codeFilePath, code);

        const { compileCmd, executeCmdTemplate } = getCommands({ language, codeFilePath, execFilePath, dirOutputs });

        const executeCmd = executeCmdTemplate.replace("{inputFilePath}", inputFilePath).replace("{outputFilePath}", outputFilePath);


        try {
            await execPromise(compileCmd);
            await execPromisewithTLE(executeCmd, TIME_LIMIT,jobID,language);
        } catch (error) {
            console.log(error);
            if (error.message === "TLE") {
                result = "TLE";
            } else {
                errorMessage = error.stderr;
            }

            return res.json({ outputContent, result,errorMessage });
        }
        outputContent = fs.readFileSync(outputFilePath, 'utf-8');
        console.log("output content is", outputContent);
        if (outputContent.length === 0) {
            result = "Runtime Error. Please recheck your code.";
        }
        outputContent.trim();
        console.log(outputContent);

    } catch (error) {
        console.error(`Error in executing program: ${error}`);
    } finally {
        unlinkAllFiles({ codeFilePath, inputFilePath, outputFilePath, execFilePath, dirCodes, dirOutputs, language });
    }
    return res.json({ outputContent, result ,errorMessage});
};

const submitProgram = async (req, res) => {
    const { language = 'cpp', code, quesID ,userId} = req.body;

    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

    const results = [];
    let success = true;
    let finalVerdict = "AC";
    let totalExecutionTime = 0;
    let totalMemoryUsed = 0;
    let errorMessage="";

    const ques = await question.findOne({ titleslug: quesID });
    const { testCase } = await TestCases.findOne({ problemId: ques._id });

    try {
        const baseDir = path.join(__dirname, "../");
        const dirCodes = path.join(baseDir, "codes");
        const dirInputs = path.join(baseDir, "inputs"); 
        const dirOutputs = path.join(baseDir, "outputs");

        [dirCodes, dirInputs, dirOutputs].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        const jobID = uuid();
        let { codeFilePath, execFilePath } = getPaths({ dirCodes, dirOutputs, jobID, language });
        console.log(codeFilePath,execFilePath);

        fs.writeFileSync(codeFilePath, code);

        const { compileCmd, executeCmdTemplate } = getCommands({ language, codeFilePath, execFilePath, dirOutputs });

        try {
            await execPromise(compileCmd); 
        } catch (error) {
            unlinkAllFiles({ codeFilePath, execFilePath });
            errorMessage=error.stderr|| "Unknown Error";
            const newSubmission = new Submission({
                userId,
                quesID: ques._id,
                titleslug: ques.titleslug,
                language,
                code,
                verdict: "RE",
                executionTime: 0,
                memoryUsed: 0,
                testCases: results?.map(result => ({
                    testCase: result.testCase,
                    input: result.input,
                    yourOutput: result.yourOutput ||"N/A",
                    ExpectedOutput: result.ExpectedOutput,
                    result: result.result,
                    executionTime: result.executionTime,
                    memoryUsed: parseFloat(result.memoryUsed),
                })), 
            });
    
            await newSubmission.save();
            return res.status(200).json({ finalVerdict:"fail",success: false, results, errorMessage });
        }

        for (const test of testCase) {


            const inputFilePath = path.join(dirInputs, `${jobID}_${test._id}_input.txt`);
            const outputFilePath = path.join(dirOutputs, `${jobID}_${test._id}_output.txt`);


            fs.writeFileSync(inputFilePath, test.input);

            const executeCmd = executeCmdTemplate.replace("{inputFilePath}", inputFilePath).replace("{outputFilePath}", outputFilePath);

            try {
                
                const startTime = process.hrtime();
                await execPromisewithTLE(executeCmd, TIME_LIMIT,jobID,language);
                const endTime = process.hrtime(startTime);
                const executionTime = endTime[0] * 1000 + endTime[1] / 1e6;
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
                    input: test.input,
                    yourOutput: outputContent,
                    ExpectedOutput: test.output,
                    result: verdict, 
                    executionTime, 
                    memoryUsed: parseFloat(memoryUsageInMB),
                    output: outputContent 
                });
 
            } catch (error) {
                let verdict = "RE";
                if (error.message === "TLE") {
                    verdict = "TLE";
                    finalVerdict = "TLE";
                } else {
                    finalVerdict = "RE";
                }
                console.log("Error in executing testcase:",error)
                results.push({
                    testCase: test._id,
                    input: test.input,
                    yourOutput: "",
                    ExpectedOutput: test.output,
                    result: verdict,
                    executionTime: 0,
                    memoryUsed: 0,
                });
                success = false;
               
                errorMessage = error.stderr;
                break;

            } finally {
                unlinkAllFiles({ inputFilePath, outputFilePath });
            }
        }

        try {
            unlinkAllFiles({ codeFilePath, execFilePath, dirCodes, dirOutputs, language });
        } catch (error) {
            console.error("Error unlinking files");
        }

        const newSubmission = new Submission({
            userId,
            quesID: ques._id,
            titleslug: ques.titleslug,
            language,
            code,
            verdict: finalVerdict,
            executionTime: totalExecutionTime,
            memoryUsed: totalMemoryUsed,
            testCases: results.map(result => ({
                testCase: result.testCase,
                input: result.input,
                yourOutput: result.yourOutput ||"N/A",
                ExpectedOutput: result.ExpectedOutput,
                result: result.result,
                executionTime: result.executionTime,
                memoryUsed: parseFloat(result.memoryUsed),
            })), 
        });
        await newSubmission.save();
        return res.status(200).json({ finalVerdict, success, results,errorMessage });
    } catch (error) {
        console.error(`Error in submitting program: ${error}`);
        
        return res.json({ finalVerdict, success, results ,errorMessage});
    }
};

const execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        try {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                }
                if (stderr) {
                    reject({stderr});
                }
                resolve(stdout);
            });
        } catch (error) {
            console.log(error);
        }
    }); 
};


const execPromisewithTLE = (cmd, timelimit, jobID, language) => {
    console.log("inside tle promise");
    return new Promise((resolve, reject) => {
        try {
            let flag = true;

            const proc = exec(cmd, (error, stdout, stderr) => {
                flag = false;
                if (error) {
                    reject({ error, stderr });
                }
                if (stderr) {
                    reject(stderr);
                }
                resolve(stdout);
            });

            setTimeout(() => {
                if (!flag) return;
                let killCmd;

                if (os.platform() === 'win32') {
                    if (language === 'py') {
                        killCmd = `taskkill /F /IM python.exe`;
                    } else if (language === 'java') {
                        killCmd = `taskkill /F /IM java.exe`;
                    } else {
                        killCmd = `taskkill /F /IM ${jobID}.exe`;
                    }
                } else { 
                    if (language === 'py') {
                        killCmd = `pkill -f python`; 
                    } else if (language === 'java') {
                        killCmd = `pkill -f java`;
                    } else {
                        killCmd = `pkill -f ${jobID}.out`;
                    }
                }

                try {
                    execSync(killCmd);
                } catch (error) {
                    console.error("Error killing process:", error);
                }
                reject(new Error("TLE"));
            }, timelimit);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

exports.runprogram = runprogram;
exports.submitProgram = submitProgram;