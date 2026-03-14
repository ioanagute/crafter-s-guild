import Link from 'next/link';
import ThreadReplyForm from '@/components/ThreadReplyForm';
import { fetchAPI } from '@/lib/api';
import { ThreadSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getThread(id: string) {
  return fetchAPI(`/forums/threads/${id}`) as Promise<ThreadSummary>;
}

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = await getThread(id);

  return (
    <>
      <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
        <Link href={`/threads?category=${thread.categoryId}`} className="badge badge--gold" style={{ marginBottom: 'var(--space-md)' }}>
          {thread.category?.icon} {thread.category?.name}
        </Link>
        <h1 className="hero__title" style={{ fontSize: '2.2rem', marginTop: 'var(--space-xs)' }}>{thread.title}</h1>
        <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>
          <span>By <span style={{ color: 'var(--accent-gold)' }}>{thread.author?.username}</span></span>
          <span>|</span>
          <span>{new Date(thread.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-2xl)', padding: '0' }}>
        <div className="post" style={{ borderBottom: 'none' }}>
          <div className="post__author">
            <div className="avatar avatar--lg" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {thread.author?.avatar || 'A'}
            </div>
            <span className="post__username">{thread.author?.username}</span>
            <span className="post__role">Original Poster</span>
          </div>
          <div className="post__content">
            <div className="post__header">
              <span className="post__date">OP</span>
            </div>
            <div className="post__body">
              {thread.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider"><span className="divider__icon">Replies</span> {thread.posts?.length || 0}</div>

      <div className="card" style={{ padding: '0' }}>
        {thread.posts?.map((post) => (
          <div key={post.id} className="post">
            <div className="post__author">
              <div className="avatar avatar--md" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {post.author?.avatar || 'M'}
              </div>
              <span className="post__username">{post.author?.username}</span>
              <span className="post__role">Guild Member</span>
            </div>
            <div className="post__content">
              <div className="post__header">
                <span className="post__date">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <div className="post__body">
                {post.content.split('\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <div className="section-header">
          <h3 className="section-header__title">Post a Reply</h3>
        </div>
        <ThreadReplyForm threadId={thread.id} />
      </div>
    </>
  );
}
