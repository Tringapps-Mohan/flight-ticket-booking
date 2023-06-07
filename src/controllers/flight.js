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
            const { departureDate, departureTime, availability } = req.query;
            let flights = await Flight.find();
            let startDate = new Date();
            if (departureDate) {
                flights = flights.filter(flight=>flight.departureDate >= new Date(departureDate));
            }
            if (departureTime) {
                startDate.setMinutes(parseInt(departureTime.split(":")[1], 10));
                startDate.setHours(parseInt(departureTime.split(":")[0], 10));
                flights = flights.filter(flight=>flight.departureDate >= new Date(departureDate));
            }
            if (availability) {
                flights = flights.filter(flight=>flight.availableSeats >= availability);
            }
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

            flight.availableSeats--;

            await flight.save();

            const user = await User.findById(req.user.id);
            if (!user)
                return res.status(404).json({ success: false, message: "User not found" });

            user.bookedFlights.push(flight);
            await user.save();

            res.status(200).json({ success: true, message: "Flight booked" });
        } catch (error) {
            next(error);
        }
    }
}