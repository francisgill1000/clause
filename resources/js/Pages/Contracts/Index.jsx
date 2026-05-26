import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, StatTile, Tabs, Badge, Btn } from '../../Components/Clause/UI';
import { Download, Filter, Plus, Search } from '../../Components/Clause/Icons';

const STATUS_MAP = {
  all:       'All',
  drafting:  'Drafting',
  review:    'In review',
  signature: 'Signature',
  active:    'Active',
  expiring:  'Expiring',
};

const typeColorMap = {
  nda: 'nda',
  msa: 'msa',
  sow: 'sow',
  amendment: 'amendment',
  renewal: 'renewal',
};

const defaultContracts = [
  { id: 'CTR-1024', title: 'SaaS Master Agreement', type: 'msa', counterparty: 'Acme Corp', owner: 'Sarah Chen', status: 'active', value: '$240,000', effective: '2025-01-15', expires: '2026-01-15' },
  { id: 'CTR-1023', title: 'NDA - Project Atlas', type: 'nda', counterparty: 'Globex Inc', owner: 'James Liu', status: 'drafting', value: '$0', effective: '-', expires: '-' },
  { id: 'CTR-1022', title: 'SOW - Phase 2 Build', type: 'sow', counterparty: 'Initech LLC', owner: 'Sarah Chen', status: 'review', value: '$85,000', effective: '2025-03-01', expires: '2025-09-01' },
  { id: 'CTR-1021', title: 'Data Processing Addendum', type: 'amendment', counterparty: 'Umbrella Co', owner: 'Maria Gonzalez', status: 'signature', value: '$0', effective: '-', expires: '-' },
  { id: 'CTR-1020', title: 'Enterprise License Agreement', type: 'msa', counterparty: 'Skyline Tech', owner: 'James Liu', status: 'active', value: '$520,000', effective: '2024-06-01', expires: '2026-06-01' },
  { id: 'CTR-1019', title: 'Support Services Agreement', type: 'sow', counterparty: 'NovaCare', owner: 'Sarah Chen', status: 'expiring', value: '$120,000', effective: '2024-12-01', expires: '2025-06-01' },
  { id: 'CTR-1018', title: 'Reseller Agreement', type: 'msa', counterparty: 'TradeLink', owner: 'Maria Gonzalez', status: 'active', value: '$310,000', effective: '2025-02-01', expires: '2026-02-01' },
  { id: 'CTR-1017', title: 'Consulting Framework Agreement', type: 'msa', counterparty: 'Bridgepoint Advisory', owner: 'James Liu', status: 'drafting', value: '$180,000', effective: '-', expires: '-' },
];

const defaultCounts = { all: 8, drafting: 2, review: 1, signature: 1, active: 3, expiring: 1 };

export default function Index({ contracts: propContracts, counts: propCounts }) {
  const contracts = propContracts || defaultContracts;
  const counts = propCounts || defaultCounts;

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

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
          c.title.toLowerCase().includes(q) ||
          c.counterparty.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [contracts, tab, search]);

  return (
    <ClauseLayout title="Contracts">
      <Head title="Contracts" />

      <PageHeader
        title="Contracts"
        subtitle={`${contracts.length} contracts across your organization`}
        actions={
          <>
            <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
            <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
            <Btn variant="primary" size="sm" icon={Plus} onClick={() => router.visit(typeof route === 'function' ? route('contracts.create') : '/contracts/create')}>New contract</Btn>
          </>
        }
      />

      {/* Stats */}
      <div className="stat-grid mb-24">
        <StatTile label="Active value" value="$1.07M" currency="" delta="+8.2%" deltaDir="up" sub="vs last quarter" />
        <StatTile label="In negotiation" value="4" delta="+1" deltaDir="up" sub="this week" />
        <StatTile label="Avg. cycle time" value="18d" delta="-2d" deltaDir="up" sub="improving" />
        <StatTile label="Renewing in 90d" value="3" sub="contracts" />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {/* Filter strip */}
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
        <button className="filter-chip">Counterparty</button>
        <button className="filter-chip">Owner</button>
        <button className="filter-chip">Effective</button>
        <button className="filter-chip">High risk</button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body no-pad">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 28 }}></th>
                  <th>Contract</th>
                  <th>Counterparty</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Effective</th>
                  <th>Expires</th>
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
                      <div className="cell-secondary">{c.id} &middot; {c.type?.toUpperCase()}</div>
                    </td>
                    <td>{c.counterparty}</td>
                    <td>{c.owner}</td>
                    <td><Badge status={c.status}>{c.status}</Badge></td>
                    <td className="cell-mono">{c.value}</td>
                    <td className="cell-secondary">{c.effective}</td>
                    <td className="cell-secondary">{c.expires}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}>
                        &hellip;
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-4)' }}>
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
