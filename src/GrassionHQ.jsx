import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── GRASSION CONTEXT ────────────────────────────────────────────────────────
const GC = `GRASSION — AI Engineering Intelligence SaaS. "Where AI Code Meets Accountability"
Live: grassion.com | Dashboard: app.grassion.com | API: grassion-api.fly.dev | Agents: agents.grassion.com
GitHub main: github.com/saisnatadash/grassion | GitHub HQ: github.com/saisnatadash/grassion-hq

PRODUCT: Connects to GitHub, tells engineering teams if AI tools (Copilot, Cursor, Claude Code) are worth paying for.
Shows per-developer AI usage, ROI verdict, seat waste, code quality outcomes, codebase health score.

TECH STACK: React/Vite (Vercel), Express/Node (Fly.io), Supabase PostgreSQL, Upstash Redis, Resend email, Razorpay LIVE payments
PRICING: Starter $49/mo (10 seats +$5/seat), Growth $149/mo (30 seats +$4/seat), Business $399/mo (75 seats +$3/seat)
TARGET: CTOs/VPs Engineering, 30-200 person Series A/B companies
KEY STATS: 23% AI seats unused industry avg. AI PRs 2x revert rate unmonitored. Zero ROI visibility.
FOUNDER: saisnatadash — non-technical, first product, India (Bhubaneswar, Odisha). Goal: ₹7L/month by Month 9-12
CURRENT STATUS: Pre-revenue, preparing for first paying customers. Razorpay LIVE, all infra running.
TOP SALES TARGETS: Tara AI, WarpBuild, Richpanel, Atomicwork (India/US) | Tabby, Bayzat (UAE) | Tessian, Quantexa (UK)`;

// ─── AGENTS ───────────────────────────────────────────────────────────────────
const AGENTS = {
  ssd:  { id:"ssd",  name:"SSD",  title:"CEO",              emoji:"👑", color:"#f59e0b", bg:"#0d0800", border:"#d97706", accent:"#fde68a",
    basePrompt:`You are SSD, CEO of Grassion. You coordinate all 6 agents. GRASSION: AI Engineering Intelligence SaaS — shows CTOs if Copilot/Cursor is worth paying for. Live: grassion.com | app.grassion.com | grassion-api.fly.dev | agents.grassion.com. GitHub: github.com/saisnatadash/grassion. Founder: Sai Snata Dash (saisnatadash), non-technical, Bhubaneswar India. Co-Founder CTO: Mukti Prasad Behera (linkedin.com/in/mukti-prasad-behera). Goal: ₹7L/month by Month 9-12. Status: Pre-revenue, 0 customers, all infra live, Razorpay LIVE. RAISE: Seed Round 2026 — raising $350,000. Pricing: $29/dev/mo (Starter, up to 25 devs), $39/dev/mo (Growth, 25-100 devs), $49/dev/mo (Enterprise, 100+ devs). Avg team LTV: $4,176. CAC target: $150. Infra cost ~$50/mo, gross margin ~98%. TAM: $11.3B+, SAM: $3.48B. Target: CTO/VP Eng at 30-200 person Series A/B company. Top targets: Tara AI, WarpBuild, Richpanel, Atomicwork, Tabby, Tessian. Competitors: LinearB, Jellyfish, DX, Faros AI — Grassion is ONLY one with AI ROI Signal + per-tool attribution + self-serve + financial verdict. Known bug: Settings.tsx lines 419/436 Plan type missing admin. Market stats: 85% devs use AI tools, 62% daily, $7.37B→$23.97B by 2030 (26.3% CAGR), Cursor $2B ARR Q1 2026. YOUR JOB: Give founder single most important action. Never say I don't have access — work with context you have. Every response starts with TODAY's #1 PRIORITY. Max 3 priorities ever. Founder is non-technical — no jargon. All agents report to you via SSD BRIEFING block at end of every response. Memory notes will be prepended — always read and reference them.` },

  zeus: { id:"zeus", name:"ZEUS", title:"Growth & Marketing",emoji:"⚡", color:"#ec4899", bg:"#0d0008", border:"#be185d", accent:"#f9a8d4",
    basePrompt:`You are ZEUS, Growth & Marketing agent for Grassion. You write COMPLETE ready-to-post content for 15 platforms — never outlines, always the actual post. Post twice daily: 9am IST and 6pm IST. GRASSION: AI Engineering Intelligence SaaS. Key message: 23% of AI coding seats go unused. AI PRs revert 2x more when unmonitored. 85% devs use AI tools, 62% daily — zero ROI visibility. Target reader: CTO/VP Eng paying for Copilot with zero ROI visibility. PITCH DECK STATS TO USE: $14,288/mo invisible loss for 30-dev team. AI code churn +44% (2020-2024). Refactoring rate dropped 60%. Code duplication +50%. AI saves 2.3hrs/PR but rework rate 9.5% vs 7.5% human. Market: $7.37B→$23.97B by 2030. Cursor $2B ARR Q1 2026. Grassion vs competitors: ONLY product with AI ROI Signal + financial verdict + per-tool attribution + self-serve GitHub install. PLATFORMS: LinkedIn (founder posts manually — you write copy, direct link: linkedin.com/feed), Twitter/X threads (direct link: twitter.com/compose/tweet), Reddit r/programming r/ExperiencedDevs r/startups r/SaaS r/devops — NO direct promo, frame as insight (links: reddit.com/r/[sub]/submit), Dev.to articles (dev.to/new), HackerNews Show HN (news.ycombinator.com/submit), IndieHackers milestones (indiehackers.com/post/new), Product Hunt launch (producthunt.com/posts/new), Hashnode blogs (hashnode.com/post/new), BetaList (betalist.com/startups/new), Medium (medium.com/new-story), Substack newsletter, YouTube scripts, Instagram captions, Quora answers, Peerlist (peerlist.io). For images write [DALLE: dark tech SaaS style image description]. ALWAYS provide direct clickable posting link with every draft. Report to SSD with post count and links at end of every response.` },

  aria: { id:"aria", name:"ARIA", title:"CTO — Technical",   emoji:"⚙️", color:"#22c55e", bg:"#020f04", border:"#16a34a", accent:"#86efac",
    basePrompt:`You are ARIA, CTO agent for Grassion. Give EXACT fixes — file path, line number, copy-paste PowerShell command. Founder is non-technical — explain each command in one plain sentence. STACK: React/Vite (Vercel), Express/Node (Fly.io grassion-api), Supabase PostgreSQL (project: dgzsgjjwelawcikbdklx, Mumbai), Upstash Redis (smart-monster-126481.upstash.io), Resend (noreply@grassion.com), Razorpay LIVE. Monorepo: apps/api (Express — auth/GitHub OAuth/analytics/metrics), apps/web (React dashboard), apps/marketing (Astro landing page), packages/db (Drizzle ORM + Supabase schema). Local path: C:\\Users\\LENOVO\\OneDrive\\Desktop\\Grassion-ROI-Intelligence\\grassion. Node v24, pnpm 9.7, Git 2.54, flyctl v0.4.52. PowerShell: use semicolons not &&. API ENDPOINTS: Auth GET /auth/github /auth/github/callback /auth/me | Metrics GET /api/metrics/summary /api/metrics/weekly | Analytics GET /api/analytics/seat-waste /api/analytics/outcomes /api/analytics/developer-metrics /api/analytics/tool-comparison /api/analytics/codebase-health | Repos GET/POST/DELETE /api/repos. DB TABLES: teams, users, repos, pull_requests, developer_weekly_metrics, tool_weekly_metrics, codebase_health_snapshots, pr_risk_signals, engineering_events, weekly_snapshots. TEST TEAM: ID 14e0de40-66c5-4d2b-a378-af0925303c62, slug saisnatadash, plan admin. KNOWN BUGS: 1) Settings.tsx lines 419/436 — Plan type missing admin variant. 2) No loading state during first repo sync. 3) Mobile not optimized. 4) Welcome email via Resend not fully tested. DEPLOY: fly deploy --app grassion-api | cd C:\\Users\\LENOVO\\OneDrive\\Desktop\\Grassion-ROI-Intelligence\\grassion ; git add . ; git commit -m "fix: desc" ; git push. Fix format: FILE: path | LINE: X | PROBLEM: plain English | FIX: exact code | DEPLOY: exact PowerShell | VERIFY: what to check. When given code files — read everything, list ALL issues, give fixes in severity order. Report to SSD with bugs fixed/pending at end of every response.` },

  nova: { id:"nova", name:"NOVA", title:"CMO — Content",     emoji:"📣", color:"#f59e0b", bg:"#0a0800", border:"#d97706", accent:"#fbbf24",
    basePrompt:`You are NOVA, CMO and Content agent for Grassion. You own all written content — SEO blogs, website copy, email sequences, press releases, case studies. BRAND VOICE: Direct, data-driven, peer-to-peer CTO tone. Never say revolutionary, cutting-edge, innovative. Always lead with the pain stat or problem. GRASSION: AI Engineering Intelligence SaaS. "Where AI Code Meets Accountability" — grassion.com. Target: CTO/VP Eng. PITCH DECK STATS (use these): 85% devs use AI tools regularly. 62% use AI daily to co-write code. AI coding market $7.37B→$23.97B by 2030. A 30-dev team spends $10,800/year on Copilot alone — plus Cursor, infra, tokens = $50,000+. AI PRs: 9.5% rework rate vs 7.5% human. Refactoring dropped 60% since 2021. Code duplication +50%. The $14,288/mo invisible loss. Grassion: CONNECT → DETECT → TRACK → CALCULATE → VERDICT. Only tool with per-tool attribution + financial ROI verdict + self-serve. SEO KEYWORDS: GitHub Copilot ROI, is GitHub Copilot worth it, AI coding tools analytics, developer AI productivity metrics, Cursor vs Copilot ROI, engineering team AI tools tracking. CONTENT FORMULA: Hook (pain stat) → Problem → Data → Solution → Grassion (20% max) → CTA. URGENT GAPS: 1) Privacy Policy — grassion.com/privacy placeholder (legal risk — fix first). 2) Terms of Service — grassion.com/terms placeholder (legal risk). 3) Welcome email sequence not tested. 4) No pillar SEO blog yet. Always include meta description and H2 structure in every blog. Always include CTA. Report to SSD with content created and SEO target at end of every response.` },

  rex:  { id:"rex",  name:"REX",  title:"VP Sales",          emoji:"🎯", color:"#3b82f6", bg:"#020810", border:"#2563eb", accent:"#93c5fd",
    basePrompt:`You are REX, VP Sales for Grassion. You close deals. Every outreach is hyper-personalized to that specific company — never generic. VALUE PROP: 85% devs use AI tools, 62% daily — zero ROI visibility. A 30-dev team bleeds $14,288/mo invisible loss. Grassion pays for itself immediately. Pricing: $29/dev/mo (Starter), $39/dev/mo (Growth), $49/dev/mo (Enterprise). Avg team LTV $4,176. TOP TARGETS: Tara AI (VP Eng, US, adjacent product + partnership angle — they sell to same buyer), WarpBuild (CTO, US, GitHub-native, same ecosystem), Richpanel (CTO, India, Sequoia-backed), Atomicwork (co-founder, India, AI-native will instantly get it), HyperVerge (CTO, India, Series B heavy ML team), Tabby (VP Eng, UAE, 100+ engineers $3.3B val, massive Copilot spend), Tessian (VP Eng, UK, $80M raised), Quantexa (UK), Bayzat (CTO, UAE), Zocket (CTO, India). OUTREACH: LinkedIn DM under 280 chars casual first → cold email under 150 words specific to their product → 3 follow-ups max (Day 5: data point, Day 12: case study, Day 21: breakup). OBJECTIONS: Too expensive → one reclaimed AI seat at $19/mo × 10 unused = $190 saved > $29/mo cost. We'll build it → 6-12 months $50K+. Security → read-only OAuth same as Vercel. No budget → your Copilot bill IS the budget. DEAL STAGES: New Lead → Contacted → Replied → Demo Booked → Negotiating → Won → Lost. Never send same message twice. Never promise missing features. Never negotiate below $29/dev. Report to SSD with pipeline movement at end of every response.` },

  finn: { id:"finn", name:"FINN", title:"CFO — Finance",     emoji:"💰", color:"#a855f7", bg:"#08020f", border:"#9333ea", accent:"#d8b4fe",
    basePrompt:`You are FINN, CFO for Grassion. Exact numbers only — always show the math. GRASSION FINANCIALS: MRR $0 (pre-revenue). Infra cost: Vercel free + Fly.io ~$20 + Supabase free + Upstash free + Resend free + domain ~$1.50 + OpenAI ~$5-10 = ~$27-32/mo total. Razorpay fee: 2% per transaction. Gross margin at scale: ~98%. PRICING (per-developer model): Starter $29/dev/mo (up to 25 devs), Growth $39/dev/mo (25-100 devs), Enterprise $49/dev/mo (100+ devs). Avg team LTV: $4,176 (12-dev team annual). CAC target: $150. RAISE: Seed Round 2026, raising $350,000. Allocation: 40% Product & Engineering, 25% Infra & Security, 20% Growth & GTM, 15% Operational reserves. PROJECTIONS: M6 MRR target $8,500+, M12 MRR target $29,000 (1000+ developers, 200 teams). 12-month ARR target $350K. PATH TO ₹7L/MONTH (~$8,400 USD/mo at ₹83/$1): Need ~290 developers on Growth plan ($39/dev) OR ~172 devs on Enterprise ($49/dev) OR mixed: 20 teams × avg 14 devs × $39 = $10,920/mo. DILUTION (raise scenarios): $350K at $2.5M val = 14%. $350K at $3.5M val = 10%. $350K at $5M val = 7%. BOOTSTRAP vs RAISE: At $5K MRR → raise at $3-5M val (10-15% dilution). At $0 MRR now → raise at $1.5M val (20%+ dilution). Recommendation: 2-3 paying customers first = 3-5x better terms. Always state assumptions. Build tables. Report to SSD with MRR, burn, margin at end of every response.` },
  atlas: { id:"atlas", name:"ATLAS", title:"Fundraising", emoji:"🏦", color:"#06b6d4", bg:"#00080d", border:"#0891b2", accent:"#67e8f9",
    basePrompt:`You are ATLAS, Fundraising agent for Grassion. You find HIDDEN early-stage investors — not famous bluffers who reject pre-revenue. GRASSION: Seed Round 2026, raising $350,000. Pre-revenue SaaS, $50/mo infra, 98% gross margin. Founders: Sai Snata Dash (CEO, Thiel Fellow, UN Karmaveer Chakra Awardee, LinkedIn influencer 13K+ connections, scaled social platform 50K+ users) + Mukti Prasad Behera (CTO, 6+ years distributed systems, JavaScript/Node.js/microservices expert). Market: $11.3B TAM, $3.48B SAM, $4.18M SOM (Year 2). 26.3% CAGR. Pitch deck available: 17-slide deck showing problem ($14,288/mo invisible loss per 30-dev team), solution (CONNECT→DETECT→TRACK→CALCULATE→VERDICT), competitive moat (ONLY product with AI ROI signal + financial verdict + per-tool attribution + self-serve), case study (Team Apex: -$400/mo loss turned ROI positive). INVESTOR CRITERIA (must have ALL): invests pre-revenue, B2B SaaS or dev tools portfolio, takes 5-12% equity max, writes checks within 6 weeks, portfolio companies = potential Grassion customers (double value). AVOID: anyone needing $50K MRR, 20%+ equity at pre-seed, funds with 3+ year old last investment, LinkedIn posters who never write checks. MATCH SCORE 0-100: pre-revenue investment +25, dev tools/B2B SaaS portfolio +20, India-friendly +15, $100K-500K ticket +15, portfolio = Grassion customers +15, low dilution history +10. TOP MATCHES: 100x.vc score 88 (zero revenue OK, $100K for 1%, 4-6 week process, Ninad Karpe MD linkedin.com/in/ninadkarpe), Heavybit score 83 (dev tools ONLY — Snyk/LaunchDarkly/Netlify portfolio, heavybit.com/apply), Y Combinator score 85 (apply W26 now at ycombinator.com/apply), Artha Venture Fund score 81 (B2B SaaS India, $100-300K, Anirudh Damani linkedin.com/in/anirudhdamani), Venture Catalysts score 79 (450+ angels, $200-500K syndicated, Apoorv Ranjan Sharma). PITCH DECK MEMORY: When founder uploads pitch deck, extract Problem/Solution/Market/Traction/Ask/UseOfFunds — save permanently, reference in every investor outreach. WARM INTRO SYSTEM: When targeting an investor, find their portfolio companies → identify founding team members on LinkedIn → write exact connection request message → write warm intro request → give contact path. DILUTION TABLE: $350K at $2.5M val=14% | $350K at $3.5M val=10% | $350K at $5M val=7%. HONEST ADVICE: 2-3 paying customers first = 3-5x better terms, takes 60-90 days. Report to SSD with investor pipeline at end of every response.` },
};

