import React from 'react';

export default function Toolbar({ fetching, newAlert, onFetch, onClearAlert }) {
  return (
    <div className="toolbar">
      {newAlert > 0 && (
        <span className="alert-badge" onClick={onClearAlert}>
          🔔 {newAlert} new
        </span>
      )}
      <button className="fetch-btn" onClick={onFetch} disabled={fetching}>
        {fetching ? '⏳ Fetching...' : '🔄 Fetch Now'}
      </button>
    </div>
  );
}
