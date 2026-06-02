import { useState, useEffect, useMemo } from "react";

// ─── 30-DAY CAMPAIGN CALENDAR ─────────────────────────────────────────────
// [day, slot, week, theme, topic, accentColor]
const CAL=[
[1,"9am",1,"Spending Blindspot","You approve budgets you can never measure","#dc2626"],
[1,"6pm",1,"Spending Blindspot","The renewal email nobody questions","#dc2626"],
[2,"9am",1,"Spending Blindspot","Ghost seats bleeding your budget","#dc2626"],
[2,"6pm",1,"Spending Blindspot","The tool nobody admitted they stopped using","#dc2626"],
[3,"9am",1,"Spending Blindspot","CFO vs CTO: the ROI conversation nobody wins","#dc2626"],
[3,"6pm",1,"Spending Blindspot","We measure everything except what we spend on devs","#dc2626"],
[4,"9am",1,"Spending Blindspot","The $800K mistake I watched happen","#dc2626"],
[4,"6pm",1,"Spending Blindspot","Nobody owns the dev tools audit","#dc2626"],
[5,"9am",1,"Spending Blindspot","Dead weight in your developer toolkit","#dc2626"],
[5,"6pm",1,"Spending Blindspot","The audit-it-next-quarter lie","#dc2626"],
[6,"9am",1,"Spending Blindspot","Seat count vs usage count — the gap nobody sees","#dc2626"],
[6,"6pm",1,"Spending Blindspot","What happens when you finally run the numbers","#dc2626"],
[7,"9am",1,"Spending Blindspot","Week 1: the blindspot nobody wants to own","#dc2626"],
[7,"6pm",1,"Spending Blindspot","SaaS renewals are built on your laziness","#dc2626"],
[8,"9am",2,"Accountability Gap","Nobody gets fired for approving AI tools","#f97316"],
[8,"6pm",2,"Accountability Gap","The dev who stopped using AI tools after week 2","#f97316"],
[9,"9am",2,"Accountability Gap","AI tools were supposed to 10x productivity","#f97316"],
[9,"6pm",2,"Accountability Gap","Senior devs hate it. Juniors love it. Now what?","#f97316"],
[10,"9am",2,"Accountability Gap","The code review problem nobody talks about","#f97316"],
[10,"6pm",2,"Accountability Gap","We ship faster and break more — is that a win?","#f97316"],
[11,"9am",2,"Accountability Gap","The VP asked to justify $400K in AI tools","#f97316"],
[11,"6pm",2,"Accountability Gap","Activity metrics are lying about AI productivity","#f97316"],
[12,"9am",2,"Accountability Gap","The org that bought 3 AI coding tools at once","#f97316"],
[12,"6pm",2,"Accountability Gap","The hallucination problem is your liability now","#f97316"],
[13,"9am",2,"Accountability Gap","Best engineers don't need AI. Worst overuse it.","#f97316"],
[13,"6pm",2,"Accountability Gap","The standup where nobody mentions the AI tool","#f97316"],
[14,"9am",2,"Accountability Gap","Week 2: why do smart leaders let this happen?","#f97316"],
[14,"6pm",2,"Accountability Gap","What if you knew which devs weren't using it?","#f97316"],
[15,"9am",3,"Industry Pattern","This isn't your problem. It's everyone's.","#3b82f6"],
[15,"6pm",3,"Industry Pattern","Survey data that should embarrass us all","#3b82f6"],
[16,"9am",3,"Industry Pattern","How did we get here? A brief history","#3b82f6"],
[16,"6pm",3,"Industry Pattern","The Series B team burning cash on unmeasured tools","#3b82f6"],
[17,"9am",3,"Industry Pattern","The tool vendor's dirty secret","#3b82f6"],
[17,"6pm",3,"Industry Pattern","Why engineers don't report low tool usage","#3b82f6"],
[18,"9am",3,"Industry Pattern","The $50B question nobody asks","#3b82f6"],
[18,"6pm",3,"Industry Pattern","Why the best CTOs are pushing back on AI tools","#3b82f6"],
[19,"9am",3,"Industry Pattern","The codebase rot nobody connects to AI tools","#3b82f6"],
[19,"6pm",3,"Industry Pattern","India's teams: fastest adopters, least measurement","#3b82f6"],
[20,"9am",3,"Industry Pattern","What the data actually says about AI productivity","#3b82f6"],
[20,"6pm",3,"Industry Pattern","The retro nobody runs: did the AI tool help?","#3b82f6"],
[21,"9am",3,"Industry Pattern","Week 3: the picture is getting clear","#3b82f6"],
[21,"6pm",3,"Industry Pattern","The problem is solvable. We need to decide it matters.","#3b82f6"],
[22,"9am",4,"Building in Public","Why I'm building something to fix this problem","#22c55e"],
[22,"6pm",4,"Building in Public","What 20 CTO conversations taught me","#22c55e"],
[23,"9am",4,"Building in Public","The first version was terrible","#22c55e"],
[23,"6pm",4,"Building in Public","The moment I almost gave up","#22c55e"],
[24,"9am",4,"Building in Public","What being a non-technical founder actually feels like","#22c55e"],
[24,"6pm",4,"Building in Public","The feedback that changed everything","#22c55e"],
[25,"9am",4,"Building in Public","Building in Bhubaneswar for CTOs in San Francisco","#22c55e"],
[25,"6pm",4,"Building in Public","The infrastructure is live. The anxiety is real.","#22c55e"],
[26,"9am",4,"Building in Public","What I'd tell myself 6 months ago","#22c55e"],
[26,"6pm",4,"Building in Public","The metric I track with nothing to do with revenue","#22c55e"],
[27,"9am",4,"Building in Public","To every CTO who DM'd me about this problem","#22c55e"],
[27,"6pm",4,"Building in Public","72 hours from now everything changes","#22c55e"],
[28,"9am",4,"Building in Public","24 hours. The problem. The gap. The answer.","#22c55e"],
[28,"6pm",4,"Building in Public","Tonight I can't sleep","#22c55e"],
[29,"9am",5,"LAUNCH","Introducing Grassion — we built the answer","#a855f7"],
[29,"6pm",5,"LAUNCH","The exact numbers Grassion shows you","#a855f7"],
[30,"9am",5,"POST-LAUNCH","30 days. One problem. One solution.","#a855f7"],
[30,"6pm",5,"POST-LAUNCH","To everyone who said this is exactly my problem","#a855f7"],
];

