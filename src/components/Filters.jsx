import React from 'react';

export default function Filters({ filters, onChange }) {
  const set = (key, value) => onChange(prev => ({ ...prev, [key]: value }));

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search title, tags, company..."
        value={filters.keyword}
        onChange={e => set('keyword', e.target.value)}
      />
      <input
        type="number"
        placeholder="Min salary ($)"
        value={filters.minSalary || ''}
        onChange={e => set('minSalary', parseInt(e.target.value) || 0)}
        min="0"
        step="10000"
      />
      <select value={filters.source} onChange={e => set('source', e.target.value)}>
        <option value="">All sources</option>
        <option value="remoteok">RemoteOK</option>
        <option value="remotive">Remotive</option>
        <option value="jobicy">Jobicy</option>
      </select>
      <select value={filters.location || ''} onChange={e => set('location', e.target.value)}>
        <option value="">All locations</option>
        <option value="us">🇺🇸 US only</option>
        <option value="worldwide">🌍 Worldwide</option>
      </select>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={filters.unseen}
          onChange={e => set('unseen', e.target.checked)}
        />
        Unseen only
      </label>
    </div>
  );
}
