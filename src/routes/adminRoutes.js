const express = require("express");
const {register,login,logout,getAllBookings} = require("../controllers/admin.js");
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/bookings",getAllBookings);

module.exports = router;