// ─── AI SYSTEM PROMPT ─────────────────────────────────────────────────────
const SYSTEM = `You are a thought leader in engineering management writing about the AI coding tools accountability problem.

CRITICAL FORMAT RULES — follow these exactly or the post fails:
- Write in plain human prose ONLY. No markdown formatting whatsoever.
- NEVER use asterisks, bold, bullet points with *, dashes as bullets, or any ### headers.
- For LinkedIn: write in short conversational paragraphs separated by blank lines. Reads like a real person's post.
- For Twitter: write numbered tweets like "1/" "2/" etc. Plain sentences. No formatting.
- Sound like a real human professional who genuinely cares about this problem.
- No AI-sounding phrases: no "In today's world", no "It's important to", no "As we navigate".
- Every post must make a senior engineer or CTO nod and say "this is exactly what we deal with."
- Do NOT mention any product (Grassion) unless the topic says grassion.com.
- Write ONLY the post text. Nothing else. No "Here is your post:" no intro, no metadata.`;

// ─── PLATFORM INSTRUCTIONS ────────────────────────────────────────────────
const INSTR = {
  linkedin: `LinkedIn post. 700 to 1000 characters. Start with a single punchy line that stops the scroll — a specific dollar amount, a provocative observation, or a stat that surprises. Then 3 short paragraphs of plain prose. End with one question that makes CTOs uncomfortable in a good way. Max 3 hashtags at the very end. No bullet points. No asterisks. Conversational paragraphs only.`,
  twitter: `Twitter thread. 8 tweets numbered 1/ through 8/. Each tweet under 280 characters. First tweet is the hook — scroll-stopping, specific. Build tension tweet by tweet. Last tweet is a question or sharp insight. Plain text sentences only, no formatting characters.`,
  reddit: `Reddit r/SaaS post. First line is the title. Then body text in plain conversational paragraphs. Honest founder voice. Can hint at building something. No spam. Reads like a genuine observation from someone who works in engineering.`,
  devto: `Dev.to article. First line is a punchy article title. Then 700 to 900 words of plain prose with clear paragraph breaks. No markdown headers, no bullet points. Write naturally like a blog post, not a listicle. End with a question for the reader.`,
  hn: `Hacker News submission. Show HN or Ask HN format. Under 200 words total. Completely factual. Zero hype. Reads like an engineer wrote it. Plain text only.`,
  ih: `IndieHackers post. Transparent founder voice. Real numbers and real feelings. Building-in-public energy. Plain paragraphs. Honest about what's hard. Reads like a diary entry from a founder, not marketing copy.`,
};

// ─── EXTRA CONTEXT PER TOPIC ──────────────────────────────────────────────
const EXTRA = {
  "You approve budgets you can never measure": "CTOs approve $50K plus in dev tools every quarter with zero process to verify actual usage afterward. Lead with a specific dollar number — make it feel real. Confessional tone, like you're admitting a collective sin. End with a question that makes the reader squirm slightly.",
  "Ghost seats bleeding your budget": "23% of software seats in any engineering org are completely unused. Show the math for a 100-person team paying per seat. Ghost licenses paid monthly, never touched, auto-renewing. Make the number feel visceral. This is money vanishing silently every month.",
  "CFO vs CTO: the ROI conversation nobody wins": "The moment every CTO dreads — CFO walks in and asks what is the ROI on this $400K in developer tools. Internal panic. A vague answer about productivity and morale. An awkward slide with vanity metrics. Write this scene so every CTO reading it feels it in their stomach.",
  "Nobody gets fired for approving AI tools": "AI tool budgets get rubber-stamped because no one wants to be the person who blocked the team from using AI. So it gets approved, deployed with excitement, then unmeasured, then silently renewed. Write about this herd mentality and why smart people participate in it.",
  "AI tools were supposed to 10x productivity": "The gap between vendor promises — 10x faster, 55% more output — and what most teams actually measure day to day. Some developers benefit enormously. Others see no change or negative effects. The average hides everything. CTOs have no way to tell which is which.",
  "The VP asked to justify $400K in AI tools": "VP Engineering facing a board meeting needs to justify $400K in AI tools across the org. Has dashboards showing commit volume and lines of code. Has no outcome data. Has no revert rate by tool. Has no ROI number. Write the anxiety, the scramble, the vague answer they end up giving.",
  "The tool vendor's dirty secret": "AI coding tool vendors have detailed internal dashboards showing exactly which seats are active and which haven't been touched in months. They never proactively share this with customers. Low-usage data stays hidden because unused seats still renew. This is not conspiracy — it's just how subscription software works.",
  "Why I'm building something to fix this problem": "Building-in-public intro post. Three weeks of talking about this problem. Now building something. Do not name the product at all. Explain why this specific problem drove you personally to build. Bhubaneswar, non-technical founder, first product. Vulnerable and direct.",
  "The moment I almost gave up": "Raw honest post about almost quitting the build. What made you doubt it. A specific low moment. What made you continue. Not a Hollywood comeback story — just a real founder moment that other founders will recognize immediately.",
  "Building in Bhubaneswar for CTOs in San Francisco": "The experience of building something in Bhubaneswar that engineering leaders in San Francisco and London actually need. The geographic paradox. The slight absurdity and the genuine pride. Write this with self-awareness and warmth.",
  "72 hours from now everything changes": "Teaser post. 72 hours from now you are launching something. Do not say what it is. Build tension. Reference the four weeks of problem posts without naming the solution. Short, punchy, makes people want to follow you right now.",
  "Tonight I can't sleep": "Launch eve. Everything is built. Tomorrow it goes public. Under 150 words. Raw honest feeling. Every founder who has been here will recognize this immediately. No drama, just the specific texture of that feeling.",
  "Introducing Grassion — we built the answer": "THE LAUNCH POST. This is the payoff after 28 days of pure problem content. Reveal Grassion: connects to GitHub, shows CTOs if their Copilot and Cursor spend is actually working — per-developer ROI verdict, seat waste detection, codebase health score 0 to 100. Connect every point back to the problems discussed over 28 days. This should feel like the answer the audience has been waiting for. End with grassion.com",
  "The exact numbers Grassion shows you": "Launch follow-up post. Be specific about what the Grassion dashboard actually shows: seat utilization rate per developer, AI PR revert rate versus human PR revert rate, codebase health score from 0 to 100, weekly trends over time, per-tool attribution (Copilot vs Cursor vs Codeium). Tell a CTO exactly what they would see in their first 2 minutes. End with grassion.com",
};

