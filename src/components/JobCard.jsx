import React, { useState } from 'react';

export default function JobCard({ job, profile, onSeen, onApplied, onDismiss }) {
  const [copied, setCopied] = useState(false);
  const tags = job.tags ? job.tags.split(',').filter(Boolean) : [];
  const isNew = !job.seen;

  const open = () => {
    window.open(job.url, '_blank');
    onSeen(job.id);
  };

  const oneClickApply = async () => {
    const name     = profile?.profile_name    || 'Brian Justice';
    const email    = profile?.profile_email   || '';
    const github   = profile?.profile_github  || 'https://github.com/SigynVS';
    const linkedin = profile?.profile_linkedin|| '';
    const bio      = profile?.profile_bio     || 'Full stack developer specializing in Electron, React, and Node.js.';
    const resume   = profile?.profile_resume  || '';

    const letter = `Hi,

${bio}

I'm interested in the ${job.title} role at ${job.company}. My background in React, Node.js, and Electron aligns well with your stack. I write clean, well-documented code and communicate clearly throughout every project.

${github ? `GitHub: ${github}` : ''}${linkedin ? `\nLinkedIn: ${linkedin}` : ''}${resume ? `\nResume: ${resume}` : ''}

Happy to answer any questions.

${name}
${email}`.trim();

    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    // Open job URL
    window.open(job.url, '_blank');
    onApplied(job.id);
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
          {job.applied && <span className="applied-badge">✅ Applied</span>}
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
            <button className="apply-btn" onClick={oneClickApply}>
              {copied ? '📋 Copied!' : '⚡ Apply'}
            </button>
          )}
          <button onClick={() => onDismiss(job.id)}>✕</button>
        </div>
      </div>
    </div>
  );
}
