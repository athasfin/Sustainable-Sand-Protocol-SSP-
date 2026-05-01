import { useState, useEffect } from "react";
import "./App.css";

const SAMPLE_REPORTS = [
  {id:"RPT-001",reporter:"Karim Uddin",community:"Shahporan, Sylhet",location:"24.8798°N, 91.8687°E",datetime:"2025-04-10T08:30",activity:"Mechanized Dredging",description:"Large dredger operating overnight near the eastern bank. Approximate extraction 50-80 tons. Three trucks observed loading material.",status:"verified",evidence:"photo_001.jpg",safetyAck:true},
  {id:"RPT-002",reporter:"Nasrin Begum",community:"Kanaighat",location:"25.0342°N, 92.0132°E",datetime:"2025-04-14T06:15",activity:"Manual Extraction",description:"Group of 8 workers extracting sand with shovels. No visible license. Riverbank visibly destabilized.",status:"review",evidence:"photo_002.jpg",safetyAck:true},
  {id:"RPT-003",reporter:"Rahim Ali",community:"Biswanath",location:"24.9011°N, 91.9876°E",datetime:"2025-04-19T09:45",activity:"Truck Loading",description:"Multiple trucks loading from stockpile near river. Fresh excavation marks visible on bank.",status:"new",evidence:"pending",safetyAck:true},
];

const SAMPLE_MSAND = [
  {id:"MS-001",source:"Jaflong Stone Quarry",wasteType:"Crusher dust (0-4mm)",preparation:"Washed + sieve graded",compStrength:"32 MPa vs 28 MPa river sand",waterAbsorption:"1.8% vs 2.3% river sand",siltContent:"1.2% (pass BDS spec)",communityFeedback:"Builders noted good workability. One mason requested slightly coarser grade.",feasibility:"High – meets BDS standard; 15% cheaper after transport savings",notes:"First demo at Sylhet City Corporation infrastructure site. Engineer Dr. Hossain endorsed for non-structural use.",date:"2025-04-08"},
];

