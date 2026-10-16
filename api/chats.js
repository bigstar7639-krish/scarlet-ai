// api/chat.js - Vercel Backend - ChatGPT Clone
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({error:'POST only'});

  try {
    const {message, history=[]} = req.body;
    if(!message) return res.status(400).json({error:'Message required'});

    // Use env key from Vercel
    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey) return res.status(500).json({error:'Server key missing'});

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {role:'system', content:'You are Scarlet AI, a ChatGPT clone. Reply in SAME language as user (Tamil, Tanglish, Hindi, Hinglish, English, Malayalam, Telugu, Kannada, Bengali). Be friendly, helpful, short. You are made by Scarlet team.'},
         ...history.slice(-6), // last 6 messages for context
          {role:'user', content:message}
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    if(data.error) throw new Error(data.error.message);

    return res.status(200).json({reply: data.choices[0].message.content});

  } catch (e) {
    return res.status(500).json({error: e.message});
  }
}
