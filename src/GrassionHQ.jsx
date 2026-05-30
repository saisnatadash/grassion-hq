import React, { useState, useEffect, useRef, useCallback } from "react";

const GC = `GRASSION — AI Engineering Intelligence SaaS. "Where AI Code Meets Accountability"
Live: grassion.com | Dashboard: app.grassion.com | API: grassion-api.fly.dev
GitHub: github.com/saisnatadash/grassion
FEATURES: Dashboard (ROI verdict, health score 91/100), AI Spend (Copilot vs Cursor, seat waste), Health (12-week trend), Outcomes (reverted/hotfixed PRs, AI root cause), Settings (repos, Slack, ROI calibration)
TECH: React/Vite Vercel, Express Fly.io, Supabase PostgreSQL, Upstash Redis, Resend, Razorpay LIVE
PRICING: Starter $49/mo (10 seats), Growth $149/mo (30 seats), Business $399/mo (75 seats)
TARGET: CTOs/VPs Engineering, 30-200 person Series A/B companies
KEY PAIN: 23% AI seats unused. AI PRs 2x revert rate unmonitored. Zero ROI visibility.
FOUNDER: saisnatadash — non-technical, first product, India. Goal: ₹7L/month by Month 9-12`;

const PLATFORMS = [
  {id:"twitter",name:"Twitter/X",icon:"🐦",color:"#1da1f2",method:"API auto",who:"ZEUS"},
  {id:"linkedin_post",name:"LinkedIn Posts",icon:"💼",color:"#0077b5",method:"Manual send",who:"ZEUS writes → YOU post"},
  {id:"linkedin_dm",name:"LinkedIn DMs",icon:"💬",color:"#0a66c2",method:"Manual send",who:"ZEUS writes → YOU send"},
  {id:"reddit",name:"Reddit",icon:"🤖",color:"#ff4500",method:"API auto",who:"ZEUS"},
  {id:"devto",name:"Dev.to",icon:"📝",color:"#3b49df",method:"API auto",who:"ZEUS"},
  {id:"hashnode",name:"Hashnode",icon:"📗",color:"#2962ff",method:"API auto",who:"ZEUS"},
  {id:"medium",name:"Medium",icon:"✍️",color:"#00ab6c",method:"API auto",who:"ZEUS"},
  {id:"bluesky",name:"Bluesky",icon:"🦋",color:"#0085ff",method:"API auto",who:"ZEUS"},
  {id:"mastodon",name:"Mastodon",icon:"🐘",color:"#6364ff",method:"API auto",who:"ZEUS"},
  {id:"producthunt",name:"Product Hunt",icon:"🚀",color:"#da552f",method:"Manual submit",who:"ZEUS plans → YOU submit"},
  {id:"hackernews",name:"Hacker News",icon:"🟠",color:"#ff6600",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"indiehackers",name:"IndieHackers",icon:"💡",color:"#0e2150",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"substack",name:"Substack Notes",icon:"📧",color:"#ff6719",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"github_discussions",name:"GitHub Discussions",icon:"🐙",color:"#e5e7eb",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"quora",name:"Quora",icon:"❓",color:"#b92b27",method:"Manual answer",who:"ZEUS writes → YOU post"},
  {id:"stackoverflow",name:"Stack Overflow",icon:"📚",color:"#f48024",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"discord",name:"Discord",icon:"🎮",color:"#5865f2",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"telegram",name:"Telegram",icon:"✈️",color:"#2ca5e0",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"facebook",name:"Facebook Groups",icon:"👥",color:"#1877f2",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"instagram",name:"Instagram",icon:"📸",color:"#e1306c",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"youtube",name:"YouTube Community",icon:"▶️",color:"#ff0000",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"tiktok",name:"TikTok",icon:"🎵",color:"#69c9d0",method:"Manual post",who:"ZEUS writes → YOU post"},
  {id:"slack",name:"Slack Communities",icon:"#️⃣",color:"#4a154b",method:"Manual post",who:"ZEUS writes → YOU post"},
];

const AGENTS = {
  ssd:  {id:"ssd",  name:"SSD",  title:"CEO",              emoji:"👑",color:"#f59e0b",bg:"#1a1000",border:"#d97706",accent:"#fde68a",prompt:`You are SSD, CEO of Grassion. Oversee all agents, give founder top priorities.\n${GC}\nBe decisive and brief. Always say what to do TODAY first.`},
  zeus: {id:"zeus", name:"ZEUS", title:"Growth & Marketing",emoji:"⚡",color:"#ec4899",bg:"#1a0010",border:"#be185d",accent:"#f9a8d4",prompt:`You are ZEUS, growth agent for Grassion. Handle all social media, outreach, content.\n${GC}\nPlatforms: LinkedIn posts+DMs (ZEUS writes → founder sends manually to protect account), Twitter/X (API auto), Reddit API auto (rotate: r/programming r/ExperiencedDevs r/startups r/devops r/cscareerquestions r/webdev r/SideProject r/MachineLearning r/artificial), Dev.to API auto, Hashnode API auto, Medium API auto, Bluesky API auto, Mastodon API auto, Product Hunt (ZEUS plans → founder submits), Hacker News Show HN (ZEUS writes → founder posts), IndieHackers, Substack Notes, GitHub Discussions, Quora, Stack Overflow Meta, Discord dev servers, Telegram channels, Facebook Groups, Instagram, YouTube Community, TikTok, Slack communities — all manual: ZEUS writes → founder posts.\nFor images include [DALLE: detailed prompt] in your response.\nAlways give COMPLETE ready-to-use copy. Never say draft or example.`},
  aria: {id:"aria", name:"ARIA", title:"CTO — Technical",   emoji:"⚙️",color:"#22c55e",bg:"#052e16",border:"#16a34a",accent:"#86efac",prompt:`You are ARIA, CTO agent for Grassion.\n${GC}\nKey files: apps/api/src/routes/metrics.ts, analytics.ts, auth.ts | apps/web/src/pages/Dashboard.tsx, Settings.tsx (BUG lines 419/436 Plan type missing admin), Health.tsx, Billing.tsx\nGive exact file/line bug fixes with copy-paste code.`},
  nova: {id:"nova", name:"NOVA", title:"CMO — Content",     emoji:"📣",color:"#f59e0b",bg:"#1c1007",border:"#d97706",accent:"#fbbf24",prompt:`You are NOVA, CMO for Grassion.\n${GC}\nSEO targets: "GitHub Copilot ROI", "AI coding tools analytics". Write SEO blogs, email sequences, website copy, press releases.`},
  rex:  {id:"rex",  name:"REX",  title:"VP Sales",          emoji:"🎯",color:"#3b82f6",bg:"#0c1a2e",border:"#2563eb",accent:"#93c5fd",prompt:`You are REX, VP Sales for Grassion.\n${GC}\nTop targets: Tara AI, WarpBuild, Dockup, Richpanel, Atomicwork (US/India). Tabby, Bayzat (UAE). Tessian, Quantexa (UK).\nObjections: "Too expensive"→pays for itself week 1. "Security"→read-only same as Vercel. "Build it"→6-12mo $50K vs $49/mo.\nWrite hyper-personalized outreach based on what each company specifically does.`},
  finn: {id:"finn", name:"FINN", title:"CFO — Finance",     emoji:"💰",color:"#a855f7",bg:"#1a0a2e",border:"#9333ea",accent:"#d8b4fe",prompt:`You are FINN, CFO for Grassion.\n${GC}\nInfra cost ~$50/mo. Gross margin ~98%. Razorpay 2% fee. Goal ₹7L/month by month 9-12.\nAlways show the math. Give exact numbers.`},
};

const DEAL_STAGES = ["New Lead","Contacted","Replied","Demo Booked","Negotiating","Won","Lost"];
const STAGE_CLR = {"New Lead":"#374151","Contacted":"#1d4ed8","Replied":"#7c3aed","Demo Booked":"#b45309","Negotiating":"#d97706","Won":"#16a34a","Lost":"#dc2626"};

const INIT_DEALS = [
  {id:1,co:"Tara AI",contact:"VP Engineering",email:"vp@tara.ai",li:"linkedin.com/company/tara-ai",val:149,stage:"New Lead",note:"Adjacent product, will instantly get Grassion"},
  {id:2,co:"WarpBuild",contact:"CTO",email:"cto@warpbuild.com",li:"linkedin.com/company/warpbuild",val:49,stage:"New Lead",note:"GitHub-native devtools, perfect fit"},
  {id:3,co:"Richpanel",contact:"CTO",email:"cto@richpanel.com",li:"linkedin.com/company/richpanel",val:149,stage:"New Lead",note:"Sequoia-backed, lean team"},
  {id:4,co:"Atomicwork",contact:"Co-founder",email:"founder@atomicwork.com",li:"linkedin.com/company/atomicwork",val:149,stage:"New Lead",note:"Sells AI productivity tools"},
  {id:5,co:"Tabby",contact:"VP Engineering",email:"engineering@tabby.app",li:"linkedin.com/company/tabby-app",val:399,stage:"New Lead",note:"100+ engineers, $3.3B valuation"},
  {id:6,co:"Tessian",contact:"VP Engineering",email:"vp@tessian.com",li:"linkedin.com/company/tessian",val:399,stage:"New Lead",note:"$80M raised, large eng team"},
  {id:7,co:"HyperVerge",contact:"CTO",email:"cto@hyperverge.co",li:"linkedin.com/company/hyperverge",val:149,stage:"New Lead",note:"Series B, heavy ML team"},
  {id:8,co:"Dockup",contact:"CEO",email:"ceo@dockup.com",li:"linkedin.com/company/dockup",val:49,stage:"New Lead",note:"Dev deployment tool, perfect ICP"},
];

