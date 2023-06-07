const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes.js");
const adminRoute = require("./routes/adminRoutes.js");
const flightRoute = require("./routes/flightRoutes.js");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongodb");
    } catch (error) {
        console.log(error);
    }
}

app.use(cookieParser());
app.use(express.json());

app.use("/users", userRoute);
app.use("/admin",adminRoute);
app.use("/flights",flightRoute);

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack
    });
})


mongoose.connection.on("disconnected",()=>{
    console.log("mongodb disconnected");
});

app.listen(1000, () => {
    connect();
    console.log("Server started.");
});