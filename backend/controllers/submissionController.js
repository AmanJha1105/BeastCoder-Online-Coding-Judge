const { executeCpp } = require("../utils/executeCpp");
const { generateFile } = require("../utils/generateFile");
const TestCases= require("../model/testcases")
const question= require("../model/Question")
const path = require("path");
const fs = require("fs")
const { v4: uuid } = require('uuid');
const { exec } = require("child_process");

const runprogram= async(req,res)=>{

    console.log("called from frontend");
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        // // const inputPath = await generateInputFile(input);
          const output = await executeCpp(filePath);
          res.json({ filePath, output });
    } catch (error) {
       res.status(500).json({ error: error });
    }

}

// const submitProgram = async(req,res)=>{

//     console.log("inside submit code");

//     const { language = 'cpp', code ,quesID} = req.body;
//     // console.log(quesID);
//     // console.log(typeof(quesID));


//     if (code === undefined) {
//         return res.status(404).json({ success: false, error: "Empty code!" });
//     }

//     const ques = await question.findOne({titleslug : quesID});

//     //console.log("ques",ques._id);

//    //const idques = (ques._id).valueOf();
//    //idques.toString();
//    //console.log("idques",idques);

//     const  {testCase}  = await TestCases.findOne({ problemId : ques._id});

//    // console.log("testCase",testCase);

//     let testCases = testCase;

// //     let success = true;
// //     let finalVerdict = "AC";

// //     // Create necessary directories if they don't exist
// //     const dirCodes = path.join(__dirname, "../Codes");
// //     const outPath = path.join(__dirname, "../Outputs");
// //     const inPath = path.join(__dirname, "../Inputs");
// //     const shellPath = path.join(__dirname, "../Scripts");

// //     [dirCodes, outPath, inPath, shellPath].forEach((dir) => {
// //         if (!fs.existsSync(dir)) {
// //         fs.mkdirSync(dir, { recursive: true });
// //         }
// //     });

// //     // Helper function to create a file
// //     const createFile = (format, content) => {
// //         const jobID = uuid();
// //         const fileName = `${jobID}.${format}`;
// //         const filePath = path.join(dirCodes, fileName);
// //         fs.writeFileSync(filePath, content);
// //         return filePath;
// //     };

// //     // Helper function to create an input file
// //     const createInput = (content, base) => {
// //         const fileName = `${base}_input.txt`;
// //         const p_input = path.join(inPath, fileName);
// //         fs.writeFileSync(p_input, content);
// //         return p_input;
// //     };

// //     // Helper function to create a shell script for compilation
// //     const createCompileShell = (base, language) => {
// //         const fileName = `${base}_compile.sh`;
// //         const p_sh = path.join(shellPath, fileName);

// //         let content = "";
// //         if (language === "cpp") {
// //         content = `#!/bin/bash
// //     g++ ${base}.cpp -o ${base}.exe
// //     `;
// //         } else if (language === "c") {
// //         content = `#!/bin/bash
// //     gcc ${base}.c -o ${base}.exe
// //     `;
// //         }

// //         fs.writeFileSync(p_sh, content);
// //         return p_sh;
// //     };

// // // Helper function to create a shell script for execution
// // const createExecuteShell = (base, language) => {
// //     const fileName = `${base}_execute.sh`;
// //     const p_sh = path.join(shellPath, fileName);

// //     let content = "";
// //     if (language === "cpp") {
// //         content = `#!/bin/bash
// //         g++ ${base}.cpp -o ${base}
// //         ./${base} < ${base}_input.txt > ${base}_output.txt
// //         `;

// //         fs.writeFileSync(p_sh, content);
// //     }

// //     return p_sh;
// // };


// //   // Helper function to create an output file
// //   const createOutput = (base) => {
// //     console.log("this is base",base);
// //     const fileName = `${base}_output.txt`;
// //     const p_output = path.join(outPath, fileName);
// //     return p_output;
// //   };
// //   try {
// //     const results = [];

// //     for (let i = 0; i < testCase.length; i++) {
// //       // Generate a unique filename base
// //       const base = uuid();

// //       // Create the code file
// //       const filePath = createFile(language, code);
// //       const input = testCase[i].input;
// //       const output = testCase[i].output;

// //       // Create the input file
// //       const p_input = createInput(input, base);

// //       // Create the compilation shell script
// //       const p_compile_sh = createCompileShell(base, language);

// //       // Create the execution shell script
// //       const p_execute_sh = createExecuteShell(base, language);

// //       // Create the output file
// //       const p_output = createOutput(base);

// //       console.log(p_output);

// //       let verdict = "";
// //       try {
// //         const outputContent = fs.readFileSync(p_output, "utf-8");

// //         // Send the response with the output, execution time, and memory usage (assuming 0 for now)
// //         verdict = outputContent.trim() == output ? "AC" : "WA";

// //         if (verdict === "WA") {
// //             success = false;
// //         }
// //       }catch(error){
// //         console.error("error in testcase",error);
// //       }finally{
// //         // [filePath, p_input, p_compile_sh, p_execute_sh, p_output].forEach(
// //         //     (file) => {
// //         //       if (fs.existsSync(file)) {
// //         //         fs.unlinkSync(file);
// //         //       }
// //         //     }
// //         //   );
        
