import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './batting.css';

const Batting = () => {
  const [battingData, setBattingData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showOverview, setShowOverview] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    MatchNo: '',
    DateOfMatch: '',
    Runs: '',
    Balls: '',
    fours: '',
    sixes: ''
  });

  useEffect(() => {
    fetchBatting();
    fetchMatches();
  }, []);

  const fetchBatting = async () => {
    try {
      const res = await axios.get("https://cricketstats-3ax6.onrender.com/api/batting/getbattingstats");
      setBattingData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await axios.get("https://cricketstats-3ax6.onrender.com/api/batting/matches");
      setMatches(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddMatch = async () => {
    try {
      await axios.post("https://cricketstats-3ax6.onrender.com/api/batting/addbattingrecord", newMatch);
      alert("Match added!");
      await fetchBatting();
      await fetchMatches();
      setNewMatch({
        MatchNo: '',
        DateOfMatch: '',
        Runs: '',
        Balls: '',
        fours: '',
        sixes: ''
      });
      setShowAddForm(false);
    } catch (e) {
      console.log(e);
      alert("Error adding match");
    }
  };

  if (!battingData) return <p>Loading batting stats...</p>;

  const average = battingData.totalMatches > 0
  ? (battingData.totalRuns / battingData.totalMatches).toFixed(2)
  : "0.00";

  const strikeRate = battingData.totalBalls > 0
  ? ((battingData.totalRuns / battingData.totalBalls) * 100).toFixed(2)
  : "0.00";

  const innings = matches.filter(match => Number(match.Balls) > 0).length;

  return (
    <div id='mainbatting'>
      <div className="batting-summary">
        <header className="summary-header">Batting</header>
        <main className="summary-main">
          <div className="stat-box">Matches<br /><span>{battingData.totalMatches}</span></div>
          <div className="stat-box">Innings<br /><span>{innings}</span></div>
          <div className="stat-box">Runs<br /><span>{battingData.totalRuns}</span></div>
          <div className="stat-box">Balls<br /><span>{battingData.totalBalls}</span></div>
          <div className="stat-box">4s<br /><span>{battingData.totalFours}</span></div>
          <div className="stat-box">6s<br /><span>{battingData.totalSixes}</span></div>
          <div className="stat-box">50s<br /><span>{battingData.totalFifties}</span></div>
          <div className="stat-box">100s<br /><span>{battingData.totalHundreds}</span></div>
          <div className="stat-box">Average<br /><span>{average}</span></div>
          <div className="stat-box">Strikerate<br /><span>{strikeRate}</span></div>
        </main>

        <button onClick={() => setShowOverview(!showOverview)} className="overview-btn">
          {showOverview ? "Hide Overview" : "Batting Overview"}
        </button>

        {showOverview && (
          <>
            <table className="match-table">
              <thead>
                <tr>
                  <th>Match No</th>
                  <th>Date</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>SR</th>
                  <th>4s</th>
                  <th>6s</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => {
                  const runs = Number(match.Runs) || 0;
                  const balls = Number(match.Balls) || 0;
                  const sr = balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";

                  return (
                    <tr key={index}>
                      <td>{match.MatchNo}</td>
                      <td>{new Date(match.DateOfMatch).toLocaleDateString()}</td>
                      <td>{runs}</td>
                      <td>{balls}</td>
                      <td>{sr}</td> {/* New column for SR */}
                      <td>{match.fours || 0}</td>
                      <td>{match.sixes || 0}</td>
                    </tr>
                  );
                })}

              </tbody>
            </table>

            <button
              onClick={() => setShowAddForm(true)}
              className="add-match-toggle-btn"
            >
              Add Match
            </button>

            {showAddForm && (
              <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <h4>Add New Match</h4>
                  {Object.entries(newMatch).map(([key, value]) => (
                    <input
                      key={key}
                      type={key === "DateOfMatch" ? "date" : "number"}
                      placeholder={key}
                      value={value}
                      onChange={(e) =>
                        setNewMatch({ ...newMatch, [key]: e.target.value })
                      }
                    />
                  ))}
                  <div className="modal-buttons">
                    <button onClick={handleAddMatch} className="submit-btn">Submit Match</button>
                    <button onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Batting;
