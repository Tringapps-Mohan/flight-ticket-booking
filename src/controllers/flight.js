const Flight = require("../models/Flight.js");
const User = require("../models/User.js");
const Ticket = require("../models/Ticket.js");

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
            const { flightNumber, departureTime,departureDate,availability } = req.query;
            
            const conditions = {};
            if (flightNumber)
                conditions.flightNumber = {$eq : flightNumber};
                
            if (departureDate) {
                conditions.departureDate = {$eq:new Date(departureDate)};
            }
            if (departureTime) {
                conditions.departureTime = {$eq:departureTime};
            }
            if (availability) {
                conditions.availableSeats = {$gte:availability};
            }
            const flights = await Flight.find(conditions);
            res.status(200).json(flights);
        } catch (err) {
            next(err);
        }
    },
    getFlight: async (req, res, next) => {
        try {
            const flight = await Flight.findById(req.params.flightId);
            res.status(200).json(flight);

        } catch (error) {
            next(error);
        }
    },
    bookFlight: async (req, res, next) => {
        try {
            const { flightId } = req.body;
            const flight = await Flight.findById(flightId);
            if (!flight)
                return res.status(404).json({ success: false, message: "Flight not found!" });

            if (flight.availableSeats <= 0)
                return res.status(400).json({ success: false, message: "No available seats on this flight!" });

            let seatNumber = flight.capacity - flight.availableSeats;

            flight.seats[seatNumber+1] = {isBooked:true,userID:req.user.id};

            flight.availableSeats--;

            await flight.save();

            const user = await User.findById(req.user.id);
            if (!user)
                return res.status(404).json({ success: false, message: "User not found" });

            user.bookedFlights.push(flight);
            const ticket = new Ticket({
                userId:req.user.id,
                flightId:flight._id,
                seat:seatNumber,
                passengerName:user.username,
                boardingDate:new Date(flight.departureDate),
                boardingTime:flight.departureTime
            });
            user.tickets.push(ticket);
            await ticket.save();
            await user.save();

            res.status(200).json({ success: true, message: "Flight booked" });
        } catch (error) {
            next(error);
        }
    }
}