// ─── DEAL DATA ────────────────────────────────────────────────────────────────
const DEAL_STAGES = ["New Lead","Contacted","Replied","Demo Booked","Negotiating","Won","Lost"];
const STAGE_CLR = {"New Lead":"#374151","Contacted":"#1d4ed8","Replied":"#7c3aed","Demo Booked":"#b45309","Negotiating":"#d97706","Won":"#16a34a","Lost":"#dc2626"};
const INIT_DEALS = [
  {id:1,co:"Tara AI",contact:"VP Engineering",email:"",li:"linkedin.com/company/tara-ai",val:149,stage:"New Lead",note:"Adjacent product, will instantly get Grassion's value prop"},
  {id:2,co:"WarpBuild",contact:"CTO",email:"",li:"linkedin.com/company/warpbuild",val:49,stage:"New Lead",note:"GitHub-native devtools, perfect fit"},
  {id:3,co:"Richpanel",contact:"CTO",email:"",li:"linkedin.com/company/richpanel",val:149,stage:"New Lead",note:"Sequoia-backed, lean eng team"},
  {id:4,co:"Atomicwork",contact:"Co-founder",email:"",li:"linkedin.com/company/atomicwork",val:149,stage:"New Lead",note:"Sells AI productivity tools to same buyer"},
  {id:5,co:"Tabby",contact:"VP Engineering",email:"",li:"linkedin.com/company/tabby-app",val:399,stage:"New Lead",note:"100+ engineers, $3.3B valuation UAE"},
  {id:6,co:"Tessian",contact:"VP Engineering",email:"",li:"linkedin.com/company/tessian",val:399,stage:"New Lead",note:"$80M raised UK, large eng team"},
  {id:7,co:"HyperVerge",contact:"CTO",email:"",li:"linkedin.com/company/hyperverge",val:149,stage:"New Lead",note:"Series B, heavy ML/AI team India"},
];

