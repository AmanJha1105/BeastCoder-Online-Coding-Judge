const express= require("express");
require('dotenv').config();
const router= require("./routes/user-routes");
const quesrouter= require("./routes/question-routes");
const solutionsrouter = require("./routes/solutionsRoutes");
const submissionrouter= require("./routes/submissionRoutes");
const discussionrouter = require("./routes/discussionRoutes");
const leaderboardrouter = require("./routes/leaderboardRoutes");
const profilerouter = require("./routes/profileRoutes");
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser'); 
const cors=require("cors");
const path = require('path'); 

const {ConnectDB}= require('./database/db');
const app=express();

const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true,  origin: "http://localhost:5173"}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/profile', express.static(path.join(__dirname, 'uploads')));
app.use("/api", router);
app.use("/ques",quesrouter);
app.use("/ques",submissionrouter);
app.use("/ques",solutionsrouter);
app.use("/ques",discussionrouter);
app.use("/api",leaderboardrouter); 
app.use("/profile",profilerouter);

ConnectDB();

app.get("/",(req,res)=>{
    res.send("Hello from backend");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(PORT);

 