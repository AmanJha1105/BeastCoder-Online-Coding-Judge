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
       username:name,
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

const login = async (req, res, next) => {
    console.log("login function called");
  
    const { email, password } = req.body;
  
    // Check if user exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (error) {
      return new Error(error);
    }
  
    // If user does not exist, throw error
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  
    // Check password
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid details" });
    }
  
    // If password is correct, generate token
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
      expiresIn: "2hr",
    });
  
    // Clear any existing token cookie
    if (req.cookies['token']) {
      res.clearCookie('token');
    }
  
    // Send cookie with token when user logs in
    res.cookie('token', token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set to true if using HTTPS
    });
  
    return res.status(200).json({ message: "Successfully logged in", user: existingUser, token });
  };
  

//verifying token

const verifyToken = (req, res, next) => {
    console.log("verify token called");
  
    const token = req.cookies.token;
    console.log("token is", token);
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }
  
    console.log("token is", token);
  
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(400).json({ message: "Invalid token" });
      }
      console.log("userid is", user.id);
      req.id = user.id;
      next();
    });
  };
  

  

//getting details of user from that token

const getUser= async(req,res,next)=>{
   console.log("inside get user");
   const userId= req.id;
   console.log("userid is",userId);
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

const refreshToken = (req, res, next) => {
    console.log("refreshToken called");
  
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }
  
    console.log("refreshToken token is", token);
  
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Authentication failed" });
      }
  
      res.clearCookie('token');
      const newToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
        expiresIn: "2h"
      });
  
      res.cookie('token', newToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // set to true if using HTTPS
      });
  
      req.id = user.id;
      next();
    });
  };
  

const logout = (req, res, next) => {
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Successfully logged out' });
  };
  

exports.signup=signup;
exports.login=login;
exports.verifyToken=verifyToken;
exports.getUser=getUser;
exports.refreshToken=refreshToken;
exports.logout = logout;