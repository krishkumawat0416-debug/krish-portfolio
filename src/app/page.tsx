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

/* ── Dot Cursor ── */
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
    const links = document.querySelectorAll('a, button, .repo-card, .skill-card, .connect-card, .proj-card, .cert-card')
    links.forEach(el => { el.addEventListener('mouseenter', handleEnter); el.addEventListener('mouseleave', handleLeave) })
    window.addEventListener('mousemove', move)
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
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
      links.forEach(el => { el.removeEventListener('mouseenter', handleEnter); el.removeEventListener('mouseleave', handleLeave) })
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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    await fetch('https://formspree.io/f/mvzleerd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
    })
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <div className="contact-form-wrap reveal">
      <div className="form-header">
        <p className="sec-label" style={{ marginBottom: 6 }}>Drop a Message</p>
        <h3 className="form-title">Send Me a <span>Message 💬</span></h3>
        <p className="form-sub">Fill the form below — your message lands straight in my inbox.</p>
      </div>
      <div className="form-body">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input className="form-input" type="text" name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input className="form-input" type="email" name="email" placeholder="rahul@example.com" value={form.email} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-textarea" name="message" placeholder="Tell me about the opportunity, project, or just say hi..." rows={5} value={form.message} onChange={handleChange} />
        </div>
        <button className={`form-btn ${status === 'sent' ? 'sent' : ''}`} onClick={handleSubmit} disabled={status === 'sending'}>
          {status === 'idle' && '📨 Send Message'}
          {status === 'sending' && 'Sending...'}
          {status === 'sent' && '✅ Message Sent!'}
        </button>
      </div>
    </div>
  )
}

/* ── Real Data from CV ── */
const PROJECTS = [
  {
    title: 'US Domestic Flight Delay Analytics Platform',
    desc: 'End-to-end flight analytics pipeline ingesting BTS data into AWS S3, processed in Databricks with PySpark & Delta Lake using Medallion Architecture. Gold tables in Snowflake power interactive Power BI dashboards.',
    tech: ['PySpark', 'Databricks', 'Snowflake', 'AWS S3', 'Delta Lake', 'Power BI'],
    icon: '✈️',
    color: 'blue',
    link: 'https://github.com/krishkumawat0416-debug/US---Project-Data-Engineering-',
  },
  {
    title: 'Snowflake End-to-End Automated Pipeline',
    desc: 'Automated ELT pipeline using Snowflake, Snowpipe, Streams & Tasks for real-time JSON ingestion from AWS S3. Implements Bronze → Silver → Gold layers with SCD Type 2 and hash-based change detection.',
    tech: ['Snowflake', 'Snowpipe', 'AWS S3', 'SCD Type 2', 'SQL', 'Streams & Tasks'],
    icon: '❄️',
    color: 'cyan',
    link: 'https://github.com/krishkumawat0416-debug/snowflake-end-to-end-data-pipeline',
  },
  {
    title: 'Online Food Management System',
    desc: 'Full-stack MySQL database project simulating a real-world food ordering platform — features window functions, CTEs, stored procedures, triggers, star schema data warehouse, and a Python ETL pipeline for end-to-end analytics.',
    tech: ['MySQL', 'Python', 'ETL Pipeline', 'Data Warehouse', 'Star Schema', 'SQL'],
    icon: '🍔',
    color: 'green',
    link: 'https://github.com/krishkumawat0416-debug/Online-Food-Management',
  },
  {
  title: 'GlobalMart Retail Data Platform',
  desc: 'End-to-end data engineering pipeline — Python automation syncs files from Google Drive + FTP to AWS S3 every 5 minutes, Snowpipe auto-ingests 225,000+ rows, Medallion Architecture transforms data through Bronze → Silver → Gold layers, and Power BI dashboards connect live to Snowflake.',
  tech: ['Python', 'Snowflake', 'AWS S3', 'EC2', 'DynamoDB', 'Snowpipe', 'Power BI'],
  icon: '🛒',
  color: 'purple',
  link: 'https://github.com/krishkumawat0416-debug/globalmart-retail-ingestion-platform',
  },
]

const EDUCATION = [
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    school: 'University Commerce College, Jaipur, Rajasthan',
    year: 'Jun 2021 – Apr 2024',
    icon: '🎓',
  },
  {
    degree: 'Senior Secondary Education (Science)',
    school: 'Shri Vidhya Mandir Sen Sec School, Jaipur',
    year: 'May 2020 – Jan 2021',
    icon: '📚',
  },
]

const CERTS = [
  {
    title: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
    issuer: 'Oracle Corporation',
    year: '2025',
    icon: '☁️',
    color: '#f97316',
  },
]

