import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import ClauseLayout from '../Layouts/ClauseLayout';
import { PageHeader, StatTile, Card, Badge, Btn } from '../Components/Clause/UI';
import { ChevronRight, Clock, FileText } from '../Components/Clause/Icons';

export default function Dashboard({ stats, queue, renewals, pipeline }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const s = stats || {
    activeValue: '2.4M',
    inNegotiation: 12,
    avgCycle: '18d',
    renewingSoon: 6,
  };

  const q = queue || [
    { id: 'CTR-1024', title: 'SaaS Master Agreement', counterparty: 'Acme Corp', status: 'draft', updated: '2h ago' },
    { id: 'CTR-1021', title: 'NDA - Project Atlas', counterparty: 'Globex Inc', status: 'pending', updated: '4h ago' },
    { id: 'CTR-1019', title: 'SOW - Phase 2 Build', counterparty: 'Initech LLC', status: 'active', updated: '1d ago' },
    { id: 'CTR-1017', title: 'Data Processing Addendum', counterparty: 'Umbrella Co', status: 'draft', updated: '2d ago' },
  ];

  const r = renewals || [
    { id: 'CTR-0988', title: 'Cloud Infrastructure MSA', counterparty: 'Skyline Tech', daysLeft: 14, progress: 85 },
    { id: 'CTR-0991', title: 'Support Services Agreement', counterparty: 'NovaCare', daysLeft: 28, progress: 65 },
    { id: 'CTR-0994', title: 'Reseller Agreement', counterparty: 'TradeLink', daysLeft: 45, progress: 40 },
  ];

  const p = pipeline || [
    { stage: 'Drafting', count: 5, pct: 20 },
    { stage: 'Internal review', count: 3, pct: 12 },
    { stage: 'Negotiation', count: 8, pct: 32 },
    { stage: 'Signature', count: 4, pct: 16 },
    { stage: 'Active', count: 5, pct: 20 },
  ];

  return (
    <ClauseLayout title="Dashboard">
      <Head title="Dashboard" />

      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Here is what needs your attention today."
      />

      {/* KPIs */}
      <div className="stat-grid mb-24">
        <StatTile label="Active contract value" value={s.activeValue} currency="$" delta="+12.3%" deltaDir="up" sub="vs last quarter" />
        <StatTile label="In negotiation" value={s.inNegotiation} delta="+3" deltaDir="up" sub="this week" />
        <StatTile label="Avg. cycle time" value={s.avgCycle} delta="-2d" deltaDir="up" sub="vs last month" />
        <StatTile label="Renewing in 90 days" value={s.renewingSoon} sub="contracts" />
      </div>

      {/* Two-column: Queue + Renewals */}
      <div className="grid-2 mb-24">
        {/* Queue */}
        <Card title="In your queue" action={<Btn variant="ghost" size="sm">View all <ChevronRight size={14} /></Btn>} padding={false}>
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
                {q.map((item) => (
                  <tr key={item.id} className="clickable-row" onClick={() => router.visit(`/contracts/${item.id}`)}>
                    <td>
                      <div className="cell-primary">{item.title}</div>
                      <div className="cell-secondary">{item.id}</div>
                    </td>
                    <td>{item.counterparty}</td>
                    <td><Badge status={item.status}>{item.status}</Badge></td>
                    <td className="cell-secondary">{item.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Renewals */}
        <Card title="Renewals coming up" action={<Btn variant="ghost" size="sm">View all <ChevronRight size={14} /></Btn>} padding={false}>
          {r.map((item) => (
            <div className="renewal-card" key={item.id}>
              <div className="renewal-card-header">
                <span className="renewal-card-title">{item.title}</span>
                <span className="renewal-card-date">
                  <Clock size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                  {item.daysLeft}d left
                </span>
              </div>
              <div className="renewal-card-party">{item.counterparty}</div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${item.daysLeft < 20 ? 'warn' : ''}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Pipeline */}
      <Card title="Pipeline by stage">
        <div className="bar-chart">
          {p.map((row) => (
            <div className="bar-row" key={row.stage}>
              <span className="bar-label">{row.stage}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${row.pct}%` }}>
                  {row.count}
                </div>
              </div>
              <span className="bar-value">{row.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </ClauseLayout>
  );
}
