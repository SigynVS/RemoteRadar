import React, { useState, useEffect, useCallback } from 'react';
import JobList from './components/JobList.jsx';
import Filters from './components/Filters.jsx';
import Settings from './components/Settings.jsx';
import Toolbar from './components/Toolbar.jsx';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', minSalary: 0, source: '', unseen: false });
  const [view, setView] = useState('jobs'); // 'jobs' | 'applied' | 'settings'
  const [fetching, setFetching] = useState(false);
  const [newAlert, setNewAlert] = useState(0);

  const loadJobs = useCallback(async () => {
    const f = view === 'applied' ? { ...filters, applied: true } : filters;
    const data = await window.radar.getJobs(f);
    setJobs(data);
  }, [filters, view]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  useEffect(() => {
    window.radar.onNewJobs((count) => {
      setNewAlert(count);
      loadJobs();
    });
  }, []);

  const fetchNow = async () => {
    setFetching(true);
    setNewAlert(0);
    const count = await window.radar.fetchNow();
    setFetching(false);
    await loadJobs();
    if (count > 0) setNewAlert(count);
  };

  const handleMarkSeen    = async (id) => { await window.radar.markSeen(id);    loadJobs(); };
  const handleMarkApplied = async (id) => { await window.radar.markApplied(id); loadJobs(); };
  const handleDismiss     = async (id) => { await window.radar.dismiss(id);     loadJobs(); };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">📡 RemoteRadar</div>
        <nav className="nav">
          <button className={view === 'jobs'    ? 'active' : ''} onClick={() => setView('jobs')}>Jobs</button>
          <button className={view === 'applied' ? 'active' : ''} onClick={() => setView('applied')}>Applied</button>
          <button className={view === 'settings'? 'active' : ''} onClick={() => setView('settings')}>Settings</button>
        </nav>
        <Toolbar
          fetching={fetching}
          newAlert={newAlert}
          onFetch={fetchNow}
          onClearAlert={() => setNewAlert(0)}
        />
      </header>

      <main className="main">
        {view === 'settings' ? (
          <Settings />
        ) : (
          <>
            <Filters filters={filters} onChange={setFilters} />
            <JobList
              jobs={jobs}
              onSeen={handleMarkSeen}
              onApplied={handleMarkApplied}
              onDismiss={handleDismiss}
            />
          </>
        )}
      </main>
    </div>
  );
}
