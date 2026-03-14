'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="auth-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="section-header" style={{ textAlign: 'center' }}>
        <h2 className="section-header__title">
          {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <p className="section-header__subtitle">
          Sign in to the guild or create a new member account.
        </p>
      </div>

      <div className="card" style={{ padding: 'var(--space-2xl)' }}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-xl)',
            marginBottom: 'var(--space-xl)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setMode('login')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'login' ? 'var(--accent-gold)' : 'var(--text-muted)',
              paddingBottom: 'var(--space-sm)',
              borderBottom: mode === 'login' ? '2px solid var(--accent-gold)' : 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'register' ? 'var(--accent-gold)' : 'var(--text-muted)',
              paddingBottom: 'var(--space-sm)',
              borderBottom: mode === 'register' ? '2px solid var(--accent-gold)' : 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              color: 'var(--accent-red-bright)',
              marginBottom: 'var(--space-md)',
              fontSize: '0.9rem',
              borderLeft: '3px solid var(--accent-red)',
              paddingLeft: 'var(--space-md)',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={mode === 'login' ? handleLogin : handleRegister}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
        >
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                  value={formData.username}
                  onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>
                Username
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                value={formData.username}
                onChange={(event) => setFormData({ ...formData, username: event.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              required
              className="form-input"
              style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="form-input"
                style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                value={formData.confirmPassword}
                onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary"
            style={{ marginTop: 'var(--space-lg)', width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <>New here? <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer' }}>Create an account</button></>
          ) : (
            <>Already a member? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer' }}>Sign in instead</button></>
          )}
        </div>
      </div>
    </div>
  );
}
