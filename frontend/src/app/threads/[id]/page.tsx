import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import React from 'react';

export const dynamic = 'force-dynamic';

async function getThread(id: string) {
    return await fetchAPI(`/forums/threads/${id}`);
}

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const thread = await getThread(id);

    return (
        <>
            {/* Thread Header */}
            <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
                <Link href={`/threads?category=${thread.categoryId}`} className="badge badge--gold" style={{ marginBottom: 'var(--space-md)' }}>
                    {thread.category?.icon} {thread.category?.name}
                </Link>
                <h1 className="hero__title" style={{ fontSize: '2.2rem', marginTop: 'var(--space-xs)' }}>{thread.title}</h1>
                <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>
                    <span>By <span style={{ color: 'var(--accent-gold)' }}>{thread.author?.username}</span></span>
                    <span>•</span>
                    <span>{new Date(thread.createdAt).toLocaleString()}</span>
                </div>
            </div>

            {/* OP Post */}
            <div className="card" style={{ marginBottom: 'var(--space-2xl)', padding: '0' }}>
                <div className="post" style={{ borderBottom: 'none' }}>
                    <div className="post__author">
                        <div className="avatar avatar--lg" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {thread.author?.avatar || '🦇'}
                        </div>
                        <span className="post__username">{thread.author?.username}</span>
                        <span className="post__role">Master Artisan</span>
                    </div>
                    <div className="post__content">
                        <div className="post__header">
                            <span className="post__date">OP</span>
                            <div className="post__actions">
                                <button className="btn btn--icon">⚔️</button>
                                <button className="btn btn--icon">⚖️</button>
                            </div>
                        </div>
                        <div className="post__body">
                            {thread.content.split('\n').map((para: string, i: number) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider"><span className="divider__icon">⚜️</span> {thread.posts?.length || 0} Replies</div>

            {/* Posts List */}
            <div className="card" style={{ padding: '0' }}>
                {thread.posts?.map((post: any) => (
                    <div key={post.id} className="post">
                        <div className="post__author">
                            <div className="avatar avatar--md" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {post.author?.avatar || '🌙'}
                            </div>
                            <span className="post__username">{post.author?.username}</span>
                            <span className="post__role">Guild Member</span>
                        </div>
                        <div className="post__content">
                            <div className="post__header">
                                <span className="post__date">{new Date(post.createdAt).toLocaleString()}</span>
                                <div className="post__actions">
                                    <button className="btn btn--icon btn--like">❤️ <span className="like-count">0</span></button>
                                    <button className="btn btn--icon">💬</button>
                                </div>
                            </div>
                            <div className="post__body">
                                {post.content.split('\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Section */}
            <div style={{ marginTop: 'var(--space-2xl)' }}>
                 <div className="section-header">
                    <h3 className="section-header__title">✦ Post a Reply</h3>
                </div>
                <div className="card reply-box" style={{ padding: 'var(--space-xl)' }}>
                    <textarea 
                        id="replyTextarea" 
                        placeholder="Share your wisdom or ask for guidance..."
                        style={{ 
                            width: '100%', 
                            minHeight: '120px', 
                            background: 'var(--bg-dark)', 
                            border: '1px solid var(--border-subtle)', 
                            borderRadius: 'var(--radius-md)', 
                            padding: 'var(--space-md)', 
                            color: '#fff',
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.1rem',
                            resize: 'vertical'
                        }}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
                        <button className="btn btn--primary">⚜️ Post Reply</button>
                    </div>
                </div>
            </div>
        </>
    );
}
