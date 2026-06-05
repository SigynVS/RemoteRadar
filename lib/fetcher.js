const remoteok        = require('./fetchers/remoteok');
const remotive        = require('./fetchers/remotive');
const jobicy          = require('./fetchers/jobicy');
const weworkremotely  = require('./fetchers/weworkremotely');
const arbeitnow       = require('./fetchers/arbeitnow');
const himalayas       = require('./fetchers/himalayas');

const SOURCES = { remoteok, remotive, jobicy, weworkremotely, arbeitnow, himalayas };

async function fetchAll(db) {
  const settings = db.getSettings();
  const keywords = (settings.keywords || '').toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
  const enabledSources = (settings.sources || 'remoteok,remotive,jobicy').split(',').map(s => s.trim());

  let newCount = 0;

  for (const sourceName of enabledSources) {
    const source = SOURCES[sourceName];
    if (!source) continue;

    try {
      const jobs = await source.fetch();

      for (const job of jobs) {
        // Keyword filter
        const text = `${job.title} ${job.tags} ${job.company}`.toLowerCase();
        const matches = keywords.length === 0 || keywords.some(k => text.includes(k));
        if (!matches) continue;

        const isNew = db.upsertJob(job);
        if (isNew) newCount++;
      }
    } catch (err) {
      console.error(`[RemoteRadar] Error fetching from ${sourceName}:`, err.message);
    }
  }

  return newCount;
}

module.exports = { fetchAll };
