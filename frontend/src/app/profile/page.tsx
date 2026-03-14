'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import MemberChip from '@/components/ui/MemberChip';
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
    return <p className="state-copy">Loading your profile...</p>;
  }

  if (!profile) {
    return <p className="state-copy">Profile unavailable.</p>;
  }

  return (
    <div className="page-shell">
      <div className="profile-banner-container">
        <div className="profile-header">
          <div className="avatar avatar--xl profile-header__avatar">
            {profile.avatar || 'A'}
          </div>
          <div className="profile-header__info">
            <h1 className="profile-header__name">{profile.username}</h1>
            <div className="profile-header__title">{profile.role === 'ADMIN' ? 'Guild Administrator' : 'Guild Member'}</div>
            <p className="profile-header__bio">
              {profile.signature || "Welcome to your Crafter's Guild profile."}
            </p>
          </div>
          <div className="profile-header__actions">
            <MemberChip
              username={profile.username}
              avatar={profile.avatar || 'A'}
              status={profile.role === 'ADMIN' ? 'Guild Administrator' : 'Member in Good Standing'}
            />
            <button className="btn btn--primary" disabled>Message Soon</button>
            <button className="btn" disabled>Settings Soon</button>
          </div>
        </div>
      </div>

      <div className="divider"><span className="divider__icon">Profile</span></div>

      <section className="profile-body">
        <div className="profile-stats">
          <div className="card profile-stat">
            <span className="profile-stat__value">{profile._count?.threads || 0}</span>
            <span className="profile-stat__label">Threads</span>
          </div>
          <div className="card profile-stat">
            <span className="profile-stat__value">{profile._count?.posts || 0}</span>
            <span className="profile-stat__label">Posts</span>
          </div>
          <div className="card profile-stat">
            <span className="profile-stat__value">{profile._count?.marketItems || 0}</span>
            <span className="profile-stat__label">Listings</span>
          </div>
          <div className="card profile-stat">
            <span className="profile-stat__value profile-stat__value--secondary">{new Date(profile.createdAt).toLocaleDateString()}</span>
            <span className="profile-stat__label">Joined</span>
          </div>
        </div>

        <div className="tabs-container">
          <div className="profile-tabs" role="tablist" aria-label="Profile sections">
            <button onClick={() => setActiveTab('threads')} className={`profile-tab ${activeTab === 'threads' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'threads'}>Recent Threads</button>
            <button onClick={() => setActiveTab('listings')} className={`profile-tab ${activeTab === 'listings' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'listings'}>Recent Listings</button>
          </div>

          <div className="tab-content active">
            {activeTab === 'threads' && (
              <section className="profile-content-panel">
                <PageHeader
                  title="Recent Threads"
                  subtitle="Your latest recorded discussions."
                  eyebrow="Member Ledger"
                />
                <div className="thread-list">
                  {profile.threads?.map((thread) => (
                    <Link key={thread.id} href={`/threads/${thread.id}`} className="card thread-item">
                      <div className="thread-item__body">
                        <h3 className="thread-item__title">{thread.title}</h3>
                        <div className="thread-item__meta">
                          <span>in <span className="thread-item__hall">{thread.category?.name}</span></span>
                          <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="thread-item__stats">
                        <span>{thread._count?.posts || 0} replies</span>
                      </div>
                    </Link>
                  ))}
                  {profile.threads?.length === 0 ? (
                    <EmptyState
                      title="No threads yet"
                      description="This member has not raised any guild records yet."
                    />
                  ) : null}
                </div>
              </section>
            )}

            {activeTab === 'listings' && (
              <section className="profile-content-panel">
                <PageHeader
                  title="Recent Listings"
                  subtitle="Wares currently tied to this member."
                  eyebrow="Guild Trade"
                />
                <div className="content-grid content-grid--compact">
                  {profile.marketItems?.map((item) => (
                    <div key={item.id} className="card profile-listing-card">
                      <h4 className="profile-listing-card__title">{item.title}</h4>
                      <p className="profile-listing-card__price">{item.price} coins</p>
                      <button className="btn btn--small" disabled>Manage Listing</button>
                    </div>
                  ))}
                  {profile.marketItems?.length === 0 ? (
                    <EmptyState
                      title="No active listings"
                      description="This member has no wares posted in the bazaar."
                    />
                  ) : null}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
