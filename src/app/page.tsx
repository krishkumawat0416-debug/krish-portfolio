'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

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

/* ── Professional Dot Cursor ── */
function DotCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -200, y: -200 })
  const ringPos = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(0)
  const isHovering = useRef(false)

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }

    const handleEnter = () => { isHovering.current = true }
    const handleLeave = () => { isHovering.current = false }

    const links = document.querySelectorAll('a, button, .repo-card, .skill-card, .connect-card')
    links.forEach(el => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    window.addEventListener('mousemove', move)

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }
      if (ringRef.current) {
        const scale = isHovering.current ? 1.8 : 1
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${scale})`
        ringRef.current.style.opacity = isHovering.current ? '0.6' : '1'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
      links.forEach(el => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="dot-cursor" />
      <div ref={ringRef} className="ring-cursor" />
    </>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.05 }
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

/* ── Contact Form ── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')

    // Direct mailto link — opens email client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:krishkumawat0416@gmail.com?subject=${subject}&body=${body}`

    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    }, 800)
  }

  return (
    <div className="contact-form-wrap reveal">
      <div className="form-header">
        <p className="sec-label" style={{ marginBottom: 6 }}>Drop a Message</p>
        <h3 className="form-title">Send Me a <span>Message 💬</span></h3>
        <p className="form-sub">Fill the form below and it'll open your email client — your message lands straight in my inbox.</p>
      </div>
      <div className="form-body">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="rahul@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Message / Description</label>
          <textarea
            className="form-textarea"
            name="message"
            placeholder="Tell me about the opportunity, project, or just say hi..."
            rows={5}
            value={form.message}
            onChange={handleChange}
          />
        </div>
        <button
          className={`form-btn ${status === 'sent' ? 'sent' : ''}`}
          onClick={handleSubmit}
          disabled={status === 'sending'}
        >
          {status === 'idle' && '📨 Send Message'}
          {status === 'sending' && 'Opening Email...'}
          {status === 'sent' && '✅ Message Sent!'}
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [repoError, setRepoError] = useState(false)
  useReveal()

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const fetchRepos = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/users/krishkumawat0416-debug/repos?sort=updated&per_page=20',
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setRepos(data)
        }
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
          setRepoError(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRepos()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body {
          background:#010207;
          color:#e2e8f0;
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:16px; line-height:1.7;
          overflow-x:hidden;
          cursor:none;
          -webkit-font-smoothing:antialiased;
        }

        /* ── Professional Cursor ── */
        .dot-cursor {
          position:fixed; pointer-events:none; z-index:9999;
          width:8px; height:8px; border-radius:50%;
          background:#38bdf8;
          will-change:transform;
          transition:width .15s, height .15s;
        }
        .ring-cursor {
          position:fixed; pointer-events:none; z-index:9998;
          width:40px; height:40px; border-radius:50%;
          border:1.5px solid rgba(56,189,248,0.5);
          will-change:transform;
          transition:transform .05s linear, opacity .2s, scale .2s;
        }

        /* ── BG ── */
        .bg-grid {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px);
          background-size:64px 64px;
        }
        .blob { position:fixed; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; opacity:0.10; animation:blobF 14s ease-in-out infinite alternate; }
        .blob1{width:520px;height:520px;background:#1e3a8a;top:-150px;left:-150px;animation-delay:0s;}
        .blob2{width:440px;height:440px;background:#3b0764;bottom:-120px;right:-120px;animation-delay:-6s;}
        .blob3{width:320px;height:320px;background:#0c4a6e;top:45%;left:48%;animation-delay:-10s;}
        @keyframes blobF{from{transform:translate(0,0)scale(1);}to{transform:translate(30px,20px)scale(1.08);}}

        /* ── Nav ── */
        .nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; justify-content:flex-end; align-items:center;
          padding:15px 48px;
          background:rgba(1,2,7,0.82);
          backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(255,255,255,0.05);
        }
        .nav-links { display:flex; gap:28px; }
        .nav-links a { color:#475569; text-decoration:none; font-size:.85rem; letter-spacing:.04em; transition:color .2s; }
        .nav-links a:hover { color:#38bdf8; }

        /* ── FRONT SECTION ── */
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
          border-right:1px solid rgba(255,255,255,0.05);
        }
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.18);
          color:#38bdf8; border-radius:100px; padding:5px 15px;
          font-size:.72rem; font-weight:600; letter-spacing:.08em;
          margin-bottom:22px;
          animation:fadeUp .6s ease both;
          width:fit-content;
        }
        .badge-dot{width:7px;height:7px;border-radius:50%;background:#38bdf8;animation:pulse 1.8s infinite;flex-shrink:0;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(1.6);}}

        .hero-name {
          font-family:'Syne',sans-serif;
          font-size:clamp(2.6rem,4.5vw,3.8rem);
          font-weight:800; line-height:1.02; letter-spacing:-.02em;
          animation:fadeUp .7s .08s ease both;
        }
        .name-white{color:#fff;}
        .name-grad {
          background:linear-gradient(120deg,#38bdf8 0%,#a78bfa 45%,#22d3ee 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          background-size:200%; animation:gradShift 5s linear infinite;
        }
        @keyframes gradShift{0%{background-position:0%}100%{background-position:200%}}

        .hero-role{margin-top:10px;font-size:.93rem;color:#a78bfa;font-weight:500;animation:fadeUp .7s .14s ease both;}
        .hero-bio{color:#475569;font-size:.84rem;line-height:1.9;margin-top:14px;animation:fadeUp .7s .2s ease both;}

        .hero-stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:22px;animation:fadeUp .7s .26s ease both;}
        .h-stat{background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.09);border-radius:11px;padding:12px;text-align:center;}
        .h-stat-num{font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .h-stat-label{font-size:.64rem;color:#334155;margin-top:2px;letter-spacing:.03em;}

        .hero-btns{display:flex;flex-direction:column;gap:9px;margin-top:22px;animation:fadeUp .7s .3s ease both;}
        .btn-primary{padding:11px 22px;border-radius:11px;background:linear-gradient(135deg,#0369a1,#6d28d9);color:#fff;font-weight:600;font-size:.83rem;text-decoration:none;box-shadow:0 0 20px rgba(56,189,248,0.14);transition:transform .2s,box-shadow .2s;border:none;text-align:center;display:block;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(56,189,248,0.3);}
        .btn-outline{padding:11px 22px;border-radius:11px;border:1px solid rgba(255,255,255,0.07);color:#64748b;text-decoration:none;font-size:.83rem;background:rgba(255,255,255,0.02);transition:border-color .2s,color .2s;text-align:center;display:block;}
        .btn-outline:hover{border-color:#38bdf8;color:#38bdf8;}

        .live-line-wrap{margin-top:28px;overflow:hidden;height:2px;animation:fadeUp .7s .34s ease both;}
        .live-line{height:2px;width:100%;background:linear-gradient(90deg,transparent,#38bdf8,#a78bfa,#22d3ee,transparent);background-size:300%;animation:lineSweep 3s linear infinite;}
        @keyframes lineSweep{0%{background-position:100%}100%{background-position:-100%}}

        /* RIGHT repos panel */
        .repos-panel {
          overflow-y:auto;
          height:calc(100vh - 62px);
          position:sticky; top:62px;
          padding:0;
          scrollbar-width:thin;
          scrollbar-color:rgba(56,189,248,0.2) transparent;
        }
        .repos-panel::-webkit-scrollbar{width:4px;}
        .repos-panel::-webkit-scrollbar-track{background:transparent;}
        .repos-panel::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.2);border-radius:4px;}

        .repos-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 36px 16px;
          background:rgba(1,2,7,0.9); backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(255,255,255,0.05);
          position:sticky; top:0; z-index:10;
        }
        .repos-title {
          font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800; color:#fff;
          display:flex; align-items:center; gap:9px;
        }
        .repos-count {
          background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.16);
          color:#38bdf8; border-radius:100px; padding:3px 11px; font-size:.7rem; font-weight:600;
        }
        .repos-list { padding:16px 36px 60px; display:flex; flex-direction:column; gap:10px; }

        /* Repo Card */
        .repo-card {
          display:block; text-decoration:none;
          background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
          border-radius:13px; padding:17px 19px;
          transition:all .22s cubic-bezier(.25,.46,.45,.94); position:relative; overflow:hidden;
        }
        .repo-card::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
          background:linear-gradient(180deg,#38bdf8,#a78bfa);
          opacity:0; transition:opacity .22s; border-radius:3px 0 0 3px;
        }
        .repo-card:hover { background:rgba(56,189,248,0.035); border-color:rgba(56,189,248,0.2); transform:translateX(4px); box-shadow:0 4px 24px rgba(0,0,0,0.25); }
        .repo-card:hover::before { opacity:1; }

        .repo-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:5px; }
        .repo-name { font-family:'Syne',sans-serif; font-size:.92rem; font-weight:700; color:#cbd5e1; }
        .repo-arrow { color:#1e293b; font-size:.88rem; transition:color .2s,transform .2s; flex-shrink:0; margin-top:2px; }
        .repo-card:hover .repo-arrow { color:#38bdf8; transform:translateX(4px); }
        .repo-desc { color:#334155; font-size:.77rem; line-height:1.65; margin-bottom:10px; }
        .repo-meta { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .repo-lang { display:flex; align-items:center; gap:5px; font-size:.71rem; color:#475569; font-weight:500; }
        .lang-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .repo-stars,.repo-forks { font-size:.71rem; color:#334155; }
        .repo-date { font-size:.67rem; color:#1e293b; margin-left:auto; }

        .repo-loading { display:flex; flex-direction:column; align-items:center; padding:60px; color:#334155; gap:12px; }
        .spinner { width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,0.05);border-top-color:#38bdf8;animation:spin .7s linear infinite; }
        @keyframes spin{to{transform:rotate(360deg);}}

        /* ── Below sections ── */
        .below { position:relative; z-index:1; }
        section { padding:80px 0; }
        .wrap { max-width:1100px; margin:0 auto; padding:0 48px; }
        .sec-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:0; }
        .sec-label{font-size:.7rem;font-weight:600;letter-spacing:.16em;color:#38bdf8;text-transform:uppercase;margin-bottom:8px;}
        .sec-title{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,4vw,2.4rem);font-weight:800;color:#fff;margin-bottom:38px;line-height:1.1;}
        .sec-title span{background:linear-gradient(90deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

        /* Skills */
        .skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;}
        .skill-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:22px;backdrop-filter:blur(16px);transition:border-color .3s,transform .3s;position:relative;overflow:hidden;}
        .skill-card::before{content:'';position:absolute;top:-50px;right:-50px;width:120px;height:120px;border-radius:50%;background:var(--ac);opacity:.08;filter:blur(30px);transition:opacity .3s;}
        .skill-card:hover{transform:translateY(-3px);}
        .skill-card:hover::before{opacity:.2;}
        .skill-card[data-c="blue"]{--ac:#38bdf8;} .skill-card[data-c="blue"]:hover{border-color:rgba(56,189,248,0.25);}
        .skill-card[data-c="purple"]{--ac:#a78bfa;} .skill-card[data-c="purple"]:hover{border-color:rgba(167,139,250,0.25);}
        .skill-card[data-c="cyan"]{--ac:#22d3ee;} .skill-card[data-c="cyan"]:hover{border-color:rgba(34,211,238,0.25);}
        .skill-card[data-c="green"]{--ac:#4ade80;} .skill-card[data-c="green"]:hover{border-color:rgba(74,222,128,0.25);}
        .skill-title{font-family:'Syne',sans-serif;font-size:.88rem;font-weight:700;margin-bottom:14px;}
        .skill-card[data-c="blue"] .skill-title{color:#38bdf8;} .skill-card[data-c="purple"] .skill-title{color:#a78bfa;}
        .skill-card[data-c="cyan"] .skill-title{color:#22d3ee;} .skill-card[data-c="green"] .skill-title{color:#4ade80;}
        .tags{display:flex;flex-wrap:wrap;gap:7px;}
        .tag{padding:4px 11px;border-radius:100px;font-size:.69rem;font-weight:500;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);color:#475569;transition:all .2s;cursor:default;}
        .tag:hover{background:rgba(56,189,248,0.07);border-color:rgba(56,189,248,0.22);color:#38bdf8;}

        /* About */
        .about-grid{display:grid;grid-template-columns:1fr auto;gap:44px;align-items:center;}
        .about-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:34px;backdrop-filter:blur(16px);}
        .about-text{color:#475569;font-size:.9rem;line-height:2;}
        .about-text strong{color:#64748b;}
        .avatar-col{display:flex;flex-direction:column;align-items:center;gap:16px;}
        .avatar-ring{
          width:175px;height:175px;border-radius:50%;padding:3px;
          background:linear-gradient(135deg,#38bdf8,#a78bfa,#22d3ee);
          animation:ringGlow 5s ease-in-out infinite alternate;flex-shrink:0;
        }
        @keyframes ringGlow{from{box-shadow:0 0 25px rgba(56,189,248,0.25);}to{box-shadow:0 0 50px rgba(167,139,250,0.4);}}
        .avatar-inner{
          width:100%;height:100%;border-radius:50%;overflow:hidden;
          background:#0f1929;
        }
        .avatar-inner img{width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:50%;}
        .avail-badge{display:flex;align-items:center;gap:7px;background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.14);border-radius:100px;padding:7px 14px;font-size:.73rem;color:#4ade80;white-space:nowrap;}
        .avail-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;animation:pulse 1.8s infinite;flex-shrink:0;}

        /* Connect section */
        .connect-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;}

        .connect-box{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:22px;padding:36px;backdrop-filter:blur(18px);position:relative;overflow:hidden;}
        .connect-box::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 0%,rgba(56,189,248,0.04),transparent 65%);}
        .connect-title{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:8px;}
        .connect-sub{color:#334155;font-size:.83rem;margin-bottom:28px;line-height:1.7;}
        .connect-links{display:flex;flex-direction:column;gap:11px;}
        .connect-card{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:13px;padding:14px 18px;text-decoration:none;color:#e2e8f0;transition:all .25s;min-width:unset;}
        .connect-card:hover{transform:translateX(5px);}
        .connect-card.email:hover{border-color:rgba(251,146,60,0.35);box-shadow:0 6px 20px rgba(251,146,60,0.07);}
        .connect-card.linkedin:hover{border-color:rgba(56,189,248,0.35);box-shadow:0 6px 20px rgba(56,189,248,0.07);}
        .connect-card.github:hover{border-color:rgba(167,139,250,0.35);box-shadow:0 6px 20px rgba(167,139,250,0.07);}
        .cc-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
        .connect-card.email .cc-icon{background:rgba(251,146,60,0.07);}
        .connect-card.linkedin .cc-icon{background:rgba(56,189,248,0.07);}
        .connect-card.github .cc-icon{background:rgba(167,139,250,0.07);}
        .cc-info{text-align:left;}
        .cc-label{font-size:.65rem;color:#334155;margin-bottom:1px;}
        .cc-val{font-weight:600;font-size:.8rem;}
        .connect-card.email .cc-val{color:#fb923c;}
        .connect-card.linkedin .cc-val{color:#38bdf8;}
        .connect-card.github .cc-val{color:#a78bfa;}

        /* Contact Form */
        .contact-form-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:22px;padding:36px;backdrop-filter:blur(18px);}
        .form-header{margin-bottom:26px;}
        .form-title{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:6px;}
        .form-title span{background:linear-gradient(90deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .form-sub{color:#334155;font-size:.8rem;line-height:1.7;}
        .form-body{display:flex;flex-direction:column;gap:14px;}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .form-group{display:flex;flex-direction:column;gap:6px;}
        .form-label{font-size:.71rem;font-weight:600;color:#475569;letter-spacing:.04em;}
        .form-input,.form-textarea{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:10px;
          padding:11px 14px;
          color:#e2e8f0;
          font-family:'DM Sans',sans-serif;
          font-size:.84rem;
          outline:none;
          transition:border-color .2s,box-shadow .2s;
          resize:none;
          width:100%;
        }
        .form-input::placeholder,.form-textarea::placeholder{color:#1e293b;}
        .form-input:focus,.form-textarea:focus{border-color:rgba(56,189,248,0.35);box-shadow:0 0 0 3px rgba(56,189,248,0.06);}
        .form-btn{
          padding:12px 24px;
          border-radius:11px;
          background:linear-gradient(135deg,#0369a1,#6d28d9);
          color:#fff;font-weight:600;font-size:.85rem;
          border:none;cursor:none;
          box-shadow:0 0 20px rgba(56,189,248,0.14);
          transition:transform .2s,box-shadow .2s,opacity .2s;
        }
        .form-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 0 36px rgba(56,189,248,0.28);}
        .form-btn:disabled{opacity:.7;}
        .form-btn.sent{background:linear-gradient(135deg,#065f46,#047857);}

        /* Footer */
        footer{text-align:center;padding:24px;border-top:1px solid rgba(255,255,255,0.04);color:#1e293b;font-size:.77rem;position:relative;z-index:1;}
        footer span{color:#38bdf8;}

        /* Reveal */
        .reveal{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}

        /* Responsive */
        @media(max-width:900px){
          .front-section{grid-template-columns:1fr;min-height:auto;}
          .hero-panel{position:relative;top:0;height:auto;padding:90px 24px 40px;}
          .repos-panel{position:relative;top:0;height:auto;overflow:visible;}
          .nav{padding:13px 20px;}
          .about-grid,.connect-grid{grid-template-columns:1fr;}
          .form-row{grid-template-columns:1fr;}
          .wrap{padding:0 22px;}
        }
      `}</style>

      <DotCursor />
      <div className="bg-grid" />
      <div className="blob blob1" /><div className="blob blob2" /><div className="blob blob3" />

      {/* Nav — no KK logo */}
      <nav className="nav">
        <div className="nav-links">
          <a href="#skills">Skills</a>
          <a href="#about">About</a>
          <a href="#connect">Connect</a>
        </div>
      </nav>

      {/* ══════════ FRONT SECTION ══════════ */}
      <div className="front-section">

        {/* LEFT: sticky hero */}
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
              <div className="h-stat-num">{totalStars}</div>
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
            <div className="repos-title">🐙 GitHub Repositories</div>
            {!loading && repos.length > 0 && <span className="repos-count">{repos.length} repos</span>}
          </div>
          <div className="repos-list">
            {loading ? (
              <div className="repo-loading">
                <div className="spinner" />
                <p>Fetching from GitHub…</p>
              </div>
            ) : repoError ? (
              <div className="repo-loading"><p>⚠️ Could not load repos. Please refresh.</p></div>
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
                <div className="avatar-ring">
                  <div className="avatar-inner">
                    {/* 
                      ✅ PHOTO INSTRUCTIONS:
                      1. Save your photo as: public/krish.jpg  (in your Next.js project)
                      2. The img tag below will automatically show it
                      3. If using Next.js Image component, replace with:
                         import Image from 'next/image'
                         <Image src="/krish.jpg" alt="Krish Kumawat" width={175} height={175} style={{borderRadius:'50%',objectFit:'cover',objectPosition:'center top'}} />
                    */}
                    <img src="/krish.jpg" alt="Krish Kumawat" />
                  </div>
                </div>
                <div className="avail-badge"><span className="avail-dot" />Open to Work · Data Engineering</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* Connect — 2 column: links + form */}
        <section id="connect" style={{paddingBottom:'100px'}}>
          <div className="wrap">
            <p className="sec-label reveal">Let&apos;s Talk</p>
            <h2 className="sec-title reveal">Get In <span>Touch 🤝</span></h2>
            <div className="connect-grid">

              {/* Left: contact cards */}
              <div className="connect-box reveal">
                <h3 className="connect-title">Reach Out Directly</h3>
                <p className="connect-sub">Data engineering role, freelance project, or just a chat — I&apos;m always open!</p>
                <div className="connect-links">
                  <a href="mailto:krishkumawat0416@gmail.com" className="connect-card email">
                    <div className="cc-icon">📧</div>
                    <div className="cc-info">
                      <div className="cc-label">Email Me</div>
                      <div className="cc-val">krishkumawat0416@gmail.com</div>
                    </div>
                  </a>
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

              {/* Right: contact form */}
              <ContactForm />

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
