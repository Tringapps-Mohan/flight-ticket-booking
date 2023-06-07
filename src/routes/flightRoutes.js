const router = require("express").Router();

router.post("/add",addFlight);
router.delete("/remove/:flightId",removeFlight);
router.get("/",getAllFlights);
router.get("/:flightId",getFlight);
router.get("/:flightId/availability",checkAvailability);
