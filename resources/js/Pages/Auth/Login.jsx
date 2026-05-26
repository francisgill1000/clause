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
    post(route('login'), { onFinish: () => reset('password') });
  };

  return (
    <div className="auth-page">
      <Head title="Log in" />

      <div className="auth-brand">
        <div className="auth-brand-icon">
          <ClauseLogo size={22} />
        </div>
        <div className="auth-brand-text">Clause</div>
      </div>

      <div className="auth-card">
        <div className="auth-card-title">Welcome back</div>
        <div className="auth-card-sub">Sign in to your account to continue</div>

        {status && <div className="auth-status">{status}</div>}

        <form onSubmit={submit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={data.email}
              autoComplete="username"
              autoFocus
              onChange={(e) => setData('email', e.target.value)}
              placeholder="you@company.com"
            />
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={data.password}
              autoComplete="current-password"
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="auth-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            {canResetPassword && (
              <Link href={route('password.request')} className="auth-link">
                Forgot password?
              </Link>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={processing}>
            {processing ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      <div className="auth-alt">
        Don't have an account?{' '}
        <Link href={route('register')}>Create one</Link>
      </div>
    </div>
  );
}
