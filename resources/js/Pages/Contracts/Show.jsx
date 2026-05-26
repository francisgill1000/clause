import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { Badge, Btn } from '../../Components/Clause/UI';
import {
  History, Download, MessageSquare, Edit, Send, Check,
  FileText, Eye, Clock, AlertTriangle, Paperclip, ChevronRight,
} from '../../Components/Clause/Icons';

const defaultContract = {
  id: 'CTR-1024',
  title: 'SaaS Master Agreement',
  status: 'review',
  type: 'MSA',
  pages: 24,
  clauses: 47,
  lastEdited: '2h ago',
  openRedlines: 3,
  value: '$240,000',
  effective: '2025-01-15',
  expires: '2026-01-15',
  riskScore: 32,
  riskLevel: 'low',
  parties: [
    { name: 'Acme Corp', role: 'Counterparty', initials: 'AC', signed: false },
    { name: 'Sarah Chen', role: 'Internal signer', initials: 'SC', signed: true },
  ],
  terms: [
    { key: 'Contract value', value: '$240,000 / year' },
    { key: 'Payment terms', value: 'Net 30' },
    { key: 'Auto-renewal', value: 'Yes, 12 months' },
    { key: 'Notice period', value: '90 days' },
    { key: 'Governing law', value: 'Delaware, US' },
    { key: 'Liability cap', value: '2x annual fees' },
  ],
  milestones: [
    { label: 'Contract created', date: 'Jan 10, 2025', done: true },
    { label: 'Internal review complete', date: 'Jan 14, 2025', done: true },
    { label: 'Sent to counterparty', date: 'Jan 15, 2025', done: true },
    { label: 'Counterparty signature', date: 'Pending', done: false },
    { label: 'Effective date', date: 'Jan 20, 2025', done: false },
  ],
  comments: [
    { author: 'Sarah Chen', initials: 'SC', text: 'I have updated the liability cap to 2x as discussed. Please review clause 7.2.', time: '2 hours ago' },
    { author: 'James Liu', initials: 'JL', text: 'Looks good. Can we also add a carve-out for IP claims?', time: '1 hour ago' },
  ],
  activities: [
    { text: '<strong>Sarah Chen</strong> uploaded revised document', time: '2h ago' },
    { text: '<strong>James Liu</strong> commented on clause 7.2', time: '1h ago' },
    { text: '<strong>System</strong> sent reminder to Acme Corp', time: '30m ago' },
  ],
};

const pipelineSteps = ['Drafting', 'Internal review', 'Negotiation', 'Signature', 'Active'];

function getPipelineState(status) {
  const map = { drafting: 0, review: 1, negotiation: 2, signature: 3, active: 4 };
  return map[status] ?? 1;
}

