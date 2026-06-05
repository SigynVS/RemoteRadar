const axios = require('axios');

async function fetch() {
  const pages = [0, 1, 2]; // fetch 3 pages = ~300 jobs
  const allJobs = [];

  for (const page of pages) {
    try {
      const res = await axios.get('https://www.themuse.com/api/public/jobs', {
        params: {
          category: 'Software Engineer',
          level: 'Entry Level',
          location: 'Flexible / Remote',
          page,
          descended: true,
        },
        timeout: 10000,
      });

      const jobs = res.data.results || [];
      allJobs.push(...jobs);
    } catch (err) {
      console.error(`[themuse] page ${page} error:`, err.message);
    }
  }

  return allJobs.map(j => {
    const company = j.company?.name || '';
    const location = j.locations?.map(l => l.name).join(', ') || 'Remote';
    const levels   = j.levels?.map(l => l.name).join(', ') || '';
    const cats     = j.categories?.map(c => c.name).join(',') || '';

    return {
      id:         `themuse-${j.id}`,
      source:     'themuse',
      title:      j.name || '',
      company,
      url:        j.refs?.landing_page || '',
      salary_min: null,
      salary_max: null,
      salary_raw: null,
      tags:       cats,
      location,
      posted_at:  j.publication_date || null,
      fetched_at: new Date().toISOString(),
    };
  });
}

module.exports = { fetch };
