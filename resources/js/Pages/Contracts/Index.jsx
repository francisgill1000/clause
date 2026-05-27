import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, StatTile, Tabs, Badge, Btn } from '../../Components/Clause/UI';
import { Download, Filter, Plus, Search, Trash } from '../../Components/Clause/Icons';

const STATUS_MAP = {
  all:       'All',
  drafting:  'Drafting',
  review:    'In review',
  signature: 'Signature',
  active:    'Active',
  expiring:  'Expiring',
};

const typeColorMap = {
  nda: 'nda', NDA: 'nda',
  msa: 'msa', MSA: 'msa',
  sow: 'sow', SOW: 'sow',
  amendment: 'amendment', Amendment: 'amendment',
  renewal: 'renewal', Renewal: 'renewal',
  Lease: 'msa',
  'IP Licence': 'sow',
  Supply: 'amendment',
  Services: 'renewal',
  'Side Letter': 'nda',
};

function fmt(val) {
  if (!val && val !== 0) return '—';
  return '$' + Number(val).toLocaleString();
}

export default function Index({ contracts: propContracts, counts: propCounts, stats: propStats }) {
  const contracts = propContracts || [];
  const counts = propCounts || {};
  const stats = propStats || {};

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);

  const tabs = Object.entries(STATUS_MAP).map(([key, label]) => ({
    key,
    label,
    count: counts[key] ?? 0,
  }));

  const filtered = useMemo(() => {
    let list = contracts;
    if (tab !== 'all') list = list.filter((c) => c.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.title || '').toLowerCase().includes(q) ||
          (c.counterparty?.name || '').toLowerCase().includes(q) ||
          (c.contract_number || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [contracts, tab, search]);

  function handleDelete(e, c) {
    e.stopPropagation();
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    router.delete(typeof route === 'function' ? route('contracts.destroy', c.id) : `/contracts/${c.id}`);
    setMenuOpen(null);
  }

  return (
    <ClauseLayout title="Contracts">
      <Head title="Contracts" />

      <PageHeader
        title="Contracts"
        subtitle={`${contracts.length} contracts across your organization`}
        actions={
          <>
            <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
            <Btn variant="primary" size="sm" icon={Plus} onClick={() => router.visit(typeof route === 'function' ? route('contracts.create') : '/contracts/create')}>New contract</Btn>
          </>
        }
      />

      <div className="stat-grid mb-24">
        <StatTile label="Active value" value={fmt(stats.total_value)} delta="" sub="total portfolio" />
        <StatTile label="Active contracts" value={String(stats.active_count || 0)} sub="currently active" />
        <StatTile label="Avg. risk score" value={String(Math.round(stats.avg_risk || 0))} sub="across all contracts" />
        <StatTile label="Total contracts" value={String(contracts.length)} sub="in system" />
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="filter-strip">
        <div className="search-input" style={{ flex: '0 1 280px' }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body no-pad">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 28 }}></th>
                  <th>Contract</th>
                  <th>Counterparty</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Start</th>
                  <th>End</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="clickable-row"
                    onClick={() => router.visit(typeof route === 'function' ? route('contracts.show', c.id) : `/contracts/${c.id}`)}
                  >
                    <td>
                      <span className={`type-dot ${typeColorMap[c.type] || 'msa'}`} />
                    </td>
                    <td>
                      <div className="cell-primary">{c.title}</div>
                      <div className="cell-secondary">{c.contract_number} &middot; {c.type}</div>
                    </td>
                    <td>{c.counterparty?.name || '—'}</td>
                    <td><Badge status={c.status}>{c.status}</Badge></td>
                    <td className="cell-mono">{fmt(c.value)}</td>
                    <td className="cell-secondary">{c.start_date ? String(c.start_date).slice(0, 10) : '—'}</td>
                    <td className="cell-secondary">{c.end_date || '—'}</td>
                    <td>
                      <div style={{ position: 'relative' }}>
                        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === c.id ? null : c.id); }}>
                          &hellip;
                        </button>
                        {menuOpen === c.id && (
                          <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 0', minWidth: 120, boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--danger)' }}
                              onClick={(e) => handleDelete(e, c)}
                            >
                              <Trash size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-4)' }}>
                      No contracts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClauseLayout>
  );
}
