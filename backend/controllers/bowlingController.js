const BowlingDB = require('../models/Bowling');

exports.addingBowling = async (req, res) => {
    try {
        const {
            MatchNo,
            DateOfMatch,
            Wickets,
            Overs,
            RunConsumed,
            fourConsumed,
            sixConsumed,
            noball,
            wide
        } = req.body;

        if (!MatchNo || !DateOfMatch || Wickets == null || Overs == null || RunConsumed == null) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const newBowling = new BowlingDB({
            MatchNo,
            DateOfMatch: new Date(DateOfMatch),
            Wickets,
            Overs,
            RunConsumed,
            fourConsumed,
            sixConsumed,
            noball,
            wide
        });

        await newBowling.save();
        res.status(200).json({ newBowling });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.getBowlingStats = async (req, res) => {
    try {
        const stats = await BowlingDB.aggregate([
            {
                $group: {
                    _id: null,
                    totalWickets: { $sum: "$Wickets" },
                    totalOvers: { $sum: "$Overs" },
                    totalRunConsumed: { $sum: "$RunConsumed" },
                    totalFours: { $sum: "$fourConsumed" },
                    totalSixes: { $sum: "$sixConsumed" },
                    totalNoballs: { $sum: "$noball" },
                    totalWides: { $sum: "$wide" },
                    avgEconomy: {
                    $avg: {
                        $cond: [
                        { $gt: ["$Overs", 0] },                  // if Overs > 0
                        { $divide: ["$RunConsumed", "$Overs"] }, // do the division
                        0                                        // else return 0
                        ]
                    }
                    },

                    totalMatches: { $sum: 1 }
                }
            }
        ]);

        const {
            totalWickets = 0,
            totalOvers = 0,
            totalRunConsumed = 0,
            totalFours = 0,
            totalSixes = 0,
            totalNoballs = 0,
            totalWides = 0,
            avgEconomy = 0,
            totalMatches = 0
        } = stats[0] || {};

        res.json({
            totalWickets,
            totalOvers,
            totalRunConsumed,
            totalFours,
            totalSixes,
            totalNoballs,
            totalWides,
            avgEconomy: avgEconomy.toFixed(2),
            totalMatches
        });
        
    } catch (err) {
        console.error("Error in get Bowling Stats:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


exports.getMatchesbowling = async (req, res) => {
    try {
        const matches = await BowlingDB.find();
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};