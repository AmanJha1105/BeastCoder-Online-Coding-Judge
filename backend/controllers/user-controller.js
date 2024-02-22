const User=require('../model/User');
const bcrypt= require("bcryptjs");

const signup= async(req,res,next)=>{

    const {name,email,password}=req.body;

    let existingUser;
    try {
        existingUser= await User.findOne({email:email});
    } catch (error) {
        console.log("something went wrong",error);
    }

    if(existingUser)
    {
        return res.status(400).json({message:"Email already exists"});
    }

    //hashing the password before storing in db
    const hashedPassword=bcrypt.hashSync(password,10);
    //creating new user 

    const user= new User({
       name,
       email,
       password: hashedPassword
    });

    try {
        await user.save();//saving the user using save method given by mongoose
    } catch (error) {
        console.log(error);
    }
    
    return res.status(201).json({message:user});
}

exports.signup=signup;