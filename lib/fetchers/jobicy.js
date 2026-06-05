const axios = require('axios');

async function fetch() {
  const res = await axios.get('https://jobicy.com/api/v2/remote-jobs?count=50&tag=javascript', {
    timeout: 10000,
  });

  return (res.data.jobs || []).map(j => ({
    id:         `jobicy-${j.id}`,
    source:     'jobicy',
    title:      j.jobTitle || '',
    company:    j.companyName || '',
    url:        j.url || '',
    salary_min: null,
    salary_max: null,
    salary_raw: j.annualSalaryMin ? `$${j.annualSalaryMin}–$${j.annualSalaryMax}` : null,
    tags:       Array.isArray(j.jobIndustry) ? j.jobIndustry.join(',') : '',
    location:   j.jobGeo || 'Remote',
    posted_at:  j.pubDate || null,
    fetched_at: new Date().toISOString(),
  }));
}

module.exports = { fetch };
