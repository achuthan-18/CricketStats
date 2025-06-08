const express = require('express');
const router = express.Router();
const battingController = require('../controllers/battingController');


router.post('/addbattingrecord' , battingController.addingScore);
router.get('/getbattingstats' , battingController.getBattingStats);
router.get('/matches' , battingController.getMatches);

module.exports = router;