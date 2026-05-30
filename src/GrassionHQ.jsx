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

const AGENTS = {
  ssd:  { id:"ssd",  name:"SSD",  title:"CEO",              emoji:"👑", color:"#f59e0b", bg:"#1a1000", border:"#d97706", accent:"#fde68a", prompt:`You are SSD, CEO of Grassion. Oversee all agents, give founder top priorities.\n${GC}\nBe decisive and brief. Always say what to do TODAY first.` },
  zeus: { id:"zeus", name:"ZEUS", title:"Growth & Marketing",emoji:"⚡", color:"#ec4899", bg:"#1a0010", border:"#be185d", accent:"#f9a8d4", prompt:`You are ZEUS, growth agent for Grassion. Handle all social media, outreach, content.\n${GC}\nPlatforms: LinkedIn, Twitter/X, Reddit (r/programming r/ExperiencedDevs r/startups), Product Hunt, HackerNews, IndieHackers, Dev.to, Hashnode.\nFor images include [DALLE: detailed prompt] in your response.\nAlways give COMPLETE ready-to-use copy. LinkedIn posts/DMs = write copy, founder sends manually (protects account).` },
  aria: { id:"aria", name:"ARIA", title:"CTO — Technical",   emoji:"⚙️", color:"#22c55e", bg:"#052e16", border:"#16a34a", accent:"#86efac", prompt:`You are ARIA, CTO agent for Grassion.\n${GC}\nKey files: apps/api/src/routes/metrics.ts, analytics.ts, auth.ts | apps/web/src/pages/Dashboard.tsx, Settings.tsx (BUG lines 419/436 Plan type missing admin), Health.tsx, Billing.tsx\nGive exact file/line bug fixes with copy-paste code.` },
  nova: { id:"nova", name:"NOVA", title:"CMO — Content",     emoji:"📣", color:"#f59e0b", bg:"#1c1007", border:"#d97706", accent:"#fbbf24", prompt:`You are NOVA, CMO for Grassion.\n${GC}\nSEO targets: "GitHub Copilot ROI", "AI coding tools analytics". Write SEO blogs, email sequences, website copy, press releases.` },
  rex:  { id:"rex",  name:"REX",  title:"VP Sales",          emoji:"🎯", color:"#3b82f6", bg:"#0c1a2e", border:"#2563eb", accent:"#93c5fd", prompt:`You are REX, VP Sales for Grassion.\n${GC}\nTop targets: Tara AI, WarpBuild, Dockup, Richpanel, Atomicwork (US/India). Tabby, Bayzat (UAE). Tessian, Quantexa (UK).\nObjections: "Too expensive"→pays for itself week 1. "Security"→read-only same as Vercel. "Build it"→6-12mo $50K vs $49/mo.\nWrite hyper-personalized outreach based on what each company specifically does.` },
  finn: { id:"finn", name:"FINN", title:"CFO — Finance",     emoji:"💰", color:"#a855f7", bg:"#1a0a2e", border:"#9333ea", accent:"#d8b4fe", prompt:`You are FINN, CFO for Grassion.\n${GC}\nInfra cost ~$50/mo. Gross margin ~98%. Razorpay 2% fee. Goal ₹7L/month by month 9-12.\nAlways show the math. Give exact numbers.` },
};

const DEAL_STAGES = ["New Lead","Contacted","Replied","Demo Booked","Negotiating","Won","Lost"];
const STAGE_CLR = {"New Lead":"#374151","Contacted":"#1d4ed8","Replied":"#7c3aed","Demo Booked":"#b45309","Negotiating":"#d97706","Won":"#16a34a","Lost":"#dc2626"};

const INIT_DEALS = [
  {id:1,co:"Tara AI",contact:"VP Engineering",li:"linkedin.com/company/tara-ai",val:149,stage:"New Lead",note:"Adjacent product, will instantly get Grassion"},
  {id:2,co:"WarpBuild",contact:"CTO",li:"linkedin.com/company/warpbuild",val:49,stage:"New Lead",note:"GitHub-native devtools, perfect fit"},
  {id:3,co:"Richpanel",contact:"CTO",li:"linkedin.com/company/richpanel",val:149,stage:"New Lead",note:"Sequoia-backed, lean team"},
  {id:4,co:"Atomicwork",contact:"Co-founder",li:"linkedin.com/company/atomicwork",val:149,stage:"New Lead",note:"Sells AI productivity tools"},
  {id:5,co:"Tabby",contact:"VP Engineering",li:"linkedin.com/company/tabby-app",val:399,stage:"New Lead",note:"100+ engineers, $3.3B valuation"},
  {id:6,co:"Tessian",contact:"VP Engineering",li:"linkedin.com/company/tessian",val:399,stage:"New Lead",note:"$80M raised, large eng team"},
  {id:7,co:"HyperVerge",contact:"CTO",li:"linkedin.com/company/hyperverge",val:149,stage:"New Lead",note:"Series B, heavy ML team"},
];

