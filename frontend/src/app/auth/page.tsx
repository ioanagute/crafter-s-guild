'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/context/AuthContext';
import { APIError } from '@/lib/api';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Request failed.';
}

const usernamePattern = /^(?![._-])(?!.*[._-]{2})[A-Za-z0-9._-]+(?<![._-])$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    identifier: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerUsername: '',
  });
  const { login, register, resendVerification } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const registrationErrors = {
    username:
      formData.registerUsername.length === 0
        ? 'Username is required.'
        : formData.registerUsername.length < 3 || formData.registerUsername.length > 30
          ? 'Username must be between 3 and 30 characters.'
          : !usernamePattern.test(formData.registerUsername)
            ? 'Use letters, numbers, dots, underscores, or hyphens only.'
            : '',
    email:
      formData.email.length === 0
        ? 'Email is required.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? 'Enter a valid email address.'
          : '',
    password:
      formData.password.length === 0
        ? 'Password is required.'
        : formData.password.length < 10
          ? 'Password must be at least 10 characters.'
          : !passwordPattern.test(formData.password)
            ? 'Password needs uppercase, lowercase, and a number.'
            : '',
    confirmPassword:
      formData.confirmPassword.length === 0
        ? 'Confirm your password.'
        : formData.password !== formData.confirmPassword
          ? 'Passwords do not match.'
          : '',
  };

  const registerFormValid = Object.values(registrationErrors).every((value) => value === '');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await login({ identifier: formData.identifier, password: formData.password });
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof APIError && err.code === 'EMAIL_NOT_VERIFIED') {
        setError('Your account exists, but the email is not verified yet.');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registerFormValid) {
      setError('Fix the highlighted registration issues and try again.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await register({
        username: formData.registerUsername,
        email: formData.email,
        password: formData.password,
      });
      setSuccessMessage(result.message);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Enter the email address you used to register.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await resendVerification(formData.email);
      setSuccessMessage(result.message);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const renderFieldMessage = (message: string) => (
    message ? <div className="form-error">{message}</div> : null
  );

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
            <div className="page-header">
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
          {successMessage ? <div className="form-success">{successMessage}</div> : null}

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
                    value={formData.registerUsername}
                    onChange={(event) => setFormData({ ...formData, registerUsername: event.target.value })}
                  />
                  {renderFieldMessage(registrationErrors.username)}
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
                  {renderFieldMessage(registrationErrors.email)}
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Email or Username</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.identifier}
                  onChange={(event) => setFormData({ ...formData, identifier: event.target.value })}
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
              {mode === 'register' ? renderFieldMessage(registrationErrors.password) : null}
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
                {renderFieldMessage(registrationErrors.confirmPassword)}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || (mode === 'register' && !registerFormValid)}
              className="btn btn--primary auth-submit"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {mode === 'login' || successMessage ? (
              <button
                type="button"
                className="btn btn--ghost auth-submit"
                onClick={handleResendVerification}
                disabled={loading}
              >
                Resend verification email
              </button>
            ) : null}
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
