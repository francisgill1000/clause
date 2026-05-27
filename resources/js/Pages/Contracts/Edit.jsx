import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import ClauseLayout from '../../Layouts/ClauseLayout';
import { PageHeader, Btn, Field, Input, Select, Textarea } from '../../Components/Clause/UI';
import { Check, X } from '../../Components/Clause/Icons';

export default function Edit({ contract, counterparties, users }) {
  const { data, setData, put, processing, errors } = useForm({
    title: contract.title || '',
    type: contract.type || 'MSA',
    counterparty_id: contract.counterparty_id || '',
    owner_id: contract.owner_id || '',
    value: contract.value || '',
    currency: contract.currency || 'USD',
    start_date: contract.start_date || '',
    end_date: contract.end_date || '',
    term: contract.term || '',
    auto_renew: contract.auto_renew || '',
    notice_period: contract.notice_period || '',
    status: contract.status || 'drafting',
  });

  const submit = (e) => {
    e.preventDefault();
    put(typeof route === 'function' ? route('contracts.update', contract.id) : `/contracts/${contract.id}`);
  };

  return (
    <ClauseLayout title="Edit contract">
      <Head title={`Edit — ${contract.title}`} />

      <PageHeader
        title="Edit contract"
        subtitle={`${contract.contract_number} — ${contract.title}`}
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

              <Field label="Status">
                <Select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                  <option value="drafting">Drafting</option>
                  <option value="review">In review</option>
                  <option value="signature">Signature</option>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring</option>
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

            <div className="grid-2">
              <Field label="Currency">
                <Select value={data.currency} onChange={(e) => setData('currency', e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </Select>
              </Field>

              <Field label="Contract value" hint={errors.value}>
                <Input
                  prefix={data.currency}
                  type="number"
                  placeholder="0"
                  value={data.value}
                  onChange={(e) => setData('value', e.target.value)}
                />
              </Field>
            </div>

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
                <Input
                  placeholder="e.g. On (12 mo)"
                  value={data.auto_renew}
                  onChange={(e) => setData('auto_renew', e.target.value)}
                />
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
                Save changes
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </ClauseLayout>
  );
}
