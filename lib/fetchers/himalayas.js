const axios = require('axios');

async function fetch() {
  const res = await axios.get('https://himalayas.app/jobs/api?limit=100', {
    headers: { 'User-Agent': 'RemoteRadar/1.0' },
    timeout: 10000,
  });

  return (res.data.jobs || []).map(j => ({
    id:         `himalayas-${j.slug || j.id}`,
    source:     'himalayas',
    title:      j.title || '',
    company:    j.companyName || '',
    url:        j.applicationLink || `https://himalayas.app/jobs/${j.slug}`,
    salary_min: j.salaryMin || null,
    salary_max: j.salaryMax || null,
    salary_raw: j.salaryMin ? `$${j.salaryMin.toLocaleString()}–$${j.salaryMax?.toLocaleString()}` : null,
    tags:       Array.isArray(j.categories) ? j.categories.join(',') : '',
    location:   j.regions?.join(', ') || 'Remote',
    posted_at:  j.createdAt || null,
    fetched_at: new Date().toISOString(),
  }));
}

module.exports = { fetch };
