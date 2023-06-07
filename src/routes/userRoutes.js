const express = require("express");
const { register, login, logout, myBookings } = require("../controllers/user.js");
const { verifyUser } = require("../utils/verifyToken.js");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/mybookings", myBookings);

module.exports = router;