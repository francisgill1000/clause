import { Head, Link } from '@inertiajs/react';
import { ClauseLogo } from '../Components/Clause/Icons';

export default function Welcome({ auth }) {
  const user = auth?.user;

  return (
    <div className="auth-page">
      <Head title="Clause" />

      <div className="auth-brand">
        <ClauseLogo size={36} />
        <span>Clause</span>
      </div>

      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-1)',
          marginBottom: 8,
          letterSpacing: '-0.02em',
        }}>
          Contract lifecycle management, simplified.
        </h1>

        <p style={{
          fontSize: 13,
          color: 'var(--text-3)',
          lineHeight: 1.6,
          marginBottom: 28,
        }}>
          Draft, negotiate, sign, and manage contracts in one place.
          Clause gives your team full visibility into every agreement
          from first draft to renewal.
        </p>

        {user ? (
          <Link href={route('dashboard')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Go to Dashboard
          </Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href={route('login')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Log in
            </Link>
            <Link href={route('register')} className="auth-link" style={{ color: 'var(--mint-400)', fontSize: 13 }}>
              Create an account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
