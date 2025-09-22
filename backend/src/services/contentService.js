const pool = require('../db');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const TABLE_BY_TYPE = {
  mantra: 'mantras',
  story: 'stories',
  belief: 'beliefs',
  action: 'actions',
  youtube_video: 'youtube_videos'
};

async function fetchTopContent(tagName, contentType, usedPriorities = []) {
  const table = TABLE_BY_TYPE[contentType];
  if (!table) return null;
  const client = await pool.connect();
  try {
    const q = `
      SELECT * FROM ${table}
      WHERE tag_id = (SELECT id FROM tags WHERE tag_name=$1)
      AND (priority_number IS NULL OR NOT (priority_number = ANY($2::int[])))
      ORDER BY priority_number ASC NULLS LAST
      LIMIT 1;
    `;
    const res = await client.query(q, [tagName, usedPriorities]);
    return res.rows[0] || null;
  } finally {
    client.release();
  }
}

async function markUsed(sessionId, tag, contentType, priority) {
  const key = `used:${sessionId}:${tag}:${contentType}`;
  const data = await redis.get(key);
  const arr = data ? JSON.parse(data) : [];
  arr.push(priority);
  await redis.set(key, JSON.stringify(arr), 'EX', 24*3600);
}

async function getUsed(sessionId, tag, contentType) {
  const key = `used:${sessionId}:${tag}:${contentType}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : [];
}

module.exports = { fetchTopContent, markUsed, getUsed };
