const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  refreshToken,
  logout,
  updateProfile,
  getUserfromUsername,
} = require("../controllers/user-controller");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.put("/update/:username",upload.single('image'),updateProfile)
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout",logout);
router.get("/getUser/:username",getUserfromUsername);
module.exports = router;