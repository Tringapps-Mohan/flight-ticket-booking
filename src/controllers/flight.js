const Flight = require("../models/Flight.js");
const User = require("../models/User.js");

module.exports = {
    addFlight: async (req, res, next) => {

        const flight = new Flight(req.body);
        try {
            const savedFlight = await flight.save();
            res.status(200).json(savedFlight);
        } catch (err) {
            next(err);
        }
    },
    updateFlight: async (req, res, next) => {
        try {
            const updatedFlight = await Flight.findByIdAndUpdate(req.params.flightId, { $set: req.body }, { new: true });
            res.status(200).json(updatedFlight);
        } catch (err) {
            next(err);
        }
    },

    removeFlight: async (req, res, next) => {
        try {
            await Flight.findByIdAndDelete(req.params.flightId);
            res.status(200).json("Flight has been deleted");
        } catch (err) {
            next(err);
        }
    },

    getAllFlights: async (req, res, next) => {
        try {
            const { departureDate, departureTime } = req.query;
            if (departureDate) {
                const startDate = new Date(departureDate);
                if (departureTime) {
                    startDate.setMinutes(parseInt(departureTime.split(":")[1], 10));
                    startDate.setHours(parseInt(departureTime.split(":")[0], 10));
                }
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);
                const flights = await Flight.find({ departureDate: { $gte: startDate, $lt: endDate } });
                res.status(200).json(flights);
            } else {
                const flights = await Flight.find();
                res.status(200).json(flights);
            }
        } catch (err) {
            next(err);
        }
    },

    getFlight: async (req, res, next) => {
        try {
            const flight = await Flight.findById(req.params.flightId);
            res.status(200).json(flight);
        } catch (error) {
            next(err);
        }
    },
    getFlight: async (req, res, next) => {
        try {
            const { availability } = req.query;
            if (availability) {
                const flight = await Flight.find({availableSeats:{$gte :availability}});
                res.status(200).json(flight);
            } else {
                const flight = await Flight.findById(req.params.flightId);
                res.status(200).json(flight);
            }

        } catch (error) {
            next(err);
        }
    },
    bookFlight:async (req,res,next)=>{
        try{
            const {flightId,userId} = req.body;
            const flight = await Flight.findById(flightId);
            if(!flight)
                return res.status(404).json({success:false,message:"Flight not found!"});

            if(flight.availableSeats <= 0)
                return res.status(400).json({success:false,message:"No available seats on this flight!"});
            
            flight.availableSeats--;

            await flight.save();
            
            const user = await User.findById(req.user.Id);
            if(!user)
                return res.status(404).json({success:false,message:"User not found"});

            if(user.availableSeats <= 0)
                return res.status(400).json({success:false,message:"No available seats on this flight!"});
            
            user.bookedFlights.push(flight);
            await user.save();

            res.status(200).json({success:true,message:"Flight booked"});
        }catch(error){
            next(error);
        }
    }
}