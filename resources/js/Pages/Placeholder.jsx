import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClauseLayout from '../Layouts/ClauseLayout';
import { FileText } from '../Components/Clause/Icons';
import { Btn } from '../Components/Clause/UI';

export default function Placeholder({ title = 'Coming soon', hint = 'This section is under development.' }) {
  return (
    <ClauseLayout title={title}>
      <Head title={title} />

      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={28} />
            </div>
            <h3>{title}</h3>
            <p>{hint}</p>
            <Link href={typeof route === 'function' ? route('contracts.index') : '/contracts'}>
              <Btn variant="primary" size="sm">Try Contracts</Btn>
            </Link>
          </div>
        </div>
      </div>
    </ClauseLayout>
  );
}
