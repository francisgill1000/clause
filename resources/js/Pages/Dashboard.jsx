import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ClauseLayout from '../Layouts/ClauseLayout';
import { PageHeader, StatTile, Card, Badge, Btn } from '../Components/Clause/UI';
import { ChevronRight, Clock, FileText } from '../Components/Clause/Icons';

function formatCurrency(value) {
  const num = Number(value) || 0;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toLocaleString();
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const end = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 7) return days + 'd ago';
  return date.toLocaleDateString();
}

export default function Dashboard({ stats, queue, renewals, pipeline }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const s = stats || {};
  const activeValue = formatCurrency(s.active_value ?? 0);
  const inNegotiation = s.in_negotiation_count ?? 0;
  const avgCycle = (s.avg_cycle_time ?? 0) + 'd';
  const renewingSoon = s.expiring_90_days_count ?? 0;

  const q = Array.isArray(queue) ? queue : [];
  const r = Array.isArray(renewals) ? renewals : [];
  const p = Array.isArray(pipeline) ? pipeline : [];

  const totalPipelineCount = p.reduce((sum, row) => sum + (row.count || 0), 0) || 1;

  return (
    <ClauseLayout title="Dashboard">
      <Head title="Dashboard" />

      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Here is what needs your attention today."
      />

      {/* KPIs */}
      <div className="stat-grid mb-24">
        <StatTile label="Active contract value" value={activeValue} currency="$" delta="+12.3%" deltaDir="up" sub="vs last quarter" />
        <StatTile label="In negotiation" value={inNegotiation} delta="+3" deltaDir="up" sub="this week" />
        <StatTile label="Avg. cycle time" value={avgCycle} delta="-2d" deltaDir="up" sub="vs last month" />
        <StatTile label="Renewing in 90 days" value={renewingSoon} sub="contracts" />
      </div>

      {/* Two-column: Queue + Renewals */}
      <div className="grid-2 mb-24">
        {/* Queue */}
        <Card title="In your queue" action={<Btn variant="ghost" size="sm" onClick={() => router.visit('/contracts')}>View all <ChevronRight size={14} /></Btn>} padding={false}>
          <div className="table-wrap">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Counterparty</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {q.length > 0 ? q.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link href={`/contracts/${item.id}`} className="cell-primary" style={{ textDecoration: 'none' }}>
                        {item.title || 'Untitled'}
                      </Link>
                      <div className="cell-secondary">{item.contract_number || ''}</div>
                    </td>
                    <td>{item.counterparty?.name || '-'}</td>
                    <td><Badge status={item.status || 'neutral'}>{item.status || '-'}</Badge></td>
                    <td className="cell-secondary">{timeAgo(item.updated_at)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-4)', padding: 32 }}>
                      No contracts in your queue
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Renewals */}
        <Card title="Renewals coming up" action={<Btn variant="ghost" size="sm" onClick={() => router.visit('/contracts')}>View all <ChevronRight size={14} /></Btn>} padding={false}>
          {r.length > 0 ? r.map((item) => {
            const days = daysUntil(item.end_date);
            const progress = item.progress ?? 0;
            return (
              <div className="renewal-card" key={item.id}>
                <div className="renewal-card-header">
                  <span className="renewal-card-title">{item.title || 'Untitled'}</span>
                  <span className="renewal-card-date">
                    <Clock size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                    {days !== null ? `${days}d left` : '-'}
                  </span>
                </div>
                <div className="renewal-card-party">{item.counterparty?.name || '-'}</div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${days !== null && days < 20 ? 'warn' : ''}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          }) : (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-4)' }}>
              No upcoming renewals
            </div>
          )}
        </Card>
      </div>

      {/* Pipeline */}
      <Card title="Pipeline by stage">
        <div className="bar-chart">
          {p.map((row) => {
            const pct = Math.round((row.count / totalPipelineCount) * 100);
            const label = row.name ? row.name.charAt(0).toUpperCase() + row.name.slice(1) : '';
            return (
              <div className="bar-row" key={row.name || label}>
                <span className="bar-label">{label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }}>
                    {row.count || 0}
                  </div>
                </div>
                <span className="bar-value">{pct}%</span>
              </div>
            );
          })}
        </div>
      </Card>
    </ClauseLayout>
  );
}
