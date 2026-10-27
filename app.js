(() => {
const $=id=>document.getElementById(id), input=$("cmd"), result=$("result");
const apps={
youtube:["https://www.youtube.com/","intent://www.youtube.com/#Intent;scheme=https;package=com.google.android.youtube;end"],
whatsapp:["https://www.whatsapp.com/","intent://send/#Intent;scheme=whatsapp;package=com.whatsapp;end"],
instagram:["https://www.instagram.com/","intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end"],
"google maps":["https://maps.google.com/","geo:0,0?q="],maps:["https://maps.google.com/","geo:0,0?q="],
gmail:["https://mail.google.com/","intent://mail.google.com/#Intent;scheme=https;package=com.google.android.gm;end"],
spotify:["https://open.spotify.com/","intent://open.spotify.com/#Intent;scheme=https;package=com.spotify.music;end"],
google:["https://www.google.com/","https://www.google.com/"],chrome:["https://www.google.com/chrome/","https://www.google.com/chrome/"],
github:["https://github.com/","https://github.com/"],facebook:["https://www.facebook.com/","intent://facebook.com/#Intent;scheme=https;package=com.facebook.katana;end"],
telegram:["https://web.telegram.org/","intent://t.me/#Intent;scheme=https;package=org.telegram.messenger;end"],
reddit:["https://www.reddit.com/","https://www.reddit.com/"],netflix:["https://www.netflix.com/","intent://www.netflix.com/#Intent;scheme=https;package=com.netflix.mediaclient;end"],
amazon:["https://www.amazon.in/","https://www.amazon.in/"],linkedin:["https://www.linkedin.com/","https://www.linkedin.com/"]};
function say(msg,bad=false){result.textContent=(bad?"NOTICE: ":"ULTRON: ")+msg}
function execute(raw){
let c=(raw||"").trim().toLowerCase().replace(/[.!?]+$/,"");if(!c)return say("Enter or speak a command first.",true);input.value=raw;
if(["help","commands","what can you do"].includes(c))return say('Try “open YouTube”, “open WhatsApp”, “open Instagram”, “open Maps”, “open Gmail”, “open Spotify”, “open GitHub”, “search Java tutorials”, or “what time is it”.');
if(["what time is it","time","current time"].includes(c))return say("The device reports "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})+".");
if(["what date is it","date","today's date","todays date"].includes(c))return say("Today is "+new Date().toLocaleDateString([],{weekday:"long",year:"numeric",month:"long",day:"numeric"})+".");
let m=c.match(/^(?:search(?: the web)?(?: for)?|google)\s+(.+)$/);if(m){let u="https://www.google.com/search?q="+encodeURIComponent(m[1]);say('Searching the web for "'+m[1]+'".');window.open(u,"_blank","noopener,noreferrer");return}
m=c.match(/^(?:open|launch|start|go to)\s+(.+)$/);if(m){let n=m[1].replace(/^the\s+/,"").replace(/ app$/,"");if(apps[n]){let fallback=apps[n][0],url=/Android/i.test(navigator.userAgent)?apps[n][1]:fallback;say("Trying to open "+n+". If the app link is blocked, use this website: "+fallback);let w=window.open(url,"_blank","noopener,noreferrer");if(!w)say("The browser blocked the new tab. Allow pop-ups or open "+fallback+" manually.",true);return}
if(/^(https?:\/\/)?[a-z0-9-]+(\.[a-z]{2,})+(\/.*)?$/i.test(n)){let u=/^https?:\/\//i.test(n)?n:"https://"+n;say("Opening "+u);window.open(u,"_blank","noopener,noreferrer");return}
return say('I cannot directly launch "'+n+'" from a website. Try a supported target or say “search '+n+'”.',true)}
if(apps[c]){let fallback=apps[c][0],url=/Android/i.test(navigator.userAgent)?apps[c][1]:fallback;say("Trying to open "+c+". Website fallback: "+fallback);window.open(url,"_blank","noopener,noreferrer");return}
say('Command not recognized. Try “open YouTube”, “search Java tutorials”, “what time is it”, or “help”.',true)}
$("form").addEventListener("submit",e=>{e.preventDefault();execute(input.value)});
document.querySelectorAll("[data-command]").forEach(b=>b.addEventListener("click",()=>execute(b.dataset.command)));
$("theme").addEventListener("click",()=>{document.body.classList.toggle("light");document.querySelector('meta[name="theme-color"]').content=document.body.classList.contains("light")?"#f2f6fc":"#080d18"});
const SR=window.SpeechRecognition||window.webkitSpeechRecognition, mic=$("mic"), status=$("voiceStatus");
if(!SR){mic.disabled=true;mic.style.opacity=".45";status.textContent="Voice recognition is not supported in this browser. Use text commands or try an up-to-date Chrome browser on HTTPS."}
else{const r=new SR();r.lang="en-IN";r.interimResults=false;r.maxAlternatives=1;r.onstart=()=>{mic.textContent="🔴";status.textContent="Listening… say a short command."};r.onresult=e=>{input.value=e.results[0][0].transcript;status.textContent="Heard: “"+input.value+"”";execute(input.value)};r.onerror=e=>status.textContent=e.error==="not-allowed"?"Microphone permission denied. Allow microphone access in site settings.":"Voice issue: "+e.error+". You can still type commands.";r.onend=()=>mic.textContent="🎙";mic.addEventListener("click",()=>{try{r.start()}catch(e){status.textContent="Voice input is starting; please wait."}})}
$("clock").textContent=new Date().toLocaleString([],{dateStyle:"medium",timeStyle:"short"});say('Ready. Try “open YouTube” or “help”.');
})();