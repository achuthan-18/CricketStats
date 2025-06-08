const BattingDB = require('../models/Batting');

exports.addingScore =async (req , res) => {
    try{
        const {
            MatchNo,
            DateOfMatch,
            Runs, 
            Balls,
            fours,
            sixes
        } = req.body;

        if(!MatchNo || !DateOfMatch || !Runs || !Balls){
            return res.status(400).json({
                message : "All fields are required"
            });
        }

        const newScore = new BattingDB({
            MatchNo,
            DateOfMatch: new Date(DateOfMatch),
            Runs, 
            Balls,
            fours,
            sixes
        });

        await newScore.save();
        res.status(200).json({
            newScore
        });
    }
    catch (err) {
        res.status(500).json({
            message: "server Error"
        });
    }
}

exports.getBattingStats = async(req , res) => {
    try{
        const stats = await BattingDB.aggregate([
            {
                $group: {
                    _id: null,
                    totalRuns: { $sum: "$Runs" },
                    totalBalls: { $sum: "$Balls" },
                    totalFours: { $sum: "$fours" },
                    totalSixes: { $sum: "$sixes" },
                    totalFifties: {
                        $sum: {
                            $cond: [{ $and: [ { $gte: ["$Runs", 50] }, { $lt: ["$Runs", 100] } ] }, 1, 0]
                        }
                    },
                    totalHundreds: {
                        $sum: {
                            $cond: [{ $gte: ["$Runs", 100] }, 1, 0]
                        }
                    },
                    totalMatches: { $sum: 1 }
                }
            }
        ]);

       const {
            totalRuns = 0,
            totalBalls = 0,
            totalFours = 0,
            totalSixes = 0,
            totalFifties = 0,
            totalHundreds = 0,
            totalMatches = 0
            } = stats[0] || {};

        res.json({
            totalRuns,
            totalBalls,
            totalFours,
            totalSixes,
            totalFifties,
            totalHundreds,
            totalMatches
            });
    }
    catch (err) {
        console.error("Error in get Batting Stats:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}


exports.getMatches = async (req, res) => {
    try {
        const matches = await BattingDB.find();
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};