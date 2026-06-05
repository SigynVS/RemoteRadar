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

      <section>
        <h2>👤 Your Profile</h2>
        <p className="section-desc">Used to generate one-click cover letters when you apply.</p>

        <label>
          Full Name
          <input type="text" value={settings.profile_name || ''} onChange={e => set('profile_name', e.target.value)} placeholder="Brian Justice" />
        </label>
        <label>
          Email
          <input type="email" value={settings.profile_email || ''} onChange={e => set('profile_email', e.target.value)} placeholder="sheogorath256@gmail.com" />
        </label>
        <label>
          GitHub
          <input type="text" value={settings.profile_github || ''} onChange={e => set('profile_github', e.target.value)} placeholder="https://github.com/SigynVS" />
        </label>
        <label>
          LinkedIn
          <input type="text" value={settings.profile_linkedin || ''} onChange={e => set('profile_linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
        </label>
        <label>
          Resume URL (optional)
          <input type="text" value={settings.profile_resume || ''} onChange={e => set('profile_resume', e.target.value)} placeholder="https://..." />
        </label>
        <label>
          One-liner bio (used in cover letters)
          <input type="text" value={settings.profile_bio || ''} onChange={e => set('profile_bio', e.target.value)} placeholder="Full stack developer specializing in Electron, React, and Node.js." />
        </label>
      </section>

      <section>
        <h2>⚙️ Job Fetching</h2>

        <label>
          Keywords (comma-separated)
          <input type="text" value={settings.keywords || ''} onChange={e => set('keywords', e.target.value)} placeholder="react,node,electron,javascript" />
          <small>Jobs must match at least one keyword in title, tags, or company.</small>
        </label>
        <label>
          Minimum Salary ($)
          <input type="number" value={settings.min_salary || 0} onChange={e => set('min_salary', e.target.value)} min="0" step="10000" />
        </label>
        <label>
          Fetch Interval (hours)
          <input type="number" value={settings.fetch_interval_hours || 2} onChange={e => set('fetch_interval_hours', e.target.value)} min="1" max="24" />
        </label>
        <label>
          Sources (comma-separated)
          <input type="text" value={settings.sources || ''} onChange={e => set('sources', e.target.value)} placeholder="remoteok,remotive,jobicy" />
        </label>
      </section>

      <button className="save-btn" onClick={save}>
        {saved ? '✅ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
