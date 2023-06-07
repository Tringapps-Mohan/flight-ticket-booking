const express = require("express");
const {register,login} = require("../controllers/user.js");
const verifyToken = require("../utils/verifyToken.js");
const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/checkauthentication",verifyToken,(req,res,next)=>{
    res.send("Hello you are logged in");
})
module.exports = router;