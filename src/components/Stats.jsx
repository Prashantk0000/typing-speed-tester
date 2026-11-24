import React from "react";

const Stats = ({ timeLeft, mistakes, wpm, cpm }) => {
  return (
    <div className="stats-container">
      <div className="stat-box">
        <span className="stat-label">Time Left</span>
        <span className="stat-value time">{timeLeft}s</span>
      </div>
      <div className="stat-box">
        <span className="stat-label">Mistakes</span>
        <span className="stat-value mistakes">{mistakes}</span>
      </div>
      <div className="stat-box">
        <span className="stat-label">WPM</span>
        <span className="stat-value wpm">{wpm}</span>
      </div>
      <div className="stat-box">
        <span className="stat-label">CPM</span>
        <span className="stat-value cpm">{cpm}</span>
      </div>
    </div>
  );
};

export default Stats;