export default function Show({ contract: propContract }) {
  const contract = propContract || defaultContract;
  const activeStep = getPipelineState(contract.status);

  const riskAngle = -90 + (contract.riskScore / 100) * 180;

  return (
    <ClauseLayout title={contract.title}>
      <Head title={contract.title} />

      {/* Detail Hero */}
      <div className="detail-hero">
        <div className="breadcrumb">
          <Link href={typeof route === 'function' ? route('contracts.index') : '/contracts'}>Contracts</Link>
          <ChevronRight size={12} />
          <span>{contract.id}</span>
        </div>

        <h1>{contract.title}</h1>

        <div className="detail-meta">
          <Badge status={contract.status}>{contract.status}</Badge>
          <div className="detail-meta-item">
            <FileText size={13} />
            {contract.pages} pages &middot; {contract.clauses} clauses
          </div>
          <div className="detail-meta-item">
            <Clock size={13} />
            Edited {contract.lastEdited}
          </div>
          {contract.openRedlines > 0 && (
            <div className="detail-meta-item" style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={13} />
              {contract.openRedlines} open redlines
            </div>
          )}
        </div>

        <div className="detail-actions">
          <Btn variant="ghost" size="sm" icon={History}>History</Btn>
          <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
          <Btn variant="ghost" size="sm" icon={MessageSquare}>Comment</Btn>
          <Btn variant="secondary" size="sm" icon={Edit}>Edit</Btn>
          <Btn variant="primary" size="sm" icon={Send}>Send for signature</Btn>
        </div>
      </div>

      {/* Pipeline */}
      <div className="pipeline mb-24">
        {pipelineSteps.map((step, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : '';
          return (
            <React.Fragment key={step}>
              {i > 0 && <div className={`pipeline-line ${i <= activeStep ? 'done' : ''}`} />}
              <div className={`pipeline-step ${state}`}>
                <div className="pipeline-dot">
                  {i < activeStep ? <Check size={14} /> : i + 1}
                </div>
                <span className="pipeline-label">{step}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Two-column detail grid */}
      <div className="detail-grid">
        {/* LEFT — Document preview */}
        <div className="contract-doc">
          <div className="sec-bar">
            <div className="sec-bar-title">
              <FileText size={16} />
              Document preview
            </div>
            <div className="sec-bar-actions">
              <Btn variant="ghost" size="sm" icon={Eye}>View</Btn>
              <Btn variant="ghost" size="sm" icon={Edit}>Edit</Btn>
            </div>
          </div>

          <div className="doc-body">
            <div className="doc-section">
              <h2>1. Services</h2>
              <p>
                Provider shall deliver the software-as-a-service platform described in
                <span className="var">Exhibit A</span> (the "Services") to Client during
                the Term. Provider shall maintain availability of at least
                <span className="var">99.9%</span> uptime measured monthly, excluding
                scheduled maintenance windows.
              </p>
            </div>

            <div className="doc-section">
              <h2>4. Fees &amp; Payment</h2>
              <p>
                Client shall pay Provider the annual fee of <span className="var">$240,000</span> in
                accordance with the payment schedule in <span className="var">Exhibit B</span>.
                All invoices are due within <span className="var">Net 30</span> days of receipt.
              </p>
              <p>
                <span className="strike">Late payments shall incur interest at 1.5% per month.</span>{' '}
                <span className="redline">Late payments shall incur interest at the lesser of 1% per month or the maximum rate permitted by law.</span>
              </p>
            </div>

            <div className="doc-section">
              <h2>7. Limitation of Liability</h2>
              <h3>7.1 Cap</h3>
              <p>
                Neither party's aggregate liability under this Agreement shall exceed
                <span className="var">2x the annual fees</span> paid or payable in
                the twelve (12) months preceding the claim.
              </p>
              <h3>7.2 Exclusions</h3>
              <p>
                The foregoing limitation shall not apply to: (a) breaches of confidentiality;
                (b) indemnification obligations; or (c) willful misconduct.
              </p>
            </div>

            <div className="doc-section">
              <h2>11. Term &amp; Termination</h2>
              <p>
                This Agreement shall commence on the <span className="var">Effective Date</span> and
                continue for an initial term of <span className="var">12 months</span> (the "Initial Term").
                Thereafter, it shall automatically renew for successive <span className="var">12-month</span> periods
                unless either party provides written notice of non-renewal at least
                <span className="var">90 days</span> prior to the end of the then-current term.
              </p>
            </div>

            <div className="doc-section">
              <h2>Signatures</h2>
              <div className="sig-grid">
                {contract.parties.map((party) => (
                  <div className="sig-block" key={party.name}>
                    <div className="sig-label">{party.role}</div>
                    <div className="sig-name">{party.name}</div>
                    <div className="sig-role">{party.role}</div>
                    <div className={`sig-status ${party.signed ? 'signed' : 'pending'}`}>
                      {party.signed ? (
                        <><Check size={14} /> Signed</>
                      ) : (
                        <><Clock size={14} /> Pending</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Rail */}
        <div className="rail">
          {/* Risk meter */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Risk assessment</span>
            </div>
            <div className="rail-card-body">
              <div className="risk-meter">
                <div className="risk-dial" style={{ '--risk-angle': `${riskAngle}deg` }} />
                <div className={`risk-label ${contract.riskLevel}`}>
                  {contract.riskLevel?.charAt(0).toUpperCase() + contract.riskLevel?.slice(1)} risk
                </div>
                <div className="risk-score">Score: {contract.riskScore}/100</div>
              </div>
            </div>
          </div>

          {/* Parties & signers */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Parties &amp; signers</span>
            </div>
            <div className="rail-card-body">
              {contract.parties.map((p) => (
                <div className="party-row" key={p.name}>
                  <div className="party-avatar">{p.initials}</div>
                  <div className="party-info">
                    <div className="party-name">{p.name}</div>
                    <div className="party-role">{p.role}</div>
                  </div>
                  <Badge status={p.signed ? 'active' : 'pending'}>
                    {p.signed ? 'Signed' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Key terms */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Key terms</span>
            </div>
            <div className="rail-card-body">
              <div className="terms-list">
                {contract.terms.map((t) => (
                  <div className="term-item" key={t.key}>
                    <span className="term-key">{t.key}</span>
                    <span className="term-value">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Milestones</span>
            </div>
            <div className="rail-card-body">
              <div className="milestones">
                {contract.milestones.map((m, i) => (
                  <div className="milestone-item" key={i}>
                    <span className={`milestone-dot ${m.done ? 'done' : 'upcoming'}`} />
                    <div>
                      <div className="milestone-text">{m.label}</div>
                      <div className="milestone-date">{m.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Discussion */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Discussion</span>
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{contract.comments.length} comments</span>
            </div>
            <div className="rail-card-body">
              <div className="thread">
                {contract.comments.map((c, i) => (
                  <div className="thread-msg" key={i}>
                    <div className="thread-avatar">{c.initials}</div>
                    <div className="thread-bubble">
                      <div className="thread-author">{c.author}</div>
                      <div className="thread-text">{c.text}</div>
                      <div className="thread-time">{c.time}</div>
                    </div>
                  </div>
                ))}
                <div className="thread-reply">
                  <input type="text" placeholder="Write a reply..." />
                  <Btn variant="primary" size="sm" icon={Send}>Send</Btn>
                </div>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Activity</span>
            </div>
            <div className="rail-card-body">
              <div className="activity-feed">
                {contract.activities.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon">
                      <Clock size={14} />
                    </div>
                    <div>
                      <div className="activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClauseLayout>
  );
}
