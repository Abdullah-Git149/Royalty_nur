const express = require('express');
const router = express.Router()
const auth = require("../auth/auth")
const { clockInClockOut, listOfTimeSheet } = require("../controller/timeController")


router.post("/api/time-sheet", auth, clockInClockOut)
router.get("/api/time-sheet-list/:date", auth, listOfTimeSheet)




module.exports = router