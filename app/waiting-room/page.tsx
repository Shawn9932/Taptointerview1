
'use client';
import { useEffect, useState } from 'react';
export default function WaitingRoom() {
  const [place, setPlace] = useState<number | null>(null);
  const [queueId, setQueueId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('waiting');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('queueId'); setQueueId(q);
    const t = setInterval(async () => {
      const res = await fetch(`/api/queue/status?queueId=${q}`); const data = await res.json();
      setPlace(data.placeInLine); setStatus(data.status);
      if (['connecting','connected'].includes(data.status)) window.location.href = `/session?sessionId=${data.sessionId}`;
    }, 1500); return () => clearInterval(t);
  }, []);
  async function cancel() { await fetch('/api/queue/cancel', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ queueId }) }); window.location.href = '/'; }
  return (<main className="container"><div style={{padding:24}}><h1>Waiting Room</h1><p className="small">You are in line to interview…</p><div style={{fontSize:48,fontWeight:800}}>{place ?? '—'}</div><p className="small">Status: {status}</p><button className="btn btn-secondary" onClick={cancel}>Cancel</button></div></main>);
}
