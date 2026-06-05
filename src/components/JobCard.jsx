import React from 'react';

export default function JobCard({ job, onSeen, onApplied, onDismiss }) {
  const tags = job.tags ? job.tags.split(',').filter(Boolean) : [];
  const isNew = !job.seen;

  const open = () => {
    window.open(job.url, '_blank');
    onSeen(job.id);
  };

  return (
    <div className={`job-card ${isNew ? 'unseen' : ''} ${job.applied ? 'applied' : ''}`}>
      <div className="job-header">
        <div>
          <h3 className="job-title" onClick={open}>{job.title}</h3>
          <span className="job-company">{job.company}</span>
          {job.location && <span className="job-location"> · {job.location}</span>}
        </div>
        <div className="job-meta">
          {job.salary_raw && <span className="salary">{job.salary_raw}</span>}
          <span className="source-badge">{job.source}</span>
          {isNew && <span className="new-badge">NEW</span>}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="tags">
          {tags.slice(0, 8).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      )}

      <div className="job-footer">
        <span className="posted">
          {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Unknown date'}
        </span>
        <div className="actions">
          <button onClick={open}>🔗 View</button>
          {!job.applied && (
            <button onClick={() => onApplied(job.id)}>✅ Applied</button>
          )}
          <button onClick={() => onDismiss(job.id)}>✕ Dismiss</button>
        </div>
      </div>
    </div>
  );
}
