const axios = require('axios');

async function fetch() {
  const res = await axios.get('https://remoteok.com/api', {
    headers: { 'User-Agent': 'RemoteRadar/1.0' },
    timeout: 10000,
  });

  // First item is metadata, skip it
  const jobs = res.data.slice(1);

  return jobs.map(j => ({
    id:         `remoteok-${j.id}`,
    source:     'remoteok',
    title:      j.position || '',
    company:    j.company || '',
    url:        j.url || `https://remoteok.com/remote-jobs/${j.id}`,
    salary_min: j.salary_min || null,
    salary_max: j.salary_max || null,
    salary_raw: j.salary_min ? `$${j.salary_min}–$${j.salary_max}` : null,
    tags:       Array.isArray(j.tags) ? j.tags.join(',') : '',
    location:   'Remote',
    posted_at:  j.date || null,
    fetched_at: new Date().toISOString(),
  }));
}

module.exports = { fetch };
