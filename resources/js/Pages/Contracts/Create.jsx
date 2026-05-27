import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Field, Input, Select } from '../../Components/Clause/UI';
import { Check, X } from '../../Components/Clause/Icons';

export default function Create({ counterparties, users }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    type: 'MSA',
    counterparty_id: '',
    owner_id: '',
    value: '',
    currency: 'USD',
    start_date: '',
    end_date: '',
    term: '',
    auto_renew: '',
    notice_period: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(typeof route === 'function' ? route('contracts.store') : '/contracts');
  };

  return (
    <ClauseLayout title="New contract">
      <Head title="New contract" />

      <PageHeader
        title="New contract"
        subtitle="Fill in the details to create a new contract."
      />

      <div className="card" style={{ maxWidth: 680 }}>
        <div className="card-body">
          {(!counterparties || counterparties.length === 0) && (
            <div style={{ padding: '12px 16px', marginBottom: 16, background: 'var(--bg-3)', borderRadius: 8, fontSize: 13, color: 'var(--text-3)' }}>
              You need to add a counterparty first before creating a contract.{' '}
              <a href="/counterparties" style={{ color: 'var(--accent)' }}>Go to Counterparties</a>
            </div>
          )}
          <form onSubmit={submit}>
            <Field label="Title" hint={errors.title}>
              <Input
                placeholder="e.g. SaaS Master Agreement"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
              />
            </Field>

            <div className="grid-2">
              <Field label="Type">
                <Select value={data.type} onChange={(e) => setData('type', e.target.value)}>
                  <option value="MSA">MSA</option>
                  <option value="NDA">NDA</option>
                  <option value="SOW">SOW</option>
                  <option value="Lease">Lease</option>
                  <option value="IP Licence">IP Licence</option>
                  <option value="Supply">Supply</option>
                  <option value="Services">Services</option>
                  <option value="Side Letter">Side Letter</option>
                  <option value="Amendment">Amendment</option>
                  <option value="Renewal">Renewal</option>
                </Select>
              </Field>

              <Field label="Currency">
                <Select value={data.currency} onChange={(e) => setData('currency', e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </Select>
              </Field>
            </div>

            <div className="grid-2">
              <Field label="Counterparty" hint={errors.counterparty_id}>
                <Select value={data.counterparty_id} onChange={(e) => setData('counterparty_id', e.target.value)}>
                  <option value="">Select counterparty...</option>
                  {(counterparties || []).map((cp) => (
                    <option key={cp.id} value={cp.id}>{cp.name}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Owner" hint={errors.owner_id}>
                <Select value={data.owner_id} onChange={(e) => setData('owner_id', e.target.value)}>
                  <option value="">Select owner...</option>
                  {(users || []).map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Contract value" hint={errors.value}>
              <Input
                prefix={data.currency}
                type="number"
                placeholder="0"
                value={data.value}
                onChange={(e) => setData('value', e.target.value)}
              />
            </Field>

            <div className="grid-2">
              <Field label="Start date" hint={errors.start_date}>
                <Input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                />
              </Field>

              <Field label="End date" hint={errors.end_date}>
                <Input
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                />
              </Field>
            </div>

            <div className="grid-3">
              <Field label="Term">
                <Input
                  placeholder="e.g. 12 months"
                  value={data.term}
                  onChange={(e) => setData('term', e.target.value)}
                />
              </Field>

              <Field label="Auto-renew">
                <Select value={data.auto_renew} onChange={(e) => setData('auto_renew', e.target.value)}>
                  <option value="">None</option>
                  <option value="On (12 mo)">On (12 mo)</option>
                  <option value="On (6 mo)">On (6 mo)</option>
                  <option value="On (24 mo)">On (24 mo)</option>
                  <option value="Off">Off</option>
                </Select>
              </Field>

              <Field label="Notice period">
                <Input
                  placeholder="e.g. 90 days"
                  value={data.notice_period}
                  onChange={(e) => setData('notice_period', e.target.value)}
                />
              </Field>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
              <Btn
                variant="ghost"
                size="md"
                icon={X}
                type="button"
                onClick={() => window.history.back()}
              >
                Cancel
              </Btn>
              <Btn
                variant="primary"
                size="md"
                icon={Check}
                type="submit"
                disabled={processing}
              >
                Create contract
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </ClauseLayout>
  );
}
