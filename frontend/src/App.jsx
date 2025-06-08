import React, { useState } from 'react';
import Batting from './Batting';
import image from './kingavatar.jpg';
import Bowling from './Bowling';
import './main.css';

const MainContainer = () => {
  const [activeTab, setActiveTab] = useState('batting');

  return (
    <div id='maincontainer'>
      <div id='container'>
        <img src={image} alt='avatar' id='avatarimage' />
      </div>
      <div id='showingstats'>
        <div id='tabButtons'>
          <button
            id="battingbutton"
            className={activeTab === 'batting' ? 'active-tab' : ''}
            onClick={() => setActiveTab('batting')}
          >
            Batting
          </button>
          <div id='separate'>|</div>
          <button
            id="bowlingbutton"
            className={activeTab === 'bowling' ? 'active-tab' : ''}
            onClick={() => setActiveTab('bowling')}
          >
            Bowling
          </button>
        </div>

        <div id='submaincontainer'>
          {activeTab === 'batting' ? <Batting /> : <Bowling />}
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
