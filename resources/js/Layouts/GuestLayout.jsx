import React from 'react';
import { Link } from '@inertiajs/react';
import { ClauseLogo } from '../Components/Clause/Icons';

export default function GuestLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ClauseLogo size={30} />
          <span>Clause</span>
        </Link>
      </div>
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}
