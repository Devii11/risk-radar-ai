"use client";

import { useState } from "react";

type Decision = {
  id: string;
  area: string;
  due: string;
  score: number;
  after: number;
  title: string;
  signal: string;
  evidence: string[];
  recommendation: string;
  owner: string;
};

const decisions: Decision[] = [
  {
    id: "R-001",
    area: "Partner API",
    due: "14 Jul",
    score: 100,
    after: 70,
    title: "Name the rollback owner",
    signal: "Integration testing is blocked because cross-company recovery ownership is still undefined.",
    evidence: ["Partner readiness meeting: rollback owner unconfirmed", "Jira: integration test window marked blocked"],
    recommendation: "Approve a joint readiness review within 24 hours and document the incident boundary.",
    owner: "Program + Partner leads",
  },
  {
    id: "R-002",
    area: "Payments",
    due: "15 Jul",
    score: 71,
    after: 48,
    title: "Set the rollback trigger",
    signal: "Peak-load latency has consumed 82% of the contractual SLA threshold.",
    evidence: ["API monitor: P95 latency 820ms", "Contractual SLA threshold: 1,000ms"],
    recommendation: "Approve a peak-load retest and roll back if the remaining SLA buffer falls below 10%.",
    owner: "Payments lead",
  },
  {
    id: "R-003",
    area: "Captain App",
    due: "13 Jul",
    score: 62,
    after: 32,
    title: "Resolve or move the gate",
    signal: "The release candidate is blocked by security approval with no decision ETA.",
    evidence: ["Jira: release-candidate promotion blocked", "Security approval: no confirmed decision date"],
    recommendation: "Get an approval decision today or move the release gate with a named owner and date.",
    owner: "Security lead",
  },
];

function ScoreBar({ now, after }: { now: number; after: number }) {
  return (
    <div className="score-bars" aria-label={`Risk score ${now}, reduced to ${after} after controls`}>
      <div className="score-row"><span>Now</span><div className="track"><i className="now" style={{ width: `${now}%` }} /></div><b>{now}</b></div>
      <div className="score-row"><span>After</span><div className="track"><i className="after" style={{ width: `${after}%` }} /></div><b>{after}</b></div>
    </div>
  );
}

function DecisionCard({ item, index }: { item: Decision; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const [status, setStatus] = useState<"review" | "approved">("review");

  return (
    <article className={`decision-card ${open ? "open" : ""}`}>
      <button className="card-summary" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="decision-number">0{index + 1}</span>
        <span className="summary-copy">
          <span className="eyebrow"><span>{item.area}</span><span>Due {item.due}</span></span>
          <strong>{item.title}</strong>
          <small>{item.signal}</small>
        </span>
        <span className="score-pill">{item.score}</span>
        <span className="chevron" aria-hidden="true">⌄</span>
      </button>

      {open && (
        <div className="card-detail">
          <ScoreBar now={item.score} after={item.after} />
          <div className="evidence-block">
            <p className="detail-label">Evidence</p>
            {item.evidence.map((line) => <p key={line} className="evidence-line"><span>↳</span>{line}</p>)}
          </div>
          <div className="recommendation">
            <p className="detail-label">Recommended call</p>
            <p>{item.recommendation}</p>
            <div className="owner"><span>Owner</span><strong>{item.owner}</strong></div>
          </div>
          <div className="actions">
            <button className="secondary" onClick={() => setOpen(false)}>Need evidence</button>
            <button className={status === "approved" ? "approved" : "primary"} onClick={() => setStatus("approved")}>
              {status === "approved" ? "✓ Approved" : "Approve call"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Risk Radar home"><span className="brand-mark">R</span><span>RISK RADAR</span></a>
        <span className="prototype">PROTOTYPE • FICTIONAL DATA</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">DELIVERY INTELLIGENCE COPILOT</p>
          <h1>Three decisions.<br /><em>Evidence attached.</em></h1>
          <p className="dek">Risk Radar cuts through delivery noise and gives program leaders the next call—with the source, owner, and consequence visible.</p>
        </div>
        <div className="health-panel">
          <div className="health-head"><span>Program health</span><strong><i /> RED</strong></div>
          <div className="metric-grid">
            <div><b>3</b><span>Decisions now</span></div>
            <div><b>78</b><span>Avg. exposure</span></div>
            <div><b>50</b><span>After controls</span></div>
          </div>
          <p><strong>28-point reduction</strong> if the proposed controls are approved.</p>
        </div>
      </section>

      <section className="decisions" aria-labelledby="decision-title">
        <div className="section-heading">
          <div><p className="kicker">THIS WEEK</p><h2 id="decision-title">Calls that cannot wait</h2></div>
          <span>3 open</span>
        </div>
        <div className="card-list">
          {decisions.map((item, index) => <DecisionCard key={item.id} item={item} index={index} />)}
        </div>
      </section>

      <section className="how-it-works">
        <p className="kicker">THE MODEL</p>
        <h2>Signal in. Decision out.</h2>
        <div className="steps">
          <div><b>01</b><strong>Sense</strong><span>Read delivery updates and SLA signals.</span></div>
          <div><b>02</b><strong>Explain</strong><span>Attach evidence and confidence.</span></div>
          <div><b>03</b><strong>Score</strong><span>Apply visible, editable rules.</span></div>
          <div><b>04</b><strong>Review</strong><span>Program Manager approves the call.</span></div>
        </div>
        <details>
          <summary>View scoring method</summary>
          <p><strong>Score:</strong> Probability × Impact × 2 + Dependency × 4 + SLA exposure × 15 + Owner gap × 8 + stale signal × 7 + blocked status × 10. Capped at 100.</p>
        </details>
      </section>

      <section className="guardrail">
        <span className="lock">H</span>
        <div><p className="kicker">HUMAN IN THE LOOP</p><h2>AI proposes. The Program Manager decides.</h2><p>No automated escalation, stakeholder communication, or go-live decision.</p></div>
      </section>

      <footer><span>Risk Radar • Careem AI Challenge</span><span>Built by Pallavi Shevelly</span></footer>
    </main>
  );
}
