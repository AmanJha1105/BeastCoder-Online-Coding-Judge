const { executeCpp } = require("../utils/executeCpp");
const { generateFile } = require("../utils/generateFile");

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

const submitProgram = async(req,res)=>{
    const { language = 'cpp', code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

}

exports.runprogram= runprogram;
exports.submitProgram=submitProgram;