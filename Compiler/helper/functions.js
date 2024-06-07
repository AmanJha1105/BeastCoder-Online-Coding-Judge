const path = require("path");
const fs = require("fs");
const os = require("os");

const getCommands = ({ language, codeFilePath, execFilePath, dirOutputs }) => {
    try {
        let compileCmd, executeCmdTemplate;

        switch (language) {
            case 'cpp':
                compileCmd = `g++ "${codeFilePath}" -o "${execFilePath}"`;
                executeCmdTemplate = `"${execFilePath}" < "{inputFilePath}" > "{outputFilePath}"`;
                break;
            case 'c':
                compileCmd = `gcc "${codeFilePath}" -o "${execFilePath}"`;
                executeCmdTemplate = `"${execFilePath}" < "{inputFilePath}" > "{outputFilePath}"`;
                break;
            case 'java':
                compileCmd = `javac "${codeFilePath}" -d "${dirOutputs}"`;
                executeCmdTemplate = `java -classpath "${dirOutputs}" Main < "{inputFilePath}" > "{outputFilePath}"`;
                break;
            case 'py':
                compileCmd = `python -m py_compile "${codeFilePath}"`;
                executeCmdTemplate = `python "${codeFilePath}" < "{inputFilePath}" > "{outputFilePath}"`;
                break;
            default:
                throw new Error("Unsupported language");
        }

        return { compileCmd, executeCmdTemplate };
    } catch (error) {
        console.error(`An error occurred in getting commands: ${error}`);
        throw new Error("Error occurred in getting commands");
    }
};

const getPaths = ({ dirCodes, dirOutputs, jobID, language }) => {
    try {
        let codeFilePath;
        if (language !== "java") {
            codeFilePath = path.join(dirCodes, `${jobID}.${language}`);
        } else {
            codeFilePath = path.join(dirCodes, "Main.java");
        }

        let execFilePath = '';
        const platform = os.platform();

        if (language === "py") {
            execFilePath = ""; 
        } else if (language === "java") {
            execFilePath = "";
        } else {
            if (platform === 'win32') {
                execFilePath = path.join(dirOutputs, `${jobID}.exe`);
            } else {
                execFilePath = path.join(dirOutputs, `${jobID}.out`); 
            }
        }

        return { codeFilePath, execFilePath };
    } catch (error) {
        console.error(`An error occurred in getting paths: ${error}`);
        throw new Error("Error occurred in getting paths");
    }
};


const unlinkAllFiles = ({codeFilePath,inputFilePath,outputFilePath,execFilePath,dirCodes,dirOutputs,language})=>{
    try {
        [codeFilePath, inputFilePath, outputFilePath, execFilePath].forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
        
        if (language === 'py') {
            const pycacheDir = path.join(dirCodes, "__pycache__");
            if (fs.existsSync(pycacheDir)) {
                fs.readdirSync(pycacheDir).forEach(file => {
                    const filePath = path.join(pycacheDir, file);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); 
                    }
                });
                fs.rmdirSync(pycacheDir);
            }
        }
    
        if (language === 'java') {
            // Remove Main.class file for Java
            const classFilePath = path.join(dirOutputs, "Main.class");
            if (fs.existsSync(classFilePath)) {
                fs.unlinkSync(classFilePath);
            }
        } else if (language !== 'python') {
            if (fs.existsSync(execFilePath)) {
                fs.unlinkSync(execFilePath);
            }
        }
    } catch (error) {
        console.error(`An error occured in unlinking files: ${error}`);
        return res.status(500).json({message:"Error occured in unlinking files"})
    }
}



exports.getCommands=getCommands;
exports.getPaths=getPaths;
exports.unlinkAllFiles=unlinkAllFiles;