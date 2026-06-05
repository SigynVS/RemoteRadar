const axios = require('axios');

// Simple RSS XML parser — no extra dependencies
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    items.push({
      title:   get('title'),
      link:    get('link'),
      company: get('author') || get('dc:creator') || '',
      pubDate: get('pubDate'),
      region:  get('region'),
    });
  }
  return items;
}

async function fetch() {
  const res = await axios.get('https://weworkremotely.com/categories/remote-programming-jobs.rss', {
    headers: { 'User-Agent': 'RemoteRadar/1.0' },
    timeout: 10000,
    responseType: 'text',
  });

  const items = parseRSS(res.data);

  return items.map((j, i) => {
    // Title format: "Company: Job Title"
    const colonIdx = j.title.indexOf(':');
    const company = colonIdx > -1 ? j.title.slice(0, colonIdx).trim() : '';
    const title   = colonIdx > -1 ? j.title.slice(colonIdx + 1).trim() : j.title;

    return {
      id:         `wwr-${Buffer.from(j.link).toString('base64').slice(0, 16)}-${i}`,
      source:     'weworkremotely',
      title,
      company,
      url:        j.link,
      salary_min: null,
      salary_max: null,
      salary_raw: null,
      tags:       '',
      location:   j.region || 'Remote',
      posted_at:  j.pubDate || null,
      fetched_at: new Date().toISOString(),
    };
  });
}

module.exports = { fetch };
