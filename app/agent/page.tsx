
'use client';
import { useEffect, useState } from 'react';
export default function AgentPage() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState('');
  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  useEffect(() => { if (sessionStorage.getItem('agent_ok')==='1') setOk(true); }, []);
  function check() { const want = (process.env.NEXT_PUBLIC_AGENT_PASS || 'letmein'); if (pass === want) { setOk(true); sessionStorage.setItem('agent_ok','1'); } else alert('Wrong passcode'); }
  async function refresh() { const r = await fetch('/api/queue/list'); const d = await r.json(); setQueue(d.queue||[]); setCurrent(d.current||null); }
  async function pullNext() { await fetch('/api/queue/next', { method:'POST' }); await refresh(); }
  async function connect(sessionId: string) { await fetch('/api/session/connect', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId }) }); await refresh(); }
  useEffect(() => { if (ok) { refresh(); const t=setInterval(refresh,1500); return ()=>clearInterval(t);} }, [ok]);
  if (!ok) return (<main className="container"><div style={{maxWidth:420, margin:'60px auto'}}><h1>Agent Console</h1><p className="small">Enter passcode.</p><input className="input" placeholder="Passcode" value={pass} onChange={e=>setPass(e.target.value)} /><button className="btn" style={{marginTop:12}} onClick={check}>Enter</button></div></main>);
  return (<main className="container"><h1>Agent Console</h1><div className="row"><button className="btn" onClick={pullNext}>Pull Next</button><button className="btn btn-secondary" onClick={refresh}>Refresh</button></div><h3 style={{marginTop:16}}>Current</h3>{!current && <div className="small">No active session.</div>}{current && (<div style={{background:'#f8fafc',padding:20,borderRadius:12}}><div className="row"><div><strong>Session:</strong> {current.sessionId}</div><div className="right"><span className="small">Status: {current.status}</span></div></div><div className="small">Job: {current.jobTitle} • {current.company}</div>{current.status!=='connected' && (<button className="btn" style={{marginTop:8}} onClick={()=>connect(current.sessionId)}>Connect</button>)}</div>)}<h3 style={{marginTop:16}}>Queue</h3><table className="table"><thead><tr><th>#</th><th>Job</th><th>Company</th><th>Queued</th></tr></thead><tbody>{queue.map((q:any,i:number)=>(<tr key={q.queueId}><td>{i+1}</td><td>{q.jobTitle}</td><td>{q.company}</td><td>{new Date(q.createdAt).toLocaleTimeString()}</td></tr>))}</tbody></table><div style={{marginTop:16}}><a className="btn" href="/api/export/csv">Export outcomes CSV</a></div></main>);
}
