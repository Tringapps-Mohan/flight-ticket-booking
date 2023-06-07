const Flight = require("../models/Flight.js");
const createError = require("../utils/error.js");

module.exports = {
    addFlight: async (req, res,next) => {

        const flight = new Flight(req.body);

        try {
            const savedFlight = await flight.save();
            res.status(200).json(savedFlight);
        } catch (err) {
            next(err);            
        }
    },
    updateFlight: async (req,res,next)=>{
        try{
            const updatedFlight = await Flight.findByIdAndUpdate(req.params.flightId,{$set : req.body},{new :true});
            res.status(200).json(updatedFlight);
        }catch(err){
            next(err);
        }
    },

    removeFlight : async (req,res,next)=>{
        try{
            await Flight.findByIdAndDelete(req.params.flightId);
            res.status(200).json("Flight has been deleted");
        }catch(err){
            next(err);
        }
    },

    getAllFlights : async (req,res,next)=>{
        try{
            const flights = await Flight.find();
            res.status(200).json(flights);
        }catch(err){
            next(err);
        }
    },

    getFlight : async (req,res,next)=>{
        try{
            const flight = await Flight.findById(req.params.flightId);
            res.status(200).json(flight);
        }catch(error){
            next(err);
        }
    }
}