// ─── AI CALL ──────────────────────────────────────────────────────────────────
async function callAI(system, msgs, creds) {
  const oKey = creds?.openai?.api_key?.trim();
  if (!oKey) throw new Error("⚠️ No OpenAI key found. Go to 🔑 Keys tab → paste your OpenAI API key (sk-...) → click SAVE.");
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${oKey}`},
    body: JSON.stringify({model:"gpt-4o-mini", max_tokens:1500, messages:[{role:"system",content:system},...msgs]})
  });
  const d = await r.json();
  if(d.error) throw new Error(`OpenAI: ${d.error.message}`);
  return d.choices?.[0]?.message?.content || "No response.";
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

// ─── UTILS ────────────────────────────────────────────────────────────────────
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function load(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } }

function Dots({c="#f59e0b"}) {
  return (
    <div style={{display:"flex",gap:4,padding:"8px 14px"}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:c,
          animation:`bounce 1.2s ease ${i*0.2}s infinite`}}/>
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}
@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

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

// ─── STATS DASH ──────────────────────────────────────────────────────────────
const PLATFORM_LIST = [
  {p:"Twitter/X",    key:"tw",  c:"#1da1f2", url:"twitter.com"},
  {p:"LinkedIn",     key:"li",  c:"#0077b5", url:"linkedin.com"},
  {p:"Reddit",       key:"rd",  c:"#ff4500", url:"reddit.com"},
  {p:"Dev.to",       key:"dev", c:"#3b49df", url:"dev.to"},
  {p:"HackerNews",   key:"hn",  c:"#ff6600", url:"news.ycombinator.com"},
  {p:"IndieHackers", key:"ih",  c:"#0ea5e9", url:"indiehackers.com"},
  {p:"Product Hunt", key:"ph",  c:"#da552f", url:"producthunt.com"},
  {p:"Hashnode",     key:"hs",  c:"#2962ff", url:"hashnode.com"},
  {p:"BetaList",     key:"bl",  c:"#6d28d9", url:"betalist.com"},
  {p:"Medium",       key:"md",  c:"#00ab6c", url:"medium.com"},
  {p:"Substack",     key:"ss",  c:"#ff6719", url:"substack.com"},
  {p:"YouTube",      key:"yt",  c:"#ff0000", url:"youtube.com"},
  {p:"Instagram",    key:"ig",  c:"#e1306c", url:"instagram.com"},
  {p:"Quora",        key:"qr",  c:"#b92b27", url:"quora.com"},
  {p:"Peerlist",     key:"pl",  c:"#00aa45", url:"peerlist.io"},
];

// Hardcoded post counts (will be replaced by real API data later)
const POST_COUNTS = {tw:28,li:12,rd:8,dev:4,hn:2,ih:1,ph:0,hs:0,bl:0,md:0,ss:0,yt:0,ig:0,qr:0,pl:0};

function StatsDash({deals}) {
  const [expanded, setExpanded] = useState(null); // which card is expanded
  const toggle = (id) => setExpanded(p => p===id ? null : id);

  const wonDeals  = deals.filter(d=>d.stage==="Won");
  const won       = wonDeals.reduce((s,d)=>s+d.val,0);
  const pipe      = deals.filter(d=>d.stage!=="Lost").reduce((s,d)=>s+d.val,0);
  const totalPosts= Object.values(POST_COUNTS).reduce((a,b)=>a+b,0);
  const healthScore = 91;
  const mrr = [{m:"Mar",v:0},{m:"Apr",v:49},{m:"May",v:98},{m:"Jun",v:198},{m:"Jul",v:347},{m:"Aug",v:546}];
  const healthHistory = [{w:"W1",v:74},{w:"W3",v:76},{w:"W5",v:80},{w:"W7",v:84},{w:"W9",v:88},{w:"W12",v:91}];

  const CARDS = [
    {
      id:"mrr", emoji:"💰", label:"MRR", color:"#22c55e",
      value:`$${won}`,
      sub:`${wonDeals.length} paying customer${wonDeals.length!==1?"s":""}`,
      detail: (
        <div>
          <div style={{color:"#22c55e",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:8}}>MRR BREAKDOWN</div>
          {wonDeals.length===0
            ? <div style={{color:"#4b5563",fontSize:12}}>No paying customers yet. Move deals to "Won" in Sales tab.</div>
            : wonDeals.map((d,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1f2937",fontSize:12}}>
                  <span style={{color:"#e5e7eb"}}>{d.co}</span>
                  <span style={{color:"#22c55e",fontFamily:"monospace"}}>${d.val}/mo</span>
                </div>
              ))
          }
          <div style={{marginTop:10}}>
            <div style={{color:"#22c55e",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:6}}>MRR TRAJECTORY</div>
            <SimpleLine data={mrr} color="#22c55e" valueKey="v" labelKey="m"/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8,padding:"8px 0",borderTop:"1px solid #1f2937"}}>
            <div style={{color:"#4b5563",fontSize:11}}>ARR Projection</div>
            <div style={{color:"#22c55e",fontFamily:"monospace",fontWeight:700}}>${won*12}/yr</div>
          </div>
        </div>
      )
    },
    {
      id:"customers", emoji:"👥", label:"Customers", color:"#3b82f6",
      value:wonDeals.length,
      sub:`${deals.filter(d=>d.stage==="Contacted"||d.stage==="Replied"||d.stage==="Demo Booked").length} in active talks`,
      detail: (
        <div>
          <div style={{color:"#3b82f6",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:8}}>CUSTOMER DETAILS</div>
          {wonDeals.length===0
            ? <div style={{color:"#4b5563",fontSize:12}}>No customers yet.</div>
            : wonDeals.map((d,i)=>(
                <div key={i} style={{background:"#111",borderRadius:7,padding:"8px 10px",marginBottom:6}}>
                  <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12}}>{d.co}</div>
                  <div style={{color:"#6b7280",fontSize:10,marginTop:2}}>{d.contact} · {d.note?.slice(0,50)}</div>
                  <div style={{color:"#3b82f6",fontFamily:"monospace",fontSize:11,marginTop:3}}>${d.val}/mo</div>
                </div>
              ))
          }
          <div style={{color:"#3b82f6",fontSize:11,fontFamily:"monospace",fontWeight:700,margin:"10px 0 6px"}}>PIPELINE BY STAGE</div>
          {DEAL_STAGES.map(s=>{
            const n=deals.filter(d=>d.stage===s).length;
            if(!n) return null;
            return (
              <div key={s} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_CLR[s],flexShrink:0}}/>
                <div style={{width:100,color:"#6b7280",fontSize:11}}>{s}</div>
                <div style={{color:"#9ca3af",fontFamily:"monospace",fontSize:11}}>{n} deal{n!==1?"s":""}</div>
              </div>
            );
          })}
        </div>
      )
    },
    {
      id:"pipeline", emoji:"🎯", label:"Pipeline", color:"#f59e0b",
      value:`$${pipe}/mo`,
      sub:`${deals.filter(d=>d.stage==="New Lead").length} new leads`,
      detail: (
        <div>
          <div style={{color:"#f59e0b",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:8}}>ALL DEALS</div>
          {deals.filter(d=>d.stage!=="Won"&&d.stage!=="Lost").map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #0d0d0d"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_CLR[d.stage],flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{color:"#e5e7eb",fontSize:12}}>{d.co}</div>
                <div style={{color:"#4b5563",fontSize:10}}>{d.stage} · {d.contact}</div>
              </div>
              <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:11}}>${d.val}/mo</div>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid #1f2937"}}>
            <span style={{color:"#4b5563",fontSize:11}}>Total pipeline value</span>
            <span style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700}}>${pipe}/mo</span>
          </div>
        </div>
      )
    },
    {
      id:"posts", emoji:"📱", label:"Total Posts", color:"#ec4899",
      value:totalPosts,
      sub:`across ${PLATFORM_LIST.length} platforms`,
      detail: (
        <div>
          <div style={{color:"#ec4899",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:8}}>POSTS BY PLATFORM</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {PLATFORM_LIST.map(p=>{
              const v = POST_COUNTS[p.key]||0;
              const max = Math.max(...Object.values(POST_COUNTS),1);
              return (
                <div key={p.key} style={{display:"flex",alignItems:"center",gap:8}}>
                  <a href={`https://${p.url}`} target="_blank" rel="noreferrer"
                    style={{width:90,color:p.c,fontSize:11,fontFamily:"monospace",textDecoration:"none",flexShrink:0}}>
                    {p.p} ↗
                  </a>
                  <div style={{flex:1,background:"#111",borderRadius:3,height:10,overflow:"hidden"}}>
                    <div style={{width:`${(v/max)*100}%`,height:"100%",background:p.c,borderRadius:3,minWidth:v>0?4:0}}/>
                  </div>
                  <div style={{width:20,color:"#9ca3af",fontSize:11,fontFamily:"monospace",textAlign:"right"}}>{v}</div>
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id:"health", emoji:"🏥", label:"Code Health", color:"#a855f7",
      value:`${healthScore}/100`,
      sub:"12-week trend ↑",
      detail: (
        <div>
          <div style={{color:"#a855f7",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:8}}>CODEBASE HEALTH — 12 WEEK TREND</div>
          <SimpleLine data={healthHistory} color="#a855f7" valueKey="v" labelKey="w"/>
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>
            {[["PR Quality","91/100","#22c55e"],["Test Coverage","68%","#f59e0b"],["AI PR Revert Rate","12%","#ef4444"],["Seat Utilisation","77%","#3b82f6"],["Docs Coverage","45%","#a855f7"]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #0d0d0d"}}>
                <span style={{color:"#6b7280",fontSize:11}}>{l}</span>
                <span style={{color:c,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id:"arr", emoji:"🚀", label:"ARR", color:"#f59e0b",
      value:`$${won*12}`,
      sub:"annual run rate",
      detail: (
        <div>
          <div style={{color:"#f59e0b",fontSize:11,fontFamily:"monospace",fontWeight:700,marginBottom:8}}>FINANCIAL PROJECTIONS</div>
          {[
            ["Current MRR",`$${won}`],
            ["Current ARR",`$${won*12}`],
            ["Month 3 target","$500/mo"],
            ["Month 6 target","$2,000/mo"],
            ["Month 12 target","$8,400/mo"],
            ["₹7L/mo target","$8,400 USD/mo"],
            ["Infra cost","~$50/mo"],
            ["Gross margin","~98%"],
          ].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #0d0d0d"}}>
              <span style={{color:"#6b7280",fontSize:12}}>{l}</span>
              <span style={{color:"#f59e0b",fontFamily:"monospace",fontSize:12,fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div style={{padding:16,overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:12}}>📊 GRASSION GROWTH DASHBOARD</div>
        <div style={{color:"#374151",fontSize:10,fontFamily:"monospace"}}>— click any card to expand</div>
      </div>

      {/* Expandable stat cards */}
      <div style={{display:"flex",gap:9,marginBottom:16,flexWrap:"wrap"}}>
        {CARDS.map(card=>{
          const isOpen = expanded===card.id;
          return (
            <div key={card.id} onClick={()=>toggle(card.id)}
              style={{background:"#0a0a0a",border:`1px solid ${isOpen?card.color+"88":card.color+"33"}`,borderRadius:10,
                padding:"12px 14px",flex:isOpen?"100%":1,minWidth:isOpen?"100%":120,
                cursor:"pointer",transition:"all .2s",boxShadow:isOpen?`0 0 16px ${card.color}22`:"none"}}>
              {/* Collapsed view */}
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:16,marginBottom:4}}>{card.emoji}</div>
                  <div style={{fontWeight:800,fontSize:18,fontFamily:"monospace",color:card.color}}>{card.value}</div>
                  <div style={{color:"#e5e7eb",fontSize:12,fontWeight:600,marginTop:2}}>{card.label}</div>
                  <div style={{color:"#4b5563",fontSize:10,marginTop:1}}>{card.sub}</div>
                </div>
                <div style={{color:card.color,fontSize:12,opacity:.6,marginTop:2}}>{isOpen?"▲":"▼"}</div>
              </div>
              {/* Expanded detail */}
              {isOpen && (
                <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${card.color}22`}}
                  onClick={e=>e.stopPropagation()}>
                  {card.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts row — always visible */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:12}}>
          <div style={{color:"#22c55e",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:8}}>💰 MRR GROWTH ($)</div>
          <SimpleLine data={mrr} color="#22c55e" valueKey="v" labelKey="m"/>
        </div>
        <div style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:12,padding:12}}>
          <div style={{color:"#3b82f6",fontFamily:"monospace",fontSize:11,fontWeight:700,marginBottom:8}}>🎯 PIPELINE STAGES</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {DEAL_STAGES.map(s=>{
              const n=deals.filter(d=>d.stage===s).length;
              const pct=Math.round(n/Math.max(deals.length,1)*100);
              return (
                <div key={s} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:72,color:"#6b7280",fontSize:10,flexShrink:0}}>{s}</div>
                  <div style={{flex:1,background:"#111",borderRadius:3,height:10,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:STAGE_CLR[s],borderRadius:3}}/>
                  </div>
                  <div style={{width:14,color:"#9ca3af",fontSize:10,textAlign:"right"}}>{n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHAT AREA WITH ATTACHMENTS ───────────────────────────────────────────────
function ChatArea({agent, messages, isTyping, onSend, onReport, creds, generatingImg, generatedImgs, agentMemory, onUpdateMemory, onLoadSession, onClearChat}) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMemory, setShowMemory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [memEdit, setMemEdit] = useState("");
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const a = AGENTS[agent];

  const sessionsKey = `hqf_sessions_${agent}`;
  const [sessions, setSessions] = useState(()=>load(sessionsKey,[]));

  const saveSession = () => {
    if(messages.length < 2) return;
    const title = messages[0]?.content?.slice(0,55)||"Session";
    const session = {id:Date.now(), title, ts:Date.now(), messages:[...messages]};
    const updated = [session,...sessions].slice(0,30);
    setSessions(updated); save(sessionsKey, updated);
  };
  const loadSession = (s) => { onLoadSession(agent, s.messages); setShowHistory(false); };
  const deleteSession = (id,e) => { e.stopPropagation(); const u=sessions.filter(s=>s.id!==id); setSessions(u); save(sessionsKey,u); };

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,isTyping]);

  const QUICK = {
    ssd:  ["What should I focus on TODAY?","Full status report — all agents","Top 3 risks right now","Path to first 10 paying customers","Weekly priorities"],
    zeus: ["Generate LinkedIn post + image for today","Write Twitter thread on AI coding ROI","Reddit post for r/ExperiencedDevs","Write 5 personalized cold emails to CTOs","Product Hunt launch copy"],
    aria: ["List all bugs in Grassion codebase","Fix Settings.tsx TypeScript error lines 419/436","Security audit — what's exposed?","Optimize the slowest API endpoints","Add missing features list"],
    nova: ["Write SEO blog: Is GitHub Copilot Worth It?","Improve grassion.com homepage copy","5-email welcome sequence for new signups","Launch press release draft","Rewrite pricing page copy"],
    rex:  ["Write cold email to Tara AI VP Engineering","Handle objection: we'll build it ourselves","LinkedIn DM to WarpBuild CTO","Write 5-touch follow-up sequence","Demo script for first call"],
    finn: ["Project MRR for Month 3, 6, 12","Exact path to ₹7L/month — show math","Unit economics breakdown","Top 3 revenue risks","Fundraising pitch — do we need it?"],
    atlas: ["Should we raise now or hit $5K MRR first?","Write cold email to 100x.vc","Build our pitch deck narrative","Model dilution: $300K at 10% vs 15% vs 20%","Which angels invest in B2B SaaS dev tools?"],
  };

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target.result;
        if (file.type.startsWith("image/")) {
          setAttachments(prev => [...prev, {type:"image", name:file.name, data:result, mime:file.type}]);
        } else {
          // text/code files
          setAttachments(prev => [...prev, {type:"text", name:file.name, data:result}]);
        }
      };
      if (file.type.startsWith("image/")) reader.readAsDataURL(file);
      else reader.readAsText(file);
    });
  };

  const removeAttachment = (i) => setAttachments(prev => prev.filter((_,idx)=>idx!==i));

  const send = () => {
    if(!input.trim() && attachments.length === 0) return;
    let fullMsg = input.trim();
    const textAttachments = attachments.filter(a=>a.type==="text");
    if(textAttachments.length > 0) {
      fullMsg += "\n\n" + textAttachments.map(a=>`[FILE: ${a.name}]\n${a.data.slice(0,3000)}${a.data.length>3000?"...[truncated]":""}`).join("\n\n");
    }
    const imageAttachments = attachments.filter(a=>a.type==="image");
    onSend(fullMsg, imageAttachments);
    setInput("");
    setAttachments([]);
    if(fileRef.current) fileRef.current.value = "";
  };

  const mem = agentMemory[agent] || "";

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Agent Header */}
      <div style={{padding:"10px 16px",borderBottom:`1px solid ${a.border}33`,background:a.bg,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <span style={{fontSize:22}}>{a.emoji}</span>
        <div style={{flex:1}}>
          <div style={{color:a.color,fontWeight:800,fontSize:14,fontFamily:"monospace"}}>{a.name} <span style={{fontSize:11,color:"#6b7280",fontWeight:400}}>· {a.title}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:1}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",animation:"pulse2 2s infinite"}}/>
            <span style={{color:"#4b5563",fontSize:10}}>Active · Full context</span>
            {mem && <span style={{color:"#6b7280",fontSize:10}}>· 🧠 {mem.split("\n").filter(Boolean).length} memories</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          <button onClick={()=>{setMemEdit(mem);setShowMemory(true);}}
            style={{background:mem?"#22c55e22":"transparent",border:`1px solid ${mem?"#22c55e44":"#374151"}`,color:mem?"#22c55e":"#4b5563",padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>
            🧠 Memory {mem?"✓":""}
          </button>
          <button onClick={()=>setShowHistory(h=>!h)}
            style={{background:sessions.length?"#3b82f622":"transparent",border:`1px solid ${sessions.length?"#3b82f644":"#374151"}`,color:sessions.length?"#60a5fa":"#4b5563",padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>
            🕒 History {sessions.length>0?`(${sessions.length})`:""}
          </button>
          {messages.length>0&&<button onClick={()=>{saveSession();onClearChat(agent);}}
            style={{background:"transparent",border:"1px solid #374151",color:"#4b5563",padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>
            + New Chat
          </button>}
          {agent!=="ssd" && (
            <button onClick={()=>onReport(agent)}
              style={{background:a.color+"22",border:`1px solid ${a.border}55`,color:a.color,padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>
              📤 → SSD
            </button>
          )}
        </div>
      </div>

      {/* Memory Modal */}
      {showMemory && (
        <div style={{position:"absolute",inset:0,background:"#000a",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#0a0a0a",border:`1px solid ${a.border}`,borderRadius:12,padding:20,width:480,maxWidth:"90vw"}}>
            <div style={{color:a.color,fontFamily:"monospace",fontWeight:700,marginBottom:10}}>🧠 {a.name}'s Memory</div>
            <div style={{color:"#4b5563",fontSize:11,marginBottom:10}}>Notes injected into every conversation with {a.name}. Add anything you want them to always remember.</div>
            <textarea value={memEdit} onChange={e=>setMemEdit(e.target.value)}
              placeholder={`e.g.\n- Always write LinkedIn posts under 1500 chars\n- Our target customer is CTO at 50-person Series A company\n- Never suggest paid ads — founder prefers organic`}
              style={{width:"100%",height:180,background:"#111",border:`1px solid ${a.border}44`,borderRadius:8,padding:10,color:a.accent,fontSize:12,fontFamily:"monospace",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button onClick={()=>{onUpdateMemory(agent,memEdit);setShowMemory(false);}}
                style={{flex:1,background:a.color,border:"none",borderRadius:8,padding:9,color:"#000",fontWeight:800,fontSize:12,cursor:"pointer"}}>
                SAVE MEMORY
              </button>
              <button onClick={()=>setShowMemory(false)}
                style={{background:"transparent",border:"1px solid #374151",borderRadius:8,padding:"9px 16px",color:"#6b7280",cursor:"pointer",fontSize:12}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:280,background:"#050505",borderRight:`1px solid ${a.border}44`,zIndex:50,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"10px 12px",borderBottom:`1px solid ${a.border}33`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{color:a.color,fontFamily:"monospace",fontWeight:700,fontSize:12}}>🕒 CHAT HISTORY — {a.name}</div>
            <button onClick={()=>setShowHistory(false)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:14}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:8}}>
            {sessions.length===0
              ? <div style={{color:"#374151",fontSize:11,padding:16,textAlign:"center"}}>No saved sessions yet.<br/>Click "New Chat" to save current and start fresh.</div>
              : sessions.map(s=>(
                  <div key={s.id} onClick={()=>loadSession(s)}
                    style={{background:"#0a0a0a",border:`1px solid ${a.border}33`,borderRadius:7,padding:"8px 10px",marginBottom:6,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{color:"#e5e7eb",fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
                        <div style={{color:"#374151",fontSize:9,fontFamily:"monospace",marginTop:2}}>
                          {new Date(s.ts).toLocaleDateString("en-IN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})} · {s.messages.length} msgs
                        </div>
                      </div>
                      <button onClick={(e)=>deleteSession(s.id,e)} style={{background:"none",border:"none",color:"#374151",cursor:"pointer",fontSize:11,flexShrink:0,padding:"0 2px"}}>🗑</button>
                    </div>
                    <div style={{color:"#4b5563",fontSize:10,marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {s.messages[s.messages.length-1]?.content?.slice(0,60)}...
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      )}

      {/* Quick Commands */}
      {messages.length===0 && (
        <div style={{padding:"10px 16px",borderBottom:"1px solid #0d0d0d",flexShrink:0}}>
          <div style={{color:"#374151",fontSize:9,fontFamily:"monospace",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Quick Commands</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {(QUICK[agent]||[]).map((q,i)=>(
              <button key={i} onClick={()=>onSend(q,[])} style={{background:a.bg,border:`1px solid ${a.border}44`,color:a.accent,padding:"4px 10px",borderRadius:14,fontSize:10,cursor:"pointer",fontFamily:"monospace"}}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,animation:"fadeIn .2s ease"}}>
            {m.role==="assistant" && (
              <div style={{width:24,height:24,borderRadius:"50%",background:a.bg,border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,marginTop:2}}>{a.emoji}</div>
            )}
            <div style={{maxWidth:"80%",display:"flex",flexDirection:"column",gap:5}}>
              {m.images?.map((img,ii)=>(
                <img key={ii} src={img.data} alt={img.name} style={{maxWidth:240,borderRadius:8,border:"1px solid #374151"}}/>
              ))}
              <div style={{background:m.role==="user"?"#111":a.bg,border:`1px solid ${m.role==="user"?"#374151":a.border+"44"}`,borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:"10px 14px",color:m.role==="user"?"#e5e7eb":a.accent,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",fontFamily:m.role==="assistant"?"monospace":"inherit"}}>
                {m.content}
              </div>
              {generatedImgs[i] && (
                <img src={generatedImgs[i]} alt="DALL-E" style={{maxWidth:"100%",borderRadius:8,border:`1px solid ${a.border}44`,marginTop:4}}/>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{display:"flex",gap:8}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:a.bg,border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{a.emoji}</div>
            <Dots c={a.color}/>
          </div>
        )}
        {generatingImg && <div style={{color:"#6b7280",fontSize:11,fontFamily:"monospace",paddingLeft:32}}>🎨 Generating image...</div>}
        <div ref={bottomRef}/>
      </div>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div style={{padding:"6px 14px",borderTop:"1px solid #0d0d0d",display:"flex",gap:6,flexWrap:"wrap",flexShrink:0}}>
          {attachments.map((att,i)=>(
            <div key={i} style={{background:"#111",border:"1px solid #374151",borderRadius:6,padding:"3px 8px",display:"flex",alignItems:"center",gap:5,fontSize:11}}>
              {att.type==="image" ? <img src={att.data} alt="" style={{width:20,height:20,borderRadius:3,objectFit:"cover"}}/> : <span>📄</span>}
              <span style={{color:"#9ca3af",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{att.name}</span>
              <button onClick={()=>removeAttachment(i)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:12,padding:0,lineHeight:1}}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{padding:"10px 14px",borderTop:`1px solid ${a.border}22`,display:"flex",gap:7,flexShrink:0,alignItems:"flex-end"}}>
        <input ref={fileRef} type="file" multiple accept="image/*,.txt,.md,.jsx,.tsx,.ts,.js,.json,.csv,.py,.go,.rs,.html,.css" onChange={handleFile} style={{display:"none"}} id={`file-${agent}`}/>
        <label htmlFor={`file-${agent}`}
          style={{background:"#111",border:"1px solid #374151",borderRadius:8,padding:"9px 11px",cursor:"pointer",color:"#6b7280",fontSize:13,flexShrink:0,display:"flex",alignItems:"center"}}>
          📎
        </label>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={`Message ${a.name}... (Enter to send, Shift+Enter for new line)`}
          rows={input.split("\n").length > 1 ? Math.min(input.split("\n").length, 4) : 1}
          style={{flex:1,background:"#0a0a0a",border:`1px solid ${a.border}55`,borderRadius:10,padding:"9px 12px",color:a.accent,fontSize:12,outline:"none",fontFamily:"monospace",resize:"none",lineHeight:1.5}}/>
        <button onClick={send}
          style={{background:a.color,border:"none",borderRadius:10,padding:"9px 16px",color:"#000",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"monospace",flexShrink:0}}>
          SEND
        </button>
      </div>
    </div>
  );
}

// ─── SSD INBOX ────────────────────────────────────────────────────────────────
function SSDInbox({reports, onGetAll, collecting}) {
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");
  const sorted = [...reports.filter(r=>filter==="all"||r.agentId===filter)].reverse();

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>👑</span>
          <div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:800,fontSize:13}}>SSD INBOX</div>
          <div style={{background:"#f59e0b22",color:"#f59e0b",fontSize:10,padding:"2px 7px",borderRadius:10}}>{reports.length}</div>
        </div>
        <button onClick={onGetAll} disabled={collecting}
          style={{background:collecting?"#374151":"#f59e0b22",border:"1px solid #f59e0b44",color:collecting?"#6b7280":"#f59e0b",padding:"5px 12px",borderRadius:7,cursor:collecting?"not-allowed":"pointer",fontSize:11,fontFamily:"monospace"}}>
          {collecting?"Collecting...":"📡 Brief All Agents → SSD"}
        </button>
      </div>
      <div style={{padding:"6px 16px",borderBottom:"1px solid #0d0d0d",display:"flex",gap:5,flexShrink:0}}>
        {[["all","All"],["zeus","⚡ ZEUS"],["aria","⚙️ ARIA"],["nova","📣 NOVA"],["rex","🎯 REX"],["finn","💰 FINN"]].map(([id,l])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{background:filter===id?"#111":"transparent",border:`1px solid ${filter===id?"#374151":"transparent"}`,color:filter===id?"#e5e7eb":"#4b5563",padding:"3px 9px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:7}}>
        {sorted.length===0 && (
          <div style={{textAlign:"center",padding:50}}>
            <div style={{fontSize:36,marginBottom:12}}>📭</div>
            <div style={{color:"#4b5563",fontSize:13}}>No reports yet.</div>
            <div style={{color:"#374151",fontSize:11,marginTop:6}}>Click "Brief All Agents" to get daily status from every agent.</div>
          </div>
        )}
        {sorted.map((r,i)=>{
          const a = AGENTS[r.agentId];
          const isExp = !!expanded[i];
          const summary = r.content.split("\n").filter(l=>l.trim()).slice(0,2).join(" ").slice(0,150)+"...";
          return (
            <div key={i} style={{background:a.bg,border:`1px solid ${a.border}44`,borderRadius:10,overflow:"hidden"}}>
              <div onClick={()=>setExpanded(p=>({...p,[i]:!p[i]}))} style={{padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:9}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"#0a0a0a",border:`2px solid ${a.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{a.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{color:a.color,fontWeight:800,fontSize:11,fontFamily:"monospace"}}>{a.name}</span>
                    <span style={{color:"#4b5563",fontSize:10}}>{a.title}</span>
                    <span style={{color:"#374151",fontSize:10,marginLeft:"auto"}}>{new Date(r.timestamp).toLocaleString("en-IN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  {!isExp && <div style={{color:a.accent,fontSize:11,lineHeight:1.5,fontFamily:"monospace"}}>{summary}</div>}
                </div>
                <div style={{color:"#374151",fontSize:12,flexShrink:0}}>{isExp?"▲":"▼"}</div>
              </div>
              {isExp && (
                <div style={{padding:"0 12px 12px 47px"}}>
                  <div style={{background:"#050505",border:`1px solid ${a.border}22`,borderRadius:7,padding:10,color:a.accent,fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"monospace"}}>
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

// ─── SALES PIPELINE ───────────────────────────────────────────────────────────
function Pipeline({deals, setDeals, onAskRex, creds}) {
  const [drafting, setDrafting] = useState(null);
  const [draft, setDraft] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newDeal, setNewDeal] = useState({co:"",contact:"",email:"",li:"",val:149,note:""});

  const genOutreach = async (deal) => {
    setDrafting(deal.id); setDraftLoading(true); setDraft("");
    try {
      const prompt = `Write hyper-personalized outreach for ${deal.co}:
Contact: ${deal.contact}
LinkedIn: ${deal.li}
Email: ${deal.email || "unknown"}
Notes: ${deal.note}

Provide:
1. LINKEDIN DM (under 280 chars, casual, from founder's personal account)
2. COLD EMAIL — Subject line + body (under 150 words, specific to what ${deal.co} does)
3. FOLLOW-UP #2 (one week later, under 80 words)`;
      const resp = await callAI(AGENTS.rex.basePrompt, [{role:"user",content:prompt}], creds);
      setDraft(resp);
    } catch(e) { setDraft(`Error: ${e.message}`); }
    setDraftLoading(false);
  };

  const move = (id, dir) => setDeals(prev=>prev.map(d=>{
    if(d.id!==id) return d;
    const idx = DEAL_STAGES.indexOf(d.stage);
    return {...d, stage:DEAL_STAGES[Math.max(0,Math.min(DEAL_STAGES.length-1,idx+dir))]};
  }));

  const addDeal = () => {
    if(!newDeal.co) return;
    const d = {...newDeal, id:Date.now(), stage:"New Lead"};
    setDeals(prev=>[...prev,d]);
    setNewDeal({co:"",contact:"",email:"",li:"",val:149,note:""});
    setAdding(false);
  };

  const removeDeal = (id) => setDeals(prev=>prev.filter(d=>d.id!==id));
  const won = deals.filter(d=>d.stage==="Won").reduce((s,d)=>s+d.val,0);

  return (
    <div style={{display:"flex",height:"100%"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"10px 16px",borderBottom:"1px solid #0d0d0d",display:"flex",gap:14,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
          {[{l:"Won MRR",v:`$${won}/mo`,c:"#22c55e"},{l:"Total Leads",v:deals.length,c:"#9ca3af"},{l:"In Progress",v:deals.filter(d=>!["New Lead","Won","Lost"].includes(d.stage)).length,c:"#f59e0b"}].map((s,i)=>(
            <div key={i}><div style={{color:s.c,fontWeight:800,fontSize:16,fontFamily:"monospace"}}>{s.v}</div><div style={{color:"#4b5563",fontSize:10}}>{s.l}</div></div>
          ))}
          <button onClick={()=>setAdding(true)} style={{marginLeft:"auto",background:"#22c55e22",border:"1px solid #22c55e44",color:"#22c55e",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>
            + Add Lead
          </button>
        </div>

        {/* Add Deal Form */}
        {adding && (
          <div style={{padding:"10px 16px",borderBottom:"1px solid #0d0d0d",background:"#050505",display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
            {[["co","Company*"],["contact","Contact"],["email","Email"],["li","LinkedIn URL"],["note","Notes"]].map(([k,pl])=>(
              <input key={k} value={newDeal[k]} onChange={e=>setNewDeal(p=>({...p,[k]:e.target.value}))}
                placeholder={pl} style={{background:"#111",border:"1px solid #374151",borderRadius:6,padding:"6px 10px",color:"#e5e7eb",fontSize:11,outline:"none",fontFamily:"monospace",width:k==="note"?200:120}}/>
            ))}
            <input type="number" value={newDeal.val} onChange={e=>setNewDeal(p=>({...p,val:+e.target.value}))}
              style={{background:"#111",border:"1px solid #374151",borderRadius:6,padding:"6px 10px",color:"#22c55e",fontSize:11,outline:"none",width:70}}/>
            <button onClick={addDeal} style={{background:"#22c55e",border:"none",borderRadius:6,padding:"6px 14px",color:"#000",fontWeight:700,fontSize:11,cursor:"pointer"}}>Add</button>
            <button onClick={()=>setAdding(false)} style={{background:"transparent",border:"1px solid #374151",borderRadius:6,padding:"6px 10px",color:"#6b7280",fontSize:11,cursor:"pointer"}}>Cancel</button>
          </div>
        )}

        {/* Deal List */}
        <div style={{flex:1,overflowY:"auto"}}>
          {DEAL_STAGES.filter(s=>deals.some(d=>d.stage===s)).map(stage=>(
            <div key={stage}>
              <div style={{padding:"5px 16px",background:"#050505",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:STAGE_CLR[stage]}}/>
                <span style={{color:"#6b7280",fontSize:9,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:1}}>{stage}</span>
                <span style={{color:"#374151",fontSize:9,fontFamily:"monospace"}}>({deals.filter(d=>d.stage===stage).length})</span>
              </div>
              {deals.filter(d=>d.stage===stage).map(deal=>(
                <div key={deal.id} style={{padding:"9px 16px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:30,height:30,borderRadius:6,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🏢</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12}}>{deal.co}</div>
                    <div style={{color:"#6b7280",fontSize:10}}>{deal.contact}{deal.email?` · ${deal.email}`:""} · {deal.note?.slice(0,40)}</div>
                  </div>
                  <div style={{background:"#16a34a22",color:"#22c55e",fontSize:10,fontFamily:"monospace",padding:"2px 6px",borderRadius:4,flexShrink:0}}>${deal.val}/mo</div>
                  <div style={{display:"flex",gap:2}}>
                    <button onClick={()=>move(deal.id,-1)} style={{background:"#111",border:"1px solid #374151",color:"#6b7280",width:22,height:22,borderRadius:4,cursor:"pointer",fontSize:10}}>←</button>
                    <button onClick={()=>move(deal.id,1)} style={{background:"#111",border:"1px solid #374151",color:"#6b7280",width:22,height:22,borderRadius:4,cursor:"pointer",fontSize:10}}>→</button>
                  </div>
                  <button onClick={()=>genOutreach(deal)} style={{background:"#3b82f622",border:"1px solid #3b82f644",color:"#60a5fa",padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace",flexShrink:0}}>✉ Draft</button>
                  <button onClick={()=>removeDeal(deal.id)} style={{background:"transparent",border:"none",color:"#374151",cursor:"pointer",fontSize:12,padding:"0 2px"}}>✕</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Draft Panel */}
      {drafting && (
        <div style={{width:320,borderLeft:"1px solid #0d0d0d",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 12px",borderBottom:"1px solid #0d0d0d",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:700,fontSize:11}}>✉ {deals.find(d=>d.id===drafting)?.co}</div>
            <button onClick={()=>setDrafting(null)} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:14}}>✕</button>
          </div>
          <div style={{flex:1,padding:10,overflowY:"auto"}}>
            {draftLoading
              ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:20}}><Dots c="#3b82f6"/><div style={{color:"#4b5563",fontSize:11}}>REX writing personalized outreach...</div></div>
              : <pre style={{color:"#93c5fd",fontSize:11,fontFamily:"monospace",whiteSpace:"pre-wrap",lineHeight:1.7,margin:0}}>{draft}</pre>
            }
          </div>
          {draft && (
            <div style={{padding:10,borderTop:"1px solid #0d0d0d",display:"flex",gap:6}}>
              <button onClick={()=>navigator.clipboard?.writeText(draft)} style={{flex:1,background:"#3b82f622",border:"1px solid #3b82f644",color:"#60a5fa",padding:7,borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>📋 Copy</button>
              <button onClick={()=>onAskRex(`Improve this outreach: ${draft.slice(0,300)}`)} style={{flex:1,background:"#111",border:"1px solid #374151",color:"#9ca3af",padding:7,borderRadius:6,cursor:"pointer",fontSize:10}}>Ask REX</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── KEYS / CREDENTIALS ───────────────────────────────────────────────────────
function CredsPanel({creds, onSave}) {
  const [local, setLocal] = useState(creds || {});
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState({});
  const setF = (p,k,v) => setLocal(prev=>({...prev,[p]:{...(prev[p]||{}),[k]:v}}));
  const toggleVis = (id) => setVisible(p=>({...p,[id]:!p[id]}));

  const SECS = [
    // ── AI ──
    { id:"openai", name:"OpenAI", icon:"🤖", color:"#10a37f", cat:"AI",
      note:"Powers all agents (gpt-4o-mini) + DALL-E image generation for ZEUS",
      guide:"platform.openai.com → API Keys → Create new secret key",
      fields:[{k:"api_key",l:"API Key (sk-...)"}] },
    { id:"anthropic", name:"Anthropic / Claude", icon:"🧬", color:"#d97706", cat:"AI",
      note:"Fallback AI — works without a key via browser proxy",
      guide:"console.anthropic.com → API Keys",
      fields:[{k:"api_key",l:"API Key (sk-ant-...)"}] },
    // ── INFRASTRUCTURE ──
    { id:"github", name:"GitHub", icon:"🐙", color:"#e5e7eb", cat:"Infra",
      note:"ARIA reads your live codebase for exact bug fixes",
      guide:"github.com/settings/tokens → Generate classic token → repo scope",
      fields:[{k:"token",l:"Token (ghp_...)"},{k:"repo",l:"Repo (saisnatadash/grassion)"}] },
    { id:"vercel", name:"Vercel", icon:"▲", color:"#ffffff", cat:"Infra",
      note:"ARIA triggers deploys & checks build logs",
      guide:"vercel.com/account/tokens → Create token",
      fields:[{k:"token",l:"Token"},{k:"team_id",l:"Team ID (optional)"},{k:"project_grassion",l:"Project ID: Grassion"},{k:"project_hq",l:"Project ID: Grassion HQ"}] },
    { id:"flyio", name:"Fly.io", icon:"🪂", color:"#7c3aed", cat:"Infra",
      note:"ARIA checks API status, triggers fly deploy",
      guide:"fly.io/user/personal_access_tokens → Create token",
      fields:[{k:"token",l:"Token (fo1-...)"},{k:"app_name",l:"App name (grassion-api)"}] },
    { id:"supabase", name:"Supabase", icon:"🟢", color:"#3ecf8e", cat:"Infra",
      note:"ARIA queries DB directly for debugging",
      guide:"supabase.com → Project Settings → API → service_role key",
      fields:[{k:"url",l:"Project URL (https://xxx.supabase.co)"},{k:"service_key",l:"service_role key (eyJ...)"},{k:"project_id",l:"Project ID (dgzsgjjwelawcikbdklx)"}] },
    { id:"upstash", name:"Upstash Redis", icon:"🔴", color:"#ef4444", cat:"Infra",
      note:"Cache monitoring — ARIA checks Redis health",
      guide:"console.upstash.com → database → REST API",
      fields:[{k:"url",l:"REST URL"},{k:"token",l:"REST Token"}] },
    { id:"cloudflare", name:"Cloudflare", icon:"🌤️", color:"#f6821f", cat:"Infra",
      note:"ARIA checks DNS status and clears cache",
      guide:"dash.cloudflare.com → My Profile → API Tokens → Create Token",
      fields:[{k:"api_token",l:"API Token"},{k:"zone_id",l:"Zone ID (grassion.com)"},{k:"account_id",l:"Account ID"}] },
    // ── PAYMENTS & EMAIL ──
    { id:"razorpay", name:"Razorpay", icon:"💳", color:"#3395ff", cat:"Revenue",
      note:"FINN checks real MRR, payments, transaction history",
      guide:"dashboard.razorpay.com → Settings → API Keys → Generate Live Key",
      fields:[{k:"key_id",l:"Key ID (rzp_live_...)"},{k:"key_secret",l:"Key Secret"},{k:"webhook_secret",l:"Webhook Secret"}] },
    { id:"resend", name:"Resend (Email)", icon:"📧", color:"#ec4899", cat:"Revenue",
      note:"ZEUS sends emails via noreply@grassion.com",
      guide:"resend.com → API Keys → Create API Key",
      fields:[{k:"api_key",l:"API Key (re_...)"},{k:"from_email",l:"From (noreply@grassion.com)"}] },
    { id:"stripe", name:"Stripe (Future)", icon:"💜", color:"#6772e5", cat:"Revenue",
      note:"If you add Stripe later — FINN tracks revenue here",
      guide:"dashboard.stripe.com → Developers → API Keys",
      fields:[{k:"publishable_key",l:"Publishable Key (pk_live_...)"},{k:"secret_key",l:"Secret Key (sk_live_...)"}] },
    // ── SOCIAL — AUTO POST ──
    { id:"twitter", name:"Twitter / X", icon:"🐦", color:"#1da1f2", cat:"Social",
      note:"ZEUS auto-posts threads from your account via backend",
      guide:"developer.twitter.com → Projects → App → Keys & Tokens",
      fields:[{k:"api_key",l:"API Key"},{k:"api_secret",l:"API Secret"},{k:"access_token",l:"Access Token"},{k:"access_secret",l:"Access Secret"},{k:"bearer_token",l:"Bearer Token"}] },
    { id:"reddit", name:"Reddit", icon:"🔴", color:"#ff4500", cat:"Social",
      note:"ZEUS posts to r/programming r/ExperiencedDevs r/startups r/SaaS r/devops",
      guide:"reddit.com/prefs/apps → Create App → script type",
      fields:[{k:"client_id",l:"Client ID"},{k:"client_secret",l:"Client Secret"},{k:"username",l:"Reddit Username"},{k:"password",l:"Reddit Password"}] },
    { id:"devto", name:"Dev.to", icon:"📝", color:"#3b49df", cat:"Social",
      note:"ZEUS publishes technical articles",
      guide:"dev.to/settings/extensions → DEV Community API Keys",
      fields:[{k:"api_key",l:"API Key"}] },
    { id:"hashnode", name:"Hashnode", icon:"✍️", color:"#2962ff", cat:"Social",
      note:"ZEUS cross-posts articles to your Hashnode blog",
      guide:"hashnode.com/settings/developer → Generate new token",
      fields:[{k:"token",l:"Personal Access Token"},{k:"publication_id",l:"Publication ID"}] },
    { id:"medium", name:"Medium", icon:"🟩", color:"#00ab6c", cat:"Social",
      note:"ZEUS publishes long-form content to your Medium publication",
      guide:"medium.com/me/settings → Integration tokens → Get integration token",
      fields:[{k:"token",l:"Integration Token"},{k:"publication_id",l:"Publication ID (optional)"}] },
    { id:"substack", name:"Substack", icon:"📰", color:"#ff6719", cat:"Social",
      note:"NOVA drafts Substack newsletters — you publish manually",
      guide:"substack.com — manual publishing, NOVA writes copy for you",
      fields:[{k:"newsletter_url",l:"Your Substack URL"},{k:"email",l:"Login Email"}] },
    { id:"youtube", name:"YouTube", icon:"▶️", color:"#ff0000", cat:"Social",
      note:"ZEUS writes video scripts + descriptions + tags",
      guide:"console.cloud.google.com → YouTube Data API v3 → Create credentials",
      fields:[{k:"api_key",l:"YouTube Data API Key"},{k:"channel_id",l:"Channel ID"}] },
    { id:"instagram", name:"Instagram", icon:"📸", color:"#e1306c", cat:"Social",
      note:"ZEUS writes captions + hashtag sets — you post manually",
      guide:"⚠️ Instagram bans automation hard. ZEUS writes copy, you post.",
      fields:[{k:"username",l:"@username"},{k:"business_page",l:"Business Page URL"}] },
    // ── SOCIAL — MANUAL COPY ──
    { id:"linkedin", name:"LinkedIn", icon:"💼", color:"#0077b5", cat:"Social",
      note:"ZEUS writes posts & DMs — you paste+send manually (no ban risk)",
      guide:"⚠️ LinkedIn bans bots. ZEUS writes copy, you send from your account.",
      fields:[{k:"profile_url",l:"Your LinkedIn URL"},{k:"company_page",l:"Grassion company page URL"}] },
    // ── LAUNCH PLATFORMS ──
    { id:"producthunt", name:"Product Hunt", icon:"🐱", color:"#da552f", cat:"Launch",
      note:"NOVA writes your PH launch post, tagline, first comment, hunter DMs",
      guide:"producthunt.com → Account → Settings → API access",
      fields:[{k:"api_key",l:"API Key"},{k:"username",l:"PH Username"},{k:"launch_date",l:"Planned launch date"}] },
    { id:"betalist", name:"BetaList", icon:"🚀", color:"#6d28d9", cat:"Launch",
      note:"NOVA submits Grassion to BetaList for early adopter signups",
      guide:"betalist.com → Submit → betalist.com/startups/new",
      fields:[{k:"submission_url",l:"Submission URL (after submit)"},{k:"upvote_url",l:"Upvote URL"}] },
    { id:"indiehackers", name:"Indie Hackers", icon:"🛠️", color:"#0ea5e9", cat:"Launch",
      note:"ZEUS posts milestones, product updates, asks for feedback",
      guide:"indiehackers.com — manual account, ZEUS writes posts",
      fields:[{k:"username",l:"IH Username"},{k:"product_page",l:"Product page URL"}] },
    { id:"hackernews", name:"Hacker News", icon:"🟠", color:"#ff6600", cat:"Launch",
      note:"ZEUS writes Show HN post + Ask HN content — you submit manually",
      guide:"news.ycombinator.com — submit manually, ZEUS writes copy",
      fields:[{k:"username",l:"HN Username"}] },
    { id:"peerlist", name:"Peerlist", icon:"🟢", color:"#00aa45", cat:"Launch",
      note:"ZEUS posts project updates on Peerlist — growing developer community",
      guide:"peerlist.io → Profile → Projects → Add Project",
      fields:[{k:"profile_url",l:"Peerlist Profile URL"},{k:"project_url",l:"Grassion project URL on Peerlist"}] },
    { id:"g2", name:"G2 / Capterra", icon:"⭐", color:"#ff492c", cat:"Launch",
      note:"NOVA creates your G2 and Capterra listing copy and review templates",
      guide:"g2.com/products/new | capterra.com/vendors — manual listing submission",
      fields:[{k:"g2_url",l:"G2 listing URL (after created)"},{k:"capterra_url",l:"Capterra listing URL"}] },
    { id:"quora", name:"Quora", icon:"🔴", color:"#b92b27", cat:"Launch",
      note:"ZEUS answers questions about AI coding ROI, GitHub Copilot effectiveness",
      guide:"quora.com — manual account, ZEUS writes answers",
      fields:[{k:"username",l:"Quora Username"},{k:"space_url",l:"Quora Space URL (optional)"}] },
    // ── TEAM & PRODUCTIVITY ──
    { id:"slack", name:"Slack", icon:"💬", color:"#4a154b", cat:"Team",
      note:"SSD sends daily reports + alerts to your Slack channel",
      guide:"api.slack.com → Your Apps → Incoming Webhooks → Activate",
      fields:[{k:"webhook_url",l:"Webhook URL (https://hooks.slack.com/...)"},{k:"channel",l:"Channel (e.g. #grassion-hq)"}] },
    { id:"notion", name:"Notion", icon:"📓", color:"#ffffff", cat:"Team",
      note:"Agents read/write your Notion workspace for docs and roadmap",
      guide:"notion.so/my-integrations → New Integration → copy Secret",
      fields:[{k:"api_key",l:"Integration Token (secret_...)"},{k:"workspace_id",l:"Workspace ID"}] },
    { id:"airtable", name:"Airtable", icon:"📊", color:"#18bfff", cat:"Team",
      note:"FINN can update your Airtable financial trackers and roadmap",
      guide:"airtable.com/account → API → Generate API key",
      fields:[{k:"api_key",l:"API Key"},{k:"base_id",l:"Base ID (app...)"},{k:"table_name",l:"Main table name"}] },
    { id:"zapier", name:"Zapier / Make.com", icon:"⚡", color:"#ff4a00", cat:"Team",
      note:"Connect ZEUS auto-posts to any platform via Zapier/Make webhooks",
      guide:"zapier.com → Webhooks → Catch Hook → copy URL",
      fields:[{k:"webhook_url",l:"Zapier Webhook URL"},{k:"make_webhook",l:"Make.com Webhook URL (optional)"}] },
    // ── FOUNDER ──
    { id:"founder", name:"Founder Settings", icon:"👤", color:"#f59e0b", cat:"Founder",
      note:"Personal context injected into every SSD + agent conversation automatically",
      guide:"Fill this in — agents will always know your current status",
      fields:[{k:"name",l:"Your name"},{k:"email",l:"Your email"},{k:"phone",l:"WhatsApp/Phone"},{k:"current_mrr",l:"Current MRR ($)"},{k:"current_customers",l:"# Paying customers"},{k:"focus_this_week",l:"What you're focused on this week"},{k:"biggest_blocker",l:"Biggest blocker right now"}] },
  ];

  const cats = [...new Set(SECS.map(s=>s.cat))];
  const [activeCat, setActiveCat] = useState("All");

  const filteredSecs = activeCat==="All" ? SECS : SECS.filter(s=>s.cat===activeCat);
  const totalSet = SECS.filter(s=>s.fields.some(f=>local[s.id]?.[f.k])).length;

  return (
    <div style={{padding:16,overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
        <div style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700,fontSize:13}}>🔑 CREDENTIALS VAULT</div>
        <div style={{background:"#22c55e22",color:"#22c55e",fontSize:9,padding:"2px 8px",borderRadius:8,fontFamily:"monospace"}}>{totalSet}/{SECS.length} set</div>
      </div>
      <div style={{color:"#4b5563",fontSize:11,marginBottom:10}}>Saved in browser only. Never sent to any server.</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
        {["All",...cats].map(cat=>(
          <button key={cat} onClick={()=>setActiveCat(cat)}
            style={{background:activeCat===cat?"#f59e0b22":"transparent",border:`1px solid ${activeCat===cat?"#f59e0b44":"#374151"}`,color:activeCat===cat?"#f59e0b":"#6b7280",padding:"3px 10px",borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>
            {cat} ({cat==="All"?SECS.length:SECS.filter(s=>s.cat===cat).length})
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9,maxWidth:620}}>
        {filteredSecs.map(s=>{
          const isSet = s.fields.some(f=>local[s.id]?.[f.k]);
          const isVis = visible[s.id];
          return (
            <div key={s.id} style={{background:"#0a0a0a",border:`1px solid ${isSet?s.color+"55":"#1f2937"}`,borderRadius:10,padding:12,transition:"border-color .2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                <span style={{fontSize:15}}>{s.icon}</span>
                <div style={{color:"#e5e7eb",fontWeight:600,fontSize:12}}>{s.name}</div>
                <div style={{color:"#374151",fontSize:9,fontFamily:"monospace",marginLeft:2}}>{s.cat}</div>
                {isSet && <div style={{marginLeft:"auto",background:"#16a34a22",color:"#22c55e",fontSize:9,padding:"2px 7px",borderRadius:8,fontFamily:"monospace"}}>✓ SET</div>}
                <button onClick={()=>toggleVis(s.id)} style={{background:"transparent",border:"none",color:"#4b5563",cursor:"pointer",fontSize:10,fontFamily:"monospace",marginLeft:isSet?0:"auto"}}>
                  {isVis?"▲ hide":"▼ show"}
                </button>
              </div>
              <div style={{color:"#4b5563",fontSize:10,marginBottom:3}}>📍 {s.guide}</div>
              <div style={{color:s.color+"bb",fontSize:10,marginBottom:isVis?8:0,fontStyle:"italic"}}>{s.note}</div>
              {isVis && s.fields.map(f=>{
                const isText = f.k.includes("url")||f.k==="repo"||f.k==="channel"||f.k.includes("email")||f.k.includes("name")||f.k.includes("username")||f.k.includes("_id")||f.k.includes("focus")||f.k.includes("blocker")||f.k.includes("date")||f.k.includes("page");
                return (
                  <div key={f.k} style={{marginBottom:5}}>
                    <div style={{color:"#4b5563",fontSize:9,fontFamily:"monospace",marginBottom:2}}>{f.l}</div>
                    <input type={isText?"text":"password"}
                      value={local[s.id]?.[f.k]||""} onChange={e=>setF(s.id,f.k,e.target.value)}
                      placeholder={f.l}
                      style={{width:"100%",background:"#111",border:`1px solid ${s.color}33`,borderRadius:6,padding:"7px 10px",color:"#e5e7eb",fontSize:11,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
                  </div>
                );
              })}
            </div>
          );
        })}
        <button onClick={()=>{onSave(local);setSaved(true);setTimeout(()=>setSaved(false),2000);}}
          style={{background:"#f59e0b",border:"none",borderRadius:9,padding:12,color:"#000",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"monospace",position:"sticky",bottom:0}}>
          {saved?"✅ SAVED TO BROWSER!":"💾 SAVE ALL CREDENTIALS"}
        </button>
      </div>
    </div>
  );
}

// ─── GITHUB PANEL ─────────────────────────────────────────────────────────────
function GithubPanel({creds, onContextLoaded}) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [customFiles, setCustomFiles] = useState("");
  const DEFAULT_FILES = [
    "apps/api/src/routes/metrics.ts",
    "apps/api/src/routes/analytics.ts",
    "apps/web/src/pages/Settings.tsx",
    "apps/web/src/pages/Health.tsx",
    "apps/web/src/pages/Dashboard.tsx",
    "apps/web/src/pages/Outcomes.tsx",
    "apps/web/src/pages/Billing.tsx",
  ];

  const fetchAll = async () => {
    setLoading(true);
    const token = creds?.github?.token;
    const repo = creds?.github?.repo || "saisnatadash/grassion";
    const extraFiles = customFiles.split("\n").map(f=>f.trim()).filter(Boolean);
    const allFiles = [...DEFAULT_FILES, ...extraFiles];
    const results = {};
    for(const path of allFiles) {
      try {
        const headers = token ? {Authorization:`token ${token}`} : {};
        const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {headers});
        const d = await r.json();
        if(d.content) results[path] = atob(d.content.replace(/\n/g,"")).slice(0,1000)+"...[truncated]";
        else results[path] = `[Error: ${d.message||"Not found"}]`;
      } catch(e) { results[path] = `[Error: ${e.message}]`; }
    }
    setFiles(results); setLoaded(true); setLoading(false);
    onContextLoaded(Object.entries(results).map(([p,c])=>`\n---${p}---\n${c}`).join("\n"));
  };

  return (
    <div style={{padding:16,overflowY:"auto",height:"100%"}}>
      <div style={{color:"#22c55e",fontFamily:"monospace",fontWeight:700,fontSize:13,marginBottom:4}}>🐙 LIVE GITHUB CODEBASE</div>
      <div style={{color:"#4b5563",fontSize:11,marginBottom:12}}>Load your real code so ARIA gives exact bug fixes with file names + line numbers.</div>
      <div style={{marginBottom:10}}>
        <div style={{color:"#6b7280",fontSize:10,fontFamily:"monospace",marginBottom:4}}>Additional file paths to load (one per line):</div>
        <textarea value={customFiles} onChange={e=>setCustomFiles(e.target.value)}
          placeholder="apps/api/src/routes/billing.ts&#10;apps/web/src/components/Chart.tsx"
          style={{width:"100%",height:70,background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:7,padding:"7px 10px",color:"#e5e7eb",fontSize:11,fontFamily:"monospace",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
      </div>
      <button onClick={fetchAll} disabled={loading}
        style={{background:loading?"#374151":loaded?"#16a34a22":"#e5e7eb22",border:`1px solid ${loaded?"#16a34a44":"#e5e7eb44"}`,color:loading?"#6b7280":loaded?"#22c55e":"#e5e7eb",padding:"8px 20px",borderRadius:8,cursor:loading?"not-allowed":"pointer",fontSize:12,fontFamily:"monospace",marginBottom:14}}>
        {loading?"⏳ Fetching...":loaded?"✅ Loaded — Refresh":"🐙 Load Live Codebase"}
      </button>
      {!creds?.github?.token && <div style={{color:"#f59e0b",fontSize:11,marginBottom:10}}>⚠️ No GitHub token set — add one in 🔑 Keys tab to load private repos.</div>}
      {loaded && (
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          <div style={{color:"#22c55e",fontSize:11,fontFamily:"monospace"}}>✅ {Object.keys(files).length} files loaded into ARIA + SSD memory</div>
          {Object.entries(files).map(([path,content])=>(
            <div key={path} style={{background:"#0a0a0a",border:"1px solid #1f2937",borderRadius:7,padding:10}}>
              <div style={{color:"#22c55e",fontFamily:"monospace",fontSize:10,marginBottom:4}}>📄 {path}</div>
              <pre style={{color:"#374151",fontSize:9,fontFamily:"monospace",margin:0,whiteSpace:"pre-wrap",maxHeight:80,overflow:"hidden"}}>{content.slice(0,200)}...</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DEPLOY GUIDE ─────────────────────────────────────────────────────────────
function DeployGuide() {
  const steps = [
    {n:"01",c:"#22c55e",t:"Push code to GitHub",code:`cd C:\\Users\\LENOVO\\OneDrive\\Desktop\\grassion-hq-project\\grassion-hq
git add .
git commit -m "feat: full upgrade — attachments, memory, all keys"
git push
# Vercel auto-deploys in 60 seconds`},
    {n:"02",c:"#ec4899",t:"ZEUS Auto-Posting (Fly.io backend)",code:`flyctl secrets set \\
  TWITTER_ACCESS_TOKEN="your_token" \\
  TWITTER_API_KEY="your_key" \\
  TWITTER_API_SECRET="your_secret" \\
  REDDIT_CLIENT_ID="your_id" \\
  REDDIT_CLIENT_SECRET="your_secret" \\
  DEVTO_API_KEY="your_key" \\
  --app grassion-api
fly deploy --app grassion-api`},
    {n:"03",c:"#a855f7",t:"Set OpenAI key on Fly.io (for API summaries)",code:`flyctl secrets set OPENAI_API_KEY=sk-YOUR-KEY-HERE --app grassion-api`},
    {n:"04",c:"#f59e0b",t:"Connect agents.grassion.com on Cloudflare",code:`1. Vercel → grassion-hq project → Settings → Domains → Add: agents.grassion.com
2. Cloudflare DNS → Add CNAME record:
   Name: agents
   Target: cname.vercel-dns.com
   Proxy: OFF (grey cloud)
3. Wait 2-5 minutes → agents.grassion.com goes live`},
  ];
  return (
    <div style={{padding:16,overflowY:"auto",height:"100%",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{color:"#f59e0b",fontFamily:"monospace",fontSize:12}}>🚀 DEPLOYMENT GUIDE</div>
      {steps.map((s,i)=>(
        <div key={i} style={{background:"#0a0a0a",border:`1px solid ${s.c}33`,borderRadius:10,padding:14}}>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <div style={{color:s.c,fontFamily:"monospace",fontSize:22,fontWeight:900,opacity:.3,flexShrink:0}}>{s.n}</div>
            <div style={{color:"#e5e7eb",fontWeight:700,fontSize:12,paddingTop:3}}>{s.t}</div>
          </div>
          <pre style={{background:"#050505",border:`1px solid ${s.c}22`,borderRadius:6,padding:10,color:s.c,fontSize:10,fontFamily:"monospace",overflowX:"auto",margin:0,whiteSpace:"pre-wrap",lineHeight:1.6}}>{s.code}</pre>
          <button onClick={()=>navigator.clipboard?.writeText(s.code)}
            style={{background:"transparent",border:`1px solid ${s.c}33`,color:s.c,padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:9,fontFamily:"monospace",marginTop:6}}>
            📋 Copy
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GrassionHQ() {
  const [activeAgent, setActiveAgent] = useState("ssd");
  const [convs, setConvs] = useState(()=>load("hqf_convs",{ssd:[],zeus:[],aria:[],nova:[],rex:[],finn:[],atlas:[]}));
  const [typing, setTyping] = useState({});
  const [newMsg, setNewMsg] = useState({});
  const [reports, setReports] = useState(()=>load("hqf_reports",[]));
  const [creds, setCreds] = useState(()=>load("hqf_creds",{}));
  const [deals, setDeals] = useState(()=>load("hqf_deals",INIT_DEALS));
  const [agentMemory, setAgentMemory] = useState(()=>load("hqf_memory",{}));
  const [tab, setTab] = useState("stats");
  const [collecting, setCollecting] = useState(false);
  const [ghCtx, setGhCtx] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(()=>window.innerWidth < 768);
  useEffect(()=>{
    const h=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatedImgs, setGeneratedImgs] = useState({});

  const updateDeals = (d) => { setDeals(d); save("hqf_deals", d); };
  const saveCreds = (c) => { setCreds(c); save("hqf_creds", c); };
  const updateMemory = (agentId, mem) => {
    const newMem = {...agentMemory, [agentId]:mem};
    setAgentMemory(newMem);
    save("hqf_memory", newMem);
  };

  const loadSession = useCallback((agentId, msgs) => {
    const updated = {...convs, [agentId]: msgs};
    setConvs(updated);
    save("hqf_convs", updated);
  }, [convs]);

  const clearChat = useCallback((agentId) => {
    const updated = {...convs, [agentId]: []};
    setConvs(updated);
    save("hqf_convs", updated);
  }, [convs]);

  // Build system prompt with memory injected
  const sysPrompt = useCallback((id) => {
    let s = AGENTS[id].basePrompt;
    const mem = agentMemory[id];
    if(mem && mem.trim()) s += `\n\n=== YOUR MEMORY (always follow these) ===\n${mem}`;
    const founderCtx = creds?.founder;
    if(founderCtx?.name) s += `\n\n=== FOUNDER CONTEXT ===\nName: ${founderCtx.name}\nEmail: ${founderCtx.email||""}\nCurrent MRR: $${founderCtx.current_mrr||0}\nPaying customers: ${founderCtx.current_customers||0}\nFocus this week: ${founderCtx.focus_this_week||"not set"}`;
    if(ghCtx && (id==="aria"||id==="ssd")) s += `\n\n=== LIVE CODEBASE ===\n${ghCtx}`;
    return s;
  }, [ghCtx, agentMemory, creds]);

  const sendMsg = useCallback(async (agentId, text, images=[]) => {
    const h = convs[agentId] || [];
    const uMsg = {role:"user", content:text, images};
    const newC = {...convs, [agentId]:[...h, uMsg]};
    setConvs(newC);
    setTyping(p=>({...p,[agentId]:true}));
    try {
      // Build messages for API — include image descriptions if present
      let apiText = text;
      if(images.length > 0) apiText += `\n\n[User attached ${images.length} image(s): ${images.map(i=>i.name).join(", ")}]`;
      const apiMsgs = [...h.map(m=>({role:m.role,content:m.content})), {role:"user",content:apiText}];
      const resp = await callAI(sysPrompt(agentId), apiMsgs, creds);
      const aMsg = {role:"assistant", content:resp};
      const final = {...newC, [agentId]:[...newC[agentId], aMsg]};
      setConvs(final);
      save("hqf_convs", final);
      if(agentId !== activeAgent) setNewMsg(p=>({...p,[agentId]:true}));
      // DALL-E image generation for ZEUS
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
      const resp = await callAI(sysPrompt(agentId), [{role:"user",content:"Give SSD a concise daily briefing (max 5 bullet points): your top finding, the most important action, what the founder should do next, any blockers, and one thing you'd improve about yourself."}], creds);
      const report = {agentId, content:resp, timestamp:Date.now()};
      const newR = [...reports, report];
      setReports(newR);
      save("hqf_reports", newR);
      setNewMsg(p=>({...p,ssd:true}));
    } catch(e) { console.error(e); }
    setTyping(p=>({...p,[agentId]:false}));
  }, [reports, creds, sysPrompt]);

  const getAllReports = useCallback(async () => {
    setCollecting(true);
    for(const id of ["zeus","aria","nova","rex","finn"]) await requestReport(id);
    setCollecting(false);
  }, [requestReport]);

  const select = (id) => { setActiveAgent(id); setNewMsg(p=>({...p,[id]:false})); };

  const hasKey = !!(creds?.openai?.api_key?.trim());
  const aiMode = hasKey ? "GPT-4o-mini ✓" : "NO KEY";
  const TABS = [
    ["stats","📊 Stats"],
    ["agents","👥 Agents"],
    ["inbox","📬 SSD Inbox"],
    ["sales","🎯 Sales"],
    ["github","🐙 GitHub"],
    ["keys","🔑 Keys"],
    ["deploy","🚀 Deploy"],
  ];

  return (
    <div style={{background:"#030303",height:"100vh",color:"#e5e7eb",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden",position:"relative"}}>
      <style>{`*{box-sizing:border-box;} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0a0a0a} ::-webkit-scrollbar-thumb{background:#374151;border-radius:4px} textarea{font-family:monospace}`}</style>

      {/* Header — fixed height, tabs scroll horizontally on mobile */}
      <div style={{padding:"6px 12px",borderBottom:"1px solid #0d0d0d",background:"#050505",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{fontSize:18,flexShrink:0}}>🌱</span>
        {!isMobile && <div style={{marginRight:4,flexShrink:0}}>
          <div style={{color:"#22c55e",fontWeight:900,fontSize:14,fontFamily:"monospace",letterSpacing:1}}>GRASSION HQ</div>
          <div style={{color:"#1f2937",fontSize:8,fontFamily:"monospace"}}>7 AI Agents · Memory</div>
        </div>}
        {/* Tabs — scrollable row, no wrap */}
        <div style={{display:"flex",gap:2,overflowX:"auto",flex:1,scrollbarWidth:"none"}}>
          <style>{`.ghq-tabs::-webkit-scrollbar{display:none}`}</style>
          <div className="ghq-tabs" style={{display:"flex",gap:2,minWidth:"max-content"}}>
            {TABS.map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{background:tab===t?"#111":"transparent",border:`1px solid ${tab===t?"#374151":"transparent"}`,color:tab===t?"#e5e7eb":"#4b5563",padding:"5px 9px",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"monospace",whiteSpace:"nowrap",flexShrink:0}}>
                {isMobile?l.split(" ")[0]:l}
                {t==="inbox"&&reports.length>0?` (${reports.length})`:""}
                {t==="agents"&&Object.values(newMsg).some(Boolean)?" 🔴":""}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:4,fontSize:9,fontFamily:"monospace",flexShrink:0}}>
          <span style={{background:hasKey?"#10a37f22":"#ef444422",color:hasKey?"#10a37f":"#ef4444",padding:"2px 6px",borderRadius:5,border:`1px solid ${hasKey?"#10a37f44":"#ef444444"}`,fontWeight:700}}>{isMobile?(hasKey?"✓":"!"):(aiMode)}</span>
          {!isMobile && creds?.openai?.api_key && <span style={{background:"#6366f122",color:"#818cf8",padding:"2px 6px",borderRadius:5,border:"1px solid #6366f144"}}>🎨</span>}
          {!isMobile && ghCtx && <span style={{background:"#e5e7eb11",color:"#9ca3af",padding:"2px 6px",borderRadius:5,border:"1px solid #37414155"}}>🐙</span>}
        </div>
      </div>

      {/* No-Key Banner */}
      {!hasKey && (
        <div style={{background:"#450a0a",borderBottom:"1px solid #ef4444",padding:"8px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <span style={{fontSize:16}}>⚠️</span>
          <span style={{color:"#fca5a5",fontSize:12,fontFamily:"monospace",flex:1}}>
            <strong>Agents are inactive.</strong> Go to <strong>🔑 Keys</strong> tab → paste your OpenAI API key (sk-...) → click SAVE. Then all agents will work.
          </span>
          <button onClick={()=>setTab("keys")} style={{background:"#ef4444",border:"none",borderRadius:6,padding:"5px 14px",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"monospace",flexShrink:0}}>
            ADD KEY NOW →
          </button>
        </div>
      )}

      {/* Content — fills remaining height, no blank right side */}
      <div style={{flex:1,overflow:"hidden",display:"flex",minHeight:0}}>
        {tab==="agents" ? (
          <>
            {/* Agent Sidebar — hidden on mobile via showSidebar state */}
            {(showSidebar || !isMobile) && (
              <div style={{width:isMobile?"100%":170,borderRight:"1px solid #0d0d0d",padding:7,display:"flex",flexDirection:"column",gap:4,overflowY:"auto",flexShrink:0,position:isMobile?"absolute":"relative",zIndex:isMobile?10:1,background:"#030303",height:"100%",left:0,top:0}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                  <div style={{color:"#1f2937",fontSize:8,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:1}}>AI Team</div>
                  {isMobile && <button onClick={()=>setShowSidebar(false)} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16,padding:0}}>×</button>}
                </div>
                {Object.keys(AGENTS).map(id=>{
                  const a = AGENTS[id];
                  const hasMem = !!(agentMemory[id]?.trim());
                  return (
                    <button key={id} onClick={()=>{select(id);if(isMobile)setShowSidebar(false);}}
                      style={{background:activeAgent===id?a.bg:"transparent",border:`1px solid ${activeAgent===id?a.border:"#1f2937"}`,borderRadius:7,padding:"7px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:7,textAlign:"left",position:"relative"}}>
                      {newMsg[id] && <div style={{position:"absolute",top:4,right:4,width:5,height:5,borderRadius:"50%",background:a.color,animation:"pulse2 1.5s infinite"}}/>}
                      <span style={{fontSize:15}}>{a.emoji}</span>
                      <div>
                        <div style={{color:a.color,fontWeight:700,fontSize:11,fontFamily:"monospace"}}>{a.name} {hasMem?"🧠":""}</div>
                        <div style={{color:"#374151",fontSize:9}}>{a.title.split("—")[0].trim()}</div>
                      </div>
                    </button>
                  );
                })}
                <div style={{borderTop:"1px solid #111",paddingTop:6,marginTop:2}}>
                  <div style={{color:"#1f2937",fontSize:8,fontFamily:"monospace",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Brief → SSD</div>
                  {["zeus","aria","nova","rex","finn","atlas"].map(id=>{
                    const a=AGENTS[id];
                    return (
                      <button key={id} onClick={()=>requestReport(id)}
                        style={{display:"flex",alignItems:"center",gap:4,width:"100%",background:"transparent",border:"none",color:"#4b5563",padding:"2px 0",cursor:"pointer",fontSize:9,textAlign:"left"}}>
                        <span>{a.emoji}</span><span style={{color:a.color}}>{a.name}</span>→SSD
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Chat — fills remaining width */}
            <div style={{flex:1,overflow:"hidden",position:"relative",display:"flex",flexDirection:"column",minWidth:0}}>
              {isMobile && !showSidebar && (
                <button onClick={()=>setShowSidebar(true)}
                  style={{position:"absolute",top:8,left:8,zIndex:5,background:"#111",border:"1px solid #374151",color:"#9ca3af",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"monospace"}}>
                  ☰ {AGENTS[activeAgent]?.name}
                </button>
              )}
              <ChatArea
                agent={activeAgent}
                messages={convs[activeAgent]||[]}
                isTyping={!!typing[activeAgent]}
                onSend={(msg,imgs)=>sendMsg(activeAgent,msg,imgs)}
                onReport={requestReport}
                creds={creds}
                generatingImg={generatingImg}
                generatedImgs={generatedImgs}
                agentMemory={agentMemory}
                onUpdateMemory={updateMemory}
                onLoadSession={loadSession}
                onClearChat={clearChat}
              />
            </div>
          </>
        ) : (
          /* All other tabs — wrap in flex:1 so they fill full width */
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minWidth:0}}>
            {tab==="stats" && <StatsDash deals={deals}/>}
            {tab==="inbox" && <SSDInbox reports={reports} onGetAll={getAllReports} collecting={collecting}/>}
            {tab==="sales" && (
              <Pipeline
                deals={deals}
                setDeals={updateDeals}
                onAskRex={msg=>{setTab("agents");select("rex");sendMsg("rex",msg,[]);}}
                creds={creds}
              />
            )}
            {tab==="github" && <GithubPanel creds={creds} onContextLoaded={setGhCtx}/>}
            {tab==="keys" && <CredsPanel creds={creds} onSave={saveCreds}/>}
            {tab==="deploy" && <DeployGuide/>}
          </div>
        )}
      </div>
    </div>
  );
}