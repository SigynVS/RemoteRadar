const cron = require('node-cron');
const { fetchAll } = require('./fetcher');

let task = null;

function start(mainWindow) {
  // Fetch immediately on startup
  runFetch();

  // Then schedule based on settings
  task = cron.schedule('0 */2 * * *', runFetch); // every 2 hours default
}

async function runFetch() {
  try {
    const db = require('./db');
    const settings = db.getSettings();
    const hours = parseInt(settings.fetch_interval_hours || '2', 10);

    // Re-schedule if interval changed (simple approach: always run, cron handles timing)
    const newCount = await fetchAll(db);
    console.log(`[RemoteRadar] Fetched — ${newCount} new jobs`);

    if (newCount > 0 && global.notifyNewJobs) {
      global.notifyNewJobs(newCount);
    }
  } catch (err) {
    console.error('[RemoteRadar] Scheduler error:', err.message);
  }
}

function stop() {
  if (task) task.stop();
}

module.exports = { start, stop };
