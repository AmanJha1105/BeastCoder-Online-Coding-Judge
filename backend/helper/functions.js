const path = require("path");
const fs = require("fs")

const getCommands=({language,codeFilePath,inputFilePath,outputFilePath,execFilePath,dirOutputs})=>{
    
    let compileCmd, executeCmd;
 
    switch (language) {
        case 'cpp':
            compileCmd = `g++ "${codeFilePath}" -o "${execFilePath}"`;
            executeCmd = `"${execFilePath}" < "${inputFilePath}" > "${outputFilePath}"`;
            break;
        case 'c':
            compileCmd = `gcc "${codeFilePath}" -o "${execFilePath}"`;
            executeCmd = `"${execFilePath}" < "${inputFilePath}" > "${outputFilePath}"`;
            break;
        case 'java':
            // Update the classpath to the current directory
            compileCmd = `javac "${codeFilePath}" -d "${dirOutputs}"`;
            executeCmd = `java -classpath "${dirOutputs}" Main < "${inputFilePath}" > "${outputFilePath}"`;
            break;
        case 'py':
            compileCmd = `python -m py_compile "${codeFilePath}"`;
            executeCmd = `python "${codeFilePath}" < "${inputFilePath}" > "${outputFilePath}"`;
            break;
        default:
            throw new Error("Unsupported language");
    }

    return {compileCmd,executeCmd};

}

const getPaths =({dirCodes,dirInputs,dirOutputs,jobID,language})=>{

    let codeFilePath;
        if(language!=="java")
            codeFilePath = path.join(dirCodes, `${jobID}.${language}`);
        if(language==="java")
            codeFilePath = path.join(dirCodes,"Main.java");

        const inputFilePath = path.join(dirInputs, `${jobID}_input.txt`);
        
        let outputFilePath;
        if(language==="java")
            outputFilePath = path.join(dirOutputs, `${jobID}_output.class`);
        if(language!=="java")
            outputFilePath = path.join(dirOutputs, `${jobID}_output.txt`);

        let execFilePath='';
        if(language==="py")
            execFilePath="";
        else if(language!=="py")
            execFilePath= path.join(dirOutputs, `${jobID}.exe`);

        return {codeFilePath,inputFilePath,outputFilePath,execFilePath};

}

const unlinkAllFiles = ({codeFilePath,inputFilePath,outputFilePath,execFilePath,dirCodes,dirOutputs,language})=>{
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
}

exports.getCommands=getCommands;
exports.getPaths=getPaths;
exports.unlinkAllFiles=unlinkAllFiles;