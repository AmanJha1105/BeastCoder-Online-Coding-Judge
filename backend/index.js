const express= require("express");
require('dotenv').config();
const router= require("./routes/user-routes");
const quesrouter= require("./routes/question-routes");
const submissionrouter= require("./routes/submissionRoutes");
const cookieParser= require('cookie-parser');
const cors=require("cors");

const {ConnectDB}= require('./database/db');
const app=express();

app.use(cors({ credentials: true,  origin: "http://localhost:5173"}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/ques",quesrouter);
app.use("/ques",submissionrouter);

ConnectDB();

app.get("/",(req,res)=>{
    res.send("Hello from backend");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(5000);

