const axios = require('axios');

async function fetch() {
  const res = await axios.get('https://www.arbeitnow.com/api/job-board-api', {
    timeout: 10000,
  });

  return (res.data.data || [])
    .filter(j => j.remote)
    .map(j => ({
      id:         `arbeitnow-${j.slug}`,
      source:     'arbeitnow',
      title:      j.title || '',
      company:    j.company_name || '',
      url:        j.url || '',
      salary_min: null,
      salary_max: null,
      salary_raw: null,
      tags:       Array.isArray(j.tags) ? j.tags.join(',') : '',
      location:   j.location || 'Remote',
      posted_at:  j.created_at ? new Date(j.created_at * 1000).toISOString() : null,
      fetched_at: new Date().toISOString(),
    }));
}

module.exports = { fetch };
