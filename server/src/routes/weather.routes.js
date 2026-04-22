const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weather.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getWeather);

module.exports = router;