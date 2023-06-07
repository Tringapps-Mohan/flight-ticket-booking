const router = require("express").Router();
const { verifyAdmin, verifyUser } = require("../utils/verifyToken.js");
const { addFlight,
    removeFlight,
    getAllFlights,
    getFlight,
    updateFlight,
    bookFlight }
    = require("../controllers/flight.js");

router.post("/", verifyAdmin, addFlight);
router.delete("/:flightId", verifyAdmin, removeFlight);
router.get("/:flightId", verifyUser, getFlight);
router.get("/", verifyUser, getAllFlights);
router.put("/:flightId", verifyAdmin, updateFlight);
router.post("/book/", verifyUser, bookFlight);

module.exports = router;