
export type QueueItem = { queueId: string; jobId: string; createdAt: number; status: 'waiting'|'connecting'|'connected'; sessionId: string|null; email?: string };
export type SessionItem = { sessionId: string; jobId: string; status: 'connecting'|'connected'; outcome?: string; notes?: string; startedAt: number; endedAt?: number; };
export type Job = { id: string; company: string; title: string; location: string; compensation?: string; logoUrl?: string; active?: boolean };

let jobs: Job[] = [
  { id: 'job_1', company: 'Sun Energy Insulation', title: 'Insulation Installer', location: 'Orlando', compensation: '$700-$900 Wkly', logoUrl: '/logo.svg', active: true },
  { id: 'job_2', company: 'Sun Energy Insulation', title: 'Insulation Sales', location: 'Orlando', compensation: '$1,500-$2,000 Wkly', logoUrl: '/logo.svg', active: true },
  { id: 'job_3', company: 'Sun Energy Insulation', title: 'B2B Sales', location: 'Orlando', compensation: '$1,000-$1,500 Wkly', logoUrl: '/logo.svg', active: true },
  { id: 'job_4', company: 'Sun Energy Insulation', title: 'Admin Assistant', location: 'Orlando', compensation: '$700-$800 Wkly', logoUrl: '/logo.svg', active: true },
];

let queue: QueueItem[] = [];
let sessions: SessionItem[] = [];

function uuid(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=(Math.random()*16)|0;const v=c==='x'?r:(r&0x3)|0x8;return v.toString(16);});}

export const Store = {
  jobs,
  queue,
  sessions,
  uuid,
  addJob(j: Job){ const id = 'job_' + (jobs.length+1); jobs.push({ ...j, id }); return id; },
  toggleJob(id:string){ const j = jobs.find(x=>x.id===id); if(j) j.active = !(j.active!==false); },
  getJob(id:string){ return jobs.find(j=>j.id===id); }
};
