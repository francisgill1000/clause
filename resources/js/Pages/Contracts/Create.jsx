import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Field, Input, Select, Textarea } from '../../Components/Clause/UI';
import { Check, X } from '../../Components/Clause/Icons';

export default function Create({ counterparties: propCounterparties, users: propUsers }) {
  const counterparties = propCounterparties || [
    { id: 1, name: 'Acme Corp' },
    { id: 2, name: 'Globex Inc' },
    { id: 3, name: 'Initech LLC' },
    { id: 4, name: 'Umbrella Co' },
    { id: 5, name: 'Skyline Tech' },
  ];

  const users = propUsers || [
    { id: 1, name: 'Sarah Chen' },
    { id: 2, name: 'James Liu' },
    { id: 3, name: 'Maria Gonzalez' },
  ];

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    type: 'msa',
    counterparty_id: '',
    owner_id: '',
    value: '',
    currency: 'USD',
    start_date: '',
    end_date: '',
    term: '12',
    auto_renew: true,
    notice_period: '90',
    description: '',
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
                  <option value="msa">MSA</option>
                  <option value="nda">NDA</option>
                  <option value="sow">SOW</option>
                  <option value="amendment">Amendment</option>
                  <option value="renewal">Renewal</option>
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
                  {counterparties.map((cp) => (
                    <option key={cp.id} value={cp.id}>{cp.name}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Owner" hint={errors.owner_id}>
                <Select value={data.owner_id} onChange={(e) => setData('owner_id', e.target.value)}>
                  <option value="">Select owner...</option>
                  {users.map((u) => (
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
              <Field label="Term (months)">
                <Input
                  type="number"
                  value={data.term}
                  onChange={(e) => setData('term', e.target.value)}
                />
              </Field>

              <Field label="Auto-renew">
                <Select value={data.auto_renew ? '1' : '0'} onChange={(e) => setData('auto_renew', e.target.value === '1')}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </Select>
              </Field>

              <Field label="Notice period (days)">
                <Input
                  type="number"
                  value={data.notice_period}
                  onChange={(e) => setData('notice_period', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Description / notes">
              <Textarea
                placeholder="Optional description or internal notes..."
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
            </Field>

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
