'use client'

import { useEffect, useRef, useState } from 'react'

interface Repo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

/* ── Water Bubble Cursor ── */
function BubbleCursor() {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<HTMLDivElement[]>([])
  const pos = useRef({ x: -200, y: -200 })
  const trailPos = useRef(Array.from({ length: 8 }, () => ({ x: -200, y: -200 })))
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move)
    const animate = () => {
      if (bubbleRef.current) {
        bubbleRef.current.style.left = pos.current.x + 'px'
        bubbleRef.current.style.top  = pos.current.y + 'px'
      }
      let px = pos.current.x, py = pos.current.y
      trailPos.current.forEach((t, i) => {
        t.x += (px - t.x) * (0.32 - i * 0.025)
        t.y += (py - t.y) * (0.32 - i * 0.025)
        const el = trailsRef.current[i]
        if (el) { el.style.left = t.x + 'px'; el.style.top = t.y + 'px' }
        px = t.x; py = t.y
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    const down = () => { if (bubbleRef.current) { bubbleRef.current.style.width = '38px'; bubbleRef.current.style.height = '38px' } }
    const up   = () => { if (bubbleRef.current) { bubbleRef.current.style.width = '22px'; bubbleRef.current.style.height = '22px' } }
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={bubbleRef} className="bubble-cursor" />
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} ref={el => { if (el) trailsRef.current[i] = el }}
          className="bubble-trail"
          style={{ width: `${6 - i * 0.45}px`, height: `${6 - i * 0.45}px`, opacity: 0.55 - i * 0.055 }}
        />
      ))}
    </>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const LANG_COLORS: Record<string, string> = {
  Python: '#3b82f6', JavaScript: '#f59e0b', TypeScript: '#6366f1',
  SQL: '#22d3ee', Java: '#f97316', Shell: '#4ade80',
  Jupyter: '#a78bfa', HTML: '#fb923c', CSS: '#38bdf8',
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  useReveal()

  useEffect(() => {
    fetch('https://api.github.com/users/krishkumawat0416-debug/repos?sort=updated&per_page=20')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRepos(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body {
          background:#010207;
          color:#e2e8f0;
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:16px; line-height:1.7;
          overflow-x:hidden;
          cursor:none;
        }

        /* ── Cursor ── */
        .bubble-cursor {
          position:fixed; pointer-events:none; z-index:9999;
          width:22px; height:22px; border-radius:50%;
          transform:translate(-50%,-50%);
          background:radial-gradient(circle at 35% 35%,rgba(56,189,248,0.92) 0%,rgba(167,139,250,0.6) 50%,rgba(34,211,238,0.2) 100%);
          box-shadow:0 0 14px rgba(56,189,248,0.7),0 0 32px rgba(167,139,250,0.3),inset 0 0 8px rgba(255,255,255,0.35);
          border:1px solid rgba(255,255,255,0.22);
          transition:width .15s,height .15s;
        }
        .bubble-cursor::after {
          content:''; position:absolute;
          top:20%; left:25%; width:30%; height:18%;
          background:rgba(255,255,255,0.6); border-radius:50%;
          filter:blur(1px); transform:rotate(-30deg);
        }
        .bubble-trail {
          position:fixed; pointer-events:none; z-index:9998; border-radius:50%;
          transform:translate(-50%,-50%);
          background:radial-gradient(circle,rgba(56,189,248,0.55),rgba(167,139,250,0.25));
        }

        /* ── BG ── */
        .bg-grid {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px);
          background-size:64px 64px;
        }
        .blob { position:fixed; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; opacity:0.12; animation:blobF 12s ease-in-out infinite alternate; }
        .blob1{width:500px;height:500px;background:#1e3a8a;top:-120px;left:-120px;animation-delay:0s;}
        .blob2{width:420px;height:420px;background:#3b0764;bottom:-100px;right:-100px;animation-delay:-5s;}
        .blob3{width:300px;height:300px;background:#0c4a6e;top:45%;left:50%;animation-delay:-9s;}
        @keyframes blobF{from{transform:translate(0,0)scale(1);}to{transform:translate(26px,16px)scale(1.07);}}

        /* ── Nav ── */
        .nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; justify-content:space-between; align-items:center;
          padding:15px 48px;
          background:rgba(1,2,7,0.82);
          backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(255,255,255,0.06);
        }
        .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:1.1rem; background:linear-gradient(90deg,#38bdf8,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .nav-links { display:flex; gap:28px; }
        .nav-links a { color:#475569; text-decoration:none; font-size:.85rem; letter-spacing:.04em; transition:color .2s; }
        .nav-links a:hover { color:#38bdf8; }

        /* ─────────────────────────────────────
           FRONT SECTION: Left Hero + Right Repos
        ───────────────────────────────────── */
        .front-section {
          display:grid;
          grid-template-columns:400px 1fr;
          min-height:100vh;
          padding-top:62px;
          position:relative; z-index:1;
        }

        /* LEFT sticky hero */
        .hero-panel {
          position:sticky; top:62px;
          height:calc(100vh - 62px);
          display:flex; flex-direction:column; justify-content:center;
          padding:40px 36px 40px 48px;
          border-right:1px solid rgba(255,255,255,0.06);
        }
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.2);
          color:#38bdf8; border-radius:100px; padding:5px 15px;
          font-size:.73rem; font-weight:600; letter-spacing:.08em;
          margin-bottom:22px;
          animation:fadeUp .6s ease both;
        }
        .badge-dot{width:7px;height:7px;border-radius:50%;background:#38bdf8;animation:pulse 1.6s infinite;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(1.5);}}

        .hero-name {
          font-family:'Syne',sans-serif;
          font-size:clamp(2.5rem,4.5vw,4rem);
          font-weight:800; line-height:1.02; letter-spacing:-.02em;
          animation:fadeUp .7s .08s ease both;
        }
        .name-white{color:#fff;}
        .name-grad {
          background:linear-gradient(120deg,#38bdf8 0%,#a78bfa 45%,#22d3ee 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          background-size:200%; animation:gradShift 4s linear infinite;
        }
        @keyframes gradShift{0%{background-position:0%}100%{background-position:200%}}

        .hero-role{margin-top:10px;font-size:.95rem;color:#a78bfa;font-weight:500;animation:fadeUp .7s .14s ease both;}
        .hero-bio{color:#334155;font-size:.85rem;line-height:1.9;margin-top:14px;animation:fadeUp .7s .2s ease both;}

        .hero-stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:22px;animation:fadeUp .7s .26s ease both;}
        .h-stat{background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.1);border-radius:11px;padding:12px;text-align:center;}
        .h-stat-num{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .h-stat-label{font-size:.65rem;color:#1e293b;margin-top:2px;letter-spacing:.03em;}

        .hero-btns{display:flex;flex-direction:column;gap:9px;margin-top:22px;animation:fadeUp .7s .3s ease both;}
        .btn-primary{padding:10px 22px;border-radius:11px;background:linear-gradient(135deg,#0369a1,#6d28d9);color:#fff;font-weight:600;font-size:.83rem;text-decoration:none;box-shadow:0 0 18px rgba(56,189,248,0.16);transition:transform .2s,box-shadow .2s;border:none;text-align:center;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 32px rgba(56,189,248,0.32);}
        .btn-outline{padding:10px 22px;border-radius:11px;border:1px solid rgba(255,255,255,0.08);color:#64748b;text-decoration:none;font-size:.83rem;background:rgba(255,255,255,0.02);transition:border-color .2s,color .2s;text-align:center;}
        .btn-outline:hover{border-color:#38bdf8;color:#38bdf8;}

        .live-line-wrap{margin-top:28px;overflow:hidden;height:2px;animation:fadeUp .7s .34s ease both;}
        .live-line{height:2px;width:100%;background:linear-gradient(90deg,transparent,#38bdf8,#a78bfa,#22d3ee,transparent);background-size:300%;animation:lineSweep 2.5s linear infinite;}
        @keyframes lineSweep{0%{background-position:100%}100%{background-position:-100%}}

        /* RIGHT repos panel — scrollable */
        .repos-panel {
          overflow-y:auto;
          height:calc(100vh - 62px);
          position:sticky; top:62px;
          padding:0;
        }
        .repos-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 36px 16px;
          background:rgba(1,2,7,0.88); backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          position:sticky; top:0; z-index:10;
        }
        .repos-title {
          font-family:'Syne',sans-serif; font-size:1.15rem; font-weight:800; color:#fff;
          display:flex; align-items:center; gap:9px;
        }
        .repos-count {
          background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.18);
          color:#38bdf8; border-radius:100px; padding:3px 11px; font-size:.72rem; font-weight:600;
        }
        .repos-list { padding:16px 36px 60px; display:flex; flex-direction:column; gap:11px; }

        /* Repo Card */
        .repo-card {
          display:block; text-decoration:none;
          background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
          border-radius:14px; padding:18px 20px;
          transition:all .22s; position:relative; overflow:hidden;
        }
        .repo-card::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
          background:linear-gradient(180deg,#38bdf8,#a78bfa);
          opacity:0; transition:opacity .22s; border-radius:3px 0 0 3px;
        }
        .repo-card:hover { background:rgba(56,189,248,0.04); border-color:rgba(56,189,248,0.22); transform:translateX(4px); box-shadow:0 4px 20px rgba(0,0,0,0.3); }
        .repo-card:hover::before { opacity:1; }

        .repo-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:6px; }
        .repo-name { font-family:'Syne',sans-serif; font-size:.95rem; font-weight:700; color:#cbd5e1; }
        .repo-arrow { color:#1e293b; font-size:.9rem; transition:color .2s,transform .2s; flex-shrink:0; margin-top:1px; }
        .repo-card:hover .repo-arrow { color:#38bdf8; transform:translateX(4px); }
        .repo-desc { color:#1e293b; font-size:.78rem; line-height:1.65; margin-bottom:10px; }
        .repo-meta { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .repo-lang { display:flex; align-items:center; gap:5px; font-size:.72rem; color:#334155; font-weight:500; }
        .lang-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .repo-stars,.repo-forks { font-size:.72rem; color:#334155; }
        .repo-date { font-size:.68rem; color:#1e293b; margin-left:auto; }

        .repo-loading { display:flex; flex-direction:column; align-items:center; padding:60px; color:#1e293b; }
        .spinner { width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,0.06);border-top-color:#38bdf8;animation:spin .8s linear infinite;margin-bottom:12px; }
        @keyframes spin{to{transform:rotate(360deg);}}

        /* ── Below sections ── */
        .below { position:relative; z-index:1; }
        section { padding:80px 0; }
        .wrap { max-width:1100px; margin:0 auto; padding:0 48px; }
        .sec-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:0; }
        .sec-label{font-size:.7rem;font-weight:600;letter-spacing:.16em;color:#38bdf8;text-transform:uppercase;margin-bottom:8px;}
        .sec-title{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,4vw,2.5rem);font-weight:800;color:#fff;margin-bottom:38px;line-height:1.1;}
        .sec-title span{background:linear-gradient(90deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

        /* Skills */
        .skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;}
        .skill-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:22px;backdrop-filter:blur(16px);transition:border-color .3s,transform .3s;position:relative;overflow:hidden;}
        .skill-card::before{content:'';position:absolute;top:-50px;right:-50px;width:120px;height:120px;border-radius:50%;background:var(--ac);opacity:.1;filter:blur(28px);transition:opacity .3s;}
        .skill-card:hover{transform:translateY(-3px);}
        .skill-card:hover::before{opacity:.22;}
        .skill-card[data-c="blue"]{--ac:#38bdf8;} .skill-card[data-c="blue"]:hover{border-color:rgba(56,189,248,0.28);}
        .skill-card[data-c="purple"]{--ac:#a78bfa;} .skill-card[data-c="purple"]:hover{border-color:rgba(167,139,250,0.28);}
        .skill-card[data-c="cyan"]{--ac:#22d3ee;} .skill-card[data-c="cyan"]:hover{border-color:rgba(34,211,238,0.28);}
        .skill-card[data-c="green"]{--ac:#4ade80;} .skill-card[data-c="green"]:hover{border-color:rgba(74,222,128,0.28);}
        .skill-title{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;margin-bottom:14px;}
        .skill-card[data-c="blue"] .skill-title{color:#38bdf8;} .skill-card[data-c="purple"] .skill-title{color:#a78bfa;}
        .skill-card[data-c="cyan"] .skill-title{color:#22d3ee;} .skill-card[data-c="green"] .skill-title{color:#4ade80;}
        .tags{display:flex;flex-wrap:wrap;gap:7px;}
        .tag{padding:4px 11px;border-radius:100px;font-size:.7rem;font-weight:500;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);color:#475569;transition:all .2s;cursor:default;}
        .tag:hover{background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.24);color:#38bdf8;}

        /* About */
        .about-grid{display:grid;grid-template-columns:1fr auto;gap:44px;align-items:center;}
        .about-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:34px;backdrop-filter:blur(16px);}
        .about-text{color:#334155;font-size:.92rem;line-height:2;}
        .about-text strong{color:#64748b;}
        .avatar-col{display:flex;flex-direction:column;align-items:center;gap:14px;}
        .avatar-ring{width:170px;height:170px;border-radius:50%;padding:3px;background:linear-gradient(135deg,#38bdf8,#a78bfa,#22d3ee);animation:ringGlow 4s ease-in-out infinite alternate;flex-shrink:0;}
        @keyframes ringGlow{from{box-shadow:0 0 25px rgba(56,189,248,0.28);}to{box-shadow:0 0 45px rgba(167,139,250,0.42);}}
        .avatar-inner{width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#080d1a,#0f1929);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:2.8rem;font-weight:800;color:#fff;}
        .avail-badge{display:flex;align-items:center;gap:7px;background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.15);border-radius:100px;padding:7px 14px;font-size:.75rem;color:#4ade80;white-space:nowrap;}
        .avail-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;animation:pulse 1.6s infinite;}

        /* Connect */
        .connect-box{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:24px;padding:52px;backdrop-filter:blur(18px);text-align:center;position:relative;overflow:hidden;}
        .connect-box::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 0%,rgba(56,189,248,0.05),transparent 65%);}
        .connect-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;margin-bottom:10px;}
        .connect-sub{color:#1e293b;font-size:.9rem;max-width:440px;margin:0 auto 36px;}
        .connect-links{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
        .connect-card{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px 20px;text-decoration:none;color:#e2e8f0;transition:all .28s;min-width:200px;}
        .connect-card:hover{transform:translateY(-3px);}
        .connect-card.email:hover{border-color:rgba(251,146,60,0.38);box-shadow:0 8px 24px rgba(251,146,60,0.09);}
        .connect-card.linkedin:hover{border-color:rgba(56,189,248,0.38);box-shadow:0 8px 24px rgba(56,189,248,0.09);}
        .connect-card.github:hover{border-color:rgba(167,139,250,0.38);box-shadow:0 8px 24px rgba(167,139,250,0.09);}
        .cc-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0;}
        .connect-card.email .cc-icon{background:rgba(251,146,60,0.08);}
        .connect-card.linkedin .cc-icon{background:rgba(56,189,248,0.08);}
        .connect-card.github .cc-icon{background:rgba(167,139,250,0.08);}
        .cc-info{text-align:left;}
        .cc-label{font-size:.67rem;color:#1e293b;margin-bottom:1px;}
        .cc-val{font-weight:600;font-size:.82rem;}
        .connect-card.email .cc-val{color:#fb923c;}
        .connect-card.linkedin .cc-val{color:#38bdf8;}
        .connect-card.github .cc-val{color:#a78bfa;}

        /* Footer */
        footer{text-align:center;padding:24px;border-top:1px solid rgba(255,255,255,0.05);color:#0f172a;font-size:.78rem;position:relative;z-index:1;}
        footer span{color:#38bdf8;}

        /* Reveal */
        .reveal{opacity:0;transform:translateY(24px);transition:opacity .65s ease,transform .65s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}

        /* Responsive */
        @media(max-width:860px){
          .front-section{grid-template-columns:1fr;min-height:auto;}
          .hero-panel{position:relative;top:0;height:auto;padding:90px 24px 40px;}
          .repos-panel{position:relative;top:0;height:auto;overflow:visible;}
          .nav{padding:13px 20px;} .nav-links{display:none;}
          .about-grid{grid-template-columns:1fr;}
          .connect-box{padding:28px 18px;}
          .wrap{padding:0 22px;}
        }
      `}</style>

      <BubbleCursor />
      <div className="bg-grid" />
      <div className="blob blob1" /><div className="blob blob2" /><div className="blob blob3" />

      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">KK</span>
        <div className="nav-links">
          <a href="#skills">Skills</a>
          <a href="#about">About</a>
          <a href="#connect">Connect</a>
        </div>
      </nav>

      {/* ══════════ FRONT SECTION ══════════ */}
      <div className="front-section">

        {/* LEFT: sticky hero info */}
        <div className="hero-panel">
          <div className="hero-badge"><span className="badge-dot" />Available for Opportunities</div>
          <h1 className="hero-name">
            <div className="name-white">Krish</div>
            <div className="name-grad">Kumawat</div>
          </h1>
          <p className="hero-role">Aspiring Data Engineer</p>
          <p className="hero-bio">
            Building scalable pipelines with Python, SQL, Snowflake, Databricks, PySpark &amp; AWS. Turning raw data into real insights.
          </p>

          <div className="hero-stats">
            <div className="h-stat">
              <div className="h-stat-num">{loading ? '—' : repos.length}</div>
              <div className="h-stat-label">Public Repos</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">{repos.reduce((a, r) => a + r.stargazers_count, 0)}</div>
              <div className="h-stat-label">Total Stars</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">10+</div>
              <div className="h-stat-label">Technologies</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">∞</div>
              <div className="h-stat-label">Curiosity</div>
            </div>
          </div>

          <div className="hero-btns">
            <a href="#connect" className="btn-primary">Connect with Me</a>
            <a href="https://github.com/krishkumawat0416-debug" target="_blank" rel="noopener noreferrer" className="btn-outline">GitHub Profile ↗</a>
          </div>
          <div className="live-line-wrap"><div className="live-line" /></div>
        </div>

        {/* RIGHT: scrollable GitHub repos */}
        <div className="repos-panel">
          <div className="repos-header">
            <div className="repos-title">
              🐙 GitHub Repositories
            </div>
            {!loading && repos.length > 0 && <span className="repos-count">{repos.length} repos</span>}
          </div>

          <div className="repos-list">
            {loading ? (
              <div className="repo-loading">
                <div className="spinner" />
                <p>Fetching from GitHub…</p>
              </div>
            ) : repos.length === 0 ? (
              <div className="repo-loading"><p>No public repos found.</p></div>
            ) : (
              repos.map(repo => {
                const color = repo.language ? (LANG_COLORS[repo.language] ?? '#64748b') : '#334155'
                return (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card">
                    <div className="repo-top">
                      <div className="repo-name">{repo.name}</div>
                      <span className="repo-arrow">↗</span>
                    </div>
                    <p className="repo-desc">
                      {repo.description || 'Data Engineering project — pipeline, analytics or automation.'}
                    </p>
                    <div className="repo-meta">
                      {repo.language && (
                        <span className="repo-lang">
                          <span className="lang-dot" style={{ background: color }} />
                          {repo.language}
                        </span>
                      )}
                      <span className="repo-stars">⭐ {repo.stargazers_count}</span>
                      <span className="repo-forks">🍴 {repo.forks_count}</span>
                      <span className="repo-date">
                        {new Date(repo.updated_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </span>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* ══════════ BELOW SECTIONS ══════════ */}
      <div className="below">
        <hr className="sec-divider" />

        {/* Skills */}
        <section id="skills">
          <div className="wrap">
            <p className="sec-label reveal">What I Know</p>
            <h2 className="sec-title reveal">Skills &amp; <span>Tools</span></h2>
            <div className="skills-grid">
              <div className="skill-card reveal" data-c="blue">
                <div className="skill-title">💻 Languages</div>
                <div className="tags">{['Python','SQL','PySpark'].map(t=><span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="skill-card reveal" data-c="purple">
                <div className="skill-title">⚙️ Data Engineering</div>
                <div className="tags">{['ETL Pipelines','ELT','Snowflake','Databricks','Hadoop','Apache Spark'].map(t=><span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="skill-card reveal" data-c="cyan">
                <div className="skill-title">☁️ Cloud &amp; DevOps</div>
                <div className="tags">{['AWS S3','AWS Lambda','GitHub','VS Code'].map(t=><span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="skill-card reveal" data-c="green">
                <div className="skill-title">📊 Analytics &amp; BI</div>
                <div className="tags">{['Power BI','Data Warehousing','Pandas','NumPy'].map(t=><span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* About */}
        <section id="about">
          <div className="wrap">
            <p className="sec-label reveal">Who I Am</p>
            <h2 className="sec-title reveal">About <span>Me</span></h2>
            <div className="about-grid">
              <div className="about-card reveal">
                <p className="about-text">
                  Hi! I&apos;m <strong>Krish Kumawat</strong>, an aspiring Data Engineer from India with a deep passion for data. I specialize in building <strong>ETL / ELT pipelines</strong>, working with cloud data warehouses, and designing scalable data architectures.
                </p>
                <p className="about-text" style={{marginTop:14}}>
                  I love working with <strong>Snowflake, Databricks, PySpark</strong> and <strong>Hadoop</strong> to solve complex data problems. My goal is to help organizations make better decisions through clean, reliable data infrastructure.
                </p>
              </div>
              <div className="avatar-col reveal">
                <div className="avatar-ring"><div className="avatar-inner">KK</div></div>
                <div className="avail-badge"><span className="avail-dot" />Open to Work · Data Engineering</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* Connect */}
        <section id="connect" style={{paddingBottom:'100px'}}>
          <div className="wrap">
            <div className="connect-box reveal">
              <p className="sec-label" style={{marginBottom:10}}>Let&apos;s Talk</p>
              <h2 className="connect-title">Get In Touch 🤝</h2>
              <p className="connect-sub">Data engineering role, freelance project, or just a chat about data — I&apos;m always open!</p>
              <div className="connect-links">
                <a href="mailto:krishkumawat0416@gmail.com" className="connect-card email">
                  <div className="cc-icon">📧</div>
                  <div className="cc-info">
                    <div className="cc-label">Email Me</div>
                    <div className="cc-val">krishkumawat0416@gmail.com</div>
                  </div>
                </a>
                {/* ⚠️ LinkedIn ka actual URL daalo yahan */}
                <a href="https://linkedin.com/in/krishkumawat" target="_blank" rel="noopener noreferrer" className="connect-card linkedin">
                  <div className="cc-icon">💼</div>
                  <div className="cc-info">
                    <div className="cc-label">LinkedIn</div>
                    <div className="cc-val">linkedin.com/in/krishkumawat</div>
                  </div>
                </a>
                <a href="https://github.com/krishkumawat0416-debug" target="_blank" rel="noopener noreferrer" className="connect-card github">
                  <div className="cc-icon">🐙</div>
                  <div className="cc-info">
                    <div className="cc-label">GitHub</div>
                    <div className="cc-val">@krishkumawat0416-debug</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer>
        Built with ❤️ by <span>Krish Kumawat</span> · Data Engineer
      </footer>
    </>
  )
}
