import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bowling.css';

const Bowling = () => {
  const [bowlingData, setBowlingData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showOverview, setShowOverview] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    MatchNo: '',
        DateOfMatch: '',
        Wickets: '',
        Overs: '',
        RunConsumed: '',
        fourConsumed: '',
        sixConsumed: '',
        noball: '',
        wide: '',
  });

  useEffect(() => {
    fetchBowling();
    fetchMatches();
  }, []);

  const fetchBowling = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bowling/getbowlingstats");
      console.log(res.data);
      setBowlingData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bowling/matches");
      setMatches(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddMatch = async () => {
    try {
      await axios.post("http://localhost:5000/api/bowling/addbowling", newMatch);
      alert("Match added!");
      await fetchMatches();
      await fetchBowling();
      setNewMatch({
        MatchNo: '',
        DateOfMatch: '',
        Wickets: '',
        Overs: '',
        RunConsumed: '',
        fourConsumed: '',
        sixConsumed: '',
        noball: '',
        wide: '',
      });
      setShowAddForm(false);
    } catch (e) {
      console.log(e);
      alert("Error adding match");
    }
  };

  if (!bowlingData) return <p>Loading bowling stats...</p>;

  const truns = Number(bowlingData.totalRunConsumed) || 0;
  const tWickets = Number(bowlingData.totalWickets) || 0;
  const tOvers = Number(bowlingData.totalOvers) || 0;
  const totalBalls = tOvers * 6;

  const avg = tWickets > 0 ? (truns / tWickets).toFixed(2) : '0.00';
  const bowlsr = tWickets > 0 ? (totalBalls / tWickets).toFixed(2) : '0.00';
  const innings = matches.filter(match => Number(match.Overs) > 0).length;

  
  return (
    <div id='mainbowling'>
      <div className="bowling-summary">
        <header className="summary-header">Bowling</header>
        <main className="summary-main">
            <div className="stat-box">Matches<br /><span>{Number(bowlingData.totalMatches) || 0}</span></div>
            <div className="stat-box">Innings<br /><span>{Number(innings) || 0}</span></div>
            <div className="stat-box">Overs<br /><span>{Number(bowlingData.totalOvers) || 0}</span></div>
            <div className="stat-box">Runs<br /><span>{Number(bowlingData.totalRunConsumed) || 0}</span></div>
            <div className="stat-box">Wickets<br /><span>{Number(bowlingData.totalWickets) || 0}</span></div>
            <div className="stat-box">4s Conceded<br /><span>{Number(bowlingData.totalFours) || 0}</span></div>
            <div className="stat-box">6s Conceded<br /><span>{Number(bowlingData.totalSixes) || 0}</span></div>
            <div className="stat-box">No Balls<br /><span>{Number(bowlingData.totalNoballs) || 0}</span></div>
            <div className="stat-box">Wides<br /><span>{Number(bowlingData.totalWides) || 0}</span></div>
            <div className="stat-box">Average<br /><span>{avg}</span></div>
            <div className="stat-box">Strikerate<br /><span>{bowlsr}</span></div>
            <div className="stat-box">Economy<br /><span>{parseFloat(bowlingData.avgEconomy).toFixed(2)}</span></div>
        </main>


        <button onClick={() => setShowOverview(!showOverview)} className="overview-btn">
          {showOverview ? "Hide Overview" : "Bowling Overview"}
        </button>

        {showOverview && (
          <>
            <table className="match-table">
              <thead>
                <tr>
                  <th>Match No</th>
                  <th>Date</th>
                  <th>Overs</th>
                  <th>Runs</th>
                  <th>Wickets</th>
                  <th>4s Conceded</th>
                  <th>6s Conceded</th>
                  <th>No Balls</th>
                  <th>Wides</th>
                  <th>Economy</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => {
                    const runs = Number(match.RunConsumed) || 0;
                    const overs = Number(match.Overs) || 0;
                    const economy = overs > 0 ? (runs / overs).toFixed(2) : '0.00';

                    return (
                        <tr key={index}>
                            <td>{match.MatchNo}</td>
                            <td>{new Date(match.DateOfMatch).toLocaleDateString()}</td>
                            <td>{match.Overs}</td>
                            <td>{runs}</td>
                            <td>{match.Wickets}</td>
                            <td>{match.fourConsumed || 0}</td>
                            <td>{match.sixConsumed || 0}</td>
                            <td>{match.noball || 0}</td>
                            <td>{match.wide || 0}</td>
                            <td>{economy}</td> 
                        </tr>
                    );
                })}

                </tbody>

            </table>

            <button onClick={() => setShowAddForm(true)} className="add-match-toggle-btn">
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

export default Bowling;