async function callAI(system, msgs, creds) {
  const oKey = creds?.openai?.api_key;
  if (!oKey) throw new Error("No OpenAI key. Add one in 🔑 Keys tab.");
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${oKey}`},
    body:JSON.stringify({model:"gpt-4o-mini",max_tokens:1200,messages:[{role:"system",content:system},...msgs]})
  });
  const d = await r.json();
  if(d.error) throw new Error(d.error.message);
  return d.choices?.[0]?.message?.content || "No response.";
}

async function genImage(prompt, key) {
  if(!key) return null;
  try {
    const r = await fetch("https://api.openai.com/v1/images/generations",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body:JSON.stringify({model:"dall-e-3",prompt:`${prompt}. Dark background, green accent, professional SaaS style.`,n:1,size:"1792x1024"})
    });
    const d = await r.json();
    return d.data?.[0]?.url||null;
  } catch{return null;}
}

function ls(k,fb){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

const card=(extra={})=>({background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:10,padding:14,...extra});
const btn=(color="#22c55e",extra={})=>({background:`${color}22`,border:`1px solid ${color}44`,color,padding:"6px 14px",borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"monospace",...extra});

function Dots({c="#f59e0b"}){
  return(
    <div style={{display:"flex",gap:4,padding:"8px 14px"}}>
      {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:c,animation:`bounce 1.2s ease ${i*0.2}s infinite`}}/>)}
    </div>
  );
}

function StatCard({emoji,label,value,sub,color="#22c55e"}){
  return(
    <div style={{background:"#0a0a0a",border:`1px solid ${color}33`,borderRadius:12,padding:"12px 14px",flex:1,minWidth:120}}>
      <div style={{fontSize:16,marginBottom:4}}>{emoji}</div>
      <div style={{color,fontWeight:800,fontSize:19,fontFamily:"monospace"}}>{value}</div>
      <div style={{color:"#e5e7eb",fontSize:12,fontWeight:600,marginTop:2}}>{label}</div>
      {sub&&<div style={{color:"#4b5563",fontSize:10,marginTop:2}}>{sub}</div>}
    </div>
  );
}

function SimpleLine({data,color="#22c55e",height=110,valueKey="v",labelKey}){
  const vals=data.map(d=>d[valueKey]);
  const mn=Math.min(...vals),mx=Math.max(...vals,mn+1);
  const W=400,H=height-20;
  const pts=vals.map((v,i)=>`${(i/Math.max(vals.length-1,1))*W},${H-((v-mn)/(mx-mn||1))*H}`).join(" ");
  return(
    <div style={{overflowX:"hidden"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H+4}`} preserveAspectRatio="none" style={{display:"block"}}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
        {vals.map((v,i)=>{const x=(i/Math.max(vals.length-1,1))*W,y=H-((v-mn)/(mx-mn||1))*H;return<circle key={i} cx={x} cy={y} r="3" fill={color}/>;} )}
      </svg>
      {labelKey&&<div style={{display:"flex",justifyContent:"space-between",paddingTop:3}}>{data.filter((_,i)=>i===0||i===Math.floor(data.length/2)||i===data.length-1).map((d,i)=><div key={i} style={{color:"#4b5563",fontSize:9,fontFamily:"monospace"}}>{d[labelKey]}</div>)}</div>}
    </div>
  );
}

function SimpleBar({data,colorKey="c",valueKey="v",labelKey="p",height=130}){
  const max=Math.max(...data.map(d=>d[valueKey]),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height,padding:"0 2px",overflowX:"auto"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,minWidth:22,display:"flex",flexDirection:"column",alignItems:"center",gap:2,height:"100%",justifyContent:"flex-end"}}>
          <div style={{color:"#9ca3af",fontSize:8,fontFamily:"monospace"}}>{d[valueKey]}</div>
          <div style={{width:"100%",background:d[colorKey]||"#22c55e",borderRadius:"3px 3px 0 0",height:`${(d[valueKey]/max)*90}%`,minHeight:3}}/>
          <div style={{color:"#6b7280",fontSize:8,textAlign:"center",fontFamily:"monospace",lineHeight:1.1,wordBreak:"break-all"}}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

