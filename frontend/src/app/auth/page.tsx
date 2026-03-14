'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });
    const { login, register } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ username: formData.username, password: formData.password }); // Backend login takes username
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            router.push('/profile');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="section-header" style={{ textAlign: 'center' }}>
                <h2 className="section-header__title">✦ {mode === 'login' ? 'Welcome Back' : 'Join the Guild'}</h2>
                <p className="section-header__subtitle">Enter the sanctuary of master artisans</p>
            </div>

            <div className="card" style={{ padding: 'var(--space-2xl)' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border-subtle)' }}>
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
                            textTransform: 'uppercase'
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
                            textTransform: 'uppercase'
                        }}
                    >
                        Register
                    </button>
                </div>

                {error && (
                    <div style={{ color: 'var(--accent-red-bright)', marginBottom: 'var(--space-md)', fontSize: '0.9rem', borderLeft: '3px solid var(--accent-red)', paddingLeft: 'var(--space-md)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {mode === 'register' && (
                        <>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Username</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="form-input" 
                                    style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="form-input" 
                                    style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </>
                    )}

                    {mode === 'login' && (
                         <div className="form-group">
                         <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Username</label>
                         <input 
                             type="text" 
                             required 
                             className="form-input" 
                             style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                             value={formData.username}
                             onChange={(e) => setFormData({...formData, username: e.target.value})}
                         />
                     </div>
                    )}

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Password</label>
                        <input 
                            type="password" 
                            required 
                            className="form-input" 
                            style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {mode === 'register' && (
                        <>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Confirm Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    className="form-input" 
                                    style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Guild Role</label>
                                <select 
                                    className="form-input" 
                                    style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="CUSTOMER">Artisan Collector / Customer</option>
                                    <option value="CREATOR">Guild Creator / artisan</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn--primary" 
                        style={{ marginTop: 'var(--space-lg)', width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'Processing...' : mode === 'login' ? '🗝️ Sign In' : '✦ Join Guild'}
                    </button>
                </form>

                <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {mode === 'login' ? (
                        <>New here? <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer' }}>Begin your journey</button></>
                    ) : (
                        <>Already a member? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer' }}>Return to the halls</button></>
                    )}
                </div>
            </div>
        </div>
    );
}
