const express= require('express');
const { signup, login, verifyToken, refreshToken,getUser } = require('../controllers/user-controller');
const router= express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/user",verifyToken,getUser);
router.get("/refresh",refreshToken,verifyToken,getUser)
module.exports=router;