import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { Badge, Btn } from '../../Components/Clause/UI';
import {
  History, Download, MessageSquare, Edit, Send, Check,
  FileText, Eye, Clock, AlertTriangle, Paperclip, ChevronRight, Trash,
} from '../../Components/Clause/Icons';

const pipelineSteps = ['Drafting', 'Review', 'Signature', 'Active'];

function getPipelineState(status) {
  const map = { drafting: 0, review: 1, signature: 2, active: 3, expiring: 3 };
  return map[status] ?? 0;
}

function fmt(val) {
  if (!val && val !== 0) return '—';
  return '$' + Number(val).toLocaleString();
}

function fmtDate(val) {
  if (!val) return '—';
  return String(val).slice(0, 10);
}

export default function Show({ contract }) {
  if (!contract) return null;

  const activeStep = getPipelineState(contract.status);
  const riskScore = contract.risk_score || 0;
  const riskLevel = riskScore >= 75 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
  const riskAngle = -90 + (riskScore / 100) * 180;

  const parties = contract.parties || [];
  const milestones = contract.milestones || [];
  const comments = contract.comments || [];
  const activities = contract.activities || [];

  const [commentText, setCommentText] = useState('');
  const [commentProcessing, setCommentProcessing] = useState(false);

  function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim() || commentProcessing) return;
    setCommentProcessing(true);
    router.post(
      typeof route === 'function'
        ? route('contracts.comments.store', contract.id)
        : `/contracts/${contract.id}/comments`,
      { body: commentText },
      {
        preserveScroll: true,
        onSuccess: () => setCommentText(''),
        onFinish: () => setCommentProcessing(false),
      }
    );
  }

  function handleDelete() {
    if (!confirm(`Delete "${contract.title}"? This cannot be undone.`)) return;
    router.delete(typeof route === 'function' ? route('contracts.destroy', contract.id) : `/contracts/${contract.id}`);
  }

  const terms = [
    { key: 'Contract value', value: fmt(contract.value) },
    { key: 'Currency', value: contract.currency || 'USD' },
    { key: 'Term', value: contract.term || '—' },
    { key: 'Auto-renewal', value: contract.auto_renew || 'Off' },
    { key: 'Notice period', value: contract.notice_period || '—' },
    { key: 'Start date', value: fmtDate(contract.start_date) },
    { key: 'End date', value: contract.end_date || '—' },
  ];

  return (
    <ClauseLayout title={contract.title}>
      <Head title={contract.title} />

      <div className="detail-hero">
        <div className="breadcrumb">
          <Link href={typeof route === 'function' ? route('contracts.index') : '/contracts'}>Contracts</Link>
          <ChevronRight size={12} />
          <span>{contract.contract_number}</span>
        </div>

        <h1>{contract.title}</h1>

        <div className="detail-meta">
          <Badge status={contract.status}>{contract.status}</Badge>
          <div className="detail-meta-item">
            <FileText size={13} />
            {contract.type}
          </div>
          {contract.counterparty && (
            <div className="detail-meta-item">
              {contract.counterparty.name}
            </div>
          )}
        </div>

        <div className="detail-actions">
          <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
          <Btn
            variant="secondary"
            size="sm"
            icon={Edit}
            onClick={() => router.visit(typeof route === 'function' ? route('contracts.edit', contract.id) : `/contracts/${contract.id}/edit`)}
          >
            Edit
          </Btn>
          <Btn variant="ghost" size="sm" icon={Trash} onClick={handleDelete} style={{ color: 'var(--danger)' }}>Delete</Btn>
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

      <div className="detail-grid">
        {/* LEFT */}
        <div className="contract-doc">
          <div className="sec-bar">
            <div className="sec-bar-title">
              <FileText size={16} />
              Contract details
            </div>
          </div>

          <div className="doc-body">
            <div className="doc-section">
              <h2>Contract information</h2>
              <div className="terms-list" style={{ marginTop: 16 }}>
                <div className="term-item"><span className="term-key">Contract #</span><span className="term-value">{contract.contract_number}</span></div>
                <div className="term-item"><span className="term-key">Title</span><span className="term-value">{contract.title}</span></div>
                <div className="term-item"><span className="term-key">Type</span><span className="term-value">{contract.type}</span></div>
                <div className="term-item"><span className="term-key">Status</span><span className="term-value">{contract.status}</span></div>
                <div className="term-item"><span className="term-key">Counterparty</span><span className="term-value">{contract.counterparty?.name || '—'}</span></div>
                <div className="term-item"><span className="term-key">Owner</span><span className="term-value">{contract.owner?.name || '—'}</span></div>
                {terms.map((t) => (
                  <div className="term-item" key={t.key}><span className="term-key">{t.key}</span><span className="term-value">{t.value}</span></div>
                ))}
                <div className="term-item"><span className="term-key">Progress</span><span className="term-value">{contract.progress ?? 0}%</span></div>
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
                <div className={`risk-label ${riskLevel}`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk
                </div>
                <div className="risk-score">Score: {riskScore}/100</div>
              </div>
            </div>
          </div>

          {/* Parties & signers */}
          {parties.length > 0 && (
            <div className="rail-card">
              <div className="rail-card-header">
                <span className="rail-card-title">Parties &amp; signers</span>
              </div>
              <div className="rail-card-body">
                {parties.map((p) => (
                  <div className="party-row" key={p.id}>
                    <div className="party-avatar">{p.initials}</div>
                    <div className="party-info">
                      <div className="party-name">{p.signer_name}</div>
                      <div className="party-role">{p.company_name} — {p.signer_title}</div>
                    </div>
                    <Badge status={p.signed ? 'active' : 'pending'}>
                      {p.signed ? 'Signed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="rail-card">
              <div className="rail-card-header">
                <span className="rail-card-title">Milestones</span>
              </div>
              <div className="rail-card-body">
                <div className="milestones">
                  {milestones.map((m) => (
                    <div className="milestone-item" key={m.id}>
                      <span className={`milestone-dot ${m.is_completed ? 'done' : 'upcoming'}`} />
                      <div>
                        <div className="milestone-text">{m.name}</div>
                        <div className="milestone-date">{m.target_date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Discussion */}
          <div className="rail-card">
            <div className="rail-card-header">
              <span className="rail-card-title">Discussion</span>
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{comments.length} comments</span>
            </div>
            <div className="rail-card-body">
              <div className="thread">
                {comments.map((c) => (
                  <div className="thread-msg" key={c.id}>
                    <div className="thread-avatar">{c.initials || c.author_name?.charAt(0) || '?'}</div>
                    <div className="thread-bubble">
                      <div className="thread-author">{c.author_name}</div>
                      <div className="thread-text">{c.body}</div>
                      <div className="thread-time">{c.company}</div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div style={{ padding: '16px 0', color: 'var(--text-4)', fontSize: 13 }}>No comments yet</div>
                )}
                <form className="thread-reply" onSubmit={submitComment}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Btn variant="primary" size="sm" icon={Send} type="submit" disabled={commentProcessing}>Send</Btn>
                </form>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          {activities.length > 0 && (
            <div className="rail-card">
              <div className="rail-card-header">
                <span className="rail-card-title">Activity</span>
              </div>
              <div className="rail-card-body">
                <div className="activity-feed">
                  {activities.map((a) => (
                    <div className="activity-item" key={a.id}>
                      <div className="activity-icon">
                        <Clock size={14} />
                      </div>
                      <div>
                        <div className="activity-text"><strong>{a.actor}</strong> — {a.description}</div>
                        <div className="activity-time">{a.when_text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClauseLayout>
  );
}
