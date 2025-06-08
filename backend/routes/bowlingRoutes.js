const express = require('express');
const router = express.Router();
const bowlingController = require('../controllers/bowlingController');

router.post('/addbowling', bowlingController.addingBowling);
router.get('/getbowlingstats', bowlingController.getBowlingStats);
router.get('/matches' , bowlingController.getMatchesbowling);

module.exports = router;
