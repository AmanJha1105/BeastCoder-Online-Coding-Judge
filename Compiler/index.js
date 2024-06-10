const express= require("express");
require('dotenv').config();

const submissionrouter= require("./routes/submitRoutes");

const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser');
const cors=require("cors");

const {ConnectDB}= require('./database/db');
const app=express();

app.use(cors({ credentials: true,  origin: "https://beast-coder-online-coding-judge.vercel.app"}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


app.use("/ques",submissionrouter);

ConnectDB();

app.get("/",(req,res)=>{
    res.send("Hello from Compiler");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8000);

