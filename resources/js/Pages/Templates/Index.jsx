import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Tabs } from '../../Components/Clause/UI';
import { Folder, Plus, Search } from '../../Components/Clause/Icons';

const defaultTemplates = [
  { id: 1, name: 'Master Services Agreement', description: 'Standard MSA for software and professional services engagements.', department: 'Legal', uses: 34, category: 'legal' },
  { id: 2, name: 'Non-Disclosure Agreement', description: 'Mutual NDA for protecting confidential information during discussions.', department: 'Legal', uses: 67, category: 'legal' },
  { id: 3, name: 'Statement of Work', description: 'Project-scoped SOW defining deliverables, timeline, and payment.', department: 'Sales', uses: 28, category: 'sales' },
  { id: 4, name: 'Data Processing Addendum', description: 'GDPR-compliant DPA for processing personal data on behalf of clients.', department: 'Privacy', uses: 19, category: 'privacy' },
  { id: 5, name: 'Employee Offer Letter', description: 'Standard offer letter template for full-time employees.', department: 'People', uses: 52, category: 'people' },
  { id: 6, name: 'Consulting Agreement', description: 'Independent contractor agreement for consulting engagements.', department: 'Ops', uses: 15, category: 'ops' },
  { id: 7, name: 'Software License Agreement', description: 'Enterprise software license with SLA and support terms.', department: 'Sales', uses: 22, category: 'sales' },
  { id: 8, name: 'Vendor Agreement', description: 'Standard terms for engaging third-party vendors and suppliers.', department: 'Ops', uses: 11, category: 'ops' },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'legal', label: 'Legal' },
  { key: 'sales', label: 'Sales' },
  { key: 'ops', label: 'Ops' },
  { key: 'people', label: 'People' },
  { key: 'privacy', label: 'Privacy' },
];

export default function Index({ templates: propTemplates }) {
  const templates = propTemplates || defaultTemplates;
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = templates;
    if (cat !== 'all') list = list.filter((t) => t.category === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [templates, cat, search]);

  return (
    <ClauseLayout title="Templates">
      <Head title="Templates" />

      <PageHeader
        title="Templates"
        subtitle={`${templates.length} templates in your library`}
        actions={
          <>
            <Btn variant="ghost" size="sm" icon={Folder}>Folders</Btn>
            <Btn variant="primary" size="sm" icon={Plus}>New template</Btn>
          </>
        }
      />

      <div className="filter-strip">
        <div className="search-input" style={{ flex: '0 1 280px' }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {categories.map((c) => (
          <button
            key={c.key}
            className={`filter-chip ${cat === c.key ? 'active' : ''}`}
            onClick={() => setCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="tpl-grid">
        {filtered.map((tpl) => (
          <div className="tpl-card" key={tpl.id}>
            <div className="tpl-thumb">
              <div className="tpl-glyph">
                <div className="tpl-glyph-line" />
                <div className="tpl-glyph-line" />
                <div className="tpl-glyph-line" />
                <div className="tpl-glyph-line" />
              </div>
              <span className="tpl-ribbon">{tpl.department}</span>
            </div>
            <div className="tpl-body">
              <div className="tpl-name">{tpl.name}</div>
              <div className="tpl-desc">{tpl.description}</div>
            </div>
            <div className="tpl-footer">
              <span>{tpl.uses} uses</span>
              <span>{tpl.department}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: 'var(--text-4)' }}>
            No templates found
          </div>
        )}
      </div>
    </ClauseLayout>
  );
}
