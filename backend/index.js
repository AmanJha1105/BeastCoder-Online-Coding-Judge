const express= require("express");
require('dotenv').config();
const router= require("./routes/user-routes");
const quesrouter= require("./routes/question-routes");
const cookieParser= require('cookie-parser');
const cors=require("cors");

const {ConnectDB}= require('./database/db');
const { generateFile } = require("./utils/generateFile");
const app=express();

app.use(cors({ credentials: true,  origin: "http://localhost:5173"}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/ques",quesrouter);

ConnectDB();

app.get("/",(req,res)=>{
    res.send("Hello from backend");
});

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        // const inputPath = await generateInputFile(input);
        // const output = await executeCpp(filePath, inputPath);
        // res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }

    res.json({language,code});
});

app.listen(5000);

