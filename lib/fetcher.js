const remoteok        = require('./fetchers/remoteok');
const remotive        = require('./fetchers/remotive');
const jobicy          = require('./fetchers/jobicy');
const weworkremotely  = require('./fetchers/weworkremotely');
const arbeitnow       = require('./fetchers/arbeitnow');
const himalayas       = require('./fetchers/himalayas');

const SOURCES = { remoteok, remotive, jobicy, weworkremotely, arbeitnow, himalayas };

const SENIOR_EXCLUDE = ['senior', 'sr.', 'staff ', 'principal', 'lead ', 'tech lead', 'manager', 'director', 'vp ', 'head of', 'architect'];

async function fetchAll(db) {
  const settings = db.getSettings();
  const keywords = (settings.keywords || '').toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
  const excludeKeywords = (settings.exclude_keywords || '').toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
  const entryOnly = settings.entry_only === 'true';
  const enabledSources = (settings.sources || 'remoteok,remotive,jobicy').split(',').map(s => s.trim());

  let newCount = 0;

  for (const sourceName of enabledSources) {
    const source = SOURCES[sourceName];
    if (!source) continue;

    try {
      const jobs = await source.fetch();

      for (const job of jobs) {
        const titleLower = job.title.toLowerCase();
        const text = `${titleLower} ${job.tags} ${job.company}`.toLowerCase();

        // Keyword filter — must match at least one
        const matches = keywords.length === 0 || keywords.some(k => text.includes(k));
        if (!matches) continue;

        // Entry-only filter — exclude senior titles
        if (entryOnly && SENIOR_EXCLUDE.some(s => titleLower.includes(s))) continue;

        // Custom exclude keywords
        if (excludeKeywords.length > 0 && excludeKeywords.some(k => text.includes(k))) continue;

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
