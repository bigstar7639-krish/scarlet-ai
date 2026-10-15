export async function POST(req) {
  try {
    const { message } = await req.json();
    
    // Scarlet AI - No Groq needed!
    const replies = [
      `Hey da! "${message}" nu ketta la? Scarlet AI ready da 🔥`,
      `Moco ${message} ku naan irukken da! Enna help venum sollu?`,
      `Semma da! ${message} - idha pathi pesalam va!`
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    return new Response(JSON.stringify({ 
      reply: randomReply,
      status: "Scarlet AI LIVE - OEV-1" 
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (e) {
    return new Response(JSON.stringify({ reply: "Scarlet AI ready da Moco! Enna venum?" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ status: "Scarlet AI OEV-1 is LIVE 🔥" }), {
    headers: { "Content-Type": "application/json" }
  });
}
