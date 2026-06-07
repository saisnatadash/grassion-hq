import { useState, useEffect, useRef } from "react";

// ─── 30-DAY CALENDAR ──────────────────────────────────────────────────────────
// [day, slot, week, phase, topic, accentColor, imageStyle]
const CAL = [
  [1,"9am",1,"Spending Blindspot","You approve budgets you can never measure","#ef4444","red"],
  [1,"6pm",1,"Spending Blindspot","The renewal email nobody questions","#ef4444","red"],
  [2,"9am",1,"Spending Blindspot","Ghost seats bleeding your budget","#ef4444","red"],
  [2,"6pm",1,"Spending Blindspot","The tool nobody admitted they stopped using","#ef4444","red"],
  [3,"9am",1,"Spending Blindspot","CFO vs CTO: the ROI conversation nobody wins","#ef4444","red"],
  [3,"6pm",1,"Spending Blindspot","We measure everything except what we spend on devs","#ef4444","red"],
  [4,"9am",1,"Spending Blindspot","The $800K mistake I watched happen","#ef4444","red"],
  [4,"6pm",1,"Spending Blindspot","Nobody owns the dev tools audit","#ef4444","red"],
  [5,"9am",1,"Spending Blindspot","Dead weight in your developer toolkit","#ef4444","red"],
  [5,"6pm",1,"Spending Blindspot","The audit-it-next-quarter lie","#ef4444","red"],
  [6,"9am",1,"Spending Blindspot","Seat count vs usage count — the gap nobody sees","#ef4444","red"],
  [6,"6pm",1,"Spending Blindspot","What happens when you finally run the numbers","#ef4444","red"],
  [7,"9am",1,"Spending Blindspot","Week 1 wrap: the blindspot nobody wants to own","#ef4444","red"],
  [7,"6pm",1,"Spending Blindspot","SaaS renewals are built on your laziness","#ef4444","red"],
  [8,"9am",2,"Accountability Gap","Nobody gets fired for approving AI tools","#f97316","orange"],
  [8,"6pm",2,"Accountability Gap","The dev who stopped using AI tools after week 2","#f97316","orange"],
  [9,"9am",2,"Accountability Gap","AI tools were supposed to 10x productivity","#f97316","orange"],
  [9,"6pm",2,"Accountability Gap","Senior devs hate it. Juniors love it. Now what?","#f97316","orange"],
  [10,"9am",2,"Accountability Gap","The code review problem nobody talks about","#f97316","orange"],
  [10,"6pm",2,"Accountability Gap","We ship faster and break more — is that a win?","#f97316","orange"],
  [11,"9am",2,"Accountability Gap","The VP asked to justify $400K in AI tools","#f97316","orange"],
  [11,"6pm",2,"Accountability Gap","Activity metrics are lying about AI productivity","#f97316","orange"],
  [12,"9am",2,"Accountability Gap","The org that bought 3 AI coding tools at once","#f97316","orange"],
  [12,"6pm",2,"Accountability Gap","The hallucination problem is your liability now","#f97316","orange"],
  [13,"9am",2,"Accountability Gap","Best engineers don't need AI. Worst overuse it.","#f97316","orange"],
  [13,"6pm",2,"Accountability Gap","The standup where nobody mentions the AI tool","#f97316","orange"],
  [14,"9am",2,"Accountability Gap","Week 2: why do smart leaders let this happen?","#f97316","orange"],
  [14,"6pm",2,"Accountability Gap","What if you knew which devs weren't using it?","#f97316","orange"],
  [15,"9am",3,"Industry Pattern","This isn't your problem. It's everyone's.","#3b82f6","blue"],
  [15,"6pm",3,"Industry Pattern","Survey data that should embarrass us all","#3b82f6","blue"],
  [16,"9am",3,"Industry Pattern","How did we get here? A brief history","#3b82f6","blue"],
  [16,"6pm",3,"Industry Pattern","The Series B team burning cash on unmeasured tools","#3b82f6","blue"],
  [17,"9am",3,"Industry Pattern","The tool vendor's dirty secret","#3b82f6","blue"],
  [17,"6pm",3,"Industry Pattern","Why engineers don't report low tool usage","#3b82f6","blue"],
  [18,"9am",3,"Industry Pattern","The $50B question nobody asks","#3b82f6","blue"],
  [18,"6pm",3,"Industry Pattern","Why the best CTOs are pushing back on AI tools","#3b82f6","blue"],
  [19,"9am",3,"Industry Pattern","The codebase rot nobody connects to AI tools","#3b82f6","blue"],
  [19,"6pm",3,"Industry Pattern","India's teams: fastest adopters, least measurement","#3b82f6","blue"],
  [20,"9am",3,"Industry Pattern","What the data actually says about AI productivity","#3b82f6","blue"],
  [20,"6pm",3,"Industry Pattern","The retro nobody runs: did the AI tool help?","#3b82f6","blue"],
  [21,"9am",3,"Industry Pattern","Week 3: the picture is getting clear","#3b82f6","blue"],
  [21,"6pm",3,"Industry Pattern","The problem is solvable. We need to decide it matters.","#3b82f6","blue"],
  [22,"9am",4,"Building in Public","Why I'm building something to fix this problem","#22c55e","green"],
  [22,"6pm",4,"Building in Public","What 20 CTO conversations taught me","#22c55e","green"],
  [23,"9am",4,"Building in Public","The first version was terrible","#22c55e","green"],
  [23,"6pm",4,"Building in Public","The moment I almost gave up","#22c55e","green"],
  [24,"9am",4,"Building in Public","What being a non-technical founder actually feels like","#22c55e","green"],
  [24,"6pm",4,"Building in Public","The feedback that changed everything","#22c55e","green"],
  [25,"9am",4,"Building in Public","Building in Bhubaneswar for CTOs in San Francisco","#22c55e","green"],
  [25,"6pm",4,"Building in Public","The infrastructure is live. The anxiety is real.","#22c55e","green"],
  [26,"9am",4,"Building in Public","What I'd tell myself 6 months ago","#22c55e","green"],
  [26,"6pm",4,"Building in Public","The metric I track that has nothing to do with revenue","#22c55e","green"],
  [27,"9am",4,"Building in Public","To every CTO who DM'd me about this problem","#22c55e","green"],
  [27,"6pm",4,"Building in Public","72 hours from now everything changes","#22c55e","green"],
  [28,"9am",4,"Building in Public","24 hours. The problem. The gap. The answer.","#22c55e","green"],
  [28,"6pm",4,"Building in Public","Tonight I can't sleep","#22c55e","green"],
  [29,"9am",5,"LAUNCH","Introducing Grassion — we built the answer","#a855f7","purple"],
  [29,"6pm",5,"LAUNCH","The exact numbers Grassion shows you","#a855f7","purple"],
  [30,"9am",5,"POST-LAUNCH","30 days. One problem. One solution.","#a855f7","purple"],
  [30,"6pm",5,"POST-LAUNCH","To everyone who said 'this is exactly my problem'","#a855f7","purple"],
];

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM = `You are a thought leader in engineering management writing about problems with AI coding tools and dev tool spending ROI.

CONTEXT ABOUT THE AUTHOR:
- Non-technical founder building Grassion (grassion.com) — a tool that shows CTOs if their GitHub Copilot and Cursor spend is actually working
- Based in Bhubaneswar, Odisha, India — building for engineering leaders in San Francisco, Dubai, London
- Has spoken with 20+ CTOs who confirmed this problem is real and universal
- Grassion connects to GitHub, shows per-developer AI tool ROI, detects seat waste, gives codebase health score 0-100

GRASSION PRODUCT DETAILS (only mention when phase is LAUNCH or POST-LAUNCH):
- Connects to GitHub via OAuth
- Shows seat utilization rate per developer
- Tracks AI PR revert rate (PRs written with AI that get reverted)
- Codebase health score 0-100 (weekly trend)
- Detects ghost seats — licenses paid, nobody using
- 2-minute dashboard for CTOs
- grassion.com

WRITING RULES:
- ZERO product promotion unless topic explicitly says LAUNCH or POST-LAUNCH
- Direct, peer-to-peer CTO voice. Data-driven. No fluff.
- Make readers physically nod and say "this is exactly my problem"
- Write ONLY the post content — no preamble, no "here is your post", no metadata
- No em-dashes. Use plain dashes or restructure sentences.`;

