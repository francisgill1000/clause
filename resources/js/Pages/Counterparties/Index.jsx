import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Badge, Drawer, Field, Input, Select } from '../../Components/Clause/UI';
import { Download, Plus, Search, More, Edit, Trash, X, Check } from '../../Components/Clause/Icons';

const riskBadgeMap = { low: 'active', medium: 'warn', high: 'danger' };
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#0ea5e9', '#14b8a6', '#ef4444'];

function generateInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Index({ counterparties: propCounterparties }) {
  const counterparties = propCounterparties || [];
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    initials: '',
    domain: '',
    color: COLORS[0],
    risk_tier: 'low',
    relationship_since: '',
  });

  const filtered = useMemo(() => {
    if (!search) return counterparties;
    const q = search.toLowerCase();
    return counterparties.filter(
      (cp) => cp.name.toLowerCase().includes(q) || (cp.domain || '').toLowerCase().includes(q)
    );
  }, [counterparties, search]);

  function openCreate() {
    setEditing(null);
    reset();
    setData({ name: '', initials: '', domain: '', color: COLORS[Math.floor(Math.random() * COLORS.length)], risk_tier: 'low', relationship_since: '' });
    setDrawerOpen(true);
  }

  function openEdit(cp) {
    setEditing(cp);
    setData({
      name: cp.name || '',
      initials: cp.initials || '',
      domain: cp.domain || '',
      color: cp.color || COLORS[0],
      risk_tier: cp.risk_tier || 'low',
      relationship_since: cp.relationship_since || '',
    });
    setDrawerOpen(true);
    setMenuOpen(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      put(typeof route === 'function' ? route('counterparties.update', editing.id) : `/counterparties/${editing.id}`, {
        onSuccess: () => { setDrawerOpen(false); reset(); },
      });
    } else {
      post(typeof route === 'function' ? route('counterparties.store') : '/counterparties', {
        onSuccess: () => { setDrawerOpen(false); reset(); },
      });
    }
  }

  function handleDelete(cp) {
    if (!confirm(`Delete "${cp.name}"? This cannot be undone.`)) return;
    router.delete(typeof route === 'function' ? route('counterparties.destroy', cp.id) : `/counterparties/${cp.id}`);
    setMenuOpen(null);
  }

  function handleNameChange(val) {
    setData((prev) => ({
      ...prev,
      name: val,
      initials: !editing ? generateInitials(val) : prev.initials,
    }));
  }

  return (
    <ClauseLayout title="Counterparties">
      <Head title="Counterparties" />

      <PageHeader
        title="Counterparties"
        subtitle={`${counterparties.length} organizations in your network`}
        actions={
          <>
            <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
            <Btn variant="primary" size="sm" icon={Plus} onClick={openCreate}>Add counterparty</Btn>
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
                  <th>Total value</th>
                  <th>Risk tier</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cp) => (
                  <tr key={cp.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="cp-logo" style={{ backgroundColor: cp.color || '#3b82f6' }}>{cp.initials}</div>
                        <div>
                          <div className="customer-name">{cp.name}</div>
                          <div className="customer-sub">{cp.domain || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{cp.contracts_count ?? 0}</td>
                    <td className="cell-mono">
                      ${((cp.contracts_sum_value || 0) / 1).toLocaleString()}
                    </td>
                    <td>
                      <Badge status={riskBadgeMap[cp.risk_tier] || 'neutral'}>
                        {cp.risk_tier || 'unset'}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ position: 'relative' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setMenuOpen(menuOpen === cp.id ? null : cp.id)}
                        >
                          <More size={16} />
                        </button>
                        {menuOpen === cp.id && (
                          <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 0', minWidth: 140, boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}>
                            <button
                              className="dropdown-item"
                              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}
                              onClick={() => openEdit(cp)}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              className="dropdown-item"
                              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--danger)' }}
                              onClick={() => handleDelete(cp)}
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
                    <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-4)' }}>
                      No counterparties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit counterparty' : 'Add counterparty'}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" size="md" icon={X} onClick={() => setDrawerOpen(false)}>Cancel</Btn>
            <Btn variant="primary" size="md" icon={Check} onClick={handleSubmit} disabled={processing}>
              {editing ? 'Save changes' : 'Create'}
            </Btn>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <Field label="Name" hint={errors.name}>
            <Input
              placeholder="e.g. Acme Corp"
              value={data.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </Field>

          <Field label="Initials" hint={errors.initials}>
            <Input
              placeholder="AC"
              maxLength={4}
              value={data.initials}
              onChange={(e) => setData('initials', e.target.value.toUpperCase())}
            />
          </Field>

          <Field label="Domain" hint={errors.domain}>
            <Input
              placeholder="acme.com"
              value={data.domain}
              onChange={(e) => setData('domain', e.target.value)}
            />
          </Field>

          <Field label="Risk tier" hint={errors.risk_tier}>
            <Select value={data.risk_tier} onChange={(e) => setData('risk_tier', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </Field>

          <Field label="Relationship since" hint={errors.relationship_since}>
            <Input
              type="date"
              value={data.relationship_since}
              onChange={(e) => setData('relationship_since', e.target.value)}
            />
          </Field>
        </form>
      </Drawer>
    </ClauseLayout>
  );
}
