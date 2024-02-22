const express= require("express");
require('dotenv').config();
const router= require("./routes/user-routes");
const cookieParser= require('cookie-parser');
const cors=require("cors");

const {ConnectDB}= require('./database/db');
const app=express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/',router);

ConnectDB();

app.get("/",(req,res)=>{
    res.send("Hello from backend");
});

app.listen(8000);