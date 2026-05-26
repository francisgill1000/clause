import { Head, Link, useForm } from '@inertiajs/react';
import { ClauseLogo } from '../../Components/Clause/Icons';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="auth-page">
      <Head title="Create account" />

      <div className="auth-brand">
        <div className="auth-brand-icon">
          <ClauseLogo size={22} />
        </div>
        <div className="auth-brand-text">Clause</div>
      </div>

      <div className="auth-card">
        <div className="auth-card-title">Create your account</div>
        <div className="auth-card-sub">Get started with contract management</div>

        <form onSubmit={submit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">Full name</label>
            <input
              id="name"
              className="auth-input"
              type="text"
              value={data.name}
              autoComplete="name"
              autoFocus
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Imani Okafor"
            />
            {errors.name && <div className="auth-error">{errors.name}</div>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={data.email}
              autoComplete="username"
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
              autoComplete="new-password"
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Min. 8 characters"
            />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password_confirmation">Confirm password</label>
            <input
              id="password_confirmation"
              className="auth-input"
              type="password"
              value={data.password_confirmation}
              autoComplete="new-password"
              onChange={(e) => setData('password_confirmation', e.target.value)}
              placeholder="Repeat your password"
            />
            {errors.password_confirmation && <div className="auth-error">{errors.password_confirmation}</div>}
          </div>

          <div style={{ height: 8 }} />

          <button type="submit" className="auth-submit" disabled={processing}>
            {processing ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>

      <div className="auth-alt">
        Already have an account?{' '}
        <Link href={route('login')}>Sign in</Link>
      </div>
    </div>
  );
}
