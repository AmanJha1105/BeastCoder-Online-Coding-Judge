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
    let codeFilePath, inputFilePath, outputFilePath, execFilePath;

    const { language, code, input } = req.body;

    const baseDir = path.join(__dirname, "../");
    const dirCodes = path.join(baseDir, "codes");
    const dirInputs = path.join(baseDir, "inputs");
    const dirOutputs = path.join(baseDir, "outputs");

    let outputContent, result;

    try {
        const jobID = uuid();

        if (!input) {
            outputContent = "Please provide valid input.";
            return res.json({ outputContent, result });
        }

        [dirCodes, dirInputs, dirOutputs].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        ({ codeFilePath, inputFilePath, outputFilePath, execFilePath } = getPaths({ dirCodes, dirInputs, dirOutputs, jobID, language }));

        fs.writeFileSync(inputFilePath, input);
        fs.writeFileSync(codeFilePath, code);

        let { compileCmd, executeCmd } = getCommands({ language, codeFilePath, inputFilePath, outputFilePath, execFilePath, dirOutputs });

        try {
            await execPromise(compileCmd);
            await execPromisewithTLE(executeCmd, TIME_LIMIT,jobID,language);
        } catch (error) {
            console.log("called 1");
            console.log(error);
            if (error.message === "TLE") {
                result = "TLE";
            } else {
                result = "Runtime Error. Please recheck your code.";
            }
            return res.json({ outputContent, result });
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
    return res.json({ outputContent, result });
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

        for (const test of testCase) {
            const jobID = uuid();
            let { codeFilePath, inputFilePath, outputFilePath, execFilePath } = getPaths({ dirCodes, dirInputs, dirOutputs, jobID, language });

            fs.writeFileSync(codeFilePath, code);
            fs.writeFileSync(inputFilePath, test.input);

            let { compileCmd, executeCmd } = getCommands({ language, codeFilePath, inputFilePath, outputFilePath, execFilePath, dirOutputs });

            try {
                await execPromise(compileCmd);
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
                console.log("Error in executing testcase:",{error})
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

            } finally {
                unlinkAllFiles({ codeFilePath, inputFilePath, outputFilePath, execFilePath, dirCodes, dirOutputs, language });
            }
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

        return res.json({ finalVerdict, success, results });
    } catch (error) {
        console.error(`Error in submitting program: ${error}`);
        const newSubmission = new Submission({
            userId,
            quesID: ques._id,
            titleslug: ques.titleslug,
            language,
            code,
            verdict: finalVerdict,
            executionTime: 0,
            memoryUsed: 0,
            testCases: results.map(result => ({
                testCase: result.testCase,
                input: result.input,
                yourOutput:result.yourOutput ||"N/A",
                ExpectedOutput: result.ExpectedOutput,
                result: result.result,
                executionTime: result.executionTime,
                memoryUsed: parseFloat(result.memoryUsed),
            })),
        });
        await newSubmission.save();
        console.log("error is".errorMessage);
        return res.json({ finalVerdict, success, results });
    }
};

const execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        try {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout);
                }
            });
        } catch (error) {
            console.log(error);
        }
    });
};

const execPromisewithTLE = (cmd, timelimit,jobID,language) => {
    return new Promise((resolve, reject) => {
        try {

            let flag = true;

            const proc = exec(cmd, (error, stdout, stderr) => {
                flag = false;
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout);
                }
            });

            setTimeout(() => {
                if(!flag)return;
                const WindowCmd = `taskkill /F /IM ${jobID}.exe`;
                const OtherCMD = `pkill -f ${jobID}.exe`;
                let killCmd;
                if (os.platform() === 'win32') {
                    if (language === 'py') {
                        killCmd = `taskkill /F /IM python.exe`;
                    } else if(language==='java'){
                        killCmd = `taskkill /F /IM java.exe`;
                    }else {
                        killCmd = `taskkill /F /IM ${jobID}.exe`;
                    }
                }else { 
                    if (language === 'python') {
                        killCmd = `kill -9 python.exe`;
                    } else {
                        killCmd = `pkill -f ${jobID}.exe`;
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
            console.log(error);
        }
    });
};
exports.runprogram = runprogram;
exports.submitProgram = submitProgram;