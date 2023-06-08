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
            const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);

            if (!isPasswordCorrect)
                return next(createError(400, "Wrong password or adminname."));

            const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT);
            const { password, ...others } = admin._doc;
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json({ ...others });
        } catch (err) {
            next(err);
        }
    },
    logout: (req, res, next) => {
        res.clearCookie("token");
        res.json({ message: "Logged out successfully" });
    },
    getAllBookings: async (req, res, next) => {
        try {
            const { flightNumber, departureTime,departureDate } = req.query;
            console.log(flightNumber,departureTime,departureDate);
            
            const conditions = {};
            if (flightNumber)
                conditions.flightNumber = {$eq : flightNumber};
                
            if (departureDate) {
                conditions.departureDate = {$eq:new Date(departureDate)};
            }
            if (departureTime) {
                conditions.departureTime = {$eq:departureTime};
            }
            console.log(conditions);
            const flights = await Flight.find(conditions);
            const bookings = [];
            flights.forEach(flight => {
                const users = [];
                flight.seats.forEach((seat, seatNumber) => {
                    if (seat.isBooked) {
                        users.push({ seatNumber, userID: seat.userID });
                    }
                });
                bookings.push({
                    flightNumber: flight.flightNumber,
                    airline: flight.airline,
                    bookedUsers: users
                });
            })
            res.status(200).json(bookings);
        } catch (err) {
            next(err);
        }

    }
}