// //        }
// //        if(verdict !== "AC") {
// //         finalVerdict = verdict;
// //        }
// //         results.push({ verdict});
    

      

      
// //     }
// //     res.json({finalVerdict,success, results}); 
// //   }catch (err) {
// //     console.log(err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
  
//         const opPath = path.join(__dirname, "../outputs");
//         const drCode = path.join(__dirname, "../codes");
//         const drInput = path.join(__dirname, "../inputs");

//         if (!fs.existsSync(opPath)) {
//             console.log("creating new path");
//         fs.mkdirSync(opPath, { recursive: true });
//         }

//         if (!fs.existsSync(drCode)) {
//             console.log("creating new path");
//         fs.mkdirSync(drCode, { recursive: true });
//         }

//         if (!fs.existsSync(drInput)) {
//             console.log("creating new path");
//         fs.mkdirSync(drInput, { recursive: true });
//         }

        
//         const generateFile = async (format, content) => {
//             const Id = uuid();
//             const filename = format == "java" ? "Main.java" : `${Id}.${format}`;
//             const filepath = path.join(drCode, filename);
//             await fs.writeFileSync(filepath, content);
//             return filepath;
//           };
          
//           const generateInput = async (input) => {
//             const Id = uuid();
//             const filename = `${Id}.txt`;
//             const filepath = path.join(drInput, filename);
//             await fs.writeFileSync(filepath, input);
//             return filepath;
//           };
          
//           const executeCode = (filepath, language, inputPath) => {
//             const Id = path.basename(filepath).split(".")[0];
//             let outputPath;
//             if (language == "java") {
//               outputPath = path.join(opPath, `${Id}.class`);
//             } else {
//               outputPath = path.join(opPath, `${Id}.exe`);
//             }
          
//             let executeCmd;
          
//             switch (language) {
//               case "java":
//                 executeCmd = `javac -d /app/outputs /app/codes/${Id}.java  && java -cp /app/outputs ${Id} < /app/inputs/${path.basename(inputPath).split(".")[0]}.txt`;
//                 break;
//               case "py":
//                 executeCmd = `python -u /app/codes/${Id}.py < /app/inputs/${path.basename(inputPath).split(".")[0]}.txt`;
//                 break;
//               case "cpp":
//                 executeCmd = `g++ /backend/codes/${Id}.cpp -o /backend/outputs/${Id}.exe && /backend/outputs/${Id}.exe < /backend/inputs/${path.basename(inputPath).split(".")[0]}.txt`;
//                 break;
//               default:
//                 return Promise.reject(`Unsupported language: ${language}`);
//             }
          
//             return new Promise((resolve, reject) => {
//               exec(executeCmd, (error, stdout, stderr) => {
//                 if (error) {
//                   reject({ error, stderr });
//                 } else {
//                   resolve(stdout);
//                 }
//               });
//             });
//           };

//           const filepath = await generateFile(language, code);
//           console.log(filepath);

//          try {
            
//           for (let i = 0; i < testCases.length; i++) {
//             const testCase = testCases[i];
//             const inputPath = await generateInput(testCase.input);
//             console.log(inputPath);

//             const executionStartTime = performance.now();
      
//             const rawOutput = await executeCode(filepath, language, inputPath);
      
//             const executionEndTime = performance.now();
//             //const executionTime = executionEndTime - executionStartTime;
      
//             const output = rawOutput.replace(/\r\n/g, "\n").trim();
//             if (output !== testCase.output) {
//               submissionStatus = `Test cases ${i + 1} failed`;
//               return res.json({
//                 message: `Test cases ${i + 1} failed`,
//               });
//             }
      
            
//           }
          
//           return res.json({ message: "Code Accepted" });
//          } catch (error) {
//           errorInfo = {
//             message: error.message || "Compilation error",
//             stack: error.stack || "",
//           };
          
//           console.log(error);
//           return res.json({ message: errorInfo.message, error });
//         }
// }

const submitProgram = async (req, res) => {
    const { language = 'cpp', code, quesID } = req.body;

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
        const codeFilePath = path.join(dirCodes, `${jobID}.cpp`);
        const inputFilePath = path.join(dirInputs, `${jobID}_input.txt`);
        const outputFilePath = path.join(dirOutputs, `${jobID}_output.txt`);
        const execFilePath = path.join(dirOutputs, `${jobID}.exe`);

        // Write the code and input to files
        fs.writeFileSync(codeFilePath, code);
        fs.writeFileSync(inputFilePath, test.input);

        const compileCmd = `g++ "${codeFilePath}" -o "${execFilePath}"`;
        const executeCmd = `"${execFilePath}" < "${inputFilePath}" > "${outputFilePath}"`;

        try {
            // Compile the code
            await execPromise(compileCmd);

            // Execute the compiled code
            await execPromise(executeCmd);

            // Read the output and compare
            const outputContent = fs.readFileSync(outputFilePath, 'utf-8').trim();
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
        } finally {
            // Cleanup files
            [codeFilePath, inputFilePath, outputFilePath, execFilePath].forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
        }
    }

    res.json({ finalVerdict, success, results });
};

// Helper function to use exec with promises
const execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};


exports.runprogram= runprogram;
exports.submitProgram=submitProgram;