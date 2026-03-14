'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/context/AuthContext';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Request failed.';
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username: formData.username, password: formData.password });
      router.push('/');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push('/profile');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <PageHero
        title={mode === 'login' ? 'Return to the Guild' : 'Open a New Ledger'}
        subtitle="Sign in to your standing records or register a fresh member entry in the guild roll."
        eyebrow="Guild Entry"
        badge={<span className="hero-kicker">{mode === 'login' ? 'Member Return' : 'New Member Seal'}</span>}
        compact
      />
      <section className="auth-shell">
        <div className="card auth-card">
          <div className="auth-card__intro">
            <div className="page-header page-header--center">
              <div className="page-header__copy">
                <div className="page-header__eyebrow">Member Access</div>
                <h2 className="page-header__title section-header__title">
                  {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h2>
                <p className="page-header__subtitle section-header__subtitle">
                  Sign in to the guild or register a new member account.
                </p>
              </div>
            </div>
          </div>
          <div className="profile-tabs" role="tablist" aria-label="Authentication tabs">
            <button
              onClick={() => setMode('login')}
              className={`profile-tab ${mode === 'login' ? 'active' : ''}`}
              type="button"
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`profile-tab ${mode === 'register' ? 'active' : ''}`}
              type="button"
            >
              Register
            </button>
          </div>

          {error ? <div className="form-error form-error--panel">{error}</div> : null}

          <form
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
            className="auth-form"
          >
            {mode === 'register' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.username}
                    onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.username}
                  onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              />
            </div>

            {mode === 'register' ? (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn btn--primary auth-submit"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-card__switch">
            {mode === 'login' ? (
              <>New here? <button onClick={() => setMode('register')} className="auth-link" type="button">Create an account</button></>
            ) : (
              <>Already a member? <button onClick={() => setMode('login')} className="auth-link" type="button">Sign in instead</button></>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
