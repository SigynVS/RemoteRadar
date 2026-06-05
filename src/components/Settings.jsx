import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.radar.getSettings().then(setSettings);
  }, []);

  const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    await window.radar.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div className="loading">Loading settings...</div>;

  return (
    <div className="settings">
      <h2>Settings</h2>

      <label>
        Keywords (comma-separated)
        <input
          type="text"
          value={settings.keywords || ''}
          onChange={e => set('keywords', e.target.value)}
          placeholder="react,node,electron,javascript"
        />
        <small>Jobs must match at least one keyword in title, tags, or company.</small>
      </label>

      <label>
        Minimum Salary ($)
        <input
          type="number"
          value={settings.min_salary || 0}
          onChange={e => set('min_salary', e.target.value)}
          min="0"
          step="10000"
        />
      </label>

      <label>
        Fetch Interval (hours)
        <input
          type="number"
          value={settings.fetch_interval_hours || 2}
          onChange={e => set('fetch_interval_hours', e.target.value)}
          min="1"
          max="24"
        />
      </label>

      <label>
        Sources (comma-separated)
        <input
          type="text"
          value={settings.sources || ''}
          onChange={e => set('sources', e.target.value)}
          placeholder="remoteok,remotive,jobicy"
        />
      </label>

      <button className="save-btn" onClick={save}>
        {saved ? '✅ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
