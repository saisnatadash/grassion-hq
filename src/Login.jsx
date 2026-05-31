import React, { useState } from "react";

const U = "saisnatadash";
const P = "#Jay_Hind7077";

export default function Login({ onAuth }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (user === U && pass === P) {
      sessionStorage.setItem("ghq_auth", "1");
      onAuth();
    } else {
      setErr("Invalid credentials.");
      setTimeout(() => setErr(""), 2500);
    }
  };

  return (
    <div style={{ background: "#030303", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <style>{`*{box-sizing:border-box} input{outline:none}`}</style>
      <div style={{ width: 360, padding: 32, background: "#0a0a0a", border: "1px solid #22c55e33", borderRadius: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
          <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 22, fontFamily: "monospace", letterSpacing: 2 }}>GRASSION HQ</div>
          <div style={{ color: "#374151", fontSize: 11, fontFamily: "monospace", marginTop: 4 }}>Founder Access Only</div>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: "#6b7280", fontSize: 10, fontFamily: "monospace", marginBottom: 4 }}>USERNAME</div>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="saisnatadash" autoComplete="username"
              style={{ width: "100%", background: "#111", border: "1px solid #1f2937", borderRadius: 8, padding: "10px 12px", color: "#e5e7eb", fontSize: 13, fontFamily: "monospace" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#6b7280", fontSize: 10, fontFamily: "monospace", marginBottom: 4 }}>PASSWORD</div>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••" autoComplete="current-password"
                style={{ width: "100%", background: "#111", border: "1px solid #1f2937", borderRadius: 8, padding: "10px 36px 10px 12px", color: "#e5e7eb", fontSize: 13, fontFamily: "monospace" }} />
              <button type="button" onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 14 }}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {err && <div style={{ color: "#ef4444", fontSize: 12, textAlign: "center", marginBottom: 12, fontFamily: "monospace" }}>{err}</div>}
          <button type="submit" style={{ width: "100%", background: "#22c55e", border: "none", borderRadius: 8, padding: 12, color: "#000", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1 }}>
            ENTER HQ
          </button>
        </form>
        <div style={{ marginTop: 16, color: "#1f2937", fontSize: 9, textAlign: "center", fontFamily: "monospace" }}>
          Private workspace · Session expires on close
        </div>
      </div>
    </div>
  );
}
