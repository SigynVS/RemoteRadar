const axios = require('axios');

async function fetch() {
  const res = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=100', {
    timeout: 10000,
  });

  return res.data.jobs.map(j => ({
    id:         `remotive-${j.id}`,
    source:     'remotive',
    title:      j.title || '',
    company:    j.company_name || '',
    url:        j.url || '',
    salary_min: null,
    salary_max: null,
    salary_raw: j.salary || null,
    tags:       Array.isArray(j.tags) ? j.tags.join(',') : '',
    location:   j.candidate_required_location || 'Remote',
    posted_at:  j.publication_date || null,
    fetched_at: new Date().toISOString(),
  }));
}

module.exports = { fetch };