// ─── PLATFORM INSTRUCTIONS ───────────────────────────────────────────────────
const PINSTR = {
  linkedin: `LinkedIn post format:
- 900-1200 characters total
- Start with ONE shocking stat, confession, or observation as a hook (single line, no hashtag)
- 3-5 short paragraphs, each 1-3 lines, with blank lines between them
- Build tension through the middle
- End with a provocative question that makes CTOs admit they face this
- 3 relevant hashtags at the very end only: #CTOs #EngineeringLeadership #AITools
- Conversational but authoritative`,

  twitter: `Twitter/X thread format:
- 8-10 tweets numbered 1/ 2/ 3/ etc.
- Tweet 1: Scroll-stopping hook under 250 chars. Bold claim or uncomfortable truth.
- Tweets 2-7: Build the argument, one sharp point per tweet. Each under 280 chars.
- Tweet 8-9: The insight or uncomfortable truth
- Final tweet: Question or call to reflect. Add relevant hashtags only on the last tweet.
- Each tweet must stand alone but build on the previous
- No filler. Every tweet earns its place.`
};

// ─── TOPIC-SPECIFIC EXTRA CONTEXT ────────────────────────────────────────────
const EXTRA = {
  "You approve budgets you can never measure": "CTOs approve $50K+ in dev tools with zero process to verify usage. Lead with a specific dollar number. Confessional tone — make the reader recognise themselves. End with a question.",
  "Ghost seats bleeding your budget": "23% of software seats in any org go completely unused. Show the math for a 100-person team paying for Copilot at $19/seat/month. Ghost licenses, paid monthly, never touched, auto-renewing.",
  "CFO vs CTO: the ROI conversation nobody wins": "The moment every CTO dreads. CFO asks: 'What's the ROI on this $400K?' Internal panic. Vague answer about 'developer productivity'. Awkward silence. Make every CTO reading this feel it physically.",
  "The $800K mistake I watched happen": "First-person observer story. $800K in dev tools across an engineering org. Zero accountability mechanism. Write what happened when the board asked for ROI proof. Specific details make this real.",
  "Nobody gets fired for approving AI tools": "AI tool budgets get rubber-stamped because saying no feels like blocking innovation. So they get approved, unmeasured, renewed. Write about this herd mentality in engineering leadership.",
  "AI tools were supposed to 10x productivity": "The gap between vendor marketing promises (10x productivity, 55% faster coding) and what most teams actually experience. The average hides massive individual variation. Some benefit enormously, some see negative effects.",
  "The VP asked to justify $400K in AI tools": "VP Engineering faces a board meeting. Must justify $400K in AI tools. Has usage dashboards showing activity metrics (commits, PRs, lines written) but zero outcome data. Write the anxiety, the scramble, the vague answer.",
  "The tool vendor's dirty secret": "AI coding tool vendors have detailed internal usage data. They know exactly which seats are active and which are ghost seats. They never proactively share low-usage data with customers. Unused seats renew just the same.",
  "Why I'm building something to fix this problem": "Building-in-public intro. 3 weeks of problem posts done. Now building. DO NOT name the product yet. Explain why this problem personally drove you to build something. Non-technical founder from Bhubaneswar.",
  "The moment I almost gave up": "Raw honest post about almost quitting. What made you doubt it. What made you continue. Not a Hollywood comeback — just real founder doubt and the small thing that pulled you through.",
  "Building in Bhubaneswar for CTOs in San Francisco": "The strange experience of building something in Bhubaneswar, Odisha that engineering leaders in San Francisco, Dubai, and London actually need. Geographic paradox. Write with self-aware pride.",
  "72 hours from now everything changes": "Teaser post. 72 hours from launch. DO NOT say what it is. Maximum tension. Reference the 4 weeks of problem posts. Short, punchy, impossible to ignore.",
  "Tonight I can't sleep": "Launch eve. Everything is built, tested, live. Tomorrow it goes public. Raw honest feeling in under 150 words. Every founder who has been here will recognise this immediately.",
  "Introducing Grassion — we built the answer": "THE LAUNCH POST. 28 days of problem content — the payoff moment. Reveal: Grassion connects to GitHub, shows CTOs if their Copilot and Cursor spend is actually working — per-developer ROI, seat waste detection, codebase health score 0-100. Connect every major problem from the past 28 days to what Grassion solves. This is the post the audience has been waiting for. Include grassion.com prominently.",
  "The exact numbers Grassion shows you": "Launch follow-up. Be hyper-specific: seat utilization rate per developer, AI PR revert rate, codebase health score 0-100, weekly trends, ghost seat detection. What the dashboard actually tells a CTO in exactly 2 minutes. Convert readers to signups. grassion.com",
  "30 days. One problem. One solution.": "Closing reflection. Look back at the 30-day journey — from spending blindspot to accountability gap to industry pattern to building in public to launch. What you learned. What surprised you. Gratitude without being sappy. Include grassion.com.",
};

