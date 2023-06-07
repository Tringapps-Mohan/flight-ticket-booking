const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const createError = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = {
    register: async (req, res, next) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const user = new User({
                ...req.body,
                password: hash
            })
            await user.save();
            res.status(200).send("New User created successfully.");
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const user = await User.findOne({
                username: req.body.username
            });
            if (!user)
                return next(createError(404, "User not found!"));
            const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);

            if(!isPasswordCorrect)
                return next(createError(400,"Wrong password or username."));

            const token = jwt.sign({id:user.id},process.env.JWT);
            const {password,isAdmin,...others} = user._doc;
            res.cookie("access_token",token,{
                httpOnly:true,
            }) .status(200).json({...others});
        } catch (err) {
            next(err);
        }
    },
    logout : (req,res,next)=>{
        res.clearCookie("token");
        res.json({message:"Logged out successfully"});
    },
    myBookings : async (req,res,next)=>{
        try{
            const 
    }
}
