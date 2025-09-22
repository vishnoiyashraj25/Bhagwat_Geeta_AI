const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateTags(userMessage) {
  const prompt = `Classify this message into relevant tags from [job_loss, loneliness, family_trust_issue, anxiety, depression, relationship_trouble, financial_stress]. Return JSON array. Message: "${userMessage}"`;
  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 50,
    temperature: 0
  });
  const text = r.choices[0].message.content;
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // fallback: simple keyword mapping
  const lower = userMessage.toLowerCase();
  const tags = [];
  if (/job|work|fired|firing|terminated|job/i.test(lower)) tags.push('job_loss');
  if (/family|parents|believe|believing/i.test(lower)) tags.push('family_trust_issue');
  if (/alone|lonely/i.test(lower)) tags.push('loneliness');
  if (tags.length === 0) tags.push('anxiety');
  return tags;
}

async function chooseContentType(userMessage, lastType, summary) {
  const prompt = `
You are a spiritual guide. Choose the next content_type from ["mantra","belief","story","action","youtube_video"].
User Message: "${userMessage}"
Last Provided Content Type: "${lastType || ''}"
Conversation Summary: "${summary || ''}"
Return only the single word content_type.
`;
  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 6,
    temperature: 0
  });
  const out = r.choices[0].message.content.trim().toLowerCase();
  const allowed = ['mantra','belief','story','action','youtube_video'];
  return allowed.includes(out) ? out : 'mantra';
}

async function generateFinalResponse(userMessage, content, contentType, userContext) {
  const system = `You are a kind Krishna-like spiritual guide. Be empathetic, concise (<= 150 words), avoid medical advice. Personalize using name: ${userContext?.name || 'friend'}.`;
  let contentBlock = '';
  if (contentType === 'mantra') {
    contentBlock = `Mantra: ${content.sanskrit_text}\nMeaning: ${content.meaning}\nApplication: ${content.application_context}`;
  } else if (contentType === 'story') {
    contentBlock = `Story: ${content.title}\n${content.content}\nMoral: ${content.moral_lesson}`;
  } else if (contentType === 'action') {
    contentBlock = `Action: ${content.action_title}\n${content.description}`;
  } else if (contentType === 'belief') {
    contentBlock = `Belief: ${content.belief_text}\n${content.explanation}`;
  } else if (contentType === 'youtube_video') {
    contentBlock = `Video: ${content.video_title}\n${content.video_url}`;
  }
  const prompt = `${system}\nUser message: ${userMessage}\nUse the content below to craft a short personalized reply:\n${contentBlock}`;
  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.7
  });
  return r.choices[0].message.content.trim();
}

module.exports = { generateTags, chooseContentType, generateFinalResponse };
