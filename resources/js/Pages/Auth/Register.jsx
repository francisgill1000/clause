import React from 'react';
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
      <Head title="Register" />

      <div className="auth-brand">
        <ClauseLogo size={30} />
        <span>Clause</span>
      </div>

      <div className="auth-card">
        <form onSubmit={submit}>
          <div className="field">
            <label className="field-label">Name</label>
            <div className="input-wrap">
              <input
                id="name"
                type="text"
                value={data.name}
                autoComplete="name"
                autoFocus
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            {errors.name && <div className="auth-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label className="field-label">Email</label>
            <div className="input-wrap">
              <input
                id="email"
                type="email"
                value={data.email}
                autoComplete="username"
                onChange={(e) => setData('email', e.target.value)}
                placeholder="you@company.com"
                required
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
                autoComplete="new-password"
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="field">
            <label className="field-label">Confirm password</label>
            <div className="input-wrap">
              <input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                autoComplete="new-password"
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            {errors.password_confirmation && <div className="auth-error">{errors.password_confirmation}</div>}
          </div>

          <div className="auth-footer">
            <Link href={route('login')} className="auth-link">
              Already registered?
            </Link>
            <button type="submit" className="btn btn-primary btn-md" disabled={processing}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