const EXPERIENCE = [
  {
    role: 'Data Engineer Intern',
    company: 'REGex Software Services',
    period: 'Jun 2025 – Present',
    location: 'Jaipur, India',
    points: [
      'Built ELT pipelines using Python and Snowflake to process daily raw data and reduce manual data handling efforts.',
      'Implemented Medallion Architecture (Raw → Silver → Gold) for transforming data into analytics-ready layers.',
      'Integrated AWS S3 with Snowflake using Snowpipe for loading semi-structured JSON data.',
      'Developed SQL queries using JOINs, CTEs, Window Functions, and Subqueries for Power BI dashboards.',
      'Optimized SQL queries and performed performance tuning to improve execution time.',
      'Implemented data validation and pipeline monitoring for accurate downstream reporting.',
    ],
  },
]

/* ══════════════════════════════════════════ */
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
          { signal: controller.signal, headers: { Accept: 'application/vnd.github.v3+json' } }
        )
        if (!res.ok) { setRepoError(true); setLoading(false); return }
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) setRepos(data)
      } catch (err: unknown) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) setRepoError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchRepos()
    return () => { cancelled = true; controller.abort() }
  }, [])

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; font-size:14px; }
        body {
          background:#010207; color:#e2e8f0;
          font-family:'DM Sans',system-ui,sans-serif;
          line-height:1.7; overflow-x:hidden; cursor:none;
          -webkit-font-smoothing:antialiased;
        }

        /* Cursor */
        .dot-cursor { position:fixed; pointer-events:none; z-index:9999; width:8px; height:8px; border-radius:50%; background:#38bdf8; will-change:transform; }
        .ring-cursor { position:fixed; pointer-events:none; z-index:9998; width:40px; height:40px; border-radius:50%; border:1.5px solid rgba(56,189,248,0.5); will-change:transform; transition:opacity .2s; }

        /* BG */
        .bg-grid { position:fixed; inset:0; z-index:0; pointer-events:none; background-image: linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px), linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px); background-size:56px 56px; }
        .blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; opacity:0.10; animation:blobF 14s ease-in-out infinite alternate; }
        .blob1{width:520px;height:520px;background:#1e3a8a;top:-150px;left:-150px;}
        .blob2{width:440px;height:440px;background:#3b0764;bottom:-120px;right:-120px;animation-delay:-6s;}
        .blob3{width:320px;height:320px;background:#0c4a6e;top:45%;left:48%;animation-delay:-10s;}
        @keyframes blobF{from{transform:translate(0,0)scale(1);}to{transform:translate(30px,20px)scale(1.08);}}

        /* Nav */
        .nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; justify-content:space-between; align-items:center; padding:0 40px; height:56px; background:rgba(1,2,7,0.85); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family:'Syne',sans-serif; font-size:1rem; font-weight:800; background:linear-gradient(120deg,#38bdf8,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .nav-links { display:flex; gap:22px; }
        .nav-links a { color:#475569; text-decoration:none; font-size:.75rem; letter-spacing:.05em; transition:color .2s; font-weight:500; }
        .nav-links a:hover { color:#38bdf8; }

        /* Front Section */
        .front-section { display:grid; grid-template-columns:360px 1fr; min-height:100vh; padding-top:56px; position:relative; z-index:1; }

        /* Hero Panel */
        .hero-panel { position:sticky; top:56px; height:calc(100vh - 56px); display:flex; flex-direction:column; justify-content:center; padding:28px 26px 28px 38px; border-right:1px solid rgba(255,255,255,0.05); overflow:hidden; }
        .hero-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.18); color:#38bdf8; border-radius:100px; padding:4px 12px; font-size:.63rem; font-weight:600; letter-spacing:.08em; margin-bottom:16px; width:fit-content; animation:fadeUp .6s ease both; }
        .badge-dot{width:6px;height:6px;border-radius:50%;background:#38bdf8;animation:pulse 1.8s infinite;flex-shrink:0;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(1.6);}}

        .hero-name { font-family:'Syne',sans-serif; font-size:clamp(1.9rem,3.2vw,3rem); font-weight:800; line-height:1.0; letter-spacing:-.02em; animation:fadeUp .7s .08s ease both; }
        .name-white{color:#fff;}
        .name-grad { background:linear-gradient(120deg,#38bdf8 0%,#a78bfa 45%,#22d3ee 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; background-size:200%; animation:gradShift 5s linear infinite; }
        @keyframes gradShift{0%{background-position:0%}100%{background-position:200%}}

        .hero-role{margin-top:7px;font-size:.8rem;color:#a78bfa;font-weight:500;animation:fadeUp .7s .14s ease both;}
        .hero-location{font-size:.72rem;color:#334155;margin-top:3px;animation:fadeUp .7s .18s ease both;}
        .hero-bio{color:#475569;font-size:.76rem;line-height:1.85;margin-top:11px;animation:fadeUp .7s .2s ease both;}

        .hero-stats{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:16px;animation:fadeUp .7s .26s ease both;}
        .h-stat{background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.09);border-radius:10px;padding:9px;text-align:center;}
        .h-stat-num{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .h-stat-label{font-size:.58rem;color:#334155;margin-top:1px;letter-spacing:.03em;}

        .hero-btns{display:flex;flex-direction:column;gap:7px;margin-top:16px;animation:fadeUp .7s .3s ease both;}
        .btn-primary{padding:9px 18px;border-radius:10px;background:linear-gradient(135deg,#0369a1,#6d28d9);color:#fff;font-weight:600;font-size:.76rem;text-decoration:none;box-shadow:0 0 20px rgba(56,189,248,0.14);transition:transform .2s,box-shadow .2s;border:none;text-align:center;display:block;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(56,189,248,0.3);}
        .btn-resume{padding:9px 18px;border-radius:10px;border:1px solid rgba(74,222,128,0.25);color:#4ade80;text-decoration:none;font-size:.76rem;background:rgba(74,222,128,0.04);transition:all .2s;text-align:center;display:block;font-weight:500;}
        .btn-resume:hover{background:rgba(74,222,128,0.08);border-color:rgba(74,222,128,0.5);transform:translateY(-2px);}
        .btn-outline{padding:9px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);color:#64748b;text-decoration:none;font-size:.76rem;background:rgba(255,255,255,0.02);transition:all .2s;text-align:center;display:block;}
        .btn-outline:hover{border-color:#38bdf8;color:#38bdf8;}

        .live-line-wrap{margin-top:20px;overflow:hidden;height:2px;animation:fadeUp .7s .34s ease both;}
        .live-line{height:2px;width:100%;background:linear-gradient(90deg,transparent,#38bdf8,#a78bfa,#22d3ee,transparent);background-size:300%;animation:lineSweep 3s linear infinite;}
        @keyframes lineSweep{0%{background-position:100%}100%{background-position:-100%}}

        /* Repos Panel */
        .repos-panel { overflow-y:auto; height:calc(100vh - 56px); position:sticky; top:56px; scrollbar-width:thin; scrollbar-color:rgba(56,189,248,0.2) transparent; }
        .repos-panel::-webkit-scrollbar{width:4px;}
        .repos-panel::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.2);border-radius:4px;}
        .repos-header { display:flex; align-items:center; justify-content:space-between; padding:14px 26px 12px; background:rgba(1,2,7,0.9); backdrop-filter:blur(16px); border-bottom:1px solid rgba(255,255,255,0.05); position:sticky; top:0; z-index:10; }
        .repos-title { font-family:'Syne',sans-serif; font-size:.95rem; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px; }
        .repos-count { background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.16); color:#38bdf8; border-radius:100px; padding:2px 9px; font-size:.63rem; font-weight:600; }
        .repos-list { padding:12px 26px 50px; display:flex; flex-direction:column; gap:8px; }

        /* Repo Card */
        .repo-card { display:block; text-decoration:none; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:11px; padding:13px 15px; transition:all .22s cubic-bezier(.25,.46,.45,.94); position:relative; overflow:hidden; }
        .repo-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,#38bdf8,#a78bfa); opacity:0; transition:opacity .22s; border-radius:3px 0 0 3px; }
        .repo-card:hover { background:rgba(56,189,248,0.035); border-color:rgba(56,189,248,0.2); transform:translateX(4px); box-shadow:0 4px 24px rgba(0,0,0,0.25); }
        .repo-card:hover::before { opacity:1; }
        .repo-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:4px; }
        .repo-name { font-family:'Syne',sans-serif; font-size:.82rem; font-weight:700; color:#cbd5e1; }
        .repo-arrow { color:#1e293b; font-size:.78rem; transition:color .2s,transform .2s; flex-shrink:0; margin-top:2px; }
        .repo-card:hover .repo-arrow { color:#38bdf8; transform:translateX(4px); }
        .repo-desc { color:#334155; font-size:.7rem; line-height:1.6; margin-bottom:8px; }
        .repo-meta { display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
        .repo-lang { display:flex; align-items:center; gap:4px; font-size:.65rem; color:#475569; font-weight:500; }
        .lang-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .repo-stars,.repo-forks { font-size:.65rem; color:#334155; }
        .repo-date { font-size:.61rem; color:#1e293b; margin-left:auto; }
        .repo-loading { display:flex; flex-direction:column; align-items:center; padding:50px; color:#334155; gap:12px; }
        .spinner { width:24px;height:24px;border-radius:50%;border:2px solid rgba(255,255,255,0.05);border-top-color:#38bdf8;animation:spin .7s linear infinite; }
        @keyframes spin{to{transform:rotate(360deg);}}

        /* Common */
        .below { position:relative; z-index:1; }
        section { padding:60px 0; }
        .wrap { max-width:1060px; margin:0 auto; padding:0 40px; }
        .sec-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:0; }
        .sec-label{font-size:.63rem;font-weight:600;letter-spacing:.16em;color:#38bdf8;text-transform:uppercase;margin-bottom:6px;}
        .sec-title{font-family:'Syne',sans-serif;font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:#fff;margin-bottom:28px;line-height:1.1;}
        .sec-title span{background:linear-gradient(90deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

        /* Experience */
        .exp-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:26px 28px; position:relative; overflow:hidden; }
        .exp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#38bdf8,#a78bfa,#22d3ee); }
        .exp-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
        .exp-role { font-family:'Syne',sans-serif; font-size:1rem; font-weight:800; color:#fff; margin-bottom:4px; }
        .exp-company { font-size:.8rem; color:#38bdf8; font-weight:600; }
        .exp-meta { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
        .exp-period { font-size:.7rem; color:#4ade80; background:rgba(74,222,128,0.07); border:1px solid rgba(74,222,128,0.15); padding:3px 10px; border-radius:100px; white-space:nowrap; }
        .exp-location { font-size:.67rem; color:#475569; }
        .exp-points { display:flex; flex-direction:column; gap:8px; }
        .exp-point { display:flex; gap:10px; align-items:flex-start; font-size:.78rem; color:#475569; line-height:1.7; }
        .exp-dot { width:5px; height:5px; border-radius:50%; background:#38bdf8; flex-shrink:0; margin-top:8px; }

        /* Projects */
        .projects-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px,1fr)); gap:14px; }
        .proj-card { display:block; text-decoration:none; color:inherit; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:22px; position:relative; overflow:hidden; transition:all .25s cubic-bezier(.25,.46,.45,.94); display:flex; flex-direction:column; gap:11px; }
        .proj-card::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 0% 0%, var(--pc) 0%, transparent 60%); opacity:0; transition:opacity .3s; pointer-events:none; }
        .proj-card:hover { transform:translateY(-4px); border-color:var(--pce); box-shadow:0 8px 32px rgba(0,0,0,0.3); }
        .proj-card:hover::after { opacity:0.06; }
        .proj-card[data-c="blue"]{--pc:#38bdf8;--pce:rgba(56,189,248,0.35);}
        .proj-card[data-c="cyan"]{--pc:#22d3ee;--pce:rgba(34,211,238,0.35);}
        .proj-card[data-c="green"]{--pc:#4ade80;--pce:rgba(74,222,128,0.35);}
        .proj-card[data-c="purple"]{--pc:#a78bfa;--pce:rgba(167,139,250,0.35);}
        .proj-icon { font-size:1.5rem; }
        .proj-title { font-family:'Syne',sans-serif; font-size:.88rem; font-weight:800; color:#e2e8f0; }
        .proj-desc { font-size:.74rem; color:#475569; line-height:1.75; flex:1; }
        .proj-tags { display:flex; flex-wrap:wrap; gap:5px; }
        .proj-tag { font-size:.61rem; padding:2px 8px; border-radius:100px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#475569; font-weight:500; }
        .proj-arrow { font-size:.72rem; color:#334155; transition:color .2s; align-self:flex-end; }
        .proj-card:hover .proj-arrow { color:#38bdf8; }

        /* Skills */
        .skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:13px;}
        .skill-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px;backdrop-filter:blur(16px);transition:border-color .3s,transform .3s;position:relative;overflow:hidden;}
        .skill-card::before{content:'';position:absolute;top:-50px;right:-50px;width:120px;height:120px;border-radius:50%;background:var(--ac);opacity:.08;filter:blur(30px);transition:opacity .3s;}
        .skill-card:hover{transform:translateY(-3px);}
        .skill-card:hover::before{opacity:.2;}
        .skill-card[data-c="blue"]{--ac:#38bdf8;} .skill-card[data-c="blue"]:hover{border-color:rgba(56,189,248,0.25);}
        .skill-card[data-c="purple"]{--ac:#a78bfa;} .skill-card[data-c="purple"]:hover{border-color:rgba(167,139,250,0.25);}
        .skill-card[data-c="cyan"]{--ac:#22d3ee;} .skill-card[data-c="cyan"]:hover{border-color:rgba(34,211,238,0.25);}
        .skill-card[data-c="green"]{--ac:#4ade80;} .skill-card[data-c="green"]:hover{border-color:rgba(74,222,128,0.25);}
        .skill-title{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;margin-bottom:11px;}
        .skill-card[data-c="blue"] .skill-title{color:#38bdf8;} .skill-card[data-c="purple"] .skill-title{color:#a78bfa;}
        .skill-card[data-c="cyan"] .skill-title{color:#22d3ee;} .skill-card[data-c="green"] .skill-title{color:#4ade80;}
        .tags{display:flex;flex-wrap:wrap;gap:6px;}
        .tag{padding:3px 9px;border-radius:100px;font-size:.63rem;font-weight:500;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);color:#475569;transition:all .2s;cursor:default;}
        .tag:hover{background:rgba(56,189,248,0.07);border-color:rgba(56,189,248,0.22);color:#38bdf8;}

        /* Education */
        .edu-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:13px; }
        .edu-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:20px 22px; display:flex; gap:14px; align-items:flex-start; position:relative; overflow:hidden; transition:border-color .3s, transform .3s; }
        .edu-card:hover { border-color:rgba(56,189,248,0.22); transform:translateY(-2px); }
        .edu-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#38bdf8,#a78bfa); opacity:0; transition:opacity .3s; }
        .edu-card:hover::before { opacity:1; }
        .edu-icon { width:40px; height:40px; border-radius:10px; background:rgba(56,189,248,0.07); border:1px solid rgba(56,189,248,0.12); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
        .edu-info { flex:1; }
        .edu-degree { font-family:'Syne',sans-serif; font-size:.84rem; font-weight:700; color:#e2e8f0; margin-bottom:3px; }
        .edu-school { font-size:.73rem; color:#38bdf8; font-weight:500; margin-bottom:6px; }
        .edu-meta { display:flex; gap:8px; flex-wrap:wrap; }
        .edu-year { font-size:.66rem; color:#475569; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); padding:2px 8px; border-radius:100px; }

        /* Certs */
        .certs-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:13px; }
        .cert-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px 20px; display:flex; align-items:center; gap:13px; transition:all .25s; position:relative; overflow:hidden; }
        .cert-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,0.3); }
        .cert-icon-wrap { width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:1.25rem; flex-shrink:0; }
        .cert-info { flex:1; }
        .cert-title { font-family:'Syne',sans-serif; font-size:.78rem; font-weight:700; margin-bottom:3px; }
        .cert-issuer { font-size:.67rem; color:#475569; margin-bottom:4px; }
        .cert-year { font-size:.62rem; color:#334155; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); padding:1px 7px; border-radius:100px; display:inline-block; }
        .cert-badge { position:absolute; top:9px; right:11px; font-size:.57rem; color:#4ade80; background:rgba(74,222,128,0.07); border:1px solid rgba(74,222,128,0.14); padding:2px 7px; border-radius:100px; }

        /* About */
        .about-grid{display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center;}
        .about-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:26px;backdrop-filter:blur(16px);}
        .about-text{color:#475569;font-size:.82rem;line-height:2;}
        .about-text strong{color:#64748b;}
        .avatar-col{display:flex;flex-direction:column;align-items:center;gap:13px;}
        .avatar-ring{width:155px;height:155px;border-radius:50%;padding:3px;background:linear-gradient(135deg,#38bdf8,#a78bfa,#22d3ee);animation:ringGlow 5s ease-in-out infinite alternate;flex-shrink:0;}
        @keyframes ringGlow{from{box-shadow:0 0 25px rgba(56,189,248,0.25);}to{box-shadow:0 0 50px rgba(167,139,250,0.4);}}
        .avatar-inner{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#0f1929;}
        .avatar-inner img{width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:50%;}
        .avail-badge{display:flex;align-items:center;gap:6px;background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.14);border-radius:100px;padding:5px 11px;font-size:.66rem;color:#4ade80;white-space:nowrap;}
        .avail-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:pulse 1.8s infinite;flex-shrink:0;}

        /* Connect */
        .connect-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;}
        .connect-box{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:26px;backdrop-filter:blur(18px);position:relative;overflow:hidden;}
        .connect-box::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 0%,rgba(56,189,248,0.04),transparent 65%);}
        .connect-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:5px;}
        .connect-sub{color:#334155;font-size:.76rem;margin-bottom:20px;line-height:1.7;}
        .connect-links{display:flex;flex-direction:column;gap:9px;}
        .connect-card{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:11px 14px;text-decoration:none;color:#e2e8f0;transition:all .25s;}
        .connect-card:hover{transform:translateX(5px);}
        .connect-card.email:hover{border-color:rgba(251,146,60,0.35);box-shadow:0 6px 20px rgba(251,146,60,0.07);}
        .connect-card.linkedin:hover{border-color:rgba(56,189,248,0.35);box-shadow:0 6px 20px rgba(56,189,248,0.07);}
        .connect-card.github:hover{border-color:rgba(167,139,250,0.35);box-shadow:0 6px 20px rgba(167,139,250,0.07);}
        .cc-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;}
        .connect-card.email .cc-icon{background:rgba(251,146,60,0.07);}
        .connect-card.linkedin .cc-icon{background:rgba(56,189,248,0.07);}
        .connect-card.github .cc-icon{background:rgba(167,139,250,0.07);}
        .cc-info{text-align:left;}
        .cc-label{font-size:.6rem;color:#334155;margin-bottom:1px;}
        .cc-val{font-weight:600;font-size:.74rem;}
        .connect-card.email .cc-val{color:#fb923c;}
        .connect-card.linkedin .cc-val{color:#38bdf8;}
        .connect-card.github .cc-val{color:#a78bfa;}

        /* Contact Form */
        .contact-form-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:26px;backdrop-filter:blur(18px);}
        .form-header{margin-bottom:20px;}
        .form-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:800;color:#fff;margin-bottom:4px;}
        .form-title span{background:linear-gradient(90deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .form-sub{color:#334155;font-size:.74rem;line-height:1.7;}
        .form-body{display:flex;flex-direction:column;gap:11px;}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
        .form-group{display:flex;flex-direction:column;gap:5px;}
        .form-label{font-size:.65rem;font-weight:600;color:#475569;letter-spacing:.04em;}
        .form-input,.form-textarea{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:9px 12px;color:#e2e8f0;font-family:'DM Sans',sans-serif;font-size:.78rem;outline:none;transition:border-color .2s,box-shadow .2s;resize:none;width:100%;}
        .form-input::placeholder,.form-textarea::placeholder{color:#1e293b;}
        .form-input:focus,.form-textarea:focus{border-color:rgba(56,189,248,0.35);box-shadow:0 0 0 3px rgba(56,189,248,0.06);}
        .form-btn{padding:10px 20px;border-radius:10px;background:linear-gradient(135deg,#0369a1,#6d28d9);color:#fff;font-weight:600;font-size:.78rem;border:none;cursor:none;box-shadow:0 0 20px rgba(56,189,248,0.14);transition:transform .2s,box-shadow .2s,opacity .2s;}
        .form-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 0 36px rgba(56,189,248,0.28);}
        .form-btn:disabled{opacity:.7;}
        .form-btn.sent{background:linear-gradient(135deg,#065f46,#047857);}

        footer{text-align:center;padding:20px;border-top:1px solid rgba(255,255,255,0.04);color:#1e293b;font-size:.7rem;position:relative;z-index:1;}
        footer span{color:#38bdf8;}

        .reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

        /* Responsive */
        @media(max-width:960px){
          .front-section{grid-template-columns:1fr;min-height:auto;}
          .hero-panel{position:relative;top:0;height:auto;padding:76px 20px 32px;}
          .repos-panel{position:relative;top:0;height:auto;overflow:visible;}
          .nav{padding:0 16px;}
          .about-grid,.connect-grid{grid-template-columns:1fr;}
          .form-row{grid-template-columns:1fr;}
          .wrap{padding:0 18px;}
          .exp-top{flex-direction:column;}
          .exp-meta{align-items:flex-start;}
        }
        @media(max-width:480px){
          html{font-size:13px;}
          .hero-name{font-size:1.85rem;}
          .nav-links{gap:14px;}
          .nav-links a{font-size:.7rem;}
        }
      `}</style>

      <DotCursor />
      <div className="bg-grid" />
      <div className="blob blob1" /><div className="blob blob2" /><div className="blob blob3" />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">Krish</div>
        <div className="nav-links">
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#education">Education</a>
          <a href="#about">About</a>
          <a href="#connect">Connect</a>
        </div>
      </nav>

      {/* ══ FRONT SECTION ══ */}
      <div className="front-section">

        {/* LEFT hero */}
        <div className="hero-panel">
          <div className="hero-badge"><span className="badge-dot" />Available for Opportunities</div>
          <h1 className="hero-name">
            <div className="name-white">Krish</div>
            <div className="name-grad">Kumawat</div>
          </h1>
          <p className="hero-role">Data Engineer Intern · REGex Software Services</p>
          <p className="hero-location">📍 Jaipur, Rajasthan, India</p>
          <p className="hero-bio">
            Building scalable ELT pipelines with Snowflake, PySpark &amp; AWS. Implementing Medallion Architecture and transforming raw data into analytics-ready insights.
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
              <div className="h-stat-num">1</div>
              <div className="h-stat-label">Certification</div>
            </div>
          </div>

          <div className="hero-btns">
            <a href="#connect" className="btn-primary">Connect with Me</a>
            {/*
              ✅ RESUME LINK — 2 options:
              Option A (Google Drive): Upload PDF to Drive → Share → Anyone with link → paste that URL below
              Option B (Local file):   Put Krish_Kumawat_Resume.pdf in your /public folder → href="/Krish_Kumawat_Resume.pdf"
            */}
            <a href="/Krish_Kumawat_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume">📄 Download Resume</a>
            <a href="https://github.com/krishkumawat0416-debug" target="_blank" rel="noopener noreferrer" className="btn-outline">GitHub Profile ↗</a>
          </div>
          <div className="live-line-wrap"><div className="live-line" /></div>
        </div>

        {/* RIGHT repos */}
        <div className="repos-panel">
          <div className="repos-header">
            <div className="repos-title">🐙 GitHub Repositories</div>
            {!loading && repos.length > 0 && <span className="repos-count">{repos.length} repos</span>}
          </div>
          <div className="repos-list">
            {loading ? (
              <div className="repo-loading"><div className="spinner" /><p>Fetching from GitHub…</p></div>
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
                    <p className="repo-desc">{repo.description || 'Data Engineering project — pipeline, analytics or automation.'}</p>
                    <div className="repo-meta">
                      {repo.language && (
                        <span className="repo-lang">
                          <span className="lang-dot" style={{ background: color }} />
                          {repo.language}
                        </span>
                      )}
                      <span className="repo-stars">⭐ {repo.stargazers_count}</span>
                      <span className="repo-forks">🍴 {repo.forks_count}</span>
                      <span className="repo-date">{new Date(repo.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* ══ BELOW SECTIONS ══ */}
      <div className="below">
        <hr className="sec-divider" />

        {/* Experience */}
        <section id="experience">
          <div className="wrap">
            <p className="sec-label reveal">Work Experience</p>
            <h2 className="sec-title reveal">Where I&apos;ve <span>Worked</span></h2>
            {EXPERIENCE.map(exp => (
              <div key={exp.role} className="exp-card reveal">
                <div className="exp-top">
                  <div>
                    <div className="exp-role">{exp.role}</div>
                    <div className="exp-company">{exp.company}</div>
                  </div>
                  <div className="exp-meta">
                    <span className="exp-period">{exp.period}</span>
                    <span className="exp-location">📍 {exp.location}</span>
                  </div>
                </div>
                <div className="exp-points">
                  {exp.points.map((pt, i) => (
                    <div key={i} className="exp-point">
                      <span className="exp-dot" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="sec-divider" />

        {/* Projects */}
        <section id="projects">
          <div className="wrap">
            <p className="sec-label reveal">What I&apos;ve Built</p>
            <h2 className="sec-title reveal">Featured <span>Projects</span></h2>
            {/*
              ✅ PROJECT LINKS — Apni GitHub repo ka exact naam daalo:
              github.com/krishkumawat0416-debug/REPO-NAME-HERE
              Har project ke link field mein wo URL paste karo
            */}
            <div className="projects-grid">
              {PROJECTS.map(p => (
                <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer" className="proj-card reveal" data-c={p.color}>
                  <div className="proj-icon">{p.icon}</div>
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-desc">{p.desc}</div>
                  <div className="proj-tags">{p.tech.map(t => <span className="proj-tag" key={t}>{t}</span>)}</div>
                  <div className="proj-arrow">View on GitHub ↗</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* Skills */}
        <section id="skills">
          <div className="wrap">
            <p className="sec-label reveal">What I Know</p>
            <h2 className="sec-title reveal">Skills &amp; <span>Tools</span></h2>
            <div className="skills-grid">
              <div className="skill-card reveal" data-c="blue">
                <div className="skill-title">💻 Languages</div>
                <div className="tags">{['Python', 'SQL', 'PySpark'].map(t => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="skill-card reveal" data-c="purple">
                <div className="skill-title">⚙️ Data Engineering</div>
                <div className="tags">{['ETL/ELT Pipelines', 'Medallion Architecture', 'SCD Type 2', 'Data Modeling', 'Data Warehousing', 'Snowpipe', 'Streams & Tasks', 'Delta Lake'].map(t => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="skill-card reveal" data-c="cyan">
                <div className="skill-title">☁️ Cloud & Platforms</div>
                <div className="tags">{['Snowflake', 'Databricks', 'AWS S3', 'AWS EC2', 'AWS Redshift', 'AWS DMS'].map(t => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="skill-card reveal" data-c="green">
                <div className="skill-title">📊 BI & Analytics</div>
                <div className="tags">{['Microsoft Power BI', 'Pandas', 'NumPy', 'Data Validation', 'SQL Optimization', 'Performance Tuning'].map(t => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* Education + Certs */}
        <section id="education">
          <div className="wrap">
            <p className="sec-label reveal">My Background</p>
            <h2 className="sec-title reveal">Education &amp; <span>Certifications</span></h2>

            <p className="sec-label reveal" style={{ marginBottom: 13 }}>🎓 Academic</p>
            <div className="edu-grid" style={{ marginBottom: 32 }}>
              {EDUCATION.map(e => (
                <div key={e.degree} className="edu-card reveal">
                  <div className="edu-icon">{e.icon}</div>
                  <div className="edu-info">
                    <div className="edu-degree">{e.degree}</div>
                    <div className="edu-school">{e.school}</div>
                    <div className="edu-meta">
                      <span className="edu-year">{e.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="sec-label reveal" style={{ marginBottom: 13 }}>🏆 Certifications</p>
            <div className="certs-grid">
              {CERTS.map(c => (
                <div key={c.title} className="cert-card reveal" style={{ borderColor: `${c.color}22` }}>
                  <div className="cert-icon-wrap" style={{ background: `${c.color}12` }}>{c.icon}</div>
                  <div className="cert-info">
                    <div className="cert-title" style={{ color: c.color }}>{c.title}</div>
                    <div className="cert-issuer">{c.issuer}</div>
                    <span className="cert-year">{c.year}</span>
                  </div>
                  <div className="cert-badge">✓ Verified</div>
                </div>
              ))}
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
                  Hi! I&apos;m <strong>Krish Kumawat</strong>, a Data Engineer Intern at <strong>REGex Software Services, Jaipur</strong>. I have hands-on experience building end-to-end <strong>ETL/ELT pipelines</strong> and processing large-scale datasets using <strong>Medallion Architecture</strong> (Raw → Silver → Gold).
                </p>
                <p className="about-text" style={{ marginTop: 11 }}>
                  I work with <strong>Snowflake, PySpark, AWS S3, Databricks</strong> and <strong>Power BI</strong> to transform raw data into analytics-ready formats. My focus is on data validation, SQL optimization, and building reliable cloud-based data solutions for business insights and reporting.
                </p>
              </div>
              <div className="avatar-col reveal">
                <div className="avatar-ring">
                  <div className="avatar-inner">
                    <img src="/krish.png" alt="Krish Kumawat" />
                  </div>
                </div>
                <div className="avail-badge"><span className="avail-dot" />Open to Work · Data Engineering</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* Connect */}
        <section id="connect" style={{ paddingBottom: '80px' }}>
          <div className="wrap">
            <p className="sec-label reveal">Let&apos;s Talk</p>
            <h2 className="sec-title reveal">Get In <span>Touch 🤝</span></h2>
            <div className="connect-grid">
              <div className="connect-box reveal">
                <h3 className="connect-title">Reach Out Directly</h3>
                <p className="connect-sub">Data engineering role, freelance project, or just a chat — I&apos;m always open!</p>
                <div className="connect-links">
                  <a href="mailto:Krishkumawat0416@gmail.com" className="connect-card email">
                    <div className="cc-icon">📧</div>
                    <div className="cc-info">
                      <div className="cc-label">Email Me</div>
                      <div className="cc-val">Krishkumawat0416@gmail.com</div>
                    </div>
                  </a>
                  <a href="https://www.linkedin.com/in/krish-kumawat-578a3b396" target="_blank" rel="noopener noreferrer" className="connect-card linkedin">
                    <div className="cc-icon">💼</div>
                    <div className="cc-info">
                      <div className="cc-label">LinkedIn</div>
                      <div className="cc-val">linkedin.com/in/krish-kumawat-578a3b396</div>
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
