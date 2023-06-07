const mongoose = require("mongoose");
const TicketSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    flightId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Flight",
        required:true,
    },
    seat:{
        type:Number,
        required:true
    },
    passengerName:{
        type:String,
        required:true
    },
    boardingDate:{
        type:Date,
        required:true
    },
    boardingTime:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Ticket",TicketSchema);