const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    username:{
        type: String,
        unique:true,
        required : true,
    },
    email:{
        type: String,
        unique: true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    fullname: { type: String, default: "" },
    location: { type: String, default: "" },
    githubUsername: { type: String, default: "" },
    linkedinUsername: { type: String, default: "" },
    skills: { type: String, default: "" },
    education: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
});

module.exports=mongoose.model('user',userSchema);