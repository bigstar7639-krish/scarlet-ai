// FIREBASE CONFIG - UN KEY DA HARI!
const firebaseConfig = {
  apiKey: "AIzaSyAJagbPj-jtLCYeTE-PDOWc9tuhXCl6PdE",
  authDomain: "scarlet-ai-fa68c.firebaseapp.com",
  projectId: "scarlet-ai-fa68c",
  storageBucket: "scarlet-ai-fa68c.firebasestorage.app",
  messagingSenderId: "145131745721",
  appId: "1:145131745721:web:dfa412973efb2f37c3c668"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');

// 1. REDIRECT RESULT - LOGIN SUCCESS CHECK
auth.getRedirectResult().then((result)=>{
  if(result && result.user){
    console.log("SUCCESS DA HARI!", result.user.displayName);
  }
}).catch((e)=>{
  console.error(e);
  alert("Error: "+e.code+"\n"+e.message);
  loginBtn.innerText = "Login";
});

// 2. AUTH STATE - LOGIN AANA USER-A KAAMIKKANUM
auth.onAuthStateChanged((user)=>{
  if(user){
    loginBtn.style.display='none';
    userInfo.style.display='flex';
    userInfo.style.alignItems='center';
    userInfo.innerHTML = `👤 ${user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0]} <button onclick="firebase.auth().signOut().then(()=>location.reload())" style="margin-left:8px;padding:5px 12px;border-radius:12px;background:#222;color:#fff;border:1px solid #444;cursor:pointer">Logout</button>`;
  } else {
    loginBtn.style.display='block';
    userInfo.style.display='none';
    loginBtn.innerText = "Login";
  }
});

// 3. LOGIN BUTTON - REDIRECT ONLY (ABOUT:BLANK FIX)
loginBtn.onclick = async ()=>{
  loginBtn.innerText = "Opening Google...";
  loginBtn.disabled = true;
  try{
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    await auth.signInWithRedirect(provider);
  }catch(e){
    alert("FAILED:\n"+e.code+"\n"+e.message);
    loginBtn.innerText = "Login";
    loginBtn.disabled = false;
  }
};

// 4. GENERATE LOGIC
function getCredits(){
  const k='img_use_'+new Date().toDateString();
  let u=parseInt(localStorage.getItem(k)||"0"); if(isNaN(u)) u=0;
  document.getElementById('credit').innerText=`${6-u}/6`;
  return {u,k};
}
getCredits();
document.getElementById('genBtn').onclick=()=>{
  const p=document.getElementById('prompt').value.trim();
  if(!p) return alert("Prompt type pannu da!");
  let {u,k}=getCredits(); if(u>=6) return alert("Daily over da!");
  const b=document.getElementById('genBtn'); b.disabled=true; b.innerText="Generating... 🔥";
  const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?seed=${Math.floor(Math.random()*99999)}&nologo=true&width=768&height=768`;
  document.getElementById('result').innerHTML=`<img src="${url}" onload="document.getElementById('genBtn').disabled=false;document.getElementById('genBtn').innerText='Generate (1 Credit)'; ">`;
  localStorage.setItem(k,String(u+1)); getCredits();
};
