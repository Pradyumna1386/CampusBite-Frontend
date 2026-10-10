const steps=['PENDING','PREPARING','READY','COMPLETED'];
export default function StatusTracker({status}){const active=steps.indexOf(status);return <div className="tracker">{steps.map((s,i)=><div className={`track-step ${i<=active?'active':''}`} key={s}><div className="dot">{i<=active?'✓':i+1}</div><span>{s}</span></div>)}</div>}