const NEXT_STEPS = [
  "Expand community monitoring to 5 additional villages along Surma River",
  "Commission third-party lab verification of M-Sand batch quality",
  "Launch Sustainable Sourcing Charter sign-up with 3 pilot construction firms",
  "Submit monitoring data to Sylhet City Corporation for enforcement review",
  "Begin Sentinel-2 satellite baseline mapping for change detection",
  "Develop drone verification protocol with SUST Computer Science dept",
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [reports, setReports] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ssp_reports") || "null") || SAMPLE_REPORTS; } catch { return SAMPLE_REPORTS; }
  });
  const [msand, setMsand] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ssp_msand") || "null") || SAMPLE_MSAND; } catch { return SAMPLE_MSAND; }
  });
  const [toast, setToast] = useState(null);
  const guardians = 30;
  const sessions = 7;

  useEffect(() => { localStorage.setItem("ssp_reports", JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem("ssp_msand", JSON.stringify(msand)); }, [msand]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const addReport = (r) => {
    setReports(prev => [{ ...r, id: `RPT-${String(prev.length+1).padStart(3,"0")}`, status: "new" }, ...prev]);
    showToast("Report submitted successfully");
  };

  const addMsand = (m) => {
    setMsand(prev => [{ ...m, id: `MS-${String(prev.length+1).padStart(3,"0")}`, date: new Date().toISOString().split("T")[0] }, ...prev]);
    showToast("M-Sand record saved");
  };

  const exportCSV = () => {
    const headers = ["ID","Reporter","Community","Location","Date/Time","Activity","Description","Status","Evidence"];
    const rows = reports.map(r => [r.id,r.reporter,r.community,r.location,r.datetime,r.activity,r.description,r.status,r.evidence]);
    const csv = [headers,...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "ssp_reports.csv"; a.click();
    showToast("CSV exported");
  };

  const navItems = [
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"report",icon:"⊕",label:"Submit Report"},
    {id:"reports",icon:"≡",label:"All Reports"},
    {id:"msand",icon:"◉",label:"M-Sand Demo"},
    {id:"pilot",icon:"✦",label:"Pilot Report"},
  ];

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>SSP Pilot</h1>
          <p>Sustainable Sand Protocol<br/>Surma River, Sylhet</p>
        </div>
        <nav className="nav">
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={() => setTab(n.id)}>
              <span className="icon">{n.icon}</span>{n.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>SUST × Millennium Fellowship<br/>Sylhet, Bangladesh</p>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div>
            <h2>{navItems.find(n=>n.id===tab)?.label}</h2>
            <p>Sustainable Sand Protocol — River Guardian Network</p>
          </div>
          <span className="badge badge-gold">Phase 1 Active</span>
        </div>
        <div className="content">
          {tab==="dashboard" && <Dashboard reports={reports} msand={msand} guardians={guardians} sessions={sessions} setTab={setTab} />}
          {tab==="report" && <ReportForm onSubmit={addReport} />}
          {tab==="reports" && <ReportTable reports={reports} onExport={exportCSV} setReports={setReports} />}
          {tab==="msand" && <MSandSection msand={msand} onAdd={addMsand} />}
          {tab==="pilot" && <PilotReport reports={reports} msand={msand} guardians={guardians} sessions={sessions} />}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Dashboard({ reports, msand, guardians, sessions, setTab }) {
  const verified = reports.filter(r=>r.status==="verified").length;
  return (
    <>
      <div className="alert alert-info">
        River Guardian network is active. {reports.length} reports collected across the Surma Basin.
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-num">{reports.length}</div><div className="stat-label">Mining Reports</div></div>
        <div className="stat-card gold"><div className="stat-num">{guardians}</div><div className="stat-label">Guardians Trained</div></div>
        <div className="stat-card green"><div className="stat-num">{sessions}</div><div className="stat-label">Community Sessions</div></div>
        <div className="stat-card red"><div className="stat-num">{verified}</div><div className="stat-label">Verified Violations</div></div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">Recent Reports</div>
          <div className="card-sub">Latest community observations</div>
          {reports.slice(0,3).map(r => (
            <div key={r.id} className="report-row">
              <span className={`status-pill status-${r.status}`}>{r.status}</span>
              <div>
                <div className="report-community">{r.community}</div>
                <div className="report-meta">{r.activity} · {r.reporter}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" style={{marginTop:14}} onClick={()=>setTab("reports")}>View All Reports →</button>
        </div>
        <div className="card">
          <div className="card-title">Protocol Progress</div>
          <div className="card-sub">Pillar implementation status</div>
          {[
            {label:"Innovation (M-Sand)",pct:45,color:"var(--blue)"},
            {label:"Accountability (Monitoring)",pct:70,color:"var(--gold)"},
            {label:"Market Transformation",pct:25,color:"var(--green)"},
          ].map(p => (
            <div key={p.label} className="progress-item">
              <div className="progress-header">
                <span className="progress-label">{p.label}</span>
                <span className="progress-pct">{p.pct}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${p.pct}%`,background:p.color}}></div></div>
            </div>
          ))}
          <div className="msand-note">M-Sand demo completed · {msand.length} batch record{msand.length!==1?"s":""}</div>
        </div>
      </div>
    </>
  );
}

function ReportForm({ onSubmit }) {
  const empty = {reporter:"",community:"",location:"",datetime:"",activity:"",description:"",evidence:"",safetyAck:false};
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const set = (k,v) => setForm(prev=>({...prev,[k]:v}));
  const handle = () => {
    if (!form.reporter||!form.community||!form.activity||!form.description) { alert("Please fill all required fields."); return; }
    if (!form.safetyAck) { alert("Please acknowledge the safety protocol."); return; }
    onSubmit(form); setForm(empty); setSubmitted(true); setTimeout(()=>setSubmitted(false),4000);
  };
  return (
    <div className="card">
      <div className="card-title">Community Observation Report</div>
      <div className="card-sub">River Guardian field documentation form</div>
      {submitted && <div className="alert alert-success">Report submitted successfully. Evidence will be reviewed by the monitoring team.</div>}
      <div className="form-grid">
        <div className="form-group"><label>Reporter Name *</label><input placeholder="Full name" value={form.reporter} onChange={e=>set("reporter",e.target.value)} /></div>
        <div className="form-group"><label>Community / Village *</label><input placeholder="e.g. Kanaighat, Sylhet" value={form.community} onChange={e=>set("community",e.target.value)} /></div>
        <div className="form-group"><label>GPS / Location</label><input placeholder="Coordinates or landmark" value={form.location} onChange={e=>set("location",e.target.value)} /></div>
        <div className="form-group"><label>Date & Time *</label><input type="datetime-local" value={form.datetime} onChange={e=>set("datetime",e.target.value)} /></div>
        <div className="form-group full">
          <label>Activity Type *</label>
          <select value={form.activity} onChange={e=>set("activity",e.target.value)}>
            <option value="">— Select activity —</option>
            <option>Mechanized Dredging</option>
            <option>Manual Extraction</option>
            <option>Truck Loading / Transport</option>
            <option>Stockpile / Storage</option>
            <option>Riverbank Erosion</option>
            <option>Equipment Staging</option>
            <option>Other (describe below)</option>
          </select>
        </div>
        <div className="form-group full"><label>Observation Description *</label><textarea rows={4} placeholder="Equipment, volume estimate, workers, license plates, duration..." value={form.description} onChange={e=>set("description",e.target.value)} /></div>
        <div className="form-group full"><div className="upload-box">📷 Tap to attach photo or video<br/><span className="upload-hint">JPG, PNG, MP4 · Max 20MB · GPS metadata preserved</span></div></div>
        <div className="form-group full"><label>Evidence Filename</label><input placeholder="e.g. photo_kanaighat_0414.jpg" value={form.evidence} onChange={e=>set("evidence",e.target.value)} /></div>
        <div className="form-group full">
          <div className="checkbox-row">
            <input type="checkbox" id="safety" checked={form.safetyAck} onChange={e=>set("safetyAck",e.target.checked)} />
            <label htmlFor="safety">I confirm I observed from a safe distance, did not confront anyone, and followed River Guardian safety protocol.</label>
          </div>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={handle}>Submit Report</button>
        <button className="btn btn-outline" onClick={()=>setForm(empty)}>Clear Form</button>
        <span className="required-note">* Required fields</span>
      </div>
    </div>
  );
}

function ReportTable({ reports, onExport, setReports }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? reports : reports.filter(r=>r.status===filter);
  const setStatus = (id, status) => setReports(prev => prev.map(r => r.id===id ? {...r,status} : r));
  return (
    <div className="card">
      <div className="table-header">
        <div>
          <div className="card-title">All Community Reports</div>
          <div className="card-sub">{reports.length} reports · sorted newest first</div>
        </div>
        <div className="table-controls">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="review">Under Review</option>
            <option value="verified">Verified</option>
          </select>
          <button className="btn btn-gold btn-sm" onClick={onExport}>Export CSV</button>
        </div>
      </div>
      {filtered.length === 0
        ? <div className="empty">No reports found for this filter.</div>
        : <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Reporter</th><th>Community</th><th>Activity</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><span className="report-id">{r.id}</span></td>
                    <td>{r.reporter}</td>
                    <td>{r.community}</td>
                    <td><span className="tag">{r.activity}</span></td>
                    <td className="date-cell">{r.datetime?.slice(0,10)}</td>
                    <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                    <td>
                      <select className="status-select" value={r.status} onChange={e=>setStatus(r.id,e.target.value)}>
                        <option value="new">New</option>
                        <option value="review">Review</option>
                        <option value="verified">Verified</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

function MSandSection({ msand, onAdd }) {
  const empty = {source:"",wasteType:"",preparation:"",compStrength:"",waterAbsorption:"",siltContent:"",communityFeedback:"",feasibility:"",notes:""};
  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);
  const set = (k,v) => setForm(prev=>({...prev,[k]:v}));
  const handle = () => {
    if (!form.source||!form.wasteType) { alert("Please fill source and waste type."); return; }
    onAdd(form); setForm(empty); setShow(false);
  };
  return (
    <>
      {msand.map(m => (
        <div className="card" key={m.id}>
          <div className="msand-header">
            <div><div className="card-title">{m.id} — {m.source}</div><div className="card-sub">{m.date} · {m.wasteType}</div></div>
            <span className="badge badge-green">Demo Complete</span>
          </div>
          <div className="form-grid">
            {[["Preparation Method",m.preparation],["Compressive Strength",m.compStrength],["Water Absorption",m.waterAbsorption],["Silt Content",m.siltContent],["Feasibility",m.feasibility]].map(([k,v]) => (
              <div key={k} className="data-cell"><div className="data-label">{k}</div><div className="data-val">{v}</div></div>
            ))}
            <div className="data-cell"><div className="data-label">Photos</div><div className="upload-box" style={{padding:"8px",fontSize:11}}>📷 Attach demo photos</div></div>
          </div>
          <div className="feedback-box">
            <div className="feedback-label">Community Feedback</div>
            <div className="feedback-text">"{m.communityFeedback}"</div>
          </div>
          {m.notes && <div className="notes-text">Notes: {m.notes}</div>}
        </div>
      ))}
      {!show
        ? <button className="btn btn-primary" onClick={()=>setShow(true)}>+ Add New M-Sand Record</button>
        : <div className="card">
            <div className="card-title">New M-Sand Demonstration Record</div>
            <div className="card-sub">Document a new batch test or community demonstration</div>
            <div className="form-grid">
              <div className="form-group"><label>Sample Source (Quarry) *</label><input placeholder="e.g. Jaflong Stone Quarry" value={form.source} onChange={e=>set("source",e.target.value)} /></div>
              <div className="form-group"><label>Quarry Waste Type *</label><input placeholder="e.g. Crusher dust (0-4mm)" value={form.wasteType} onChange={e=>set("wasteType",e.target.value)} /></div>
              <div className="form-group"><label>Preparation Method</label><input placeholder="e.g. Washed + sieve graded" value={form.preparation} onChange={e=>set("preparation",e.target.value)} /></div>
              <div className="form-group"><label>Compressive Strength (vs river sand)</label><input placeholder="e.g. 30 MPa vs 28 MPa" value={form.compStrength} onChange={e=>set("compStrength",e.target.value)} /></div>
              <div className="form-group"><label>Water Absorption</label><input placeholder="e.g. 1.8% vs 2.3%" value={form.waterAbsorption} onChange={e=>set("waterAbsorption",e.target.value)} /></div>
              <div className="form-group"><label>Silt Content (BDS limit ≤3%)</label><input placeholder="e.g. 1.2%" value={form.siltContent} onChange={e=>set("siltContent",e.target.value)} /></div>
              <div className="form-group full"><label>Community Feedback</label><textarea placeholder="What did builders and community members say?" value={form.communityFeedback} onChange={e=>set("communityFeedback",e.target.value)} /></div>
              <div className="form-group full"><label>Feasibility Assessment</label><textarea placeholder="Economic viability, supply chain, barriers..." value={form.feasibility} onChange={e=>set("feasibility",e.target.value)} /></div>
              <div className="form-group full"><label>Additional Notes</label><textarea placeholder="Engineer endorsements, next steps..." value={form.notes} onChange={e=>set("notes",e.target.value)} /></div>
            </div>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={handle}>Save Record</button>
              <button className="btn btn-outline" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </div>
      }
    </>
  );
}

function PilotReport({ reports, msand, guardians, sessions }) {
  const verified = reports.filter(r=>r.status==="verified").length;
  const locations = [...new Set(reports.map(r=>r.community))];
  const today = new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"});
  return (
    <>
      <div className="card">
        <div className="pilot-header">
          <div>
            <div className="pilot-label">Sustainable Sand Protocol</div>
            <div className="pilot-title">Pilot Phase Summary Report</div>
            <div className="pilot-sub">Surma River Basin, Sylhet Division · Generated {today}</div>
          </div>
          <div className="pilot-badge-wrap">
            <span className="badge badge-blue">Phase 1 Complete</span>
            <span className="pilot-phase-note">Months 1–3</span>
          </div>
        </div>
        <div className="section-divider"><span>Key Metrics</span></div>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-num">{reports.length}</div><div className="stat-label">Reports Collected</div></div>
          <div className="stat-card gold"><div className="stat-num">{guardians}</div><div className="stat-label">Guardians Trained</div></div>
          <div className="stat-card green"><div className="stat-num">{sessions}</div><div className="stat-label">Community Sessions</div></div>
          <div className="stat-card red"><div className="stat-num">{verified}</div><div className="stat-label">Verified Violations</div></div>
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">M-Sand Demonstration</div>
          <div className="card-sub">{msand.length} batch record{msand.length!==1?"s":""} completed</div>
          {msand.map(m=>(
            <div key={m.id} className="msand-row">
              <div className="msand-row-name">{m.source}</div>
              <div className="msand-row-type">{m.wasteType}</div>
              <div className="msand-row-ok">✓ {m.feasibility?.split("–")[0] || "Feasible"}</div>
            </div>
          ))}
          <div className="bds-note">Status: M-Sand meets BDS specification for non-structural use</div>
        </div>
        <div className="card">
          <div className="card-title">Coverage Map</div>
          <div className="card-sub">Communities with active monitoring</div>
          {locations.map(loc => (
            <div key={loc} className="location-row"><span className="loc-dot">◈</span><span className="loc-name">{loc}</span></div>
          ))}
          <div className="phase2-note">Phase 2 target: expand to 8 additional communities</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Key Findings</div>
        <div className="card-sub">Evidence-based observations from pilot implementation</div>
        {[
          `${reports.length} sand mining observations documented across ${locations.length} riverside communities, with ${verified} violations independently verified.`,
          "M-Sand from Jaflong quarry dust meets BDS standards and shows 10–15% higher compressive strength than river sand in preliminary tests.",
          "Community monitors report 70% decline in fish catches in actively-mined stretches, corroborating environmental impact data.",
          `Pilot monitoring network successfully trained ${guardians} River Guardians across ${sessions} community sessions within the foundation phase.`,
          "Sustainable Sourcing Charter draft completed; 2 construction firms have expressed interest in Bronze tier commitment.",
          "Satellite change detection using Sentinel-2 identified 3 new mining hotspots not previously reported by ground monitors.",
        ].map((f,i) => (
          <div className="finding-item" key={i}>
            <div className="finding-dot"></div>
            <div className="finding-text">{f}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Next Steps — Phase 2 Roadmap</div>
        <div className="card-sub">Planned activities for months 4–12</div>
        {NEXT_STEPS.map((step,i) => (
          <div key={i} className="next-step-row">
            <span className="step-num">{i+1}</span>
            <span className="step-text">{step}</span>
          </div>
        ))}
      </div>
      <div className="pilot-footer">
        <div className="pilot-footer-label">Prepared By</div>
        <div className="pilot-footer-name">Sustainable Resource Innovation Lab</div>
        <div className="pilot-footer-sub">Shahjalal University of Science and Technology · Sylhet, Bangladesh</div>
      </div>
    </>
  );
}
