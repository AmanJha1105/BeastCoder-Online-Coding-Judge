const TestCases= require("../model/testcases")
const question= require("../model/Question")
const path = require("path");
const fs = require("fs")
const {getCommands, getPaths, unlinkAllFiles}=require("../helper/functions")
const { v4: uuid } = require('uuid');
const { exec} = require("child_process");

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
        console.log("statement 1 ok");
        await execPromise(executeCmd);
        
        console.log("statement 2 ok")
        outputContent = fs.readFileSync(outputFilePath, 'utf-8').trim();
        console.log("this is output content",outputContent);
        
    } catch (error) {
        console.error(`Error in executing program: ${error}`);
        throw error;
    }finally{
        unlinkAllFiles({codeFilePath,inputFilePath,outputFilePath,execFilePath,dirCodes,dirOutputs,language});
    }
    return res.json(outputContent);
};

const submitProgram = async (req, res) => {
    console.log("inside submit program");
    const { language = 'cpp', code, quesID } = req.body;
    //console.log(language);

    if (!code) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

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

    for (const test of testCase) {
        const jobID = uuid();
        
        let{codeFilePath,inputFilePath,outputFilePath,execFilePath} = getPaths({dirCodes,dirInputs,dirOutputs,jobID,language});

        // Write the code and input to files
        fs.writeFileSync(codeFilePath, code);
        fs.writeFileSync(inputFilePath, test.input);
      //  console.log(test.input);

      let {compileCmd, executeCmd} = getCommands({language,codeFilePath,inputFilePath,outputFilePath,execFilePath});

        try {
            // Compile the code
            await execPromise(compileCmd);
 
            // Execute the compiled code
            await execPromise(executeCmd);

            // Read the output and compare
            const outputContent = fs.readFileSync(outputFilePath, 'utf-8').trim();
            //console.log("this is outputcontent",outputContent);
            const verdict = outputContent === test.output.trim() ? "AC" : "WA";
            if (verdict === "WA") {
                success = false;
                finalVerdict = "WA";
            }
            results.push({ verdict, output: outputContent });
        } catch (error) {
            console.error(`Error in executing test case: ${error}`);
            results.push({ verdict: "RE", error: error.message });
            success = false;
            finalVerdict = "RE";
            [codeFilePath, inputFilePath, outputFilePath, execFilePath].forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
        } finally {
            // Cleanup files
            unlinkAllFiles({codeFilePath,inputFilePath,outputFilePath,execFilePath,dirCodes,dirOutputs,language});
        }
    }
    res.json({ finalVerdict, success, results });
};

// Helper function to use exec with promises
const execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log("error in exec");
                reject(error);
            } else {
                resolve(stdout);
            }
            if(stderr)
                console.log("stderr is",stderr);
        });
    });
};

exports.runprogram= runprogram;
exports.submitProgram=submitProgram;