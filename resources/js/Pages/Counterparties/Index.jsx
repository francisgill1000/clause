import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Badge } from '../../Components/Clause/UI';
import { Download, Plus, Search, More } from '../../Components/Clause/Icons';

const defaultCounterparties = [
  { id: 1, name: 'Acme Corp', domain: 'acme.com', initials: 'AC', contracts: 5, active: 3, totalValue: '$760,000', since: 'Jan 2023', risk: 'low' },
  { id: 2, name: 'Globex Inc', domain: 'globex.io', initials: 'GI', contracts: 3, active: 2, totalValue: '$420,000', since: 'Mar 2023', risk: 'low' },
  { id: 3, name: 'Initech LLC', domain: 'initech.com', initials: 'IL', contracts: 2, active: 1, totalValue: '$185,000', since: 'Jun 2024', risk: 'medium' },
  { id: 4, name: 'Umbrella Co', domain: 'umbrella.co', initials: 'UC', contracts: 4, active: 2, totalValue: '$530,000', since: 'Sep 2022', risk: 'high' },
  { id: 5, name: 'Skyline Tech', domain: 'skyline.tech', initials: 'ST', contracts: 6, active: 4, totalValue: '$1,240,000', since: 'Feb 2022', risk: 'low' },
  { id: 6, name: 'NovaCare', domain: 'novacare.io', initials: 'NC', contracts: 2, active: 1, totalValue: '$120,000', since: 'Dec 2024', risk: 'medium' },
  { id: 7, name: 'TradeLink', domain: 'tradelink.com', initials: 'TL', contracts: 3, active: 2, totalValue: '$310,000', since: 'Jul 2023', risk: 'low' },
  { id: 8, name: 'Bridgepoint Advisory', domain: 'bridgepoint.co', initials: 'BA', contracts: 1, active: 0, totalValue: '$180,000', since: 'Jan 2025', risk: 'low' },
];

const riskBadgeMap = { low: 'active', medium: 'warn', high: 'danger' };

export default function Index({ counterparties: propCounterparties }) {
  const counterparties = propCounterparties || defaultCounterparties;
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return counterparties;
    const q = search.toLowerCase();
    return counterparties.filter(
      (cp) => cp.name.toLowerCase().includes(q) || cp.domain.toLowerCase().includes(q)
    );
  }, [counterparties, search]);

  return (
    <ClauseLayout title="Counterparties">
      <Head title="Counterparties" />

      <PageHeader
        title="Counterparties"
        subtitle={`${counterparties.length} organizations in your network`}
        actions={
          <>
            <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
            <Btn variant="primary" size="sm" icon={Plus}>Add counterparty</Btn>
          </>
        }
      />

      <div className="toolbar">
        <div className="search-input" style={{ flex: '0 1 320px' }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search counterparties..."
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
                  <th>Counterparty</th>
                  <th>Contracts</th>
                  <th>Active</th>
                  <th>Total value</th>
                  <th>Relationship since</th>
                  <th>Risk tier</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cp) => (
                  <tr key={cp.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="cp-logo">{cp.initials}</div>
                        <div>
                          <div className="customer-name">{cp.name}</div>
                          <div className="customer-sub">{cp.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td>{cp.contracts}</td>
                    <td>{cp.active}</td>
                    <td className="cell-mono">{cp.totalValue}</td>
                    <td className="cell-secondary">{cp.since}</td>
                    <td>
                      <Badge status={riskBadgeMap[cp.risk] || 'neutral'}>
                        {cp.risk}
                      </Badge>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">
                        <More size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-4)' }}>
                      No counterparties found
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
