import React, { useState } from 'react';

function VersionHistory({ versionHistory = [] }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h3 onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
        Version History {isCollapsed ? '➕' : '➖'}
      </h3>
      {!isCollapsed && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {versionHistory.length > 0 ? (
            versionHistory.map((entry, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <strong>{entry.version}</strong> - {new Date(entry.timestamp).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No version history available.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default VersionHistory;
