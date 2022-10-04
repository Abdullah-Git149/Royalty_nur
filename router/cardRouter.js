const express = require('express');
const router = express.Router()
const auth = require("../auth/auth")
const { cardData, addCard } = require("../controller/cardController")

router.post("/api/add-card", auth, addCard)
router.post("/api/card-data", auth, cardData)


module.exports = router