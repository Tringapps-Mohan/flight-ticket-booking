const express = require("express");
const {register,login,logout} = require("../controllers/user.js");
const {verifyToken,verifyUser} = require("../utils/verifyToken.js");
const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);


// router.get("/checkauthentication",verifyToken,(req,res,next)=>{
//     res.send("Hello you are logged in");
// });

// router.get("/check/:id",verifyUser,(req,res,next)=>{
//     res.send("hello you are logged in.");
// })
module.exports = router;