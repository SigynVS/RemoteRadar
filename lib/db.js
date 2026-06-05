const fs   = require('fs');
const path = require('path');
const { app } = require('electron');

let dbPath;
let data; // { jobs: {}, settings: {} }

function getDbPath() {
  return app.isPackaged
    ? path.join(app.getPath('userData'), 'remoteradar.json')
    : path.join(__dirname, '..', 'remoteradar.json');
}

function save() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function init() {
  dbPath = getDbPath();

  if (fs.existsSync(dbPath)) {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } else {
    data = { jobs: {}, settings: {} };
  }

  // Default settings
  const defaults = {
    keywords: 'react,node,electron,javascript,typescript',
    min_salary: '0',
    fetch_interval_hours: '2',
    sources: 'remoteok,remotive,jobicy',
    profile_name: 'Brian Justice',
    profile_email: 'sheogorath256@gmail.com',
    profile_github: 'https://github.com/SigynVS',
    profile_linkedin: 'https://www.linkedin.com/in/brian-justice-96ba36413/',
    profile_resume: '',
    profile_bio: 'Full stack developer specializing in Electron, React, and Node.js.',
  };
  for (const [k, v] of Object.entries(defaults)) {
    if (!data.settings[k]) data.settings[k] = v;
  }
  save();
}

function getJobs(filters = {}) {
  let jobs = Object.values(data.jobs).filter(j => !j.dismissed);

  if (filters.keyword) {
    const k = filters.keyword.toLowerCase();
    jobs = jobs.filter(j =>
      (j.title + j.tags + j.company).toLowerCase().includes(k)
    );
  }
  if (filters.minSalary && filters.minSalary > 0) {
    jobs = jobs.filter(j => !j.salary_min || j.salary_min >= filters.minSalary);
  }
  if (filters.source) {
    jobs = jobs.filter(j => j.source === filters.source);
  }
  if (filters.location === 'us') {
    const usTerms = ['us', 'usa', 'united states', 'america', 'north america', 'remote us', 'us only', 'anywhere'];
    jobs = jobs.filter(j => {
      const loc = (j.location || '').toLowerCase();
      return usTerms.some(t => loc.includes(t)) || loc === 'remote' || loc === '';
    });
  }
  if (filters.location === 'worldwide') {
    jobs = jobs.filter(j => {
      const loc = (j.location || '').toLowerCase();
      return loc.includes('worldwide') || loc.includes('anywhere') || loc === 'remote' || loc === '';
    });
  }
  if (filters.unseen) {
    jobs = jobs.filter(j => !j.seen);
  }
  if (filters.applied) {
    jobs = jobs.filter(j => j.applied);
  }

  return jobs
    .sort((a, b) => new Date(b.fetched_at) - new Date(a.fetched_at))
    .slice(0, 200);
}

function upsertJob(job) {
  if (data.jobs[job.id]) return false;
  data.jobs[job.id] = { ...job, seen: false, applied: false, dismissed: false };
  save();
  return true;
}

function markSeen(id)    { if (data.jobs[id]) { data.jobs[id].seen = true;    save(); } }
function markApplied(id) { if (data.jobs[id]) { data.jobs[id].applied = true; data.jobs[id].seen = true; save(); } }
function dismissJob(id)  { if (data.jobs[id]) { data.jobs[id].dismissed = true; save(); } }

function getSettings() { return { ...data.settings }; }

function saveSettings(settings) {
  data.settings = { ...data.settings, ...settings };
  save();
}

module.exports = { init, getJobs, upsertJob, markSeen, markApplied, dismissJob, getSettings, saveSettings };
