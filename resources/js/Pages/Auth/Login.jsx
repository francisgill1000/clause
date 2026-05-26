import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ClauseLogo } from '../../Components/Clause/Icons';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="auth-page">
      <Head title="Log in" />

      <div className="auth-brand">
        <ClauseLogo size={30} />
        <span>Clause</span>
      </div>

      <div className="auth-card">
        {status && <div className="auth-status">{status}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label className="field-label">Email</label>
            <div className="input-wrap">
              <input
                id="email"
                type="email"
                value={data.email}
                autoComplete="username"
                autoFocus
                onChange={(e) => setData('email', e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="input-wrap">
              <input
                id="password"
                type="password"
                value={data.password}
                autoComplete="current-password"
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="auth-checkbox-wrap">
            <input
              type="checkbox"
              id="remember"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="auth-footer">
            {canResetPassword && (
              <Link href={route('password.request')} className="auth-link">
                Forgot password?
              </Link>
            )}
            {!canResetPassword && <span />}
            <button type="submit" className="btn btn-primary btn-md" disabled={processing}>
              Log in
            </button>
          </div>
        </form>
      </div>

      <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-4)' }}>
        Don't have an account?{' '}
        <Link href={route('register')} className="auth-link" style={{ color: 'var(--mint-400)' }}>
          Create one
        </Link>
      </p>
    </div>
  );
}
