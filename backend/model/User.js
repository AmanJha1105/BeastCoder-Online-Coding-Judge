const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    fullname: {
        type: String,
    },
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
    fullName: { type: String, },
    location: { type: String },
    githubUsername: { type: String },
    linkedinUsername: { type: String },
    skills: { type: String },
    education: { type: String },
    profilePicture: { type: String },
});

module.exports=mongoose.model('user',userSchema);