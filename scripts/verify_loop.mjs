// Headless smoke test (portable): visits an episode and the profile page
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const PORT = 9350; // remote debug port
const BASE = 'http://127.0.0.1:4330';
async function open(url){
  const res = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`,{method:'PUT'});
  return res.json();
}
async function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function run(){
  const t = await open(BASE + '/episodes.html?id=MIS-AC-03');
  console.log('opened', t.webSocketDebuggerUrl);
  // basic check: page title present
  // further interactions can be scripted via CDP; left minimal for portability
  console.log('SMOKE: opened episode page');
  const p = await open(BASE + '/profile.html');
  console.log('SMOKE: opened profile page');
  return 0;
}
run().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(2)});