// ─── IMAGE GENERATION (Canvas, no API needed) ─────────────────────────────
function makeImg(day, slot, topic, acc) {
  const cv = document.createElement("canvas");
  cv.width = 1200; cv.height = 630;
  const x = cv.getContext("2d");
  const BGS = { "#dc2626":"#0a0000","#f97316":"#0a0500","#3b82f6":"#000814","#22c55e":"#001a0a","#a855f7":"#0a0008" };
  const g = x.createLinearGradient(0, 0, 1200, 630);
  g.addColorStop(0, BGS[acc] || "#080808"); g.addColorStop(1, "#111");
  x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
  const gl = x.createRadialGradient(260, 315, 20, 260, 315, 380);
  gl.addColorStop(0, acc + "22"); gl.addColorStop(1, "transparent");
  x.fillStyle = gl; x.fillRect(0, 0, 1200, 630);
  x.fillStyle = acc + "15";
  for (let px = 690; px < 1160; px += 36)
    for (let py = 50; py < 590; py += 36) { x.beginPath(); x.arc(px, py, 1.8, 0, Math.PI * 2); x.fill(); }
  [0.3,0.68,0.45,0.88,0.55,0.95,0.4,0.72,0.85,0.5].forEach((h, i) => {
    const bx = 710 + i * 46, bh = h * 230, by = 385 - bh;
    const bg = x.createLinearGradient(0, by, 0, 385);
    bg.addColorStop(0, acc + "bb"); bg.addColorStop(1, acc + "15");
    x.fillStyle = bg; x.beginPath(); x.roundRect(bx, by, 32, bh, [5,5,0,0]); x.fill();
    x.fillStyle = acc; x.fillRect(bx, by, 32, 3);
  });
  x.strokeStyle = "#ffffff06"; x.lineWidth = 1;
  [205,265,325,385].forEach(y => { x.beginPath(); x.moveTo(695, y); x.lineTo(1165, y); x.stroke(); });
  const tb = x.createLinearGradient(0, 0, 900, 0);
  tb.addColorStop(0, acc); tb.addColorStop(1, "transparent");
  x.fillStyle = tb; x.fillRect(0, 0, 1200, 5);
  const lb = x.createLinearGradient(0, 0, 0, 630);
  lb.addColorStop(0, acc); lb.addColorStop(1, "transparent");
  x.fillStyle = lb; x.fillRect(0, 0, 4, 630);
  x.fillStyle = acc + "20"; x.beginPath(); x.roundRect(60, 50, 166, 32, 16); x.fill();
  x.font = "700 12px monospace"; x.fillStyle = acc; x.textAlign = "center";
  x.fillText(`WEEK ${Math.ceil(day / 7)} · DAY ${day}`, 143, 71); x.textAlign = "left";
  if (day >= 29) {
    x.font = "900 110px Arial"; x.fillStyle = acc; x.shadowColor = acc; x.shadowBlur = 50;
    x.fillText("LIVE", 60, 310); x.shadowBlur = 0;
    x.font = "700 22px Arial"; x.fillStyle = "#fff"; x.fillText("grassion.com", 60, 360);
  } else {
    const words = topic.toUpperCase().split(" "); let ln = "", ly = 210;
    x.font = "900 62px Arial";
    words.forEach(w => {
      const t = ln + w + " ";
      if (x.measureText(t).width > 540 && ln) {
        x.fillStyle = acc; x.shadowColor = acc; x.shadowBlur = 16; x.fillText(ln.trim(), 60, ly); x.shadowBlur = 0;
        ln = w + " "; ly += 76;
      } else ln = t;
    });
    x.fillStyle = acc; x.shadowColor = acc; x.shadowBlur = 16; x.fillText(ln.trim(), 60, ly); x.shadowBlur = 0;
  }
  x.fillStyle = "#ffffff05"; x.fillRect(0, 592, 1200, 38);
  x.font = "700 12px monospace"; x.fillStyle = "#374151";
  x.fillText(day >= 29 ? "grassion.com — Where AI Code Meets Accountability" : `Day ${day} of 30 · Building in public`, 60, 615);
  x.fillStyle = slot === "9am" ? "#f97316" : "#3b82f6"; x.textAlign = "right";
  x.fillText(slot + " IST", 1120, 615); x.textAlign = "left";
  return cv.toDataURL("image/png");
}

// ─── PLATFORMS ────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id:"linkedin",    name:"LinkedIn",    emoji:"💼", color:"#0077b5", url:()=>"https://www.linkedin.com/feed/" },
  { id:"twitter",     name:"Twitter/X",   emoji:"🐦", color:"#1da1f2", url:(c)=>`https://twitter.com/intent/tweet?text=${encodeURIComponent(c.slice(0,280))}` },
  { id:"reddit",      name:"r/SaaS",      emoji:"🤖", color:"#ff4500", url:(c)=>`https://www.reddit.com/r/SaaS/submit?title=${encodeURIComponent(c.split('\n')[0].slice(0,200))}&text=${encodeURIComponent(c)}` },
  { id:"devto",       name:"Dev.to",      emoji:"📝", color:"#3b49df", url:()=>"https://dev.to/new" },
  { id:"hn",          name:"Hacker News", emoji:"🟠", color:"#ff6600", url:(c)=>`https://news.ycombinator.com/submit?title=${encodeURIComponent(c.split('\n')[0].slice(0,200))}` },
  { id:"ih",          name:"IndieHackers",emoji:"💡", color:"#5850e3", url:()=>"https://www.indiehackers.com/post/new" },
];

