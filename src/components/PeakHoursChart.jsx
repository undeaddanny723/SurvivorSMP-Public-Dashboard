import React from 'react';

const PeakHoursChart = ({ data }) => {
  return (
    <div className="peak-hours-chart-placeholder">
      <h3>Peak Hours Chart Placeholder</h3>
      {data && data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              Hour: {item.hour}, Average Players: {item.averagePlayers}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available for peak hours chart.</p>
      )}
    </div>
  );
};

export default PeakHoursChart;
