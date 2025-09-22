const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateTags, chooseContentType, generateFinalResponse } = require('../services/aiService');
const { fetchTopContent, markUsed, getUsed } = require('../services/contentService');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  const token = h.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch(e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/message', authMiddleware, async (req, res) => {
  const { message, session_id } = req.body;
  const userId = req.userId;
  // 1. tags
  const tags = await generateTags(message); // array
  const mainTag = tags[0];

  // 2. decide content type
  const nextType = await chooseContentType(message, null, null);

  // 3. fetch from DB excluding used priorities
  const used = await getUsed(session_id, mainTag, nextType);
  const content = await fetchTopContent(mainTag, nextType, used);
  if (!content) return res.status(404).json({ error: 'No content found' });

  // 4. personalize AI response
  // get user info
  const client = await pool.connect();
  const u = await client.query('SELECT name, language_preference FROM users WHERE id=$1', [userId]);
  const user = u.rows[0];
  client.release();

  const aiResponse = await generateFinalResponse(message, content, nextType, user);

  // 5. persist conversation
  const client2 = await pool.connect();
  try {
    await client2.query(`
      INSERT INTO conversations (id, user_id, session_id, user_message, ai_response, generated_tags, content_type, content_id, timestamp)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, now())
    `, [userId, session_id, message, aiResponse, tags, nextType, content.id]);
  } finally { client2.release(); }

  // 6. mark used
  if (content.priority_number) await markUsed(session_id, mainTag, nextType, content.priority_number);

  // 7. suggestions
  const suggestions = nextType === 'mantra'
    ? ['Tell me a story', 'How do I apply this?', 'I feel better']
    : ['Tell me another', 'Give practical action', 'Play video'];

  // 8. return
  res.json({
    response: aiResponse,
    suggestions,
    content_type: nextType,
    content
  });
});

module.exports = router;
