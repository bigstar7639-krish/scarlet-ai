export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'no'});
 const {prompt}=req.body;
 const KEY=process.env.GROQ_API_KEY;
 try{
  let enhanced=prompt;
  if(KEY){
   try{
    const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.1-8b-instant",messages:[{role:"system",content:"You are prompt engineer like ChatGPT/Gemini. Enhance user prompt to detailed image prompt. Add style, lighting, background, quality tags: highly detailed, 8k, masterpiece, sharp focus. Return ONLY enhanced prompt, 1 sentence, 60-80 words."},{role:"user",content:prompt}],temperature:0.8,max_tokens:150})});
    const d=await r.json();enhanced=d.choices?.[0]?.message?.content?.trim()||prompt;
   }catch{}
  }
  if(!enhanced.includes('highly detailed'))enhanced+=', highly detailed, 8k, masterpiece, sharp focus, cinematic lighting, vibrant';
  const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(enhanced)}?seed=${Math.floor(Math.random()*99999)}&width=768&height=768&model=flux&nologo=true&private=true&enhance=true&nofeed=true`;
  res.json({original:prompt,enhanced,url});
 }catch(e){res.status(500).json({error:e.message});}
}
