
'use client';
import { useEffect, useState } from 'react';
type Job = { id: string; company: string; title: string; location: string; compensation?: string; logoUrl?: string; active?: boolean };

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Job>({ id:'', company:'', title:'', location:'', compensation:'', logoUrl:'', active:true });

  useEffect(() => { if (sessionStorage.getItem('agent_ok')==='1') setOk(true); }, []);
  function check() { const want = (process.env.NEXT_PUBLIC_AGENT_PASS || 'letmein'); if (pass === want) { setOk(true); sessionStorage.setItem('agent_ok','1'); } else alert('Wrong passcode'); }

  async function load() { const r = await fetch('/api/jobs'); const d = await r.json(); setJobs(d.jobs||[]); }
  useEffect(()=>{ if(ok) load(); }, [ok]);

  async function saveJob(e:any){ e.preventDefault();
    const r = await fetch('/api/jobs/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if(r.ok){ setForm({ id:'', company:'', title:'', location:'', compensation:'', logoUrl:'', active:true }); await load(); }
  }

  async function toggleActive(id:string){ await fetch('/api/jobs/toggle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) }); await load(); }

  if(!ok) return (<main className="container"><div style={{maxWidth:420, margin:'60px auto'}}><h1>Admin</h1><p className="small">Enter passcode.</p><input className="input" placeholder="Passcode" value={pass} onChange={e=>setPass(e.target.value)} /><button className="btn" style={{marginTop:12}} onClick={check}>Enter</button></div></main>);

  return (<main className="container"><h1>Admin – Jobs</h1><form onSubmit={saveJob} style={{background:'#f8fafc',padding:20,borderRadius:12}}>
      <div className="row">
        <div style={{flex:1}}><label className="small">Company</label><input className="input" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} required/></div>
        <div style={{flex:1}}><label className="small">Title</label><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/></div>
      </div>
      <div className="row">
        <div style={{flex:1}}><label className="small">Location</label><input className="input" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} required/></div>
        <div style={{flex:1}}><label className="small">Compensation</label><input className="input" value={form.compensation} onChange={e=>setForm({...form, compensation:e.target.value})}/></div>
      </div>
      <div className="row">
        <div style={{flex:1}}><label className="small">Logo URL</label><input className="input" value={form.logoUrl} onChange={e=>setForm({...form, logoUrl:e.target.value})}/></div>
        <div style={{flex:1}}><label className="small">Active</label>
          <select className="input" value={form.active?'1':'0'} onChange={e=>setForm({...form, active:e.target.value==='1'})}>
            <option value="1">Yes</option><option value="0">No</option>
          </select>
        </div>
      </div>
      <div className="row"><button className="btn" type="submit">Save Job</button></div>
    </form>

    <h3 style={{marginTop:16}}>Current Jobs</h3>
    <table className="table"><thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Comp</th><th>Active</th><th></th></tr></thead>
    <tbody>
      {jobs.map(j=>(<tr key={j.id}><td>{j.title}</td><td>{j.company}</td><td>{j.location}</td><td>{j.compensation}</td><td>{j.active!==false?'Yes':'No'}</td>
        <td><button className="btn btn-secondary" onClick={()=>toggleActive(j.id)}>{j.active!==false?'Deactivate':'Activate'}</button></td></tr>))}
    </tbody></table></main>);
}
