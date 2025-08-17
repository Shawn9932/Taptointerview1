
'use client';
import { useEffect, useState } from 'react';
export default function SessionPage() {
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>(''); const [sessionId, setSessionId] = useState<string>('');
  useEffect(() => { (async () => {
    const r = await fetch('/api/video/token', { method:'POST' }); const d = await r.json(); setToken(d.token); setRoomName(d.roomName || 'demo-room');
  })(); const p = new URLSearchParams(window.location.search); setSessionId(p.get('sessionId') || ''); }, []);
  async function sendOutcome(outcome: string) {
    const notes = (document.getElementById('notes') as HTMLTextAreaElement)?.value || '';
    await fetch('/api/outcome', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId, outcome, notes }) });
    alert('Outcome saved (in-memory).'); window.location.href = '/';
  }
  return (<main className="container"><h1>Interview Session</h1><p className="small">Token (dev): {token ? token.slice(0, 20) + '…' : 'requesting…'}</p><p className="small">Room: {roomName}</p><div style={{background:'#0b1220',color:'#e5e7eb',padding:20,borderRadius:12}}>Video area placeholder.</div><div style={{marginTop:12,background:'#f8fafc',padding:20,borderRadius:12}}><div className="row"><button className="btn" onClick={() => sendOutcome('Hire')}>Hire</button><button className="btn btn-secondary" onClick={() => sendOutcome('Follow-up')}>Follow-up</button><button className="btn btn-secondary" onClick={() => sendOutcome('Decline')}>Decline</button></div><div style={{marginTop:12}}><label className="small">Notes</label><textarea id="notes" rows={3} className="input" placeholder="Optional notes…"></textarea></div></div></main>);
}
