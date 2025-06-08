const mongoose = require('mongoose');

const BowlingSchema = mongoose.Schema({
    MatchNo: { type: Number, required: true },
    DateOfMatch: { type: Date, required: true },
    Wickets: { type: Number, required: true , default: 0 },
    Overs: { type: Number, required: true , default: 0 },
    RunConsumed: { type: Number, required: true , default: 0 },
    fourConsumed: { type: Number, default: 0 },
    sixConsumed: { type: Number, default: 0 },
    noball: { type: Number, default: 0 },
    wide: { type: Number, default: 0 }
});

module.exports = mongoose.model("Bowling", BowlingSchema);