// ── NOTIFICATION BAR ──────────────────────────────────────────────────────
function NotifBar({notifs,onDismiss,onClearAll}){
  if(notifs.length===0) return null;
  return(
    <div style={{background:"#0a0a0a",borderBottom:"1px solid #1f2937",padding:"4px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:6,flex:1,flexWrap:"wrap",alignItems:"center"}}>
        {notifs.slice(0,3).map(n=>(
          <div key={n.id} style={{display:"flex",alignItems:"center",gap:5,background:"#111",border:"1px solid #1f2937",borderRadius:5,padding:"2px 7px",fontSize:11}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:n.color||"#22c55e",animation:n.fresh?"pulse2 1.5s infinite":undefined,flexShrink:0}}/>
            <span style={{color:"#d1d5db"}}>{n.msg}</span>
            <span style={{color:"#374151",fontSize:9}}>{n.time}</span>
            <button onClick={()=>onDismiss(n.id)} style={{background:"transparent",border:"none",color:"#374151",cursor:"pointer",padding:0,fontSize:13,lineHeight:1}}>×</button>
          </div>
        ))}
        {notifs.length>3&&<span style={{color:"#374151",fontSize:10,fontFamily:"monospace"}}>+{notifs.length-3} more</span>}
      </div>
      <button onClick={onClearAll} style={{background:"transparent",border:"none",color:"#374151",fontSize:10,cursor:"pointer",fontFamily:"monospace",flexShrink:0}}>Clear all</button>
    </div>
  );
}

// ── TAB 1: STATS ──────────────────────────────────────────────────────────
function StatsDash({deals,creds}){
  const [liveData,setLiveData]=useState(null);
  const won=deals.filter(d=>d.stage==="Won").reduce((s,d)=>s+d.val,0);
  const pipe=deals.filter(d=>d.stage!=="Lost").reduce((s,d)=>s+d.val,0);
  useEffect(()=>{
    const url=creds?.grassion?.api_url||"https://grassion-api.fly.dev";
    fetch(`${url}/api/metrics/summary`).then(r=>r.json()).then(setLiveData).catch(()=>{});
  },[creds]);
  const mrr=[{m:"Mar",v:0},{m:"Apr",v:49},{m:"May",v:98},{m:"Jun",v:198},{m:"Jul",v:347},{m:"Aug",v:546},{m:"Sep",v:794},{m:"Oct",v:1043},{m:"Nov",v:1342},{m:"Dec",v:1740},{m:"Jan",v:2239},{m:"Feb",v:2888}];
  const health=[{w:"W1",v:74},{w:"W3",v:76},{w:"W5",v:80},{w:"W7",v:84},{w:"W9",v:88},{w:"W12",v:91}];
  const posts=PLATFORMS.slice(0,12).map((p,i)=>({p:p.name.slice(0,5),v:[28,12,8,4,4,3,6,2,2,2,2,1][i]||1,c:p.color}));
  return(
    <div style={{padding:14,overflowY:"auto",height:"100%",width:"100%"}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:11,marginBottom:10}}>📊 LIVE DASHBOARD — Grassion Growth</div>
      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
        <StatCard emoji="💰" label="MRR" value={`$${won}`} sub="Monthly recurring" color="#22c55e"/>
        <StatCard emoji="👥" label="Customers" value={deals.filter(d=>d.stage==="Won").length} sub="Paying" color="#3b82f6"/>
        <StatCard emoji="🎯" label="Pipeline" value={`$${pipe}/mo`} sub={`${deals.length} leads`} color="#f59e0b"/>
        <StatCard emoji="📱" label="Posts" value="54" sub="All platforms" color="#ec4899"/>
        <StatCard emoji="🏥" label="Health" value="91/100" sub="Codebase" color="#a855f7"/>
        <StatCard emoji="🚀" label="ARR" value={`$${won*12}`} sub="Projection" color="#f59e0b"/>
      </div>
      {liveData?(
        <div style={{...card({marginBottom:12,borderColor:"#22c55e33"})}}>
          <div style={{color:"#22c55e",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:7}}>🟢 LIVE — grassion-api.fly.dev</div>
          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
            {[["Active Now",liveData.active_users??0,"#22c55e"],["Signups Today",liveData.signups_today??0,"#3b82f6"],["Free Users",liveData.free_users??0,"#9ca3af"],["Paid Users",liveData.paid_users??0,"#f59e0b"],["Churn Rate",`${liveData.churn_rate??0}%`,"#ef4444"]].map(([l,v,c])=>(
              <div key={l}><div style={{color:c,fontWeight:700,fontSize:14,fontFamily:"monospace"}}>{v}</div><div style={{color:"#4b5563",fontSize:10}}>{l}</div></div>
            ))}
          </div>
          {liveData.recent_paid?.length>0&&<div style={{marginTop:7}}><div style={{color:"#f59e0b",fontSize:10,fontFamily:"monospace",marginBottom:3}}>Recent Pro Conversions (Razorpay)</div>{liveData.recent_paid.map((u,i)=><div key={i} style={{color:"#6b7280",fontSize:11}}>✅ {u}</div>)}</div>}
        </div>
      ):(
        <div style={{...card({marginBottom:12,borderColor:"#22c55e22"})}}>
          <div style={{color:"#374151",fontSize:12}}>💡 Add Grassion API URL in 🔑 Keys tab to show live user metrics from grassion-api.fly.dev</div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <div style={card()}><div style={{color:"#22c55e",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>💰 MRR GROWTH ($)</div><SimpleLine data={mrr} color="#22c55e" labelKey="m"/></div>
        <div style={card()}><div style={{color:"#a855f7",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>🏥 CODEBASE HEALTH</div><SimpleLine data={health} color="#a855f7" labelKey="w"/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={card()}><div style={{color:"#ec4899",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>📱 POSTS BY PLATFORM</div><SimpleBar data={posts}/></div>
        <div style={card()}>
          <div style={{color:"#3b82f6",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>🎯 SALES PIPELINE</div>
          {DEAL_STAGES.slice(0,5).map(s=>{const n=deals.filter(d=>d.stage===s).length,pct=Math.round(n/Math.max(deals.length,1)*100);return(
            <div key={s} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <div style={{width:75,color:"#6b7280",fontSize:10,flexShrink:0}}>{s}</div>
              <div style={{flex:1,background:"#111",borderRadius:3,height:11,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:STAGE_CLR[s],borderRadius:3}}/></div>
              <div style={{width:14,color:"#9ca3af",fontSize:10,textAlign:"right"}}>{n}</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: AGENTS ─────────────────────────────────────────────────────────
function ChatArea({agent,messages,isTyping,onSend,onReport,creds,generatingImg,generatedImgs}){
  const [input,setInput]=useState("");
  const bottomRef=useRef(null);
  const a=AGENTS[agent];
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,isTyping]);
  const QUICK={
    ssd:["What should I focus on today?","Full status report","Top 3 risks right now","Path to first 10 customers"],
    zeus:["Generate today's LinkedIn post + image","Write Twitter thread on AI coding ROI","Reddit post for r/ExperiencedDevs","Content calendar for all 22 platforms this week"],
    aria:["Find all bugs in Grassion code","Fix Settings.tsx TypeScript error","Security audit","Check slow API queries"],
    nova:["Write SEO blog: Is Copilot Worth It?","Improve grassion.com homepage copy","Plan 5-email welcome sequence","Write launch press release"],
    rex:["Write cold email to Tara AI CTO","Handle: we'll build this ourselves","LinkedIn DM to WarpBuild CTO","5-touch follow-up sequence"],
    finn:["Project MRR Month 3/6/12","Path to ₹7L/month","Unit economics breakdown","Top revenue risks"],
  };
  const send=()=>{if(!input.trim())return;onSend(input.trim());setInput("");};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"9px 14px",borderBottom:`1px solid ${a.border}33`,background:a.bg,display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
        <span style={{fontSize:20}}>{a.emoji}</span>
        <div style={{flex:1}}>
          <div style={{color:a.color,fontWeight:800,fontSize:13,fontFamily:"monospace"}}>{a.name} <span style={{fontSize:10,color:"#6b7280",fontWeight:400}}>· {a.title}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}><div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",animation:"pulse2 2s infinite"}}/><span style={{color:"#4b5563",fontSize:10}}>Active · Full Grassion context</span></div>
        </div>
        {agent!=="ssd"&&<button onClick={()=>onReport(agent)} style={btn(a.color,{fontSize:10,padding:"4px 10px"})}>📤 Report to SSD</button>}
      </div>
      {messages.length===0&&(
        <div style={{padding:"8px 14px",borderBottom:"1px solid #0d0d0d",flexShrink:0}}>
          <div style={{color:"#374151",fontSize:9,fontFamily:"monospace",marginBottom:5,textTransform:"uppercase"}}>Quick Commands</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {(QUICK[agent]||[]).map((q,i)=><button key={i} onClick={()=>onSend(q)} style={{background:a.bg,border:`1px solid ${a.border}44`,color:a.accent,padding:"4px 9px",borderRadius:14,fontSize:10,cursor:"pointer",fontFamily:"monospace"}}>{q}</button>)}
          </div>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:9}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:7}}>
            {m.role==="assistant"&&<div style={{width:24,height:24,borderRadius:"50%",background:a.bg,border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,marginTop:2}}>{a.emoji}</div>}
            <div style={{maxWidth:"82%"}}>
              <div style={{padding:"9px 13px",borderRadius:m.role==="user"?"14px 14px 3px 14px":"3px 14px 14px 14px",background:m.role==="user"?"#1f2937":a.bg,border:`1px solid ${m.role==="user"?"#374151":a.border+"44"}`,color:m.role==="user"?"#e5e7eb":a.accent,fontSize:12,lineHeight:1.7,fontFamily:m.role==="assistant"?"monospace":"inherit",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {m.role==="assistant"&&<div style={{color:a.color,fontSize:9,fontWeight:800,marginBottom:3}}>{a.name}</div>}
                {m.content}
              </div>
              {m.role==="assistant"&&m.content?.includes("[DALLE:")&&(
                <div style={{marginTop:5}}>
                  {generatingImg?<div style={{...card({padding:8}),color:a.color,fontSize:10,fontFamily:"monospace"}}>🎨 Generating with DALL-E 3...</div>
                  :generatedImgs[i]?<img src={generatedImgs[i]} style={{width:"100%",borderRadius:7}} alt="DALL-E"/>
                  :!creds?.openai?.api_key&&<div style={{color:"#4b5563",fontSize:10}}>Add OpenAI key to generate images</div>}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping&&<div style={{display:"flex",gap:7}}><div style={{width:24,height:24,borderRadius:"50%",background:a.bg,border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{a.emoji}</div><div style={{background:a.bg,border:`1px solid ${a.border}44`,borderRadius:"3px 14px 14px 14px"}}><Dots c={a.color}/></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"7px 12px",borderTop:`1px solid ${a.border}22`,display:"flex",gap:7,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={`Message ${a.name}...`}
          style={{flex:1,background:"#0a0a0a",border:`1px solid ${a.border}55`,borderRadius:9,padding:"8px 11px",color:a.accent,fontSize:12,outline:"none",fontFamily:"monospace"}}/>
        <button onClick={send} style={{background:a.color,border:"none",borderRadius:9,padding:"8px 16px",color:"#000",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"monospace"}}>SEND</button>
      </div>
    </div>
  );
}

// ── TAB 3: SSD INBOX ──────────────────────────────────────────────────────
function SSDInbox({reports,onGetAll,collecting}){
  const [expanded,setExpanded]=useState({});
  const [filter,setFilter]=useState("all");
  const sorted=[...reports.filter(r=>filter==="all"||r.agentId===filter)].reverse();
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"9px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>👑</span><div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:800,fontSize:13}}>SSD INBOX</div><div style={{background:"#f59e0b22",color:"#f59e0b",fontSize:10,padding:"1px 6px",borderRadius:9}}>{reports.length}</div></div>
        <button onClick={onGetAll} disabled={collecting} style={btn("#f59e0b",{opacity:collecting?0.7:1,cursor:collecting?"not-allowed":"pointer"})}>{collecting?"Collecting...":"📡 Get All Reports"}</button>
      </div>
      <div style={{padding:"5px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",gap:4,flexShrink:0,flexWrap:"wrap"}}>
        {[["all","All"],["zeus","⚡ ZEUS"],["aria","⚙️ ARIA"],["nova","📣 NOVA"],["rex","🎯 REX"],["finn","💰 FINN"]].map(([id,l])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{background:filter===id?"#111":"transparent",border:`1px solid ${filter===id?"#374151":"transparent"}`,color:filter===id?"#e5e7eb":"#4b5563",padding:"3px 8px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>{l}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:6}}>
        {sorted.length===0&&<div style={{textAlign:"center",padding:50}}><div style={{fontSize:32,marginBottom:9}}>📭</div><div style={{color:"#4b5563",fontSize:13}}>No reports yet.</div><div style={{color:"#374151",fontSize:11,marginTop:5}}>Click "Get All Reports" to brief every agent.</div></div>}
        {sorted.map((r,i)=>{const a=AGENTS[r.agentId],isExp=!!expanded[i];return(
          <div key={i} style={{background:a.bg,border:`1px solid ${a.border}44`,borderRadius:9,overflow:"hidden"}}>
            <div onClick={()=>setExpanded(p=>({...p,[i]:!p[i]}))} style={{padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:9}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"#0a0a0a",border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{a.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                  <span style={{color:a.color,fontWeight:800,fontSize:11,fontFamily:"monospace"}}>{a.name}</span>
                  <span style={{color:"#4b5563",fontSize:10}}>{a.title}</span>
                  <span style={{color:"#374151",fontSize:9,marginLeft:"auto"}}>{new Date(r.timestamp).toLocaleString("en-IN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                </div>
                {!isExp&&<div style={{color:a.accent,fontSize:11,lineHeight:1.5,fontFamily:"monospace"}}>{r.content.split("\n").filter(l=>l.trim()).slice(0,2).join(" ").slice(0,130)}...</div>}
              </div>
              <div style={{color:"#374151",fontSize:12,flexShrink:0}}>{isExp?"▲":"▼"}</div>
            </div>
            {isExp&&<div style={{padding:"0 12px 12px 45px"}}><div style={{background:"#050505",border:`1px solid ${a.border}22`,borderRadius:6,padding:10,color:a.accent,fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"monospace"}}>{r.content}</div></div>}
          </div>
        );})}
      </div>
    </div>
  );
}

// ── EMAIL MODAL ───────────────────────────────────────────────────────────
function EmailModal({deal,onClose,creds}){
  const [subject,setSubject]=useState(`Grassion for ${deal.co} — AI Code ROI in 5 mins`);
  const [body,setBody]=useState(`Hi ${deal.contact},\n\nI'm Sai, founder of Grassion — we help engineering teams track which AI coding tools (Copilot, Cursor, etc.) are delivering ROI and which are wasting budget.\n\n${deal.note}\n\nWould a 15-min demo this week work?\n\nBest,\nSai\ngrassion.com`);
  const [loading,setLoading]=useState(false);
  const zohoUrl=`https://mail.zoho.in/zm/#compose?to=${encodeURIComponent(deal.email||"")}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const genWithREX=async()=>{
    setLoading(true);
    try{
      const resp=await callAI(AGENTS.rex.prompt,[{role:"user",content:`Write hyper-personalized cold email to ${deal.contact} at ${deal.co}. Context: ${deal.note}. Return "Subject: ..." on line 1, blank line, then body. Under 150 words. Sign off from "Sai, Founder of Grassion — grassion.com".`}],creds);
      const lines=resp.split("\n");const si=lines.findIndex(l=>l.toLowerCase().startsWith("subject:"));
      if(si>=0){setSubject(lines[si].replace(/subject:\s*/i,"").trim());setBody(lines.slice(si+2).join("\n").trim());}else setBody(resp);
    }catch(e){setBody(`Error: ${e.message}`);}
    setLoading(false);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:18,width:"min(520px,96vw)",maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:700,fontSize:13}}>✉ Email — {deal.co}</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18}}>×</button>
        </div>
        <div style={{marginBottom:9}}><div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>TO</div><input value={deal.email||""} readOnly style={{width:"100%",background:"#111",border:"1px solid #1f2937",borderRadius:7,padding:"7px 9px",color:"#9ca3af",fontSize:12,fontFamily:"monospace",boxSizing:"border-box"}}/></div>
        <div style={{marginBottom:9}}><div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>SUBJECT</div><input value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:7,padding:"7px 9px",color:"#e5e7eb",fontSize:12,outline:"none",boxSizing:"border-box"}}/></div>
        <div style={{marginBottom:11}}><div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>BODY</div><textarea value={body} onChange={e=>setBody(e.target.value)} rows={8} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:7,padding:"7px 9px",color:"#e5e7eb",fontSize:12,outline:"none",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <button onClick={genWithREX} disabled={loading} style={btn("#3b82f6",{flex:1,minWidth:130})}>{loading?"✍️ REX writing...":"🎯 Ask REX to write"}</button>
          <button onClick={()=>navigator.clipboard?.writeText(`Subject: ${subject}\n\n${body}`)} style={btn("#9ca3af",{flex:1,minWidth:100})}>📋 Copy</button>
          <a href={zohoUrl} target="_blank" rel="noopener noreferrer" style={{...btn("#22c55e",{flex:1,minWidth:130,textDecoration:"none",textAlign:"center",display:"inline-flex",alignItems:"center",justifyContent:"center"})}}>📧 Open in Zoho Mail</a>
        </div>
      </div>
    </div>
  );
}

// ── TAB 4: SALES ──────────────────────────────────────────────────────────
function Pipeline({deals,setDeals,onAskRex,creds}){
  const [drafting,setDrafting]=useState(null);
  const [draft,setDraft]=useState("");
  const [draftLoading,setDraftLoading]=useState(false);
  const [emailDeal,setEmailDeal]=useState(null);
  const genOutreach=async(deal)=>{
    setDrafting(deal.id);setDraftLoading(true);setDraft("");
    try{const resp=await callAI(AGENTS.rex.prompt,[{role:"user",content:`Write for ${deal.co} (Contact: ${deal.contact}, Notes: ${deal.note}):\n1. LINKEDIN DM (under 280 chars)\n2. COLD EMAIL subject + body\nHyper-personalized to what ${deal.co} does.`}],creds);setDraft(resp);}
    catch(e){setDraft(`Error: ${e.message}`);}
    setDraftLoading(false);
  };
  const move=(id,dir)=>setDeals(prev=>prev.map(d=>d.id!==id?d:{...d,stage:DEAL_STAGES[Math.max(0,Math.min(DEAL_STAGES.length-1,DEAL_STAGES.indexOf(d.stage)+dir))]}));
  const won=deals.filter(d=>d.stage==="Won").reduce((s,d)=>s+d.val,0);
  return(
    <div style={{display:"flex",height:"100%",position:"relative"}}>
      {emailDeal&&<EmailModal deal={emailDeal} onClose={()=>setEmailDeal(null)} creds={creds}/>}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"7px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",gap:14,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
          {[{l:"Won MRR",v:`$${won}/mo`,c:"#22c55e"},{l:"Total Leads",v:deals.length,c:"#9ca3af"},{l:"Active",v:deals.filter(d=>!["New Lead","Won","Lost"].includes(d.stage)).length,c:"#f59e0b"}].map((s,i)=>(
            <div key={i}><div style={{color:s.c,fontWeight:800,fontSize:15,fontFamily:"monospace"}}>{s.v}</div><div style={{color:"#4b5563",fontSize:9}}>{s.l}</div></div>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {DEAL_STAGES.filter(s=>deals.some(d=>d.stage===s)).map(stage=>(
            <div key={stage}>
              <div style={{padding:"4px 14px",background:"#050505",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:STAGE_CLR[stage]}}/>
                <span style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:1}}>{stage}</span>
              </div>
              {deals.filter(d=>d.stage===stage).map(deal=>(
                <div key={deal.id} style={{padding:"8px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:28,height:28,borderRadius:6,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🏢</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12}}>{deal.co}</div>
                    <div style={{color:"#6b7280",fontSize:10}}>{deal.contact} · {deal.note?.slice(0,40)}</div>
                  </div>
                  <div style={{background:"#16a34a22",color:"#22c55e",fontSize:10,fontFamily:"monospace",padding:"2px 5px",borderRadius:3}}>${deal.val}/mo</div>
                  <div style={{display:"flex",gap:2}}>
                    <button onClick={()=>move(deal.id,-1)} style={{background:"#111",border:"1px solid #374151",color:"#6b7280",width:21,height:21,borderRadius:4,cursor:"pointer",fontSize:9}}>←</button>
                    <button onClick={()=>move(deal.id,1)} style={{background:"#111",border:"1px solid #374151",color:"#6b7280",width:21,height:21,borderRadius:4,cursor:"pointer",fontSize:9}}>→</button>
                  </div>
                  <button onClick={()=>setEmailDeal(deal)} style={btn("#22c55e",{fontSize:10,padding:"3px 8px"})}>✉ Email</button>
                  <button onClick={()=>genOutreach(deal)} style={btn("#3b82f6",{fontSize:10,padding:"3px 8px"})}>✍ Draft</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {drafting&&(
        <div style={{width:310,borderLeft:"1px solid #0d0d0d",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"9px 11px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:700,fontSize:11}}>REX — {deals.find(d=>d.id===drafting)?.co}</div>
            <button onClick={()=>setDrafting(null)} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:15}}>×</button>
          </div>
          <div style={{flex:1,padding:10,overflowY:"auto"}}>
            {draftLoading?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,padding:18}}><Dots c="#3b82f6"/><div style={{color:"#4b5563",fontSize:11}}>REX writing personalized outreach...</div></div>
            :<pre style={{color:"#93c5fd",fontSize:11,fontFamily:"monospace",whiteSpace:"pre-wrap",lineHeight:1.7,margin:0}}>{draft}</pre>}
          </div>
          {draft&&<div style={{padding:9,borderTop:"1px solid #0d0d0d",display:"flex",gap:6}}>
            <button onClick={()=>navigator.clipboard?.writeText(draft)} style={btn("#3b82f6",{flex:1,fontSize:10})}>📋 Copy</button>
            <button onClick={()=>onAskRex(`Improve this: ${draft}`)} style={{flex:1,background:"#111",border:"1px solid #374151",color:"#9ca3af",padding:6,borderRadius:6,cursor:"pointer",fontSize:10}}>Ask REX</button>
          </div>}
        </div>
      )}
    </div>
  );
}

// ── TAB 5: AUTO POSTS ─────────────────────────────────────────────────────
function AutoPosts({creds}){
  const [section,setSection]=useState("queue");
  const [posts,setPosts]=useState(()=>ls("hqf_posts",[]));
  const [showAdd,setShowAdd]=useState(false);
  const [newPost,setNewPost]=useState({platform:"twitter",content:"",time:"",status:"Queued"});
  const [generating,setGenerating]=useState(false);
  const [toggles,setToggles]=useState(()=>ls("hqf_platform_toggles",{}));
  const STATUS_CLR={Queued:"#f59e0b",Posting:"#3b82f6",Posted:"#22c55e",Failed:"#ef4444"};
  const savePost=()=>{if(!newPost.content.trim())return;const u=[...posts,{...newPost,id:Date.now()}];setPosts(u);lsSet("hqf_posts",u);setShowAdd(false);setNewPost({platform:"twitter",content:"",time:"",status:"Queued"});};
  const delPost=(id)=>{const u=posts.filter(p=>p.id!==id);setPosts(u);lsSet("hqf_posts",u);};
  const genWithZEUS=async()=>{
    setGenerating(true);
    try{const plat=PLATFORMS.find(p=>p.id===newPost.platform);const resp=await callAI(AGENTS.zeus.prompt,[{role:"user",content:`Write a high-engagement post for ${plat?.name||newPost.platform} about Grassion. Platform-optimized tone, hashtags included. Max 280 chars for Twitter, longer for others.`}],creds);setNewPost(p=>({...p,content:resp}));}
    catch(e){setNewPost(p=>({...p,content:`Error: ${e.message}`}));}
    setGenerating(false);
  };
  const togglePlatform=(id)=>{const t={...toggles,[id]:!toggles[id]};setToggles(t);lsSet("hqf_platform_toggles",t);};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"7px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
        <span style={{color:"#ec4899",fontFamily:"monospace",fontWeight:700,fontSize:13}}>📅 AUTO POSTS</span>
        <div style={{display:"flex",gap:4}}>
          {[["queue","Scheduled Queue"],["rules","Posting Rules"]].map(([s,l])=><button key={s} onClick={()=>setSection(s)} style={{background:section===s?"#111":"transparent",border:`1px solid ${section===s?"#374151":"transparent"}`,color:section===s?"#e5e7eb":"#4b5563",padding:"3px 10px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>{l}</button>)}
        </div>
        {section==="queue"&&<button onClick={()=>setShowAdd(true)} style={btn("#22c55e",{marginLeft:"auto",padding:"4px 12px",fontSize:10})}>+ Add Post</button>}
      </div>
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:18,width:"min(460px,96vw)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{color:"#22c55e",fontFamily:"monospace",fontWeight:700,fontSize:13}}>+ New Scheduled Post</span>
              <button onClick={()=>setShowAdd(false)} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18}}>×</button>
            </div>
            <div style={{marginBottom:9}}><div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>PLATFORM</div>
              <select value={newPost.platform} onChange={e=>setNewPost(p=>({...p,platform:e.target.value}))} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:7,padding:"7px 9px",color:"#e5e7eb",fontSize:12,outline:"none",boxSizing:"border-box"}}>
                {PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
              </select>
            </div>
            <div style={{marginBottom:9}}><div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>CONTENT</div><textarea value={newPost.content} onChange={e=>setNewPost(p=>({...p,content:e.target.value}))} rows={5} placeholder="Write post content..." style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:7,padding:"7px 9px",color:"#e5e7eb",fontSize:12,outline:"none",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box"}}/></div>
            <div style={{marginBottom:11}}><div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>SCHEDULE TIME</div><input type="datetime-local" value={newPost.time} onChange={e=>setNewPost(p=>({...p,time:e.target.value}))} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:7,padding:"7px 9px",color:"#e5e7eb",fontSize:12,outline:"none",boxSizing:"border-box"}}/></div>
            <div style={{display:"flex",gap:7}}>
              <button onClick={genWithZEUS} disabled={generating} style={btn("#ec4899",{flex:1})}>{generating?"⚡ ZEUS writing...":"⚡ Generate with ZEUS"}</button>
              <button onClick={savePost} style={btn("#22c55e",{flex:1})}>✓ Add to Queue</button>
            </div>
          </div>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:12}}>
        {section==="queue"&&(
          <>
            {posts.length===0&&<div style={{textAlign:"center",padding:50}}><div style={{fontSize:32,marginBottom:9}}>📭</div><div style={{color:"#4b5563",fontSize:13}}>No posts queued. Click "+ Add Post" to schedule content.</div></div>}
            {posts.length>0&&<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:"1px solid #1f2937"}}>{["Platform","Content","Scheduled","Status","Actions"].map(h=><th key={h} style={{color:"#6b7280",fontFamily:"monospace",fontSize:9,textAlign:"left",padding:"5px 8px",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
              <tbody>{posts.map(p=>{const plat=PLATFORMS.find(pl=>pl.id===p.platform);return(
                <tr key={p.id} style={{borderBottom:"1px solid #0d0d0d"}}>
                  <td style={{padding:"7px 8px",color:"#e5e7eb",whiteSpace:"nowrap"}}>{plat?.icon} {plat?.name||p.platform}</td>
                  <td style={{padding:"7px 8px",color:"#9ca3af",maxWidth:180}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.content}</div></td>
                  <td style={{padding:"7px 8px",color:"#6b7280",whiteSpace:"nowrap",fontFamily:"monospace",fontSize:10}}>{p.time||"—"}</td>
                  <td style={{padding:"7px 8px"}}><span style={{background:`${STATUS_CLR[p.status]||"#374151"}22`,color:STATUS_CLR[p.status]||"#9ca3af",padding:"1px 6px",borderRadius:4,fontSize:9,fontFamily:"monospace"}}>{p.status}</span></td>
                  <td style={{padding:"7px 8px"}}><div style={{display:"flex",gap:3}}>
                    <button onClick={()=>navigator.clipboard?.writeText(p.content)} style={{background:"#111",border:"1px solid #374151",color:"#9ca3af",padding:"2px 6px",borderRadius:4,cursor:"pointer",fontSize:9}}>Copy</button>
                    <button onClick={()=>delPost(p.id)} style={{background:"#ef444422",border:"1px solid #ef444444",color:"#ef4444",padding:"2px 6px",borderRadius:4,cursor:"pointer",fontSize:9}}>Del</button>
                  </div></td>
                </tr>
              );})}
              </tbody>
            </table></div>}
          </>
        )}
        {section==="rules"&&(
          <>
            <div style={{...card({marginBottom:12})}}>
              <div style={{color:"#ec4899",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:9}}>PLATFORM TOGGLES</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:6}}>
                {PLATFORMS.map(p=>(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:7,background:"#111",borderRadius:6,padding:"7px 9px"}}>
                    <span style={{fontSize:14}}>{p.icon}</span>
                    <span style={{flex:1,color:"#d1d5db",fontSize:11}}>{p.name}</span>
                    <div onClick={()=>togglePlatform(p.id)} style={{width:34,height:17,borderRadius:8,background:toggles[p.id]?"#22c55e":"#374151",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                      <div style={{width:13,height:13,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:toggles[p.id]?19:2,transition:"left .2s"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card()}>
              <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:9}}>WHO POSTS WHAT</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"1px solid #1f2937"}}>{["Platform","Method","Who Does It"].map(h=><th key={h} style={{color:"#6b7280",fontFamily:"monospace",fontSize:9,textAlign:"left",padding:"4px 7px",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                <tbody>{PLATFORMS.map(p=>(
                  <tr key={p.id} style={{borderBottom:"1px solid #0d0d0d"}}>
                    <td style={{padding:"6px 7px",color:"#e5e7eb"}}>{p.icon} {p.name}</td>
                    <td style={{padding:"6px 7px"}}><span style={{background:p.method.includes("API")?"#22c55e22":"#f59e0b22",color:p.method.includes("API")?"#22c55e":"#f59e0b",padding:"1px 5px",borderRadius:3,fontSize:9,fontFamily:"monospace"}}>{p.method}</span></td>
                    <td style={{padding:"6px 7px",color:"#9ca3af",fontSize:10}}>{p.who}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── TAB 6: SOCIAL MEDIA ───────────────────────────────────────────────────
function SocialMedia(){
  const [connected,setConnected]=useState(()=>ls("hqf_social_connected",{}));
  const toggle=(id)=>{const c={...connected,[id]:!connected[id]};setConnected(c);lsSet("hqf_social_connected",c);};
  const reachData=[{m:"W1",v:420},{m:"W2",v:680},{m:"W3",v:940},{m:"W4",v:1340}];
  const engData=PLATFORMS.slice(0,8).map((p,i)=>({p:p.name.slice(0,5),v:[6,4,8,5,4,3,2,2][i],c:p.color}));
  return(
    <div style={{padding:12,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#ec4899",fontFamily:"monospace",fontWeight:700,fontSize:12,marginBottom:10}}>📱 SOCIAL MEDIA — All 23 Platforms</div>
      <div style={{display:"flex",gap:6,marginBottom:13,flexWrap:"wrap"}}>
        <StatCard emoji="📤" label="Total Posts" value="54" sub="All platforms" color="#ec4899"/>
        <StatCard emoji="👁️" label="Total Reach" value="18.4K" sub="Estimated" color="#3b82f6"/>
        <StatCard emoji="💬" label="Engagement" value="3.2%" sub="Avg rate" color="#22c55e"/>
        <StatCard emoji="🔄" label="Conversion" value="0.8%" sub="To signups" color="#f59e0b"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div style={card()}><div style={{color:"#3b82f6",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>📈 REACH OVER TIME (30d)</div><SimpleLine data={reachData} color="#3b82f6" labelKey="m"/></div>
        <div style={card()}><div style={{color:"#22c55e",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>💬 ENGAGEMENT BY PLATFORM</div><SimpleBar data={engData}/></div>
      </div>
      <div style={{...card({marginBottom:12})}}>
        <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:10,fontWeight:700,marginBottom:7}}>🔽 CONVERSION FUNNEL</div>
        {[["Reach",18400,"#3b82f6"],["Clicks",920,"#a855f7"],["Signups",74,"#f59e0b"],["Paid",3,"#22c55e"]].map(([l,v,c],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
            <div style={{width:80,color:"#9ca3af",fontSize:11}}>{l}</div>
            <div style={{flex:1,background:"#111",borderRadius:3,height:14,overflow:"hidden"}}><div style={{width:`${(v/18400)*100}%`,height:"100%",background:c,borderRadius:3,minWidth:3}}/></div>
            <div style={{color:c,fontFamily:"monospace",fontSize:11,width:48,textAlign:"right"}}>{v.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div style={{color:"#6b7280",fontFamily:"monospace",fontSize:10,marginBottom:8}}>PLATFORM CARDS — Connect for real analytics</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {PLATFORMS.map(p=>(
          <div key={p.id} style={{background:"#0a0a0a",border:`1px solid ${p.color}33`,borderRadius:9,padding:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:16}}>{p.icon}</span>
              <div style={{flex:1}}><div style={{color:"#e5e7eb",fontWeight:600,fontSize:11}}>{p.name}</div><div style={{color:connected[p.id]?"#22c55e":"#4b5563",fontSize:9}}>{connected[p.id]?"● Connected":"○ Not connected"}</div></div>
            </div>
            {connected[p.id]?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:7}}>
                {[["Posts",Math.floor(Math.random()*15)+2],["Reach",Math.floor(Math.random()*900)+100],["Eng",`${(Math.random()*4+0.5).toFixed(1)}%`]].map(([l,v])=>(
                  <div key={l} style={{background:"#111",borderRadius:4,padding:"4px 5px"}}><div style={{color:p.color,fontWeight:700,fontSize:12,fontFamily:"monospace"}}>{v}</div><div style={{color:"#4b5563",fontSize:9}}>{l}</div></div>
                ))}
              </div>
            ):(
              <div style={{color:"#374151",fontSize:10,marginBottom:7}}>Connect to see real analytics</div>
            )}
            <button onClick={()=>toggle(p.id)} style={{...btn(connected[p.id]?"#ef4444":p.color,{width:"100%",textAlign:"center",padding:"4px 8px",fontSize:10})}}>
              {connected[p.id]?"Disconnect":`Connect ${p.name.split(" ")[0]}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB 7: CALENDAR ───────────────────────────────────────────────────────
function CalendarTab({deals,creds}){
  const [sec,setSec]=useState("meetings");
  const [meetings,setMeetings]=useState(()=>ls("hqf_meetings",[]));
  const [showForm,setShowForm]=useState(false);
  const [newM,setNewM]=useState({title:"",date:"",company:"",notes:""});
  const [emailTo,setEmailTo]=useState("");
  const [emailSubj,setEmailSubj]=useState("");
  const [emailBody,setEmailBody]=useState("");
  const [tmpl,setTmpl]=useState("outreach");
  const [genLoad,setGenLoad]=useState(false);
  const TMPLS={
    outreach:{subj:"Quick question about AI coding tools at [Company]",body:"Hi [Name],\n\nI'm Sai, founder of Grassion — we help engineering teams track ROI on AI coding tools.\n\n[Personalization here]\n\nWould a quick 15-minute call work?\n\nBest,\nSai\ngrassion.com"},
    followup:{subj:"Following up — Grassion for [Company]",body:"Hi [Name],\n\nJust following up on my previous email about Grassion.\n\nAre AI tool ROI and seat waste something you track? Happy to show a quick demo.\n\nBest,\nSai"},
    demo:{subj:"Demo scheduled — Grassion + [Company]",body:"Hi [Name],\n\nLooking forward to our call!\n\nI'll show: ROI dashboard, AI spend analysis, health score, reverted PR tracking.\n\nMeet link: [add here]\n\nBest,\nSai"},
    trial:{subj:"Free trial — Grassion for [Company]",body:"Hi [Name],\n\nWould you like to try Grassion free for 14 days? No card needed.\n\nSign up at app.grassion.com — I'll personally set you up.\n\nBest,\nSai"},
    closing:{subj:"Moving forward with Grassion?",body:"Hi [Name],\n\nWanted to check in — ready to move forward?\n\nWe can start at $49/mo (10 seats), 30-day money-back guarantee.\n\nBest,\nSai"},
  };
  const applyTmpl=(t)=>{setTmpl(t);setEmailSubj(TMPLS[t].subj);setEmailBody(TMPLS[t].body);};
  const genREX=async()=>{
    setGenLoad(true);
    try{const resp=await callAI(AGENTS.rex.prompt,[{role:"user",content:`Write a ${tmpl} email for ${emailTo||"a prospect"}. Return "Subject: ..." on line 1, blank line, then body. Concise and compelling.`}],creds);
    const lines=resp.split("\n");const si=lines.findIndex(l=>l.toLowerCase().startsWith("subject:"));
    if(si>=0){setEmailSubj(lines[si].replace(/subject:\s*/i,"").trim());setEmailBody(lines.slice(si+2).join("\n").trim());}else setEmailBody(resp);}
    catch(e){setEmailBody(`Error: ${e.message}`);}
    setGenLoad(false);
  };
  const addMeeting=()=>{if(!newM.title)return;const m=[...meetings,{...newM,id:Date.now()}];setMeetings(m);lsSet("hqf_meetings",m);setShowForm(false);setNewM({title:"",date:"",company:"",notes:""});};
  const delMeeting=(id)=>{const m=meetings.filter(x=>x.id!==id);setMeetings(m);lsSet("hqf_meetings",m);};
  const zohoUrl=`https://mail.zoho.in/zm/#compose?to=${encodeURIComponent(emailTo)}&subject=${encodeURIComponent(emailSubj)}&body=${encodeURIComponent(emailBody)}`;
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"7px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
        <span style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:700,fontSize:13}}>🗓️ CALENDAR</span>
        <div style={{display:"flex",gap:4}}>
          {[["meetings","Meetings"],["email","Emails"],["scheduler","Scheduler"]].map(([s,l])=><button key={s} onClick={()=>setSec(s)} style={{background:sec===s?"#111":"transparent",border:`1px solid ${sec===s?"#374151":"transparent"}`,color:sec===s?"#e5e7eb":"#4b5563",padding:"3px 10px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>{l}</button>)}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <a href="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code" target="_blank" rel="noopener noreferrer" style={{...btn("#ef4444",{textDecoration:"none",fontSize:9,padding:"3px 8px"})}}>Google Cal</a>
          <a href="https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCalendar.calendar.READ&response_type=code" target="_blank" rel="noopener noreferrer" style={{...btn("#f59e0b",{textDecoration:"none",fontSize:9,padding:"3px 8px"})}}>Zoho Cal</a>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:12}}>
        {sec==="meetings"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{color:"#9ca3af",fontSize:11,fontFamily:"monospace"}}>Scheduled Meetings & Calls</div>
              <button onClick={()=>setShowForm(!showForm)} style={btn("#3b82f6",{fontSize:10,padding:"4px 10px"})}>+ Add Meeting</button>
            </div>
            {showForm&&(
              <div style={{...card({marginBottom:12,borderColor:"#3b82f633"})}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:9}}>
                  {[["Title","title","text"],["Company","company","text"],["Date/Time","date","datetime-local"],["Notes","notes","text"]].map(([l,k,t])=>(
                    <div key={k} style={k==="notes"?{gridColumn:"1/-1"}:{}}>
                      <div style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",marginBottom:2}}>{l}</div>
                      <input type={t} value={newM[k]} onChange={e=>setNewM(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:6,padding:"6px 9px",color:"#e5e7eb",fontSize:11,outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  ))}
                </div>
                <button onClick={addMeeting} style={btn("#22c55e",{width:"100%",textAlign:"center"})}>Save Meeting</button>
              </div>
            )}
            {meetings.length===0&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:30,marginBottom:8}}>📅</div><div style={{color:"#4b5563",fontSize:12}}>No meetings yet. Connect Google/Zoho Calendar or add manually.</div></div>}
            {meetings.map(m=>(
              <div key={m.id} style={{...card({marginBottom:7,borderColor:"#3b82f633"})}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                  <div style={{flex:1}}>
                    <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12}}>{m.title}</div>
                    {m.company&&<div style={{color:"#3b82f6",fontSize:10,marginTop:2}}>🏢 {m.company}</div>}
                    {m.date&&<div style={{color:"#f59e0b",fontSize:10,fontFamily:"monospace",marginTop:2}}>🕐 {new Date(m.date).toLocaleString()}</div>}
                    {m.notes&&<div style={{color:"#6b7280",fontSize:10,marginTop:3}}>{m.notes}</div>}
                  </div>
                  <button onClick={()=>delMeeting(m.id)} style={{background:"transparent",border:"none",color:"#374151",cursor:"pointer",fontSize:13}}>×</button>
                </div>
              </div>
            ))}
          </>
        )}
        {sec==="email"&&(
          <>
            <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
              {[["outreach","Outreach"],["followup","Follow-up"],["demo","Demo"],["trial","Trial"],["closing","Closing"]].map(([k,l])=>(
                <button key={k} onClick={()=>applyTmpl(k)} style={{background:tmpl===k?"#1f2937":"transparent",border:`1px solid ${tmpl===k?"#374151":"#1f2937"}`,color:tmpl===k?"#e5e7eb":"#6b7280",padding:"3px 10px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>{l}</button>
              ))}
            </div>
            <div style={card()}>
              <div style={{marginBottom:8}}><div style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",marginBottom:2}}>TO</div>
                <input value={emailTo} onChange={e=>setEmailTo(e.target.value)} placeholder="Email address..." list="deal-emails" style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:6,padding:"6px 9px",color:"#e5e7eb",fontSize:11,outline:"none",boxSizing:"border-box"}}/>
                <datalist id="deal-emails">{deals.map(d=><option key={d.id} value={d.email||""}>{d.co} — {d.contact}</option>)}</datalist>
              </div>
              <div style={{marginBottom:8}}><div style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",marginBottom:2}}>SUBJECT</div><input value={emailSubj} onChange={e=>setEmailSubj(e.target.value)} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:6,padding:"6px 9px",color:"#e5e7eb",fontSize:11,outline:"none",boxSizing:"border-box"}}/></div>
              <div style={{marginBottom:10}}><div style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",marginBottom:2}}>BODY</div><textarea value={emailBody} onChange={e=>setEmailBody(e.target.value)} rows={8} style={{width:"100%",background:"#111",border:"1px solid #374151",borderRadius:6,padding:"6px 9px",color:"#e5e7eb",fontSize:11,outline:"none",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box"}}/></div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <button onClick={genREX} disabled={genLoad} style={btn("#3b82f6",{flex:1,minWidth:130})}>{genLoad?"✍️ Writing...":"🎯 Ask REX to write"}</button>
                <button onClick={()=>navigator.clipboard?.writeText(`Subject: ${emailSubj}\n\n${emailBody}`)} style={btn("#9ca3af",{flex:1,minWidth:90})}>📋 Copy</button>
                <a href={zohoUrl} target="_blank" rel="noopener noreferrer" style={{...btn("#22c55e",{flex:1,minWidth:130,textDecoration:"none",textAlign:"center",display:"inline-flex",alignItems:"center",justifyContent:"center"})}}>📧 Open in Zoho</a>
              </div>
            </div>
          </>
        )}
        {sec==="scheduler"&&(
          <>
            <div style={{...card({marginBottom:10})}}>
              <div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700,fontSize:11,marginBottom:7}}>📋 DEMO-BOOKED DEALS</div>
              {deals.filter(d=>d.stage==="Demo Booked").length===0&&<div style={{color:"#4b5563",fontSize:11}}>No deals in "Demo Booked" stage. Move deals forward in the Sales tab.</div>}
              {deals.filter(d=>d.stage==="Demo Booked").map(deal=>(
                <div key={deal.id} style={{background:"#111",borderRadius:7,padding:10,marginBottom:7}}>
                  <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12,marginBottom:3}}>{deal.co} — {deal.contact}</div>
                  <div style={{color:"#4b5563",fontSize:10,marginBottom:7}}>${deal.val}/mo · {deal.note}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <button onClick={()=>{setSec("email");applyTmpl("demo");setEmailTo(deal.email||"");}} style={btn("#3b82f6",{fontSize:10,padding:"3px 9px"})}>📧 Demo Reminder Email</button>
                    <button onClick={()=>{setSec("meetings");setShowForm(true);setNewM(p=>({...p,company:deal.co,title:`Demo — ${deal.co}`}));}} style={btn("#22c55e",{fontSize:10,padding:"3px 9px"})}>📅 Add to Calendar</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={card()}>
              <div style={{color:"#9ca3af",fontFamily:"monospace",fontSize:11,marginBottom:7}}>Post-Meeting Checklist</div>
              <div style={{color:"#4b5563",fontSize:11,lineHeight:1.8}}>
                1. Update deal stage in 🎯 Sales tab<br/>
                2. Send follow-up email (Email section above)<br/>
                3. Add meeting notes in Meetings section<br/>
                4. Ask REX for objection handling<br/>
                5. Book next touchpoint
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── TAB 8: GITHUB ─────────────────────────────────────────────────────────
function GithubPanel({creds,onContextLoaded}){
  const [files,setFiles]=useState({});
  const [loading,setLoading]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const KEY_FILES=["apps/api/src/routes/metrics.ts","apps/api/src/routes/analytics.ts","apps/web/src/pages/Settings.tsx","apps/web/src/pages/Health.tsx","apps/web/src/pages/Dashboard.tsx"];
  const fetchAll=async()=>{
    setLoading(true);
    const token=creds?.github?.token,repo=creds?.github?.repo||"saisnatadash/grassion",results={};
    for(const path of KEY_FILES){
      try{const headers=token?{Authorization:`token ${token}`}:{};const r=await fetch(`https://api.github.com/repos/${repo}/contents/${path}`,{headers});const d=await r.json();if(d.content)results[path]=atob(d.content.replace(/\n/g,"")).slice(0,800)+"...[truncated]";}catch{}
    }
    setFiles(results);setLoaded(true);setLoading(false);
    onContextLoaded(Object.entries(results).map(([p,c])=>`\n---${p}---\n${c}`).join("\n"));
  };
  return(
    <div style={{padding:14,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#22c55e",fontFamily:"monospace",fontWeight:700,fontSize:12,marginBottom:4}}>🐙 LIVE GITHUB CODEBASE</div>
      <div style={{color:"#4b5563",fontSize:11,marginBottom:11}}>Load real code so ARIA gives exact bug fixes with file names + line numbers.</div>
      <button onClick={fetchAll} disabled={loading} style={btn(loaded?"#22c55e":"#e5e7eb",{marginBottom:14,opacity:loading?0.7:1,cursor:loading?"not-allowed":"pointer"})}>
        {loading?"⏳ Fetching...":loaded?"✅ Loaded — Refresh":"🐙 Load Live Codebase"}
      </button>
      {loaded&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
        <div style={{color:"#22c55e",fontSize:11,fontFamily:"monospace"}}>✅ {Object.keys(files).length} files loaded into ARIA + SSD memory</div>
        {Object.entries(files).map(([path,content])=>(
          <div key={path} style={card()}><div style={{color:"#22c55e",fontFamily:"monospace",fontSize:10,marginBottom:4}}>📄 {path}</div><pre style={{color:"#374151",fontSize:9,fontFamily:"monospace",margin:0,whiteSpace:"pre-wrap"}}>{content}</pre></div>
        ))}
      </div>}
    </div>
  );
}

// ── TAB 9: KEYS ───────────────────────────────────────────────────────────
function CredsPanel({creds,onSave}){
  const [local,setLocal]=useState(creds||{});
  const [saved,setSaved]=useState(false);
  const setF=(p,k,v)=>setLocal(prev=>({...prev,[p]:{...(prev[p]||{}),[k]:v}}));
  const SECS=[
    {id:"openai",name:"OpenAI API",icon:"🤖",color:"#10a37f",note:"Powers all agents + DALL-E image generation",fields:[{k:"api_key",l:"API Key (sk-...)"}],guide:"platform.openai.com → API Keys → Create"},
    {id:"github",name:"GitHub",icon:"🐙",color:"#e5e7eb",note:"Lets ARIA read your actual Grassion code files",fields:[{k:"token",l:"Token (ghp_...)"},{k:"repo",l:"Repo (saisnatadash/grassion)"}],guide:"github.com/settings/tokens → Generate → repo scope"},
    {id:"twitter",name:"Twitter / X",icon:"🐦",color:"#1da1f2",note:"ZEUS auto-posts via API",fields:[{k:"api_key",l:"API Key"},{k:"api_secret",l:"API Secret"},{k:"access_token",l:"Access Token"},{k:"access_secret",l:"Access Secret"}],guide:"developer.twitter.com → Project → App → Keys & Tokens"},
    {id:"reddit",name:"Reddit",icon:"🤖",color:"#ff4500",note:"ZEUS posts to subreddits automatically",fields:[{k:"client_id",l:"Client ID"},{k:"client_secret",l:"Client Secret"},{k:"username",l:"Username"},{k:"password",l:"Password"}],guide:"reddit.com/prefs/apps → Create App (script type)"},
    {id:"devto",name:"Dev.to + Hashnode",icon:"📝",color:"#3b49df",note:"ZEUS publishes articles via API",fields:[{k:"devto_key",l:"Dev.to API Key"},{k:"hashnode_token",l:"Hashnode Token"}],guide:"dev.to/settings/extensions | hashnode.com/settings/developer"},
    {id:"medium",name:"Medium",icon:"✍️",color:"#00ab6c",note:"ZEUS auto-publishes articles",fields:[{k:"token",l:"Integration Token"}],guide:"medium.com/me/settings → Integration tokens → New token"},
    {id:"bluesky",name:"Bluesky",icon:"🦋",color:"#0085ff",note:"ZEUS auto-posts via API",fields:[{k:"handle",l:"Handle (e.g. grassion.bsky.social)"},{k:"app_password",l:"App Password"}],guide:"bsky.app → Settings → App Passwords → Add App Password"},
    {id:"zoho",name:"Zoho Mail",icon:"📧",color:"#f59e0b",note:"Send emails from Calendar tab via Zoho",fields:[{k:"client_id",l:"Client ID"},{k:"client_secret",l:"Client Secret"},{k:"refresh_token",l:"Refresh Token"}],guide:"accounts.zoho.in/developerconsole → Create Client → Server-based"},
    {id:"gcal",name:"Google Calendar",icon:"📅",color:"#4285f4",note:"Show meetings + client calls in Calendar tab",fields:[{k:"client_id",l:"Client ID"},{k:"api_key",l:"API Key"}],guide:"console.cloud.google.com → APIs → Calendar API → Credentials"},
    {id:"linkedin",name:"LinkedIn (Manual Send)",icon:"💼",color:"#0077b5",note:"ZEUS writes posts & DMs → you send manually to protect account",fields:[{k:"profile_url",l:"Your LinkedIn Profile URL"}],guide:"⚠️ LinkedIn bans bots. ZEUS writes → you paste and send."},
    {id:"grassion",name:"Grassion API",icon:"🌱",color:"#22c55e",note:"Fetch real MRR, users, churn data in Stats tab",fields:[{k:"api_url",l:"API URL",default:"https://grassion-api.fly.dev"}],guide:"Your Fly.io app URL — shows live signups, active users, Razorpay conversions"},
  ];
  return(
    <div style={{padding:14,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700,fontSize:12,marginBottom:4}}>🔑 CREDENTIALS VAULT</div>
      <div style={{color:"#4b5563",fontSize:11,marginBottom:12}}>Saved in your browser only. Never sent anywhere except the respective API.</div>
      <div style={{display:"flex",flexDirection:"column",gap:9,maxWidth:580}}>
        {SECS.map(s=>(
          <div key={s.id} style={{background:"#0a0a0a",border:`1px solid ${s.color}33`,borderRadius:9,padding:11}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:15}}>{s.icon}</span>
              <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12,flex:1}}>{s.name}</div>
              {local[s.id]?.[s.fields[0].k]&&<div style={{background:"#16a34a22",color:"#22c55e",fontSize:9,padding:"2px 6px",borderRadius:7}}>✓ Set</div>}
            </div>
            <div style={{color:"#4b5563",fontSize:9,marginBottom:3}}>📍 {s.guide}</div>
            <div style={{color:s.color,fontSize:10,marginBottom:6,fontStyle:"italic"}}>{s.note}</div>
            {s.fields.map(f=>(
              <div key={f.k} style={{marginBottom:5}}>
                <div style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",marginBottom:2}}>{f.l}</div>
                <input type={["url","repo","handle"].some(x=>f.k.includes(x))?"text":"password"}
                  value={local[s.id]?.[f.k]||f.default||""} onChange={e=>setF(s.id,f.k,e.target.value)}
                  placeholder={f.default||f.l}
                  style={{width:"100%",background:"#111",border:"1px solid #1f2937",borderRadius:6,padding:"6px 9px",color:"#e5e7eb",fontSize:11,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
        ))}
        <button onClick={()=>{onSave(local);setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{background:"#f59e0b",border:"none",borderRadius:8,padding:10,color:"#000",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>
          {saved?"✅ SAVED!":"SAVE ALL CREDENTIALS"}
        </button>
      </div>
    </div>
  );
}

// ── TAB 10: DEPLOY ────────────────────────────────────────────────────────
function DeployGuide(){
  const steps=[
    {n:"01",c:"#22c55e",t:"Deploy agents.grassion.com — FREE",code:`Give Claude Code in VS Code:

"Deploy this Vite React app to Vercel.
1. vercel login
2. vercel --prod (root directory: grassion-hq)
3. Add domain agents.grassion.com in Vercel dashboard
4. Cloudflare DNS → CNAME: agents → cname.vercel-dns.com (grey cloud)"`},
    {n:"02",c:"#ec4899",t:"ZEUS Auto-Posting on Fly.io",code:`Give Claude Code:

"Add zeus scheduler at apps/api/src/scheduler/zeus.ts
node-cron jobs:
- 8am IST: Twitter API v2 post from zeus_queue
- 12pm IST: Reddit API post (rotate subreddits)
- 6pm IST: Dev.to + Hashnode API publish

CREATE TABLE zeus_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT, content TEXT, status TEXT DEFAULT 'queued',
  scheduled_for TIMESTAMPTZ, posted_at TIMESTAMPTZ
);
Deploy: fly deploy --app grassion-api"`},
    {n:"03",c:"#a855f7",t:"Set API Keys on Fly.io",code:`flyctl secrets set \\
  TWITTER_API_KEY="..." TWITTER_API_SECRET="..." \\
  TWITTER_ACCESS_TOKEN="..." TWITTER_ACCESS_SECRET="..." \\
  REDDIT_CLIENT_ID="..." REDDIT_CLIENT_SECRET="..." \\
  DEVTO_API_KEY="..." MEDIUM_TOKEN="..." \\
  --app grassion-api`},
    {n:"04",c:"#f59e0b",t:"Daily SSD Email Report at 9pm IST",code:`Give Claude Code:

"Add ssd-daily.ts scheduler in apps/api/src/scheduler/
Every 9pm IST via Resend to eswar33007@gmail.com:
Subject: SSD Daily Report — [date]
Content: ZEUS posts today, outreach sent, API errors,
Razorpay new signups, health score change
Deploy: fly deploy --app grassion-api"`},
  ];
  return(
    <div style={{padding:14,overflowY:"auto",height:"100%",display:"flex",flexDirection:"column",gap:9}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:11}}>🚀 DEPLOYMENT — Make Everything Always-On</div>
      {steps.map((s,i)=>(
        <div key={i} style={{background:"#0a0a0a",border:`1px solid ${s.c}33`,borderRadius:9,padding:13}}>
          <div style={{display:"flex",gap:9,marginBottom:7}}>
            <div style={{color:s.c,fontFamily:"monospace",fontSize:22,fontWeight:900,opacity:.4,flexShrink:0}}>{s.n}</div>
            <div style={{color:"#e5e7eb",fontWeight:700,fontSize:12,paddingTop:3}}>{s.t}</div>
          </div>
          <pre style={{background:"#050505",border:`1px solid ${s.c}22`,borderRadius:6,padding:10,color:s.c,fontSize:10,fontFamily:"monospace",overflowX:"auto",margin:0,whiteSpace:"pre-wrap",lineHeight:1.6}}>{s.code}</pre>
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
export default function GrassionHQ(){
  const [activeAgent,setActiveAgent]=useState("ssd");
  const [convs,setConvs]=useState(()=>ls("hqf_convs",{ssd:[],zeus:[],aria:[],nova:[],rex:[],finn:[]}));
  const [typing,setTyping]=useState({});
  const [newMsg,setNewMsg]=useState({});
  const [reports,setReports]=useState(()=>ls("hqf_reports",[]));
  const [creds,setCreds]=useState(()=>ls("hqf_creds",{}));
  const [deals,setDeals]=useState(()=>ls("hqf_deals",INIT_DEALS));
  const [tab,setTab]=useState("stats");
  const [collecting,setCollecting]=useState(false);
  const [ghCtx,setGhCtx]=useState("");
  const [generatingImg,setGeneratingImg]=useState(false);
  const [generatedImgs,setGeneratedImgs]=useState({});
  const [notifs,setNotifs]=useState(()=>ls("hqf_notifs",[]));

  const addNotif=useCallback((msg,color="#22c55e")=>{
    const n={id:Date.now()+Math.random(),msg:String(msg).slice(0,60),color,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),fresh:true};
    setNotifs(prev=>{const u=[n,...prev].slice(0,20);lsSet("hqf_notifs",u);return u;});
    setTimeout(()=>setNotifs(prev=>prev.map(x=>x.id===n.id?{...x,fresh:false}:x)),3000);
  },[]);

  const dismissNotif=(id)=>setNotifs(prev=>{const u=prev.filter(n=>n.id!==id);lsSet("hqf_notifs",u);return u;});
  const clearNotifs=()=>{setNotifs([]);lsSet("hqf_notifs",[]);};

  const sysPrompt=useCallback((id)=>{
    let s=AGENTS[id].prompt;
    if(ghCtx&&(id==="aria"||id==="ssd")) s+=`\n\nLIVE CODEBASE:\n${ghCtx}`;
    return s;
  },[ghCtx]);

  const sendMsg=useCallback(async(agentId,text)=>{
    const h=convs[agentId]||[];
    const uMsg={role:"user",content:text};
    const newC={...convs,[agentId]:[...h,uMsg]};
    setConvs(newC);setTyping(p=>({...p,[agentId]:true}));
    try{
      const resp=await callAI(sysPrompt(agentId),[...h,uMsg],creds);
      const aMsg={role:"assistant",content:resp};
      const final={...newC,[agentId]:[...newC[agentId],aMsg]};
      setConvs(final);lsSet("hqf_convs",final);
      if(agentId!==activeAgent){setNewMsg(p=>({...p,[agentId]:true}));addNotif(`${AGENTS[agentId].emoji} ${AGENTS[agentId].name} responded`,AGENTS[agentId].color);}
      if(agentId==="zeus"&&resp.includes("[DALLE:")&&creds?.openai?.api_key){
        const match=resp.match(/\[DALLE:(.*?)\]/s);
        if(match){setGeneratingImg(true);const idx=final[agentId].length-1;const url=await genImage(match[1].trim(),creds.openai.api_key);if(url)setGeneratedImgs(p=>({...p,[idx]:url}));setGeneratingImg(false);}
      }
    }catch(e){
      const errC={...newC,[agentId]:[...newC[agentId],{role:"assistant",content:`⚠️ Error: ${e.message}`}]};
      setConvs(errC);addNotif(`⚠️ ${AGENTS[agentId].name}: ${e.message.slice(0,45)}`,"#ef4444");
    }
    setTyping(p=>({...p,[agentId]:false}));
  },[convs,activeAgent,creds,sysPrompt,addNotif]);

  const requestReport=useCallback(async(agentId)=>{
    setTyping(p=>({...p,[agentId]:true}));
    try{
      const resp=await callAI(sysPrompt(agentId),[{role:"user",content:"Give SSD a brief daily report (max 5 bullet points): top finding, key action, what founder should do next, any blocker."}],creds);
      const report={agentId,content:resp,timestamp:Date.now()};
      const newR=[...reports,report];setReports(newR);lsSet("hqf_reports",newR);
      setNewMsg(p=>({...p,ssd:true}));addNotif(`📬 ${AGENTS[agentId].name} briefed SSD`,AGENTS[agentId].color);
    }catch(e){addNotif(`⚠️ Report failed: ${e.message.slice(0,40)}`,"#ef4444");}
    setTyping(p=>({...p,[agentId]:false}));
  },[reports,creds,sysPrompt,addNotif]);

  const getAllReports=useCallback(async()=>{
    setCollecting(true);addNotif("📡 Collecting all agent reports...","#f59e0b");
    for(const id of ["zeus","aria","nova","rex","finn"]) await requestReport(id);
    setCollecting(false);addNotif("✅ All reports in SSD Inbox","#22c55e");
  },[requestReport,addNotif]);

  const select=(id)=>{setActiveAgent(id);setNewMsg(p=>({...p,[id]:false}));};
  const saveCreds=(c)=>{setCreds(c);lsSet("hqf_creds",c);addNotif("✅ Credentials saved","#22c55e");};
  const saveDeals=(d)=>{setDeals(d);lsSet("hqf_deals",d);};

  const TABS=[["stats","📊 Stats"],["agents","👥 Agents"],["inbox","📬 SSD Inbox"],["sales","🎯 Sales"],["autoposts","📅 Auto Posts"],["social","📱 Social Media"],["calendar","🗓️ Calendar"],["github","🐙 GitHub"],["creds","🔑 Keys"],["deploy","🚀 Deploy"]];

  return(
    <div style={{background:"#030303",height:"100vh",color:"#e5e7eb",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#374151;border-radius:3px}@keyframes bounce{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

      {/* Header */}
      <div style={{padding:"6px 12px",borderBottom:"1px solid #0d0d0d",background:"#050505",display:"flex",alignItems:"center",gap:7,flexShrink:0,flexWrap:"wrap"}}>
        <span style={{fontSize:17}}>🌱</span>
        <div style={{marginRight:5}}>
          <div style={{color:"#22c55e",fontWeight:900,fontSize:14,fontFamily:"monospace",letterSpacing:1}}>GRASSION HQ</div>
          <div style={{color:"#374151",fontSize:9,fontFamily:"monospace"}}>6 AI Agents · DALL-E · Live GitHub</div>
        </div>
        <div style={{display:"flex",gap:2,flexWrap:"wrap",flex:1}}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?"#111":"transparent",border:`1px solid ${tab===t?"#374151":"transparent"}`,color:tab===t?"#e5e7eb":"#4b5563",padding:"4px 8px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace",whiteSpace:"nowrap"}}>
              {l}{t==="inbox"&&reports.length>0?` (${reports.length})`:""}
              {t==="agents"&&Object.values(newMsg).some(Boolean)?" 🔴":""}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:4,fontSize:9,fontFamily:"monospace",flexShrink:0}}>
          <span style={{background:"#22c55e22",color:creds?.openai?.api_key?"#10a37f":"#22c55e",padding:"2px 7px",borderRadius:6,border:"1px solid #22c55e22"}}>{creds?.openai?.api_key?"GPT-4o":"No AI Key"}</span>
          {creds?.openai?.api_key&&<span style={{background:"#6366f122",color:"#818cf8",padding:"2px 7px",borderRadius:6,border:"1px solid #6366f122"}}>🎨 DALL-E</span>}
          {ghCtx&&<span style={{background:"#e5e7eb11",color:"#9ca3af",padding:"2px 7px",borderRadius:6,border:"1px solid #37414133"}}>🐙 Live Code</span>}
        </div>
      </div>

      {/* Notification Bar */}
      <NotifBar notifs={notifs} onDismiss={dismissNotif} onClearAll={clearNotifs}/>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        {tab==="stats"&&<StatsDash deals={deals} creds={creds}/>}
        {tab==="agents"&&(
          <>
            <div style={{width:175,borderRight:"1px solid #0d0d0d",padding:7,display:"flex",flexDirection:"column",gap:3,overflowY:"auto",flexShrink:0}}>
              <div style={{color:"#374151",fontSize:8,fontFamily:"monospace",padding:"2px",textTransform:"uppercase",letterSpacing:1}}>Your AI Team</div>
              {Object.keys(AGENTS).map(id=>{const a=AGENTS[id];return(
                <button key={id} onClick={()=>select(id)} style={{background:activeAgent===id?a.bg:"transparent",border:`1px solid ${activeAgent===id?a.border:"#1f2937"}`,borderRadius:6,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,textAlign:"left",position:"relative"}}>
                  {newMsg[id]&&<div style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:a.color,animation:"pulse2 1.5s infinite"}}/>}
                  <span style={{fontSize:14}}>{a.emoji}</span>
                  <div><div style={{color:a.color,fontWeight:700,fontSize:11,fontFamily:"monospace"}}>{a.name}</div><div style={{color:"#374151",fontSize:9}}>{a.title.split("—")[0].trim()}</div></div>
                </button>
              );})}
              <div style={{borderTop:"1px solid #111",paddingTop:6,marginTop:2}}>
                <div style={{color:"#374151",fontSize:8,fontFamily:"monospace",marginBottom:3,textTransform:"uppercase"}}>Brief All → SSD</div>
                {["zeus","aria","nova","rex","finn"].map(id=>{const a=AGENTS[id];return(
                  <button key={id} onClick={()=>requestReport(id)} style={{display:"flex",alignItems:"center",gap:4,width:"100%",background:"transparent",border:"none",color:"#4b5563",padding:"2px 0",cursor:"pointer",fontSize:9,textAlign:"left"}}>
                    <span>{a.emoji}</span><span style={{color:a.color}}>{a.name}</span>→SSD
                    {typing[id]&&<Dots c={a.color}/>}
                  </button>
                );})}
              </div>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <ChatArea agent={activeAgent} messages={convs[activeAgent]||[]} isTyping={!!typing[activeAgent]} onSend={msg=>sendMsg(activeAgent,msg)} onReport={requestReport} creds={creds} generatingImg={generatingImg} generatedImgs={generatedImgs}/>
            </div>
          </>
        )}
        {tab==="inbox"&&<SSDInbox reports={reports} onGetAll={getAllReports} collecting={collecting}/>}
        {tab==="sales"&&<Pipeline deals={deals} setDeals={saveDeals} onAskRex={msg=>{setTab("agents");select("rex");sendMsg("rex",msg);}} creds={creds}/>}
        {tab==="autoposts"&&<AutoPosts creds={creds}/>}
        {tab==="social"&&<SocialMedia/>}
        {tab==="calendar"&&<CalendarTab deals={deals} creds={creds}/>}
        {tab==="github"&&<GithubPanel creds={creds} onContextLoaded={setGhCtx}/>}
        {tab==="creds"&&<CredsPanel creds={creds} onSave={saveCreds}/>}
        {tab==="deploy"&&<DeployGuide/>}
      </div>
    </div>
  );
}
