const mongoose = require('mongoose');

const BattingSchema = mongoose.Schema({
    MatchNo : {type: Number , required: true , unique: true},
    DateOfMatch : {type: Date, required: true},
    Runs: {type:Number , required: true, default: 0 },
    Balls: {type: Number, required: true, default: 0 },
    fours: {type: Number, default: 0},
    sixes: {type: Number, default: 0},
});

module.exports = mongoose.model("Batting" , BattingSchema);