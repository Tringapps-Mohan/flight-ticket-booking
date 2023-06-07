const Admin = require("../models/Admin.js");
const bcrypt = require("bcryptjs");
const createError = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const Flight = require("../models/Flight.js");

module.exports = {
    register: async (req, res, next) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const admin = new Admin({
                ...req.body,
                password: hash
            })
            await admin.save();
            res.status(200).send("New admin created successfully.");
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const admin = await Admin.findOne({
                username: req.body.username
            });
            if (!admin)
                return next(createError(404, "admin not found!"));
            const isPasswordCorrect = await bcrypt.compare(req.body.password,admin.password);

            if(!isPasswordCorrect)
                return next(createError(400,"Wrong password or adminname."));

            const token = jwt.sign({id:admin.id,isAdmin:true},process.env.JWT);
            const {password,...others} = admin._doc;
            res.cookie("access_token",token,{
                httpOnly:true,
            }) .status(200).json({...others});
        } catch (err) {
            next(err);
        }
    },
    logout : async (req,res,next)=>{
        res.clearCookie("token");
        res.json({message:"Logged out successfully"});
    },
    getAllBookedFlights:async (req,res,next)=>{
        try{
            const bookedFlights = await Flight.find({ availableSeats : {$lt : capacity}});
            res.status(200).json({bookedFlights});
        }catch(err){
            next(err);
        }

    }
}