const wc = (d) => ["#dc2626","#f97316","#3b82f6","#22c55e","#22c55e","#a855f7"][Math.min(Math.ceil(d / 7) - 1, 5)];
const SK = "zeus_v8";
const lp = () => { try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch { return []; } };
const sp = (p) => { try { localStorage.setItem(SK, JSON.stringify(p)); } catch {} };

function Dots() {
  return <span style={{display:"inline-flex",gap:4}}>
    {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#ec4899",display:"inline-block",animation:`zb 1.2s ${i*.2}s infinite`}}/>)}
    <style>{`@keyframes zb{0%,80%,100%{transform:scale(.4);opacity:.2}40%{transform:scale(1);opacity:1}}`}</style>
  </span>;
}

// ─── LINKEDIN POSTING MODAL ───────────────────────────────────────────────
function Modal({ post, onClose, onDone }) {
  const [step, setStep] = useState(1);
  const [id, setId] = useState(false);
  const [ic, setIc] = useState(false);
  const dl = () => { const a = document.createElement("a"); a.href = post.img; a.download = `grassion-d${post.day}.png`; a.click(); setId(true); setStep(s=>Math.max(s,2)); };
  const cp = () => { navigator.clipboard.writeText(post.content).catch(()=>{}); setIc(true); setStep(s=>Math.max(s,3)); };
  const op = () => { window.open("https://www.linkedin.com/feed/","_blank"); setStep(s=>Math.max(s,4)); };
  return <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"#000000f0",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
    <div style={{background:"#0d0d0d",border:"1px solid #0077b540",borderRadius:16,width:"100%",maxWidth:800,maxHeight:"92vh",overflow:"auto"}}>
      <div style={{padding:"13px 18px",borderBottom:"1px solid #1a1a1a",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:26,height:26,background:"#0077b5",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>💼</div>
        <div><div style={{color:"#fff",fontFamily:"monospace",fontWeight:700,fontSize:12}}>LinkedIn Posting Assistant · Day {post.day} · {post.slot}</div></div>
        <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"1px solid #2d2d2d",color:"#6b7280",padding:"4px 11px",borderRadius:7,cursor:"pointer",fontSize:11}}>✕</button>
      </div>
      <div style={{padding:15,display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}>
        <div>
          <div style={{display:"flex",gap:3,marginBottom:13}}>
            {["① Download","② Copy","③ Open LI","④ Post"].map((s,i)=>{const n=i+1,done=step>n,act=step===n;return<div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:done?"#22c55e":act?"#0077b5":"#1f2937",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,margin:"0 auto 3px"}}>{done?"✓":n}</div>
              <div style={{fontSize:9,color:done?"#22c55e":act?"#60a5fa":"#374151",fontFamily:"monospace",lineHeight:1.3}}>{s}</div>
            </div>;})}
          </div>
          {post.img && <img src={post.img} alt="" style={{width:"100%",borderRadius:9,border:"1px solid #1f2937",marginBottom:9}}/>}
          <button onClick={dl} style={{width:"100%",padding:"10px",background:id?"#22c55e15":"#0077b5",border:`1.5px solid ${id?"#22c55e":"#0077b5"}`,borderRadius:9,color:id?"#22c55e":"#fff",fontSize:12,fontFamily:"monospace",fontWeight:700,cursor:"pointer",marginBottom:7}}>{id?"✓ Image saved to computer":"⬇ STEP 1 — Download image"}</button>
          <button onClick={op} style={{width:"100%",padding:"10px",background:"#0077b512",border:"1.5px solid #0077b5",borderRadius:9,color:"#60a5fa",fontSize:12,fontFamily:"monospace",fontWeight:700,cursor:"pointer",marginBottom:step>=4?11:0}}>{step>=4?"✓ LinkedIn open — go paste":"🔗 STEP 3 — Open LinkedIn"}</button>
          {step>=4&&<div style={{padding:12,background:"#001a2a",border:"1px solid #0077b528",borderRadius:10}}>
            <div style={{color:"#60a5fa",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:8}}>In LinkedIn now:</div>
            {["Click 'Start a post' (white box, top of feed)","Click inside text area","Ctrl+V to paste your text","Click 📷 photo icon, upload your image","Click the blue Post button ✓"].map((s,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:5}}>
              <div style={{width:17,height:17,borderRadius:"50%",background:"#0077b5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0}}>{i+1}</div>
              <div style={{color:"#9ca3af",fontSize:11}}>{s}</div>
            </div>)}
            <button onClick={()=>{onDone();onClose();}} style={{width:"100%",marginTop:9,padding:"10px",background:"#22c55e",border:"none",borderRadius:9,color:"#000",fontSize:13,fontFamily:"monospace",fontWeight:700,cursor:"pointer"}}>✓ Done — I posted it!</button>
          </div>}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <span style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",letterSpacing:2}}>POST TEXT</span>
            <button onClick={cp} style={{padding:"5px 13px",background:ic?"#22c55e":"#0077b5",border:"none",borderRadius:7,color:ic?"#000":"#fff",fontSize:11,fontFamily:"monospace",fontWeight:700,cursor:"pointer"}}>{ic?"✓ Copied!":"📋 STEP 2"}</button>
          </div>
          <div onClick={cp} style={{background:"#111",border:`1px solid ${ic?"#22c55e40":"#2d2d2d"}`,borderRadius:10,padding:12,maxHeight:320,overflow:"auto",cursor:"pointer",marginBottom:8}}>
            <p style={{color:"#d1d5db",fontSize:12,lineHeight:1.9,fontFamily:"Georgia,serif",margin:0,whiteSpace:"pre-wrap"}}>{post.content}</p>
          </div>
          <div style={{display:"flex",gap:7,marginBottom:9}}>
            <span style={{padding:"4px 9px",background:"#111",borderRadius:7,color:"#6b7280",fontSize:11,fontFamily:"monospace"}}>{post.content.length} chars</span>
            <span style={{padding:"4px 9px",background:post.content.length>1300?"#1f0000":"#0a1a0a",borderRadius:7,color:post.content.length>1300?"#f87171":"#22c55e",fontSize:11,fontFamily:"monospace"}}>{post.content.length>1300?"⚠ Long":"✓ Good length"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// ─── POST CARD ────────────────────────────────────────────────────────────
function Card({ post, onPosted, onDelete, onMetric }) {
  const [exp, setExp] = useState(false);
  const [li, setLi] = useState(false);
  const [sm, setSm] = useState(false);
  const [reach, setReach] = useState(post.reach || "");
  const [likes, setLikes] = useState(post.likes || "");
  const [cp, setCp] = useState(false);
  const p = PLATFORMS.find(pl => pl.id === post.pid);
  const isLI = post.pid === "linkedin";
  const openP = () => { navigator.clipboard.writeText(post.content).catch(()=>{}); setCp(true); setTimeout(()=>setCp(false),2500); onPosted(post.id); };
  const acc = wc(post.day);
  return <>
    {li && <Modal post={post} onClose={()=>setLi(false)} onDone={()=>onPosted(post.id)}/>}
    <div style={{background:"#0d0d0d",border:`1px solid ${post.posted?"#22c55e28":"#1f2937"}`,borderRadius:13,overflow:"hidden"}}>
      <div style={{padding:"9px 13px",display:"flex",alignItems:"center",gap:7,borderBottom:"1px solid #161616",flexWrap:"wrap"}}>
        <span>{p?.emoji}</span>
        <span style={{color:p?.color,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{p?.name}</span>
        <span style={{background:"#1a1a1a",color:"#6b7280",fontSize:10,padding:"2px 7px",borderRadius:5,fontFamily:"monospace"}}>Day {post.day} · {post.slot}</span>
        <span style={{background:acc+"18",color:acc,fontSize:10,padding:"2px 7px",borderRadius:5,fontFamily:"monospace"}}>{post.theme}</span>
        {post.posted && <span style={{background:"#22c55e12",color:"#22c55e",fontSize:10,padding:"2px 7px",borderRadius:6,fontFamily:"monospace",marginLeft:"auto"}}>✓ POSTED</span>}
      </div>
      {post.img && <div style={{padding:"9px 13px 0",position:"relative"}}>
        <img src={post.img} alt="" style={{width:"100%",borderRadius:9,border:"1px solid #1f2937",cursor:isLI?"pointer":"default",display:"block"}} onClick={isLI?()=>setLi(true):undefined}/>
        {isLI && <div style={{position:"absolute",bottom:9,left:21,background:"#0077b5cc",borderRadius:7,padding:"4px 10px",color:"#fff",fontSize:11,fontFamily:"monospace",cursor:"pointer"}} onClick={()=>setLi(true)}>Click → posting assistant</div>}
      </div>}
      {!isLI && <div style={{margin:"8px 13px 0",padding:"8px 11px",background:(p?.color||"#555")+"10",border:`1px solid ${(p?.color||"#555")}25`,borderRadius:8}}>
        <div style={{color:p?.color,fontSize:10,fontFamily:"monospace",fontWeight:700,marginBottom:3}}>HOW TO POST ON {p?.name?.toUpperCase()}</div>
        <div style={{color:"#6b7280",fontSize:11,fontFamily:"monospace"}}>
          {post.pid==="twitter"?"① Click Open Twitter → first tweet pre-filled ② Add remaining tweets manually ③ Attach image → Post all"
          :post.pid==="reddit"?"① Click Open Reddit → title + body pre-filled ② Review and submit"
          :"① Click Open → ② Paste content → ③ Add image → Publish"}
        </div>
      </div>}
      <div style={{padding:"10px 13px 4px"}}>
        <p style={{color:"#d1d5db",fontSize:13,lineHeight:1.85,fontFamily:"Georgia,serif",margin:0,whiteSpace:"pre-wrap"}}>{exp ? post.content : post.content.slice(0,220)}{!exp && post.content.length>220 && "…"}</p>
        {post.content.length > 220 && <button onClick={()=>setExp(!exp)} style={{background:"none",border:"none",color:"#ec4899",fontSize:12,cursor:"pointer",fontFamily:"monospace"}}>{exp?"▲ less":"▼ read full"}</button>}
      </div>
      {sm && <div style={{margin:"0 13px 8px",padding:"9px",background:"#111",borderRadius:9,display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
        <input value={reach} onChange={e=>setReach(e.target.value)} placeholder="Impressions" style={{flex:1,minWidth:80,padding:"6px 8px",background:"#0d0d0d",border:"1px solid #2d2d2d",borderRadius:6,color:"#e5e7eb",fontSize:12,fontFamily:"monospace",outline:"none"}}/>
        <input value={likes} onChange={e=>setLikes(e.target.value)} placeholder="Likes" style={{width:65,padding:"6px 8px",background:"#0d0d0d",border:"1px solid #2d2d2d",borderRadius:6,color:"#e5e7eb",fontSize:12,fontFamily:"monospace",outline:"none"}}/>
        <button onClick={()=>{onMetric(post.id,{reach:+reach||0,likes:+likes||0});setSm(false);}} style={{padding:"6px 12px",background:"#22c55e",border:"none",borderRadius:6,color:"#000",fontSize:12,fontFamily:"monospace",fontWeight:700,cursor:"pointer"}}>Save</button>
      </div>}
      {post.posted && post.reach>0 && <div style={{margin:"0 13px 7px",display:"flex",gap:10,padding:"6px 10px",background:"#111",borderRadius:7}}>
        <span style={{color:"#3b82f6",fontSize:11,fontFamily:"monospace"}}>👁 {post.reach.toLocaleString()}</span>
        {post.likes>0 && <span style={{color:"#ec4899",fontSize:11,fontFamily:"monospace"}}>❤ {post.likes}</span>}
      </div>}
      <div style={{padding:"8px 13px 12px",display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
        {isLI
          ? <button onClick={()=>setLi(true)} style={{padding:"8px 14px",background:"#0077b5",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontFamily:"monospace",fontWeight:700,cursor:"pointer"}}>💼 LinkedIn Assistant</button>
          : <a href={p?.url(post.content)||"#"} target="_blank" rel="noreferrer" onClick={openP} style={{padding:"8px 14px",background:cp?"#22c55e":(p?.color||"#555"),color:cp?"#000":"#fff",borderRadius:8,textDecoration:"none",fontSize:12,fontFamily:"monospace",fontWeight:700,transition:"background .2s"}}>
              {cp ? "✓ Copied! Open the tab" : `🔗 Open ${p?.name}`}
            </a>}
        <button onClick={()=>setSm(!sm)} style={{background:"#1a1a1a",border:"1px solid #2d2d2d",color:"#9ca3af",padding:"8px 12px",borderRadius:8,fontSize:12,fontFamily:"monospace",cursor:"pointer"}}>📊 Metrics</button>
        <button onClick={()=>onDelete(post.id)} style={{background:"none",border:"none",color:"#374151",fontSize:11,cursor:"pointer",fontFamily:"monospace",marginLeft:"auto"}}>✕</button>
      </div>
    </div>
  </>;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export default function ZeusAgent() {
  const [tab, setTab] = useState("cal");
  const [posts, setPosts] = useState(lp);
  const [gen, setGen] = useState(null);
  const [gst, setGst] = useState("");
  const [toast, setToast] = useState(null);
  const [sel, setSel] = useState(["linkedin","twitter"]);
  const [day, setDay] = useState(1);
  const [filt, setFilt] = useState("all");
  const [ist, setIst] = useState("");

  // Read OpenAI key from GrassionHQ credentials in localStorage
  const oKey = useMemo(() => {
    try {
      const c = JSON.parse(localStorage.getItem("hqf_creds") || "{}");
      return c?.openai?.api_key?.trim() || "";
    } catch { return ""; }
  }, []);

  useEffect(() => {
    const t = () => setIst(new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date()));
    t(); const id = setInterval(t, 30000); return () => clearInterval(id);
  }, []);
  useEffect(() => sp(posts), [posts]);

  const toast_ = (m, tp="ok") => { setToast({m,tp}); setTimeout(()=>setToast(null),3500); };

  const mt = {
    total: posts.filter(p=>p.posted).length,
    reach: posts.reduce((s,p)=>s+(p.reach||0),0),
    likes: posts.reduce((s,p)=>s+(p.likes||0),0),
    drafts: posts.filter(p=>!p.posted).length,
    streak: (()=>{const dm={};posts.filter(p=>p.posted).forEach(p=>{dm[p.day]=1;});let s=0;for(let i=30;i>=1;i--){if(dm[i])s++;else break;}return s;})(),
    byDay: Array.from({length:30},(_,i)=>posts.filter(p=>p.day===i+1&&p.posted).length),
  };

  const doGen = async (entry) => {
    if (!oKey) { toast_("Add your OpenAI key in the 🔑 Keys tab first","err"); return; }
    if (!sel.length) { toast_("Select at least one platform","err"); return; }
    setGen({day:entry[0],slot:entry[1]});
    const np = [];
    for (const pid of sel) {
      setGst(`Writing ${PLATFORMS.find(p=>p.id===pid)?.name}…`);
      try {
        const extra = EXTRA[entry[4]] || `Write about: "${entry[4]}". ${entry[3]==="LAUNCH"||entry[3]==="POST-LAUNCH"?"Include grassion.com at the end.":"No product promotion whatsoever."}`;
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":`Bearer ${oKey}`},
          body: JSON.stringify({
            model:"gpt-4o",
            max_tokens:1000,
            messages:[
              {role:"system",content:SYSTEM},
              {role:"user",content:`PLATFORM: ${PLATFORMS.find(p=>p.id===pid)?.name}\nINSTRUCTIONS: ${INSTR[pid]||INSTR.linkedin}\nTOPIC: ${entry[4]}\nADDITIONAL CONTEXT: ${extra}`}
            ]
          })
        });
        const d = await r.json();
        if (d.error) throw new Error(d.error.message);
        const content = d.choices?.[0]?.message?.content || "";
        const img = (pid==="linkedin"||pid==="twitter") ? makeImg(entry[0],entry[1],entry[4],entry[5]) : null;
        np.push({id:`${Date.now()}_${pid}`,pid,day:entry[0],slot:entry[1],theme:entry[3],topic:entry[4],content,img,posted:false,reach:0,likes:0,createdAt:Date.now()});
      } catch(e) { toast_(`Error: ${e.message}`,"err"); }
    }
    if (np.length) { setPosts(p=>[...np,...p]); toast_(`✓ ${np.length} post${np.length>1?"s":""} ready`); setTab("posts"); }
    setGen(null); setGst("");
  };

  const calByDay = {};
  CAL.forEach(e => { if (!calByDay[e[0]]) calByDay[e[0]] = []; calByDay[e[0]].push(e); });
  const fp = posts.filter(p=>filt==="all"||p.pid===filt);
  const PHASES = [["Week 1","Spending Blindspot","#dc2626","1–7"],["Week 2","Accountability Gap","#f97316","8–14"],["Week 3","Industry Pattern","#3b82f6","15–21"],["Week 4","Building in Public","#22c55e","22–28"],["Days 29–30","🚀 LAUNCH","#a855f7","29–30"]];

  return <div style={{fontFamily:"monospace",background:"#080808",height:"100%",color:"#e5e7eb",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ec4899}button:active{transform:scale(.97)}input:focus,textarea:focus{outline:none}@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

    {toast && <div style={{position:"fixed",top:14,right:14,zIndex:9998,background:toast.tp==="err"?"#1f0000":"#001f0a",border:`1px solid ${toast.tp==="err"?"#dc2626":"#22c55e"}`,color:toast.tp==="err"?"#f87171":"#4ade80",padding:"8px 15px",borderRadius:9,fontSize:13,animation:"fu .2s"}}>{toast.m}</div>}

    {/* ZEUS Header */}
    <div style={{borderBottom:"1px solid #161616",padding:"9px 15px",display:"flex",alignItems:"center",gap:10,background:"#0a0a0a",flexShrink:0,flexWrap:"wrap"}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#ec4899,#f97316)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚡</div>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:1}}>ZEUS — 30-Day Launch Campaign</div>
        <div style={{fontSize:9,color:"#4b5563",letterSpacing:2}}>GRASSION SOCIAL AGENT · NO PRODUCT MENTION UNTIL DAY 29</div>
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
        {[{t:`IST ${ist}`,c:"#22c55e",b:"#0a1a0a",pulse:true},{t:`${mt.total} posted`,c:"#ec4899",b:"#1a0010"},{t:`${mt.drafts} drafts`,c:"#3b82f6",b:"#0a0a1a"},{t:mt.streak>0?`🔥${mt.streak}d`:"",c:"#f97316",b:"#1a0a00"}].filter(x=>x.t).map((x,i)=>(
          <div key={i} style={{background:x.b,border:"1px solid "+x.c+"22",borderRadius:16,padding:"2px 9px",fontSize:10,color:x.c,display:"flex",alignItems:"center",gap:4}}>
            {x.pulse && <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",animation:"pulse 2s infinite"}}/>}{x.t}
          </div>
        ))}
        {!oKey && <div style={{background:"#1f0000",border:"1px solid #dc2626",borderRadius:16,padding:"2px 9px",fontSize:10,color:"#f87171"}}>⚠ No OpenAI key</div>}
      </div>
    </div>

    {/* Phase banner */}
    <div style={{background:"#09080a",borderBottom:"1px solid #1a1a1a",padding:"6px 15px",display:"flex",gap:6,overflowX:"auto",flexShrink:0}}>
      {PHASES.map(([l,s,c,d])=>(
        <div key={l} style={{flexShrink:0,padding:"4px 9px",background:c+"14",border:`1px solid ${c}25`,borderRadius:7}}>
          <div style={{color:c,fontSize:9,fontWeight:700}}>{l} · {d}</div>
          <div style={{color:"#9ca3af",fontSize:10,marginTop:1}}>{s}</div>
        </div>
      ))}
    </div>

    {/* Tabs */}
    <div style={{display:"flex",borderBottom:"1px solid #161616",background:"#0a0a0a",padding:"0 15px",flexShrink:0}}>
      {[["cal","📅 Calendar"],["posts",`📄 Drafts (${posts.length})`],["metrics","📊 Metrics"]].map(([id,l])=>(
        <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 13px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?"#ec4899":"transparent"}`,color:tab===id?"#ec4899":"#4b5563",cursor:"pointer",fontSize:11,fontFamily:"monospace",whiteSpace:"nowrap"}}>{l}</button>
      ))}
    </div>

    {/* Content */}
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{maxWidth:860,margin:"0 auto",padding:"13px 12px"}}>

        {/* ── CALENDAR TAB ── */}
        {tab==="cal" && <div style={{animation:"fu .2s"}}>
          <div style={{background:"#0d0d0d",border:"1px solid #1f2937",borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:2,marginBottom:8}}>PLATFORMS — {sel.length} selected · generates image for LinkedIn + Twitter</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {PLATFORMS.map(p=>{const s=sel.includes(p.id);return(
                <button key={p.id} onClick={()=>setSel(prev=>s?prev.filter(x=>x!==p.id):[...prev,p.id])} style={{padding:"5px 10px",borderRadius:16,border:`1.5px solid ${s?p.color:"#2d2d2d"}`,background:s?p.color+"20":"transparent",color:s?p.color:"#4b5563",fontSize:11,fontFamily:"monospace",cursor:"pointer"}}>
                  {p.emoji} {p.name}
                </button>
              );})}
            </div>
          </div>
          <div style={{background:"#0d0d0d",border:"1px solid #1f2937",borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:2,marginBottom:8}}>SELECT DAY (1–30)</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {Array.from({length:30},(_,i)=>i+1).map(d=>{
                const hp=posts.some(p=>p.day===d&&p.posted),hd=posts.some(p=>p.day===d&&!p.posted),c=wc(d);
                return<button key={d} onClick={()=>setDay(d)} style={{width:32,height:32,borderRadius:7,border:`1.5px solid ${day===d?c:hp?c+"55":hd?c+"33":"#1f2937"}`,background:day===d?c+"22":"transparent",color:day===d?c:hp?c:hd?c+"77":"#374151",cursor:"pointer",fontSize:11,fontFamily:"monospace",fontWeight:day===d?700:400}}>{d}</button>;
              })}
            </div>
          </div>
          {(calByDay[day]||[]).map((e,i)=>{
            const sp=posts.filter(p=>p.day===e[0]&&p.slot===e[1]);
            const isG=gen?.day===e[0]&&gen?.slot===e[1];
            const c=wc(e[0]);
            return<div key={i} style={{background:"#0d0d0d",border:`1px solid ${c}20`,borderRadius:12,padding:"14px",marginBottom:10}}>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{background:c+"14",border:`1px solid ${c}25`,borderRadius:9,padding:"8px 12px",textAlign:"center",flexShrink:0,minWidth:58}}>
                  <div style={{fontSize:16}}>{e[1]==="9am"?"🌅":"🌆"}</div>
                  <div style={{color:c,fontSize:11,fontWeight:700,marginTop:2}}>{e[1]}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{background:c+"18",color:c,fontSize:10,padding:"2px 8px",borderRadius:6}}>Wk{e[2]}: {e[3]}</span>
                  </div>
                  <div style={{color:"#e5e7eb",fontSize:14,fontWeight:700,lineHeight:1.4}}>{e[4]}</div>
                </div>
              </div>
              {sp.length>0 && <div style={{marginBottom:9,padding:"8px 11px",background:"#111",borderRadius:8}}>
                <div style={{color:"#22c55e",fontSize:11,marginBottom:4}}>✓ {sp.length} draft{sp.length>1?"s":""} ready</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{sp.map(s=>{const pp=PLATFORMS.find(pl=>pl.id===s.pid);return<span key={s.id} style={{background:pp?.color+"20",color:pp?.color,fontSize:11,padding:"2px 8px",borderRadius:6}}>{pp?.emoji} {pp?.name}{s.posted?" ✓":""}</span>;})}</div>
              </div>}
              <button onClick={()=>doGen(e)} disabled={!!isG||!oKey} style={{width:"100%",padding:"10px",background:isG||!oKey?"#0d0d0d":"linear-gradient(135deg,#ec4899,#f97316)",border:`1px solid ${isG||!oKey?"#ec489928":"transparent"}`,borderRadius:9,color:"#fff",fontSize:12,fontFamily:"monospace",fontWeight:700,cursor:isG||!oKey?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:!oKey?0.5:1}}>
                {!oKey?"⚠ Add OpenAI key in 🔑 Keys tab":isG?<><Dots/><span style={{color:"#ec4899",fontSize:11}}>{gst}</span></>:`⚡ Generate Day ${e[0]} ${e[1]} · ${sel.length} platform${sel.length!==1?"s":""}`}
              </button>
            </div>;
          })}
        </div>}

        {/* ── DRAFTS TAB ── */}
        {tab==="posts" && <div style={{animation:"fu .2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:6}}>
            <div style={{fontSize:13,fontWeight:700}}>{fp.length} posts</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <button onClick={()=>setFilt("all")} style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${filt==="all"?"#ec4899":"#2d2d2d"}`,background:filt==="all"?"#1a0010":"transparent",color:filt==="all"?"#ec4899":"#6b7280",fontSize:11,cursor:"pointer"}}>All</button>
              {PLATFORMS.map(p=><button key={p.id} onClick={()=>setFilt(filt===p.id?"all":p.id)} style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${filt===p.id?p.color:"#2d2d2d"}`,background:filt===p.id?p.color+"22":"transparent",color:filt===p.id?p.color:"#6b7280",fontSize:11,cursor:"pointer"}}>{p.emoji}</button>)}
            </div>
          </div>
          {fp.length===0
            ? <div style={{textAlign:"center",padding:"55px 20px",color:"#374151"}}><div style={{fontSize:32,marginBottom:8}}>⚡</div><div>No posts yet — go to Calendar and generate</div><button onClick={()=>setTab("cal")} style={{marginTop:11,background:"#1a0010",border:"1px solid #ec4899",color:"#ec4899",padding:"6px 15px",borderRadius:8,cursor:"pointer",fontSize:11}}>→ Calendar</button></div>
            : <div style={{display:"flex",flexDirection:"column",gap:12}}>{fp.map(p=>(
                <Card key={p.id} post={p} onPosted={id=>setPosts(prev=>prev.map(p=>p.id===id?{...p,posted:true}:p))} onDelete={id=>setPosts(prev=>prev.filter(p=>p.id!==id))} onMetric={(id,mv)=>setPosts(prev=>prev.map(p=>p.id===id?{...p,...mv}:p))}/>
              ))}</div>}
        </div>}

        {/* ── METRICS TAB ── */}
        {tab==="metrics" && <div style={{animation:"fu .2s"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(105px,1fr))",gap:8,marginBottom:13}}>
            {[["Posted",mt.total,"📤","#22c55e"],["Reach",mt.reach>999?`${(mt.reach/1000).toFixed(1)}K`:mt.reach||"—","👁","#3b82f6"],["Likes",mt.likes||"—","❤","#ec4899"],["Streak",mt.streak>0?`${mt.streak}d`:"—","🔥","#f97316"],["Drafts",mt.drafts,"📄","#a855f7"]].map(([l,v,ic,c])=>(
              <div key={l} style={{background:"#0d0d0d",border:`1px solid ${c}20`,borderRadius:11,padding:"10px 12px"}}>
                <div style={{fontSize:16,marginBottom:4}}>{ic}</div>
                <div style={{color:c,fontWeight:800,fontSize:20}}>{v}</div>
                <div style={{color:"#9ca3af",fontSize:11,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#0d0d0d",border:"1px solid #1f2937",borderRadius:12,padding:"13px 14px",marginBottom:11}}>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:2,marginBottom:8}}>POSTS PER DAY — click bar to go to that day</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:2,height:55}}>
              {mt.byDay.map((v,i)=>{const max=Math.max(...mt.byDay,1),c=wc(i+1);return(
                <div key={i} onClick={()=>{setDay(i+1);setTab("cal");}} style={{flex:1,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:2,cursor:"pointer"}}>
                  <div style={{width:"100%",background:v>0?c:"#1f2937",borderRadius:"2px 2px 0 0",height:`${Math.max((v/max)*100,v>0?8:2)}%`,transition:"height .3s"}}/>
                  {[0,6,13,20,27,29].includes(i) && <div style={{color:"#374151",fontSize:8}}>{i+1}</div>}
                </div>
              );})}
            </div>
          </div>
          <div style={{background:"#0d0d0d",border:"1px solid #1f2937",borderRadius:12,padding:"13px 14px",marginBottom:11}}>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:2,marginBottom:10}}>BY PLATFORM</div>
            {PLATFORMS.map(pl=>{
              const ct=posts.filter(p=>p.pid===pl.id&&p.posted).length;
              const rc=posts.filter(p=>p.pid===pl.id).reduce((s,p)=>s+(p.reach||0),0);
              return<div key={pl.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 11px",background:"#111",borderRadius:8}}>
                <span style={{fontSize:13}}>{pl.emoji}</span>
                <span style={{color:pl.color,fontSize:11,width:100,flexShrink:0}}>{pl.name}</span>
                <span style={{color:ct>0?"#e5e7eb":"#374151",fontSize:11,flex:1}}>{ct} posts{rc>0?` · ${rc.toLocaleString()} reach`:""}</span>
                <div style={{width:55,height:6,background:"#1f2937",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:pl.color,width:`${Math.min((ct/Math.max(mt.total,1))*100*3,100)}%`}}/></div>
              </div>;
            })}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{if(window.confirm("Clear all posts?"))setPosts([]);}} style={{background:"#1f0000",border:"1px solid #dc2626",color:"#f87171",padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:11}}>Clear all</button>
            <button onClick={()=>{const a=document.createElement("a");a.href="data:text/json,"+encodeURIComponent(JSON.stringify(posts));a.download="zeus_backup.json";a.click();}} style={{background:"#0a1a0a",border:"1px solid #22c55e",color:"#22c55e",padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:11}}>Export backup</button>
          </div>
        </div>}

      </div>
    </div>
  </div>;
}
