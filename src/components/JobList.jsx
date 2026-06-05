import React from 'react';
import JobCard from './JobCard.jsx';

export default function JobList({ jobs, profile, onSeen, onApplied, onDismiss }) {
  if (jobs.length === 0) {
    return <div className="empty">No jobs found. Try fetching or adjusting filters.</div>;
  }

  return (
    <div className="job-list">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          profile={profile}
          onSeen={onSeen}
          onApplied={onApplied}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