async function callAI(system, msgs, creds) {
  const oKey = creds?.openai?.api_key;
  if (oKey) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${oKey}`},
      body: JSON.stringify({model:"gpt-4o", max_tokens:1000, messages:[{role:"system",content:system},...msgs]})
    });
    const d = await r.json();
    if(d.error) throw new Error(d.error.message);
    return d.choices?.[0]?.message?.content || "No response.";
  }
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages:msgs})
  });
  const d = await r.json();
  if(d.error) throw new Error(JSON.stringify(d.error));
  return d.content?.map(b=>b.text||"").join("") || "No response.";
}

async function genImage(prompt, key) {
  if(!key) return null;
  try {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body: JSON.stringify({model:"dall-e-3", prompt:`${prompt}. Dark background, green accent, professional SaaS tech style.`, n:1, size:"1792x1024"})
    });
    const d = await r.json();
    return d.data?.[0]?.url || null;
  } catch { return null; }
}

function Dots({c="#f59e0b"}) {
  return (
    <div style={{display:"flex",gap:4,padding:"8px 14px"}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:c,
          animation:`bounce 1.2s ease ${i*0.2}s infinite`}}/>
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

// Simple bar chart using pure CSS
function SimpleBar({data, colorKey="c", valueKey="v", labelKey="p", height=140}) {
  const max = Math.max(...data.map(d=>d[valueKey]), 1);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height,padding:"0 4px"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
          <div style={{color:"#9ca3af",fontSize:10,fontFamily:"monospace"}}>{d[valueKey]}</div>
          <div style={{width:"100%",background:d[colorKey]||"#22c55e",borderRadius:"4px 4px 0 0",height:`${(d[valueKey]/max)*100}%`,minHeight:4,transition:"height .3s"}}/>
          <div style={{color:"#6b7280",fontSize:10,textAlign:"center",fontFamily:"monospace",lineHeight:1.2}}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

// Simple line chart using SVG
function SimpleLine({data, color="#22c55e", height=120, valueKey="v", labelKey}) {
  const vals = data.map(d=>d[valueKey]);
  const min = Math.min(...vals);
  const max = Math.max(...vals, min+1);
  const W = 400, H = height - 24;
  const pts = vals.map((v,i)=>{
    const x = (i/(vals.length-1))*W;
    const y = H - ((v-min)/(max-min))*H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div style={{overflowX:"hidden"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H+4}`} preserveAspectRatio="none" style={{display:"block"}}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
        {vals.map((v,i)=>{
          const x=(i/(vals.length-1))*W;
          const y=H-((v-min)/(max-min))*H;
          return <circle key={i} cx={x} cy={y} r="3.5" fill={color}/>;
        })}
      </svg>
      {labelKey && (
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:4}}>
          {data.filter((_,i)=>i===0||i===Math.floor(data.length/2)||i===data.length-1).map((d,i)=>(
            <div key={i} style={{color:"#4b5563",fontSize:10,fontFamily:"monospace"}}>{d[labelKey]}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({emoji,label,value,sub,color="#22c55e"}) {
  return (
    <div style={{background:"#0a0a0a",border:`1px solid ${color}33`,borderRadius:12,padding:"14px 16px",flex:1,minWidth:130}}>
      <div style={{fontSize:18,marginBottom:5}}>{emoji}</div>
      <div style={{color,fontWeight:800,fontSize:20,fontFamily:"monospace"}}>{value}</div>
      <div style={{color:"#e5e7eb",fontSize:13,fontWeight:600,marginTop:2}}>{label}</div>
      {sub&&<div style={{color:"#4b5563",fontSize:11,marginTop:2}}>{sub}</div>}
    </div>
  );
}

function StatsDash({deals}) {
  const won = deals.filter(d=>d.stage==="Won").reduce((s,d)=>s+d.val,0);
  const pipe = deals.filter(d=>d.stage!=="Lost").reduce((s,d)=>s+d.val,0);
  const mrr = [{m:"Mar",v:0},{m:"Apr",v:49},{m:"May",v:98},{m:"Jun",v:198},{m:"Jul",v:347},{m:"Aug",v:546}];
  const health = [{w:"W1",v:74},{w:"W3",v:76},{w:"W5",v:80},{w:"W7",v:84},{w:"W9",v:88},{w:"W12",v:91}];
  const posts = [{p:"TW",v:28,c:"#1da1f2"},{p:"LI",v:12,c:"#0077b5"},{p:"RD",v:8,c:"#ff4500"},{p:"Dev",v:4,c:"#3b49df"},{p:"HN",v:2,c:"#ff6600"}];

  return (
    <div style={{padding:20,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:12,marginBottom:14}}>📊 LIVE DASHBOARD — Grassion Growth</div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <StatCard emoji="💰" label="MRR" value={`$${won}`} sub="Monthly recurring" color="#22c55e"/>
        <StatCard emoji="👥" label="Customers" value={deals.filter(d=>d.stage==="Won").length} sub="Paying" color="#3b82f6"/>
        <StatCard emoji="🎯" label="Pipeline" value={`$${pipe}/mo`} sub={`${deals.filter(d=>d.stage==="New Lead").length} leads`} color="#f59e0b"/>
        <StatCard emoji="📱" label="Posts" value="54" sub="All platforms" color="#ec4899"/>
        <StatCard emoji="🏥" label="Health" value="91/100" sub="Codebase" color="#a855f7"/>
        <StatCard emoji="🚀" label="ARR" value={`$${won*12}`} sub="Projection" color="#f59e0b"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:14}}>
          <div style={{color:"#22c55e",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:10}}>💰 MRR GROWTH ($)</div>
          <SimpleLine data={mrr} color="#22c55e" labelKey="m"/>
        </div>
        <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:14}}>
          <div style={{color:"#a855f7",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:10}}>🏥 CODEBASE HEALTH</div>
          <SimpleLine data={health} color="#a855f7" labelKey="w"/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:14}}>
          <div style={{color:"#ec4899",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:10}}>📱 POSTS BY PLATFORM</div>
          <SimpleBar data={posts}/>
        </div>
        <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:14}}>
          <div style={{color:"#3b82f6",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:10}}>🎯 SALES PIPELINE</div>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:4}}>
            {DEAL_STAGES.slice(0,5).map(s=>{
              const n=deals.filter(d=>d.stage===s).length;
              const pct=Math.round(n/Math.max(deals.length,1)*100);
              return (
                <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:80,color:"#6b7280",fontSize:11,flexShrink:0}}>{s}</div>
                  <div style={{flex:1,background:"#111",borderRadius:4,height:14,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:STAGE_CLR[s],borderRadius:4}}/>
                  </div>
                  <div style={{width:16,color:"#9ca3af",fontSize:11,textAlign:"right"}}>{n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatArea({agent, messages, isTyping, onSend, onReport, creds, generatingImg, generatedImgs}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const a = AGENTS[agent];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,isTyping]);

  const QUICK = {
    ssd: ["What should I focus on today?","Full status report","Top 3 risks right now","Path to first 10 customers"],
    zeus:["Generate today's LinkedIn post + image","Write Twitter thread on AI coding ROI","Reddit post for r/ExperiencedDevs","Find 5 CTOs + write cold emails"],
    aria:["Find all bugs in Grassion code","Fix Settings.tsx TypeScript error","Security audit","Check slow API queries"],
    nova:["Write SEO blog: Is Copilot Worth It?","Improve grassion.com homepage copy","Plan 5-email welcome sequence","Write launch press release"],
    rex: ["Write cold email to Tara AI CTO","Handle: we'll build this ourselves","LinkedIn DM to WarpBuild CTO","5-touch follow-up sequence"],
    finn:["Project MRR Month 3/6/12","Path to ₹7L/month","Unit economics","Top revenue risks"],
  };

  const send = () => { if(!input.trim()) return; onSend(input.trim()); setInput(""); };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${a.border}33`,background:a.bg,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <span style={{fontSize:22}}>{a.emoji}</span>
        <div style={{flex:1}}>
          <div style={{color:a.color,fontWeight:800,fontSize:15,fontFamily:"monospace"}}>{a.name} <span style={{fontSize:11,color:"#6b7280",fontWeight:400}}>· {a.title}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:1}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",animation:"pulse2 2s infinite"}}/>
            <span style={{color:"#4b5563",fontSize:11}}>Active · Full Grassion context</span>
          </div>
        </div>
        {agent!=="ssd" && (
          <button onClick={()=>onReport(agent)} style={{background:a.color+"22",border:`1px solid ${a.border}55`,color:a.color,padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>
            📤 Report to SSD
          </button>
        )}
      </div>

      {messages.length===0 && (
        <div style={{padding:"12px 18px",borderBottom:"1px solid #0d0d0d",flexShrink:0}}>
          <div style={{color:"#374151",fontSize:10,fontFamily:"monospace",marginBottom:7,textTransform:"uppercase"}}>Quick Commands</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {(QUICK[agent]||[]).map((q,i)=>(
              <button key={i} onClick={()=>onSend(q)} style={{background:a.bg,border:`1px solid ${a.border}44`,color:a.accent,padding:"5px 12px",borderRadius:18,fontSize:11,cursor:"pointer",fontFamily:"monospace"}}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8}}>
            {m.role==="assistant" && (
              <div style={{width:26,height:26,borderRadius:"50%",background:a.bg,border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginTop:2}}>{a.emoji}</div>
            )}
            <div style={{maxWidth:"82%"}}>
              <div style={{padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 3px 16px":"3px 16px 16px 16px",background:m.role==="user"?"#1f2937":a.bg,border:`1px solid ${m.role==="user"?"#374151":a.border+"44"}`,color:m.role==="user"?"#e5e7eb":a.accent,fontSize:13,lineHeight:1.7,fontFamily:m.role==="assistant"?"monospace":"inherit",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {m.role==="assistant" && <div style={{color:a.color,fontSize:10,fontWeight:800,marginBottom:4}}>{a.name}</div>}
                {m.content}
              </div>
              {m.role==="assistant" && m.content?.includes("[DALLE:") && (
                <div style={{marginTop:6}}>
                  {generatingImg
                    ? <div style={{background:a.bg,border:`1px solid ${a.border}44`,borderRadius:8,padding:10,color:a.color,fontSize:11,fontFamily:"monospace"}}>🎨 Generating image with DALL-E 3...</div>
                    : generatedImgs[i]
                    ? <img src={generatedImgs[i]} style={{width:"100%",borderRadius:8}} alt="Generated by DALL-E"/>
                    : !creds?.openai?.api_key && <div style={{color:"#4b5563",fontSize:11}}>Add OpenAI key in Credentials to generate images</div>
                  }
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{display:"flex",gap:8}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:a.bg,border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{a.emoji}</div>
            <div style={{background:a.bg,border:`1px solid ${a.border}44`,borderRadius:"3px 16px 16px 16px"}}><Dots c={a.color}/></div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div style={{padding:"10px 16px",borderTop:`1px solid ${a.border}22`,display:"flex",gap:8,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder={`Message ${a.name}...`}
          style={{flex:1,background:"#0a0a0a",border:`1px solid ${a.border}55`,borderRadius:10,padding:"10px 14px",color:a.accent,fontSize:13,outline:"none",fontFamily:"monospace"}}/>
        <button onClick={send} style={{background:a.color,border:"none",borderRadius:10,padding:"10px 20px",color:"#000",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>
          SEND
        </button>
      </div>
    </div>
  );
}

function SSDInbox({reports, onGetAll, collecting}) {
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");
  const sorted = [...reports.filter(r=>filter==="all"||r.agentId===filter)].reverse();

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 18px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>👑</span>
          <div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:800,fontSize:14}}>SSD INBOX</div>
          <div style={{background:"#f59e0b22",color:"#f59e0b",fontSize:10,padding:"2px 7px",borderRadius:10}}>{reports.length}</div>
        </div>
        <button onClick={onGetAll} disabled={collecting}
          style={{background:collecting?"#374151":"#f59e0b22",border:"1px solid #f59e0b44",color:collecting?"#6b7280":"#f59e0b",padding:"6px 14px",borderRadius:7,cursor:collecting?"not-allowed":"pointer",fontSize:11,fontFamily:"monospace"}}>
          {collecting?"Collecting...":"📡 Get All Reports"}
        </button>
      </div>
      <div style={{padding:"7px 18px",borderBottom:"1px solid #0d0d0d",display:"flex",gap:5,flexShrink:0}}>
        {[["all","All"],["zeus","⚡ ZEUS"],["aria","⚙️ ARIA"],["nova","📣 NOVA"],["rex","🎯 REX"],["finn","💰 FINN"]].map(([id,l])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{background:filter===id?"#111":"transparent",border:`1px solid ${filter===id?"#374151":"transparent"}`,color:filter===id?"#e5e7eb":"#4b5563",padding:"3px 10px",borderRadius:5,cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:8}}>
        {sorted.length===0 && (
          <div style={{textAlign:"center",padding:50}}>
            <div style={{fontSize:36,marginBottom:12}}>📭</div>
            <div style={{color:"#4b5563",fontSize:14}}>No reports yet.</div>
            <div style={{color:"#374151",fontSize:12,marginTop:6}}>Click "Get All Reports" to brief every agent.</div>
          </div>
        )}
        {sorted.map((r,i)=>{
          const a = AGENTS[r.agentId];
          const isExp = !!expanded[i];
          const summary = r.content.split("\n").filter(l=>l.trim()).slice(0,2).join(" ").slice(0,150)+"...";
          return (
            <div key={i} style={{background:a.bg,border:`1px solid ${a.border}44`,borderRadius:10,overflow:"hidden"}}>
              <div onClick={()=>setExpanded(p=>({...p,[i]:!p[i]}))} style={{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#0a0a0a",border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{a.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{color:a.color,fontWeight:800,fontSize:12,fontFamily:"monospace"}}>{a.name}</span>
                    <span style={{color:"#4b5563",fontSize:10}}>{a.title}</span>
                    <span style={{color:"#374151",fontSize:10,marginLeft:"auto"}}>{new Date(r.timestamp).toLocaleString("en-IN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  {!isExp && <div style={{color:a.accent,fontSize:12,lineHeight:1.5,fontFamily:"monospace"}}>{summary}</div>}
                </div>
                <div style={{color:"#374151",fontSize:14,flexShrink:0}}>{isExp?"▲":"▼"}</div>
              </div>
              {isExp && (
                <div style={{padding:"0 14px 14px 52px"}}>
                  <div style={{background:"#050505",border:`1px solid ${a.border}22`,borderRadius:7,padding:12,color:a.accent,fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"monospace"}}>
                    {r.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Pipeline({deals, setDeals, onAskRex, creds}) {
  const [drafting, setDrafting] = useState(null);
  const [draft, setDraft] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);

  const genOutreach = async (deal) => {
    setDrafting(deal.id); setDraftLoading(true); setDraft("");
    try {
      const prompt = `Write for ${deal.co} (Contact: ${deal.contact}, LinkedIn: ${deal.li}, Notes: ${deal.note}):\n1. LINKEDIN DM (under 280 chars, from founder's personal account)\n2. COLD EMAIL (subject + body)\nBoth hyper-personalized to what ${deal.co} specifically does.`;
      const resp = await callAI(AGENTS.rex.prompt, [{role:"user",content:prompt}], creds);
      setDraft(resp);
    } catch(e) { setDraft(`Error: ${e.message}`); }
    setDraftLoading(false);
  };

  const move = (id, dir) => setDeals(prev=>prev.map(d=>{
    if(d.id!==id) return d;
    const idx = DEAL_STAGES.indexOf(d.stage);
    return {...d, stage:DEAL_STAGES[Math.max(0,Math.min(DEAL_STAGES.length-1,idx+dir))]};
  }));

  const won = deals.filter(d=>d.stage==="Won").reduce((s,d)=>s+d.val,0);

  return (
    <div style={{display:"flex",height:"100%"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"10px 18px",borderBottom:"1px solid #0d0d0d",display:"flex",gap:16,alignItems:"center",flexShrink:0}}>
          {[{l:"Won MRR",v:`$${won}/mo`,c:"#22c55e"},{l:"Total Leads",v:deals.length,c:"#9ca3af"},{l:"Active",v:deals.filter(d=>!["New Lead","Won","Lost"].includes(d.stage)).length,c:"#f59e0b"}].map((s,i)=>(
            <div key={i}><div style={{color:s.c,fontWeight:800,fontSize:17,fontFamily:"monospace"}}>{s.v}</div><div style={{color:"#4b5563",fontSize:10}}>{s.l}</div></div>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {DEAL_STAGES.filter(s=>deals.some(d=>d.stage===s)).map(stage=>(
            <div key={stage}>
              <div style={{padding:"6px 18px",background:"#050505",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:STAGE_CLR[stage]}}/>
                <span style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:1}}>{stage}</span>
              </div>
              {deals.filter(d=>d.stage===stage).map(deal=>(
                <div key={deal.id} style={{padding:"10px 18px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:7,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🏢</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:"#e5e7eb",fontWeight:600,fontSize:13}}>{deal.co}</div>
                    <div style={{color:"#6b7280",fontSize:11}}>{deal.contact} · {deal.note?.slice(0,45)}</div>
                  </div>
                  <div style={{background:"#16a34a22",color:"#22c55e",fontSize:11,fontFamily:"monospace",padding:"2px 7px",borderRadius:4}}>${deal.val}/mo</div>
                  <div style={{display:"flex",gap:3}}>
                    <button onClick={()=>move(deal.id,-1)} style={{background:"#111",border:"1px solid #374151",color:"#6b7280",width:24,height:24,borderRadius:5,cursor:"pointer",fontSize:11}}>←</button>
                    <button onClick={()=>move(deal.id,1)} style={{background:"#111",border:"1px solid #374151",color:"#6b7280",width:24,height:24,borderRadius:5,cursor:"pointer",fontSize:11}}>→</button>
                  </div>
                  <button onClick={()=>genOutreach(deal)} style={{background:"#3b82f622",border:"1px solid #3b82f644",color:"#60a5fa",padding:"5px 10px",borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>✉ Draft</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {drafting && (
        <div style={{width:340,borderLeft:"1px solid #0d0d0d",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 14px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:700,fontSize:12}}>✉ {deals.find(d=>d.id===drafting)?.co}</div>
            <button onClick={()=>setDrafting(null)} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{flex:1,padding:12,overflowY:"auto"}}>
            {draftLoading ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:24}}><Dots c="#3b82f6"/><div style={{color:"#4b5563",fontSize:12}}>REX writing personalized outreach...</div></div>
            : <pre style={{color:"#93c5fd",fontSize:12,fontFamily:"monospace",whiteSpace:"pre-wrap",lineHeight:1.7,margin:0}}>{draft}</pre>}
          </div>
          {draft && (
            <div style={{padding:12,borderTop:"1px solid #0d0d0d",display:"flex",gap:7}}>
              <button onClick={()=>navigator.clipboard?.writeText(draft)} style={{flex:1,background:"#3b82f622",border:"1px solid #3b82f644",color:"#60a5fa",padding:8,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>📋 Copy</button>
              <button onClick={()=>onAskRex(`Improve: ${draft}`)} style={{flex:1,background:"#111",border:"1px solid #374151",color:"#9ca3af",padding:8,borderRadius:7,cursor:"pointer",fontSize:11}}>Ask REX</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CredsPanel({creds, onSave}) {
  const [local, setLocal] = useState(creds || {});
  const [saved, setSaved] = useState(false);
  const setF = (p,k,v) => setLocal(prev=>({...prev,[p]:{...(prev[p]||{}),[k]:v}}));

  const SECS = [
    {id:"openai",name:"OpenAI API",icon:"🤖",color:"#10a37f",note:"Powers agents + DALL-E image generation",fields:[{k:"api_key",l:"API Key (sk-...)"}],guide:"platform.openai.com → API Keys → Create"},
    {id:"github",name:"GitHub — Live Code Access",icon:"🐙",color:"#e5e7eb",note:"Lets ARIA read your actual code files",fields:[{k:"token",l:"Token (ghp_...)"},{k:"repo",l:"Repo: saisnatadash/grassion"}],guide:"github.com/settings/tokens → Generate → repo scope"},
    {id:"twitter",name:"Twitter / X",icon:"🐦",color:"#1da1f2",note:"ZEUS auto-posts from your account",fields:[{k:"api_key",l:"API Key"},{k:"api_secret",l:"API Secret"},{k:"access_token",l:"Access Token"},{k:"access_secret",l:"Access Secret"}],guide:"developer.twitter.com → Project → App → Keys & Tokens"},
    {id:"reddit",name:"Reddit",icon:"🤖",color:"#ff4500",note:"ZEUS posts to subreddits",fields:[{k:"client_id",l:"Client ID"},{k:"client_secret",l:"Client Secret"},{k:"username",l:"Username"},{k:"password",l:"Password"}],guide:"reddit.com/prefs/apps → Create App (script type)"},
    {id:"devto",name:"Dev.to + Hashnode",icon:"📝",color:"#3b49df",note:"ZEUS publishes articles",fields:[{k:"devto_key",l:"Dev.to API Key"},{k:"hashnode_token",l:"Hashnode Token"}],guide:"dev.to/settings/extensions | hashnode.com/settings/developer"},
    {id:"linkedin",name:"LinkedIn (Manual Send)",icon:"💼",color:"#0077b5",note:"ZEUS writes posts & DMs → you send from your personal account",fields:[{k:"profile_url",l:"Your LinkedIn URL"}],guide:"⚠️ LinkedIn bans bots for DMs. ZEUS writes copy → you paste + send. Protects your account."},
  ];

  return (
    <div style={{padding:18,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700,fontSize:13,marginBottom:4}}>🔑 CREDENTIALS VAULT</div>
      <div style={{color:"#4b5563",fontSize:12,marginBottom:16}}>Saved in browser. OpenAI key activates GPT-4o + image generation. Others enable auto-posting.</div>
      <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:580}}>
        {SECS.map(s=>(
          <div key={s.id} style={{background:"#0a0a0a",border:`1px solid ${s.color}33`,borderRadius:10,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
              <span style={{fontSize:18}}>{s.icon}</span>
              <div style={{color:"#e5e7eb",fontWeight:600,fontSize:13}}>{s.name}</div>
              {local[s.id]?.[s.fields[0].k] && <div style={{marginLeft:"auto",background:"#16a34a22",color:"#22c55e",fontSize:10,padding:"2px 7px",borderRadius:8}}>✓ Set</div>}
            </div>
            <div style={{color:"#4b5563",fontSize:11,marginBottom:6}}>📍 {s.guide}</div>
            <div style={{color:s.color,fontSize:11,marginBottom:8,fontStyle:"italic"}}>{s.note}</div>
            {s.fields.map(f=>(
              <div key={f.k} style={{marginBottom:6}}>
                <div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:3}}>{f.l}</div>
                <input type={f.k.includes("url")||f.k==="repo"?"text":"password"} value={local[s.id]?.[f.k]||""} onChange={e=>setF(s.id,f.k,e.target.value)}
                  placeholder={f.l} style={{width:"100%",background:"#111",border:"1px solid #1f2937",borderRadius:7,padding:"8px 11px",color:"#e5e7eb",fontSize:12,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
        ))}
        <button onClick={()=>{onSave(local);setSaved(true);setTimeout(()=>setSaved(false),2000);}}
          style={{background:"#f59e0b",border:"none",borderRadius:9,padding:12,color:"#000",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"monospace"}}>
          {saved?"✅ SAVED!":"SAVE ALL CREDENTIALS"}
        </button>
      </div>
    </div>
  );
}

function DeployGuide() {
  const steps = [
    {n:"01",c:"#22c55e",t:"Deploy agents.grassion.com — FREE",code:`Give Claude Code in VS Code:

"Create apps/agents in grassion monorepo as a Vite React app.
1. package.json with react + react-dom + vite
2. index.html + src/main.jsx + src/App.jsx
3. Copy grassion_hq_final.jsx into src/
4. vercel.json for SPA routing
5. npm run build must work

git add apps/agents
git commit -m 'feat: agents dashboard'
git push"

Then: vercel.com → New Project → Root Directory: apps/agents → Deploy
Then: Vercel Domains → Add agents.grassion.com
Then: Cloudflare DNS → CNAME: agents → cname.vercel-dns.com (grey cloud)`},
    {n:"02",c:"#ec4899",t:"ZEUS Auto-Posting on Fly.io",code:`Give Claude Code:

"Add scheduler at apps/api/src/scheduler/zeus.ts
node-cron jobs:
- 8am IST: post from zeus_queue where platform='twitter' (Twitter API v2)
- 12pm IST: post where platform='reddit' (Reddit API)
- 6pm IST: post where platform='devto' (Dev.to API)
- Monday 9am: send from zeus_outreach via Resend

CREATE TABLE zeus_queue (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, platform TEXT, content TEXT, image_url TEXT, status TEXT DEFAULT 'queued', scheduled_for TIMESTAMPTZ, posted_at TIMESTAMPTZ);
CREATE TABLE zeus_outreach (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, company TEXT, email TEXT, subject TEXT, body TEXT, status TEXT DEFAULT 'queued', sent_at TIMESTAMPTZ);

Deploy: fly deploy --app grassion-api"`},
    {n:"03",c:"#a855f7",t:"Set API Keys on Fly.io",code:`flyctl secrets set \`
  TWITTER_ACCESS_TOKEN="your_token" \`
  TWITTER_ACCESS_SECRET="your_secret" \`
  TWITTER_API_KEY="your_key" \`
  TWITTER_API_SECRET="your_secret" \`
  REDDIT_CLIENT_ID="your_id" \`
  REDDIT_CLIENT_SECRET="your_secret" \`
  REDDIT_USERNAME="grassion_official" \`
  REDDIT_PASSWORD="your_password" \`
  DEVTO_API_KEY="your_key" \`
  --app grassion-api`},
    {n:"04",c:"#f59e0b",t:"Daily SSD Email Report at 9pm",code:`Give Claude Code:

"Add daily email at apps/api/src/scheduler/ssd-daily.ts
Every 9pm IST via Resend to founder email:
Subject: SSD Daily Report — [date]
Content: ZEUS posts today, outreach sent, any API errors, new Razorpay payments, codebase health score
Deploy: fly deploy --app grassion-api"`},
  ];
  return (
    <div style={{padding:18,overflowY:"auto",height:"100%",display:"flex",flexDirection:"column",gap:12}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:12}}>🚀 DEPLOYMENT — Make Everything Always-On</div>
      {steps.map((s,i)=>(
        <div key={i} style={{background:"#0a0a0a",border:`1px solid ${s.c}33`,borderRadius:10,padding:16}}>
          <div style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{color:s.c,fontFamily:"monospace",fontSize:26,fontWeight:900,opacity:.4,flexShrink:0}}>{s.n}</div>
            <div style={{color:"#e5e7eb",fontWeight:700,fontSize:13,paddingTop:4}}>{s.t}</div>
          </div>
          <pre style={{background:"#050505",border:`1px solid ${s.c}22`,borderRadius:7,padding:12,color:s.c,fontSize:11,fontFamily:"monospace",overflowX:"auto",margin:0,whiteSpace:"pre-wrap",lineHeight:1.6}}>{s.code}</pre>
        </div>
      ))}
    </div>
  );
}

function GithubPanel({creds, onContextLoaded}) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const KEY_FILES = ["apps/api/src/routes/metrics.ts","apps/api/src/routes/analytics.ts","apps/web/src/pages/Settings.tsx","apps/web/src/pages/Health.tsx","apps/web/src/pages/Dashboard.tsx"];

  const fetchAll = async () => {
    setLoading(true);
    const token = creds?.github?.token;
    const repo = creds?.github?.repo || "saisnatadash/grassion";
    const results = {};
    for(const path of KEY_FILES) {
      try {
        const headers = token ? {Authorization:`token ${token}`} : {};
        const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {headers});
        const d = await r.json();
        if(d.content) results[path] = atob(d.content.replace(/\n/g,"")).slice(0,800)+"...[truncated]";
      } catch {}
    }
    setFiles(results); setLoaded(true); setLoading(false);
    onContextLoaded(Object.entries(results).map(([p,c])=>`\n---${p}---\n${c}`).join("\n"));
  };

  return (
    <div style={{padding:18,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#22c55e",fontFamily:"monospace",fontWeight:700,fontSize:13,marginBottom:4}}>🐙 LIVE GITHUB CODEBASE</div>
      <div style={{color:"#4b5563",fontSize:12,marginBottom:14}}>Load your real code so ARIA gives exact bug fixes with file names + line numbers.</div>
      <button onClick={fetchAll} disabled={loading}
        style={{background:loading?"#374151":loaded?"#16a34a22":"#e5e7eb22",border:`1px solid ${loaded?"#16a34a44":"#e5e7eb44"}`,color:loading?"#6b7280":loaded?"#22c55e":"#e5e7eb",padding:"9px 22px",borderRadius:9,cursor:loading?"not-allowed":"pointer",fontSize:13,fontFamily:"monospace",marginBottom:16}}>
        {loading?"⏳ Fetching...":loaded?"✅ Loaded — Refresh":"🐙 Load Live Codebase"}
      </button>
      {loaded && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{color:"#22c55e",fontSize:12,fontFamily:"monospace"}}>✅ {Object.keys(files).length} files loaded into ARIA + SSD memory</div>
          {Object.entries(files).map(([path,content])=>(
            <div key={path} style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:7,padding:12}}>
              <div style={{color:"#22c55e",fontFamily:"monospace",fontSize:11,marginBottom:5}}>📄 {path}</div>
              <pre style={{color:"#374151",fontSize:10,fontFamily:"monospace",margin:0,whiteSpace:"pre-wrap"}}>{content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GrassionHQ() {
  const [activeAgent, setActiveAgent] = useState("ssd");
  const [convs, setConvs] = useState({ssd:[],zeus:[],aria:[],nova:[],rex:[],finn:[]});
  const [typing, setTyping] = useState({});
  const [newMsg, setNewMsg] = useState({});
  const [reports, setReports] = useState([]);
  const [creds, setCreds] = useState({});
  const [deals, setDeals] = useState(INIT_DEALS);
  const [tab, setTab] = useState("stats");
  const [collecting, setCollecting] = useState(false);
  const [ghCtx, setGhCtx] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatedImgs, setGeneratedImgs] = useState({});

  // Load saved data
  useEffect(() => {
    try {
      const savedConvs = JSON.parse(localStorage.getItem("hqf_convs")||"null");
      if(savedConvs) setConvs(savedConvs);
      const savedReports = JSON.parse(localStorage.getItem("hqf_reports")||"null");
      if(savedReports) setReports(savedReports);
      const savedCreds = JSON.parse(localStorage.getItem("hqf_creds")||"null");
      if(savedCreds) setCreds(savedCreds);
      const savedDeals = JSON.parse(localStorage.getItem("hqf_deals")||"null");
      if(savedDeals) setDeals(savedDeals);
    } catch {}
  }, []);

  const sysPrompt = useCallback((id) => {
    let s = AGENTS[id].prompt;
    if(ghCtx && (id==="aria"||id==="ssd")) s += `\n\nLIVE CODEBASE:\n${ghCtx}`;
    return s;
  }, [ghCtx]);

  const sendMsg = useCallback(async (agentId, text) => {
    const h = convs[agentId] || [];
    const uMsg = {role:"user", content:text};
    const newC = {...convs, [agentId]:[...h, uMsg]};
    setConvs(newC);
    setTyping(p=>({...p,[agentId]:true}));
    try {
      const resp = await callAI(sysPrompt(agentId), [...h, uMsg], creds);
      const aMsg = {role:"assistant", content:resp};
      const final = {...newC, [agentId]:[...newC[agentId], aMsg]};
      setConvs(final);
      try { localStorage.setItem("hqf_convs", JSON.stringify(final)); } catch {}
      if(agentId !== activeAgent) setNewMsg(p=>({...p,[agentId]:true}));
      // Generate image if DALL-E prompt detected
      if(agentId==="zeus" && resp.includes("[DALLE:") && creds?.openai?.api_key) {
        const match = resp.match(/\[DALLE:(.*?)\]/s);
        if(match) {
          setGeneratingImg(true);
          const msgIdx = final[agentId].length - 1;
          const url = await genImage(match[1].trim(), creds.openai.api_key);
          if(url) setGeneratedImgs(p=>({...p,[msgIdx]:url}));
          setGeneratingImg(false);
        }
      }
    } catch(e) {
      const errC = {...newC, [agentId]:[...newC[agentId], {role:"assistant",content:`⚠️ Error: ${e.message}`}]};
      setConvs(errC);
    }
    setTyping(p=>({...p,[agentId]:false}));
  }, [convs, activeAgent, creds, sysPrompt]);

  const requestReport = useCallback(async (agentId) => {
    setTyping(p=>({...p,[agentId]:true}));
    try {
      const resp = await callAI(sysPrompt(agentId), [{role:"user",content:"Give SSD a brief daily report (max 5 bullet points): top finding, key action, what founder should do next, any blocker."}], creds);
      const report = {agentId, content:resp, timestamp:Date.now()};
      const newR = [...reports, report];
      setReports(newR);
      try { localStorage.setItem("hqf_reports", JSON.stringify(newR)); } catch {}
      setNewMsg(p=>({...p,ssd:true}));
    } catch(e) { console.error(e); }
    setTyping(p=>({...p,[agentId]:false}));
  }, [reports, creds, sysPrompt]);

  const getAllReports = useCallback(async () => {
    setCollecting(true);
    for(const id of ["zeus","aria","nova","rex","finn"]) {
      await requestReport(id);
    }
    setCollecting(false);
  }, [requestReport]);

  const select = (id) => { setActiveAgent(id); setNewMsg(p=>({...p,[id]:false})); };

  const saveCreds = (c) => {
    setCreds(c);
    try { localStorage.setItem("hqf_creds", JSON.stringify(c)); } catch {}
  };

  const aiMode = creds?.openai?.api_key ? "GPT-4o" : "Claude";
  const TABS = [["stats","📊 Stats"],["agents","👥 Agents"],["inbox","📬 SSD Inbox"],["sales","🎯 Sales"],["github","🐙 GitHub"],["creds","🔑 Keys"],["deploy","🚀 Deploy"]];

  return (
    <div style={{background:"#030303",height:"100vh",color:"#e5e7eb",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box;} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#0a0a0a} ::-webkit-scrollbar-thumb{background:#374151;border-radius:4px}`}</style>

      {/* Header */}
      <div style={{padding:"9px 18px",borderBottom:"1px solid #0d0d0d",background:"#050505",display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap"}}>
        <span style={{fontSize:20}}>🌱</span>
        <div style={{marginRight:8}}>
          <div style={{color:"#22c55e",fontWeight:900,fontSize:16,fontFamily:"monospace",letterSpacing:1}}>GRASSION HQ</div>
          <div style={{color:"#374151",fontSize:10,fontFamily:"monospace"}}>6 AI Agents · DALL-E · Live GitHub</div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?"#111":"transparent",border:`1px solid ${tab===t?"#374151":"transparent"}`,color:tab===t?"#e5e7eb":"#4b5563",padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>
              {l}{t==="inbox"&&reports.length>0?` (${reports.length})`:""}
              {t==="agents"&&Object.values(newMsg).some(Boolean)?" 🔴":""}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:7,fontSize:10,fontFamily:"monospace"}}>
          <span style={{background:creds?.openai?.api_key?"#10a37f22":"#22c55e22",color:creds?.openai?.api_key?"#10a37f":"#22c55e",padding:"3px 9px",borderRadius:8,border:`1px solid ${creds?.openai?.api_key?"#10a37f44":"#22c55e44"}`}}>{aiMode}</span>
          {creds?.openai?.api_key && <span style={{background:"#6366f122",color:"#818cf8",padding:"3px 9px",borderRadius:8,border:"1px solid #6366f144"}}>🎨 DALL-E</span>}
          {ghCtx && <span style={{background:"#e5e7eb11",color:"#9ca3af",padding:"3px 9px",borderRadius:8,border:"1px solid #37414155"}}>🐙 Live Code</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        {tab==="stats" && <StatsDash deals={deals}/>}
        {tab==="agents" && (
          <>
            <div style={{width:185,borderRight:"1px solid #0d0d0d",padding:9,display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flexShrink:0}}>
              <div style={{color:"#374151",fontSize:9,fontFamily:"monospace",padding:"3px",textTransform:"uppercase",letterSpacing:1}}>Your AI Team</div>
              {Object.keys(AGENTS).map(id=>{
                const a = AGENTS[id];
                return (
                  <button key={id} onClick={()=>select(id)} style={{background:activeAgent===id?a.bg:"transparent",border:`1px solid ${activeAgent===id?a.border:"#1f2937"}`,borderRadius:7,padding:"8px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,textAlign:"left",position:"relative"}}>
                    {newMsg[id] && <div style={{position:"absolute",top:5,right:5,width:5,height:5,borderRadius:"50%",background:a.color,animation:"pulse2 1.5s infinite"}}/>}
                    <span style={{fontSize:16}}>{a.emoji}</span>
                    <div>
                      <div style={{color:a.color,fontWeight:700,fontSize:12,fontFamily:"monospace"}}>{a.name}</div>
                      <div style={{color:"#374151",fontSize:10}}>{a.title.split("—")[0].trim()}</div>
                    </div>
                  </button>
                );
              })}
              <div style={{borderTop:"1px solid #111",paddingTop:8,marginTop:2}}>
                <div style={{color:"#374151",fontSize:9,fontFamily:"monospace",marginBottom:5,textTransform:"uppercase"}}>Brief All → SSD</div>
                {["zeus","aria","nova","rex","finn"].map(id=>{
                  const a=AGENTS[id];
                  return (
                    <button key={id} onClick={()=>requestReport(id)} style={{display:"flex",alignItems:"center",gap:5,width:"100%",background:"transparent",border:"none",color:"#4b5563",padding:"3px 0",cursor:"pointer",fontSize:10,textAlign:"left"}}>
                      <span>{a.emoji}</span><span style={{color:a.color}}>{a.name}</span>→SSD
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <ChatArea
                agent={activeAgent}
                messages={convs[activeAgent]||[]}
                isTyping={!!typing[activeAgent]}
                onSend={msg=>sendMsg(activeAgent,msg)}
                onReport={requestReport}
                creds={creds}
                generatingImg={generatingImg}
                generatedImgs={generatedImgs}
              />
            </div>
          </>
        )}
        {tab==="inbox" && <SSDInbox reports={reports} onGetAll={getAllReports} collecting={collecting}/>}
        {tab==="sales" && <Pipeline deals={deals} setDeals={d=>{setDeals(d);try{localStorage.setItem("hqf_deals",JSON.stringify(d));}catch{}}} onAskRex={msg=>{setTab("agents");select("rex");sendMsg("rex",msg);}} creds={creds}/>}
        {tab==="github" && <GithubPanel creds={creds} onContextLoaded={setGhCtx}/>}
        {tab==="creds" && <CredsPanel creds={creds} onSave={saveCreds}/>}
        {tab==="deploy" && <DeployGuide/>}
      </div>
    </div>
  );
}