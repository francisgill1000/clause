import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Drawer, Field, Input, Select, Textarea } from '../../Components/Clause/UI';
import { Folder, Plus, Search, Edit, Trash, X, Check } from '../../Components/Clause/Icons';

const DEPARTMENTS = ['Legal', 'Sales', 'Ops', 'People', 'Privacy', 'Finance', 'Engineering'];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'Legal', label: 'Legal' },
  { key: 'Sales', label: 'Sales' },
  { key: 'Ops', label: 'Ops' },
  { key: 'People', label: 'People' },
  { key: 'Privacy', label: 'Privacy' },
];

export default function Index({ templates: propTemplates }) {
  const templates = propTemplates || [];
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    description: '',
    department: 'Legal',
    ribbon: '',
  });

  const filtered = useMemo(() => {
    let list = templates;
    if (cat !== 'all') list = list.filter((t) => t.department === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [templates, cat, search]);

  function openCreate() {
    setEditing(null);
    reset();
    setData({ name: '', description: '', department: 'Legal', ribbon: '' });
    setDrawerOpen(true);
  }

  function openEdit(tpl) {
    setEditing(tpl);
    setData({
      name: tpl.name || '',
      description: tpl.description || '',
      department: tpl.department || 'Legal',
      ribbon: tpl.ribbon || '',
    });
    setDrawerOpen(true);
  }

  function handleSubmit(e) {
    e?.preventDefault();
    if (editing) {
      put(typeof route === 'function' ? route('templates.update', editing.id) : `/templates/${editing.id}`, {
        onSuccess: () => { setDrawerOpen(false); reset(); },
      });
    } else {
      post(typeof route === 'function' ? route('templates.store') : '/templates', {
        onSuccess: () => { setDrawerOpen(false); reset(); },
      });
    }
  }

  function handleDelete(tpl) {
    if (!confirm(`Delete template "${tpl.name}"? This cannot be undone.`)) return;
    router.delete(typeof route === 'function' ? route('templates.destroy', tpl.id) : `/templates/${tpl.id}`);
  }

  return (
    <ClauseLayout title="Templates">
      <Head title="Templates" />

      <PageHeader
        title="Templates"
        subtitle={`${templates.length} templates in your library`}
        actions={
          <>
            <Btn variant="ghost" size="sm" icon={Folder}>Folders</Btn>
            <Btn variant="primary" size="sm" icon={Plus} onClick={openCreate}>New template</Btn>
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
              {tpl.ribbon && <span className="tpl-ribbon">{tpl.ribbon}</span>}
              {!tpl.ribbon && tpl.department && <span className="tpl-ribbon">{tpl.department}</span>}
            </div>
            <div className="tpl-body">
              <div className="tpl-name">{tpl.name}</div>
              <div className="tpl-desc">{tpl.description}</div>
            </div>
            <div className="tpl-footer">
              <span>{tpl.uses_count ?? 0} uses</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  title="Edit"
                  onClick={() => openEdit(tpl)}
                >
                  <Edit size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  title="Delete"
                  onClick={() => handleDelete(tpl)}
                  style={{ color: 'var(--danger)' }}
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: 'var(--text-4)' }}>
            No templates found
          </div>
        )}
      </div>

      {/* Create / Edit drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit template' : 'New template'}
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
              placeholder="e.g. Mutual NDA"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
          </Field>

          <Field label="Description" hint={errors.description}>
            <Textarea
              placeholder="What is this template for?"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
          </Field>

          <Field label="Department" hint={errors.department}>
            <Select value={data.department} onChange={(e) => setData('department', e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>

          <Field label="Ribbon label" hint={errors.ribbon}>
            <Input
              placeholder="e.g. Popular, New, Updated (optional)"
              value={data.ribbon}
              onChange={(e) => setData('ribbon', e.target.value)}
            />
          </Field>
        </form>
      </Drawer>
    </ClauseLayout>
  );
}
