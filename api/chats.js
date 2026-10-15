export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'no'});
 const {message,image}=req.body;
 const KEY=process.env.GROQ_API_KEY;
 if(!KEY)return res.status(500).json({error:'key missing'});
 try{
  let model="llama-3.1-8b-instant";
  let msgs=[{role:"system",content:"You are Scarlet AI OEV-1 created by Moco. You are ChatGPT + Gemini + Meta + Groq combined. Fast, helpful, friendly. Mix Tamil slang da. Answer in same language user uses."}];
  if(image){
    model="meta-llama/llama-4-scout-17b-16e-instruct";
    msgs=[{role:"user",content:[{type:"text",text:message},{type:"image_url",image_url:{url:image}}]}];
  }else{
    msgs.push({role:"user",content:message});
  }
  const groq=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model,messages:msgs,temperature:0.7,max_tokens:1024,stream:true})});
  if(!groq.ok){const t=await groq.text();return res.status(500).json({error:t});}
  res.setHeader('Content-Type','text/event-stream');res.setHeader('Cache-Control','no-cache');res.setHeader('Connection','keep-alive');
  const reader=groq.body.getReader();const dec=new TextDecoder();
  while(true){const {done,value}=await reader.read();if(done)break;const chunk=dec.decode(value);const lines=chunk.split('\n').filter(l=>l.trim().startsWith('data:'));for(const line of lines){const data=line.replace('data: ','').trim();if(data==='[DONE]'){res.write('data: [DONE]\n\n');break;}try{const j=JSON.parse(data);const t=j.choices?.[0]?.delta?.content||'';if(t)res.write(`data: ${t}\n\n`);}catch{}} }res.end();
 }catch(e){res.status(500).json({error:e.message});}
}