// ─── IMAGE GENERATOR ─────────────────────────────────────────────────────────
function makeImage(day, slot, topic, accentColor, phase) {
  const cv = document.createElement("canvas");
  cv.width = 1200; cv.height = 630;
  const ctx = cv.getContext("2d");

  // Background gradient
  const bgMap = {
    "#ef4444": "#0c0000", "#f97316": "#0a0400",
    "#3b82f6": "#00040f", "#22c55e": "#001008", "#a855f7": "#070010"
  };
  const bg = bgMap[accentColor] || "#080808";
  const grad = ctx.createLinearGradient(0, 0, 1200, 630);
  grad.addColorStop(0, bg);
  grad.addColorStop(0.6, "#0d0d0d");
  grad.addColorStop(1, "#111");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  // Radial glow left side
  const glow = ctx.createRadialGradient(300, 315, 0, 300, 315, 420);
  glow.addColorStop(0, accentColor + "30");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1200, 630);

  // Right side: bar chart visualization
  const bars = [0.35, 0.72, 0.48, 0.91, 0.55, 0.83, 0.42, 0.76, 0.88, 0.61, 0.94, 0.5];
  bars.forEach((h, i) => {
    const bx = 720 + i * 40, maxH = 240, bh = h * maxH, by = 400 - bh;
    const barGrad = ctx.createLinearGradient(0, by, 0, 400);
    barGrad.addColorStop(0, accentColor + "cc");
    barGrad.addColorStop(1, accentColor + "18");
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(bx, by, 26, bh, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.fillRect(bx, by, 26, 3);
  });

  // Dot grid right background
  ctx.fillStyle = accentColor + "12";
  for (let x = 700; x < 1180; x += 32) {
    for (let y = 60; y < 580; y += 32) {
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Horizontal grid lines behind bars
  ctx.strokeStyle = "#ffffff08"; ctx.lineWidth = 1;
  [220, 290, 360].forEach(y => {
    ctx.beginPath(); ctx.moveTo(700, y); ctx.lineTo(1170, y); ctx.stroke();
  });

  // Top accent bar
  const topBar = ctx.createLinearGradient(0, 0, 800, 0);
  topBar.addColorStop(0, accentColor);
  topBar.addColorStop(1, "transparent");
  ctx.fillStyle = topBar;
  ctx.fillRect(0, 0, 1200, 4);

  // Left accent bar
  const leftBar = ctx.createLinearGradient(0, 0, 0, 630);
  leftBar.addColorStop(0, accentColor);
  leftBar.addColorStop(1, "transparent");
  ctx.fillStyle = leftBar;
  ctx.fillRect(0, 0, 4, 630);

  // Phase badge
  ctx.fillStyle = accentColor + "22";
  ctx.beginPath();
  ctx.roundRect(60, 52, 200, 34, 17);
  ctx.fill();
  ctx.strokeStyle = accentColor + "44";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(60, 52, 200, 34, 17);
  ctx.stroke();
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = accentColor;
  ctx.textAlign = "center";
  ctx.fillText(`WEEK ${Math.ceil(day / 7)} · DAY ${day} · ${slot.toUpperCase()} IST`, 160, 74);
  ctx.textAlign = "left";

  // Main text or LAUNCH graphic
  if (phase === "LAUNCH" || phase === "POST-LAUNCH") {
    ctx.font = "900 120px Georgia";
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 60;
    ctx.fillText("LIVE", 60, 330);
    ctx.shadowBlur = 0;
    ctx.font = "bold 26px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("grassion.com", 60, 385);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("AI Dev Tools · ROI Intelligence · GitHub-native", 60, 420);
  } else {
    const words = topic.toUpperCase().split(" ");
    let line = "", y = 200;
    ctx.font = "900 56px Georgia";
    words.forEach(word => {
      const test = line + word + " ";
      if (ctx.measureText(test).width > 520 && line) {
        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 20;
        ctx.fillText(line.trim(), 60, y);
        ctx.shadowBlur = 0;
        line = word + " ";
        y += 68;
      } else { line = test; }
    });
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
    ctx.fillText(line.trim(), 60, y);
    ctx.shadowBlur = 0;
  }

  // Bottom bar
  ctx.fillStyle = "#ffffff04";
  ctx.fillRect(0, 590, 1200, 40);
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = "#374151";
  ctx.textAlign = "left";
  ctx.fillText(phase === "LAUNCH" || phase === "POST-LAUNCH"
    ? "grassion.com — Where AI Code Meets Accountability"
    : `Day ${day} of 30 · Building in public · grassion.com`, 60, 615);
  ctx.fillStyle = slot === "9am" ? "#f97316" : "#3b82f6";
  ctx.textAlign = "right";
  ctx.fillText(slot === "9am" ? "☀ Morning Post" : "🌆 Evening Post", 1140, 615);

  return cv.toDataURL("image/png");
}

// ─── GENERATE POST VIA API ───────────────────────────────────────────────────
async function generatePost(topic, phase, platform) {
  const extra = EXTRA[topic] || `Write a powerful post about: "${topic}". ${phase === "LAUNCH" || phase === "POST-LAUNCH" ? "Include grassion.com." : "No product promotion."}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `PLATFORM: ${platform}\n\nFORMAT INSTRUCTIONS:\n${PINSTR[platform]}\n\nTOPIC CONTEXT:\n${extra}\n\nPhase: ${phase}`
      }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.map(b => b.text || "").join("") || "";
}

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
const SK = "zeus_v8";
const loadPosts = () => { try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch { return []; } };
const savePosts = (p) => { try { localStorage.setItem(SK, JSON.stringify(p)); } catch {} };

// ─── PHASE CONFIG ─────────────────────────────────────────────────────────────
const PHASES = [
  { label: "Week 1", sub: "Spending Blindspot", color: "#ef4444", days: "1–7" },
  { label: "Week 2", sub: "Accountability Gap", color: "#f97316", days: "8–14" },
  { label: "Week 3", sub: "Industry Pattern", color: "#3b82f6", days: "15–21" },
  { label: "Week 4", sub: "Building in Public", color: "#22c55e", days: "22–28" },
  { label: "Launch", sub: "🚀 Grassion Goes Live", color: "#a855f7", days: "29–30" },
];

// ─── DOTS LOADER ─────────────────────────────────────────────────────────────
function Dots() {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: "#ec4899",
          display: "inline-block",
          animation: `zdot 1.2s ${i * 0.2}s infinite ease-in-out`
        }} />
      ))}
    </span>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, onDelete, onPosted, accent }) {
  const [expanded, setExpanded] = useState(false);
  const [copying, setCopying] = useState(false);
  const isLI = post.platform === "linkedin";
  const isX = post.platform === "twitter";
  const platformColor = isLI ? "#0077b5" : "#1da1f2";
  const platformLabel = isLI ? "💼 LinkedIn" : "🐦 Twitter/X";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch {}
  };

  const openPost = () => {
    if (isLI) {
      window.open("https://www.linkedin.com/feed/", "_blank");
    } else {
      const text = encodeURIComponent(post.content.slice(0, 280));
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    }
    if (!post.posted) onPosted(post.id);
  };

  const downloadImg = () => {
    if (!post.img) return;
    const a = document.createElement("a");
    a.href = post.img;
    a.download = `grassion-day${post.day}-${post.slot.replace(":", "")}.png`;
    a.click();
  };

  return (
    <div style={{
      background: "#0d0d0d",
      border: `1px solid ${post.posted ? "#22c55e33" : platformColor + "33"}`,
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color .2s"
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        gap: 10
      }}>
        <div style={{
          background: platformColor + "20",
          border: `1px solid ${platformColor}40`,
          borderRadius: 8,
          padding: "3px 10px",
          fontSize: 11,
          color: platformColor,
          fontWeight: 700
        }}>{platformLabel}</div>
        <div style={{ fontSize: 11, color: "#6b7280" }}>
          Day {post.day} · {post.slot} · {post.phase}
        </div>
        {post.posted && (
          <div style={{ marginLeft: "auto", color: "#22c55e", fontSize: 11 }}>✓ Posted</div>
        )}
        <button onClick={() => onDelete(post.id)} style={{
          marginLeft: post.posted ? 8 : "auto",
          background: "none", border: "none",
          color: "#374151", cursor: "pointer", fontSize: 13, padding: "0 4px"
        }}>✕</button>
      </div>

      {/* Topic */}
      <div style={{ padding: "10px 14px 0", fontSize: 12, color: accent || "#9ca3af", fontWeight: 700 }}>
        {post.topic}
      </div>

      {/* Content preview */}
      <div style={{ padding: "8px 14px 12px" }}>
        <div style={{
          fontSize: 13,
          color: "#d1d5db",
          lineHeight: 1.65,
          maxHeight: expanded ? "none" : 90,
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          fontFamily: "'Georgia', serif",
          position: "relative"
        }}>
          {post.content}
          {!expanded && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
              background: "linear-gradient(transparent, #0d0d0d)"
            }} />
          )}
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{
          background: "none", border: "none", color: "#6b7280",
          cursor: "pointer", fontSize: 11, padding: "4px 0", fontFamily: "monospace"
        }}>
          {expanded ? "▲ Collapse" : "▼ Show full post"}
        </button>
      </div>

      {/* Image preview */}
      {post.img && (
        <div style={{ padding: "0 14px 10px" }}>
          <img src={post.img} alt="post visual" style={{
            width: "100%", borderRadius: 10, border: `1px solid ${platformColor}22`,
            maxHeight: 200, objectFit: "cover"
          }} />
        </div>
      )}

      {/* Actions */}
      <div style={{
        padding: "10px 14px 12px",
        borderTop: "1px solid #1a1a1a",
        display: "flex", gap: 8, flexWrap: "wrap"
      }}>
        <button onClick={copy} style={{
          padding: "8px 14px",
          background: copying ? "#14301a" : "#111",
          border: `1px solid ${copying ? "#22c55e" : "#2d2d2d"}`,
          color: copying ? "#22c55e" : "#9ca3af",
          borderRadius: 8, cursor: "pointer", fontSize: 11,
          fontFamily: "monospace", fontWeight: 700, transition: "all .2s"
        }}>
          {copying ? "✓ Copied!" : "📋 Copy text"}
        </button>
        <button onClick={openPost} style={{
          padding: "8px 14px",
          background: platformColor + "20",
          border: `1px solid ${platformColor}60`,
          color: platformColor,
          borderRadius: 8, cursor: "pointer", fontSize: 11,
          fontFamily: "monospace", fontWeight: 700
        }}>
          🚀 Open {isLI ? "LinkedIn" : "Twitter/X"}
        </button>
        {post.img && (
          <button onClick={downloadImg} style={{
            padding: "8px 14px",
            background: "#111",
            border: "1px solid #2d2d2d",
            color: "#9ca3af",
            borderRadius: 8, cursor: "pointer", fontSize: 11,
            fontFamily: "monospace"
          }}>
            🖼 Download image
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("cal");
  const [posts, setPosts] = useState(loadPosts);
  const [generating, setGenerating] = useState(null); // {day,slot}
  const [genStatus, setGenStatus] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const d = today.getDate();
    return Math.min(d, 30);
  });
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setIstTime(new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit", minute: "2-digit", hour12: false
      }).format(new Date()));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { savePosts(posts); }, [posts]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const calByDay = {};
  CAL.forEach(e => {
    if (!calByDay[e[0]]) calByDay[e[0]] = [];
    calByDay[e[0]].push(e);
  });

  const doGenerate = async (entry) => {
    const [day, slot,, phase, topic, accent] = entry;
    setGenerating({ day, slot });

    for (const platform of ["linkedin", "twitter"]) {
      const pName = platform === "linkedin" ? "LinkedIn" : "Twitter/X";
      setGenStatus(`Writing ${pName}…`);
      try {
        const content = await generatePost(topic, phase, platform);
        const img = makeImage(day, slot, topic, accent, phase);
        setPosts(prev => [{
          id: `${Date.now()}_${platform}`,
          platform,
          day, slot, phase, topic, accent,
          content, img,
          posted: false,
          createdAt: Date.now()
        }, ...prev]);
      } catch (e) {
        showToast(`Error: ${e.message}`, "err");
      }
    }

    showToast(`✓ Day ${day} ${slot} — LinkedIn + Twitter ready`);
    setGenerating(null);
    setGenStatus("");
    setTab("posts");
  };

  const dayPosts = calByDay[selectedDay] || [];
  const filteredPosts = posts.filter(p => filterPlatform === "all" || p.platform === filterPlatform);
  const totalPosted = posts.filter(p => p.posted).length;
  const totalDrafts = posts.filter(p => !p.posted).length;

  const phaseColor = (day) => {
    if (day <= 7) return "#ef4444";
    if (day <= 14) return "#f97316";
    if (day <= 21) return "#3b82f6";
    if (day <= 28) return "#22c55e";
    return "#a855f7";
  };

  return (
    <div style={{ fontFamily: "monospace", background: "#080808", minHeight: "100vh", color: "#e5e7eb" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #ec4899; border-radius: 2px; }
        button:active { transform: scale(.97); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes zdot { 0%,80%,100% { transform: scale(.3); opacity: .2; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: toast.type === "err" ? "#1f0000" : "#001a0a",
          border: `1px solid ${toast.type === "err" ? "#dc2626" : "#22c55e"}`,
          color: toast.type === "err" ? "#f87171" : "#4ade80",
          padding: "10px 18px", borderRadius: 10, fontSize: 13,
          animation: "fadeUp .2s", fontFamily: "monospace"
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #161616",
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12,
        background: "#0a0a0a", flexWrap: "wrap"
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #ec4899, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17
        }}>⚡</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>ZEUS</div>
          <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: 3 }}>GRASSION SOCIAL AGENT</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            background: "#0a1a0a", border: "1px solid #22c55e22",
            borderRadius: 18, padding: "3px 11px", fontSize: 11, color: "#22c55e",
            display: "flex", alignItems: "center", gap: 5
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            IST {istTime}
          </div>
          {totalPosted > 0 && (
            <div style={{ background: "#1a0010", border: "1px solid #ec489922", borderRadius: 18, padding: "3px 11px", fontSize: 11, color: "#ec4899" }}>
              {totalPosted} posted
            </div>
          )}
          {totalDrafts > 0 && (
            <div style={{ background: "#0a0a1a", border: "1px solid #3b82f622", borderRadius: 18, padding: "3px 11px", fontSize: 11, color: "#3b82f6" }}>
              {totalDrafts} drafts
            </div>
          )}
        </div>
      </div>

      {/* Phase ribbon */}
      <div style={{
        background: "#09080a", borderBottom: "1px solid #1a1a1a",
        padding: "8px 20px", display: "flex", gap: 7, overflowX: "auto"
      }}>
        {PHASES.map(p => (
          <div key={p.label} style={{
            flexShrink: 0, padding: "5px 12px",
            background: p.color + "14", border: `1px solid ${p.color}25`, borderRadius: 9
          }}>
            <div style={{ color: p.color, fontSize: 9, fontWeight: 700 }}>{p.label} · {p.days}</div>
            <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{p.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", borderBottom: "1px solid #161616",
        background: "#0a0a0a", padding: "0 20px", overflowX: "auto"
      }}>
        {[
          ["cal", "🗓 Calendar"],
          ["posts", `📋 Drafts${posts.length > 0 ? ` (${posts.length})` : ""}`],
          ["metrics", "📊 Stats"]
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "11px 16px", background: "none", border: "none",
            borderBottom: `2px solid ${tab === id ? "#ec4899" : "transparent"}`,
            color: tab === id ? "#ec4899" : "#4b5563",
            cursor: "pointer", fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap"
          }}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 14px" }}>

        {/* ── CALENDAR TAB ── */}
        {tab === "cal" && (
          <div style={{ animation: "fadeUp .2s" }}>
            {/* Platform note */}
            <div style={{
              background: "#0d0d0d",
              border: "1px solid #1f2937",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 12,
              display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"
            }}>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Generates for:</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ padding: "4px 12px", background: "#0077b520", border: "1px solid #0077b560", borderRadius: 20, color: "#0077b5", fontSize: 11, fontWeight: 700 }}>
                  💼 LinkedIn
                </div>
                <div style={{ padding: "4px 12px", background: "#1da1f220", border: "1px solid #1da1f260", borderRadius: 20, color: "#1da1f2", fontSize: 11, fontWeight: 700 }}>
                  🐦 Twitter/X
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#374151" }}>+ image for each</div>
            </div>

            {/* Day selector */}
            <div style={{
              background: "#0d0d0d",
              border: "1px solid #1f2937",
              borderRadius: 12, padding: "12px 16px", marginBottom: 12
            }}>
              <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 2, marginBottom: 10 }}>SELECT DAY</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
                  const hasPosted = posts.some(p => p.day === d && p.posted);
                  const hasDraft = posts.some(p => p.day === d && !p.posted);
                  const c = phaseColor(d);
                  return (
                    <button key={d} onClick={() => setSelectedDay(d)} style={{
                      width: 33, height: 33, borderRadius: 8,
                      border: `1.5px solid ${selectedDay === d ? c : hasPosted ? c + "55" : hasDraft ? c + "33" : "#1f2937"}`,
                      background: selectedDay === d ? c + "22" : "transparent",
                      color: selectedDay === d ? c : hasPosted ? c : hasDraft ? c + "88" : "#374151",
                      cursor: "pointer", fontSize: 11, fontFamily: "monospace",
                      fontWeight: selectedDay === d ? 700 : 400,
                      position: "relative"
                    }}>
                      {d}
                      {hasPosted && <div style={{ position: "absolute", top: 2, right: 2, width: 4, height: 4, borderRadius: "50%", background: c }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day entries */}
            {dayPosts.map((entry, i) => {
              const [day, slot,, phase, topic, accent] = entry;
              const isGenerating = generating?.day === day && generating?.slot === slot;
              const existingPosts = posts.filter(p => p.day === day && p.slot === slot);
              const c = accent;

              return (
                <div key={i} style={{
                  background: "#0d0d0d",
                  border: `1px solid ${c}20`,
                  borderRadius: 13, padding: "15px 16px", marginBottom: 11
                }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      background: c + "14", border: `1px solid ${c}25`,
                      borderRadius: 10, padding: "10px 14px", textAlign: "center",
                      flexShrink: 0, minWidth: 64
                    }}>
                      <div style={{ fontSize: 18 }}>{slot === "9am" ? "🌅" : "🌆"}</div>
                      <div style={{ color: c, fontSize: 12, fontWeight: 700, marginTop: 3 }}>{slot}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 5 }}>
                        <span style={{
                          background: c + "18", color: c,
                          fontSize: 10, padding: "2px 9px", borderRadius: 6
                        }}>Week {Math.ceil(day / 7)} · {phase}</span>
                      </div>
                      <div style={{ color: "#e5e7eb", fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{topic}</div>
                    </div>
                  </div>

                  {existingPosts.length > 0 && (
                    <div style={{
                      marginBottom: 10, padding: "8px 12px",
                      background: "#111", borderRadius: 9
                    }}>
                      <div style={{ color: "#22c55e", fontSize: 11, marginBottom: 4 }}>
                        ✓ {existingPosts.length} draft{existingPosts.length > 1 ? "s" : ""} ready
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {existingPosts.map(p => (
                          <span key={p.id} style={{
                            background: p.platform === "linkedin" ? "#0077b520" : "#1da1f220",
                            color: p.platform === "linkedin" ? "#0077b5" : "#1da1f2",
                            fontSize: 11, padding: "2px 9px", borderRadius: 6
                          }}>
                            {p.platform === "linkedin" ? "💼" : "🐦"} {p.posted ? "✓ posted" : "draft"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => doGenerate(entry)}
                    disabled={!!isGenerating}
                    style={{
                      width: "100%", padding: "11px",
                      background: isGenerating ? "#0d0d0d" : `linear-gradient(135deg, ${c}cc, ${c}88)`,
                      border: isGenerating ? `1px solid ${c}28` : "none",
                      borderRadius: 10, color: isGenerating ? c : "#fff",
                      fontSize: 12, fontFamily: "monospace", fontWeight: 700,
                      cursor: isGenerating ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all .2s"
                    }}
                  >
                    {isGenerating
                      ? <><Dots /><span style={{ color: c, fontSize: 11 }}>{genStatus}</span></>
                      : `⚡ Generate Day ${day} ${slot} — LinkedIn + Twitter + Images`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── POSTS TAB ── */}
        {tab === "posts" && (
          <div style={{ animation: "fadeUp .2s" }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8
            }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{filteredPosts.length} posts</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { id: "all", label: "All", color: "#ec4899" },
                  { id: "linkedin", label: "💼 LinkedIn", color: "#0077b5" },
                  { id: "twitter", label: "🐦 Twitter", color: "#1da1f2" }
                ].map(p => (
                  <button key={p.id} onClick={() => setFilterPlatform(p.id)} style={{
                    padding: "4px 12px", borderRadius: 18,
                    border: `1px solid ${filterPlatform === p.id ? p.color : "#2d2d2d"}`,
                    background: filterPlatform === p.id ? p.color + "22" : "transparent",
                    color: filterPlatform === p.id ? p.color : "#6b7280",
                    fontSize: 11, fontFamily: "monospace", cursor: "pointer"
                  }}>{p.label}</button>
                ))}
              </div>
            </div>

            {filteredPosts.length === 0
              ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#374151" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>⚡</div>
                  <div style={{ marginBottom: 14 }}>No posts yet — go to Calendar and generate</div>
                  <button onClick={() => setTab("cal")} style={{
                    background: "#1a0010", border: "1px solid #ec4899",
                    color: "#ec4899", padding: "8px 20px", borderRadius: 8,
                    cursor: "pointer", fontFamily: "monospace", fontSize: 12
                  }}>→ Open Calendar</button>
                </div>
              )
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {filteredPosts.map(p => (
                    <PostCard
                      key={p.id}
                      post={p}
                      accent={p.accent}
                      onPosted={id => setPosts(prev => prev.map(x => x.id === id ? { ...x, posted: true } : x))}
                      onDelete={id => setPosts(prev => prev.filter(x => x.id !== id))}
                    />
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── METRICS TAB ── */}
        {tab === "metrics" && (
          <div style={{ animation: "fadeUp .2s" }}>
            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Posted", value: posts.filter(p => p.posted).length, icon: "📤", color: "#22c55e" },
                { label: "Drafts", value: posts.filter(p => !p.posted).length, icon: "📋", color: "#3b82f6" },
                { label: "LinkedIn", value: posts.filter(p => p.platform === "linkedin" && p.posted).length, icon: "💼", color: "#0077b5" },
                { label: "Twitter", value: posts.filter(p => p.platform === "twitter" && p.posted).length, icon: "🐦", color: "#1da1f2" },
                { label: "Days covered", value: [...new Set(posts.map(p => p.day))].length, icon: "🗓", color: "#a855f7" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#0d0d0d", border: `1px solid ${s.color}20`,
                  borderRadius: 12, padding: "12px 14px"
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: 22 }}>{s.value}</div>
                  <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Posts per day bar */}
            <div style={{
              background: "#0d0d0d", border: "1px solid #1f2937",
              borderRadius: 13, padding: "14px 16px", marginBottom: 12
            }}>
              <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 2, marginBottom: 10 }}>POSTS PER DAY (click to jump)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 64 }}>
                {Array.from({ length: 30 }, (_, i) => {
                  const d = i + 1;
                  const count = posts.filter(p => p.day === d && p.posted).length;
                  const max = Math.max(...Array.from({ length: 30 }, (_, j) => posts.filter(p => p.day === j + 1 && p.posted).length), 1);
                  const c = phaseColor(d);
                  return (
                    <div key={i} onClick={() => { setSelectedDay(d); setTab("cal"); }}
                      style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 2, cursor: "pointer" }}>
                      <div style={{
                        width: "100%", background: count > 0 ? c : "#1f2937",
                        borderRadius: "2px 2px 0 0",
                        height: `${Math.max((count / max) * 100, count > 0 ? 10 : 3)}%`,
                        transition: "height .3s"
                      }} />
                      {[0, 6, 13, 20, 27, 29].includes(i) && <div style={{ color: "#374151", fontSize: 7 }}>{d}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform breakdown */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1f2937", borderRadius: 13, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 2, marginBottom: 12 }}>BY PLATFORM</div>
              {[
                { id: "linkedin", name: "LinkedIn", emoji: "💼", color: "#0077b5" },
                { id: "twitter", name: "Twitter/X", emoji: "🐦", color: "#1da1f2" }
              ].map(pl => {
                const total = posts.filter(p => p.platform === pl.id).length;
                const posted = posts.filter(p => p.platform === pl.id && p.posted).length;
                return (
                  <div key={pl.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    marginBottom: 9, padding: "10px 14px",
                    background: "#111", borderRadius: 10
                  }}>
                    <span style={{ fontSize: 16 }}>{pl.emoji}</span>
                    <span style={{ color: pl.color, fontSize: 12, width: 110, flexShrink: 0 }}>{pl.name}</span>
                    <span style={{ color: total > 0 ? "#e5e7eb" : "#374151", fontSize: 12, flex: 1 }}>
                      {posted} posted · {total - posted} drafts
                    </span>
                    <div style={{ width: 70, height: 7, background: "#1f2937", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: pl.color, width: `${Math.min((posted / Math.max(total, 1)) * 100, 100)}%`, transition: "width .5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => {
                if (window.confirm("Clear all posts? This cannot be undone.")) setPosts([]);
              }} style={{
                background: "#1f0000", border: "1px solid #dc2626",
                color: "#f87171", padding: "8px 14px", borderRadius: 9,
                cursor: "pointer", fontFamily: "monospace", fontSize: 11
              }}>🗑 Clear all</button>
              <button onClick={() => {
                const a = document.createElement("a");
                a.href = "data:text/json," + encodeURIComponent(JSON.stringify(posts));
                a.download = "zeus_grassion_backup.json";
                a.click();
              }} style={{
                background: "#0a1a0a", border: "1px solid #22c55e",
                color: "#22c55e", padding: "8px 14px", borderRadius: 9,
                cursor: "pointer", fontFamily: "monospace", fontSize: 11
              }}>💾 Export backup</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
