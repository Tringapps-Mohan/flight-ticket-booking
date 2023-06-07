const router = require("express").Router();
const {verifyAdmin,verifyUser} = require("../utils/verifyToken.js");
const { addFlight,
    removeFlight,
    getAllFlights,
    getFlight,
    checkAvailability,
    updateFlight }
    = require("../controllers/flight.js");

router.post("/add", verifyAdmin ,addFlight);
router.delete("/remove/:flightId", verifyAdmin, removeFlight);
router.get("/",verifyUser,  getAllFlights);
router.put("/",verifyAdmin, updateFlight);
router.get("/:flightId",verifyUser, getFlight);
router.get("/availability/:flightId",verifyUser, checkAvailability);

module.exports = router;