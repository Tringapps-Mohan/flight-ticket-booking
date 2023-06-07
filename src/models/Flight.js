const mongoose = require("mongoose");
const FlightSchema = new mongoose.Schema({
    flightNumber:{
        type:Number,
        required:true,
        unique:true
    },
    departureDate:{
        type:Date,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },
    arrivalDate:{
        type:Date,
        required:true
    },
    arrivalTime:{
        type:String,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    availableSeats:{
        type:Number,
        default:60,
        required:true
    },
    isBooked:{
        type:Boolean,
        default:false,
        required:true
    }
});

module.exports = mongoose.model("Flight",FlightSchema);