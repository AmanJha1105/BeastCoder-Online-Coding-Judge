const User=require('../model/User');
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");

const JWT_SECRET_KEY= process.env.JWT_SECRET_KEY;

//creating signup functionality
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
    const hashedPassword=bcrypt.hashSync(password);
    //creating new user 

    const user= new User({
       name,
       email,
       password: hashedPassword,
    });

    try {
        await user.save();//saving the user using save method given by mongoose
    } catch (error) {
        console.log(error);
    }
    
    return res.status(201).json({message:user});
}

//creating login route

const login =async(req,res,next)=>{

    console.log("login function called");

    const {email,password}=req.body;
   // console.log(email,password);
    //check if user exists
    let existingUser;
    try {
        existingUser= await User.findOne({email:email});
    } catch (error) {
        return new Error(error);
    }
    //if user does not exist throw error
    if(!existingUser){
        return res.status(400).json({message:"Invalid Credentials"});
    }

    //check password

    const isPasswordCorrect= bcrypt.compareSync(password,existingUser.password);
    
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid details"});
    }
    
    //if password correct then login
    //generate token for correct details.

    const token= jwt.sign({id:existingUser._id},JWT_SECRET_KEY,{
        expiresIn:"2hr",
    });

    //console.log("gernerated token\n", token);

    if(req.cookies[`${existingUser._id}`]){
        req.cookies[`${existingUser._id}`]="";
    }

    //sending cookie when user logs in

    res.cookie(String(existingUser._id),token,{
        path:"/",
        expires: new Date(Date.now()+1000*60*60*2),
        httpOnly: true,
        sameSite: 'lax',
        secure:false,
    })

    return res.status(200).json({message:"Successfully logged in",user:existingUser,token});
};

//verifying token

const verifyToken = (req,res,next)=>{

    //console.log("verify token called");

    const cookies=req.headers.cookie;
    console.log(cookies);
    
    const token= cookies.split("=")[5];
   // console.log("token is",token);

    if(!token){
        res.status(404).json({message:"No token found"});
    }
    jwt.verify(String(token),JWT_SECRET_KEY,(err,user)=>{
        if(err)
        {
            return res.status(400).json({message:"Invalid token "});
        }
        console.log(user.id);
        req.id=user.id;
        next();
    });
};

//getting details of user from that token

const getUser= async(req,res,next)=>{
   const userId= req.id;
   let user;
   try {
     user=await User.findById(userId,"-password");
   } catch (error) {
      return new Error(error);
   }

   if(!user){
    return res.status(404).json({message:"User not found "});
   }

   return res.status(200).json({user});
};

const refreshToken = (req,res,next)=>{

   // console.log("called refresh function");

    const cookies=req.headers.cookie;
    console.log(cookies);
    
    const prevtoken = cookies.split("=")[5];
    if(!prevtoken){
        return res.status(400).json({message: "Couldn't find token"});
    }
    console.log("prev token is",prevtoken);
    jwt.verify(String(prevtoken),JWT_SECRET_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message: "Authentication failed"});
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`]="";
        const token = jwt.sign({id:user.id},JWT_SECRET_KEY,{
            expiresIn:"2hr"
        })

        //console.log("Regenerated token\n",token);

        res.cookie(String(user.id),token,{
            path:"/",
            expires: new Date(Date.now()+1000*60*60*2),
            httpOnly: true,
            sameSite: 'lax'
        });

        req.id=user.id;
        next();

    })
}

exports.signup=signup;
exports.login=login;
exports.verifyToken=verifyToken;
exports.getUser=getUser;
exports.refreshToken=refreshToken;