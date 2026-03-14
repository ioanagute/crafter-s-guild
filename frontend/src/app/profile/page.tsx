'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { ProfileData } from '@/lib/types';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('threads');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return;

      if (!authUser) {
        router.replace('/auth');
        return;
      }

      try {
        const data = await fetchAPI('/users/me/profile') as ProfileData;
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        router.replace('/auth');
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [authLoading, authUser, router]);

  if (loading || authLoading) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading your profile...</p>;
  }

  if (!profile) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Profile unavailable.</p>;
  }

  return (
    <>
      <div className="profile-banner-container" style={{ position: 'relative' }}>
        <div className="profile-banner">
          <Image src="/img/profile-banner-default.png" alt="Profile banner" fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
        </div>
        <div className="profile-header">
          <div className="avatar avatar--xl" style={{ fontSize: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile.avatar || 'A'}
          </div>
          <div className="profile-header__info">
            <h1 className="profile-header__name">{profile.username}</h1>
            <div className="profile-header__title">{profile.role === 'ADMIN' ? 'Guild Administrator' : 'Guild Member'}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>
              {profile.signature || "Welcome to your Crafter's Guild profile."}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button className="btn btn--primary" disabled>Messaging Coming Soon</button>
            <button className="btn" disabled>Settings Coming Soon</button>
          </div>
        </div>
      </div>

      <div className="divider"><span className="divider__icon">Profile</span></div>

      <section className="profile-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>{profile._count?.threads || 0}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Threads</span>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>{profile._count?.posts || 0}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posts</span>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>{profile._count?.marketItems || 0}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Listings</span>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '1.2rem', color: 'var(--accent-purple-bright)' }}>{new Date(profile.createdAt).toLocaleDateString()}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined</span>
          </div>
        </div>

        <div className="tabs-container">
          <div style={{ display: 'flex', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border-subtle)' }}>
            <button onClick={() => setActiveTab('threads')} className={`profile-tab ${activeTab === 'threads' ? 'active' : ''}`}>Recent Threads</button>
            <button onClick={() => setActiveTab('listings')} className={`profile-tab ${activeTab === 'listings' ? 'active' : ''}`}>Recent Listings</button>
          </div>

          <div className="tab-content active">
            {activeTab === 'threads' && (
              <div className="thread-list">
                {profile.threads?.map((thread) => (
                  <Link key={thread.id} href={`/threads/${thread.id}`} className="card thread-item">
                    <div className="thread-item__body">
                      <h3 className="thread-item__title">{thread.title}</h3>
                      <div className="thread-item__meta">
                        <span>in <span style={{ color: 'var(--accent-gold)' }}>{thread.category?.name}</span></span>
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="thread-item__stats">
                      <span>{thread._count?.posts || 0} replies</span>
                    </div>
                  </Link>
                ))}
                {profile.threads?.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-xl)' }}>No threads created yet.</p>}
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {profile.marketItems?.map((item) => (
                  <div key={item.id} className="card">
                    <h4 style={{ color: 'var(--accent-gold)' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem' }}>{item.price} coins</p>
                    <button className="btn btn--small" disabled>Manage Listing</button>
                  </div>
                ))}
                {profile.marketItems?.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-xl)', gridColumn: '1/-1' }}>No active listings yet.</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
