export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).send('Method Not Allowed');

  const apiKey = process.env.OPENAI_API_KEY;
  if(!apiKey) return res.status(500).json({error:'OPENAI_API_KEY not set in Vercel Dashboard'});

  try{
    const {messages} = req.body;
    const r = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body:JSON.stringify({model:'gpt-4o-mini',messages,temperature:0.7})
    });
    const data = await r.json();
    if(!r.ok) return res.status(r.status).json({error:data.error?.message||'OpenAI Error'});
    return res.status(200).json(data);
  }catch(e){
    return res.status(500).json({error:e.message});
  }
}
