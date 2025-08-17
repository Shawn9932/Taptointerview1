
'use client';
import { useEffect, useRef, useState } from 'react';
type Job = { id: string; company: string; title: string; location: string; compensation?: string; logoUrl?: string; active?: boolean };

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => { (async () => {
    const res = await fetch('/api/jobs'); const data = await res.json();
    const actives = (data.jobs || []).filter((j:Job)=>j.active!==false);
    setJobs(actives); setLoading(false);
  })(); }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const i = Math.round(el.scrollTop / h);
      setIndex(Math.min(Math.max(i, 0), jobs.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [jobs.length]);

  function onTouchStart(e: React.TouchEvent){ touchStartY.current = e.touches[0].clientY; }
  function onTouchEnd(e: React.TouchEvent){
    if (touchStartY.current == null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    const el = viewportRef.current; if (!el) return;
    const h = el.clientHeight;
    if (Math.abs(delta) > 60) {
      const next = delta < 0 ? index + 1 : index - 1;
      const clamped = Math.max(0, Math.min(next, jobs.length - 1));
      el.scrollTo({ top: clamped * h, behavior: 'smooth' });
      setIndex(clamped);
    } else {
      el.scrollTo({ top: index * h, behavior: 'smooth' });
    }
    touchStartY.current = null;
  }

  async function enqueue(jobId: string) {
    const res = await fetch('/api/queue/enqueue', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ jobId, email }) });
    const data = await res.json(); if (data.queueId) window.location.href = `/waiting-room?queueId=${data.queueId}`;
  }

  if (loading) return <main className="container"><div style={{padding:24}}>Loading jobs…</div></main>;
  if (!jobs.length) return <main className="container"><div style={{padding:24}}>No active jobs.</div></main>;

  return (
    <main className="feed-viewport" ref={viewportRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {jobs.map((job, i) => (
        <section className="card-full" key={job.id}>
          <div className="card-overlay"></div>
          <div className="hint">{i+1}/{jobs.length} • swipe ↑↓</div>
          <div className="card-content">
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <img className="logo" src={job.logoUrl || '/logo.svg'} alt={job.company}/>
              <div className="badge">Actively Interviewing</div>
            </div>
            <div className="title" style={{marginTop:8}}>{job.title}</div>
            <div className="meta">{job.company} • {job.location} • {job.compensation}</div>
            <div style={{marginTop:12, maxWidth:420}}>
              <input className="input" placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <button className="btn" style={{marginTop:12}} onClick={() => enqueue(job.id)}>Tap to Interview Now</button>
          </div>
          <div className="actions">
            <button className="action-btn" onClick={() => enqueue(job.id)}>Apply</button>
            <a className="action-btn" href="/">Save</a>
            <a className="action-btn" href="/">Share</a>
          </div>
        </section>
      ))}
    </main>
  );
}
