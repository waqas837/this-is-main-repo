const express = require("express")
const { createHotel } = require("../controllers/hotel/hotelController")
const router = express.Router()


router.post('/register', createHotel)

module.exports = router;