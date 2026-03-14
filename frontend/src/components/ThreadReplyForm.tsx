'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to post reply.';
}

export default function ThreadReplyForm({ threadId }: { threadId: number }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="card reply-box" style={{ padding: 'var(--space-xl)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
          Sign in to post a reply.
        </p>
        <Link href="/auth" className="btn btn--primary">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await fetchAPI(`/forums/threads/${threadId}/posts`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setContent('');
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card reply-box" style={{ padding: 'var(--space-xl)' }}>
      <textarea
        id="replyTextarea"
        placeholder="Share your advice or follow-up..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        style={{
          width: '100%',
          minHeight: '120px',
          background: 'var(--bg-dark)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          resize: 'vertical',
        }}
      />
      {error && <p style={{ color: 'var(--accent-red-bright)', marginTop: 'var(--space-sm)' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
        <button className="btn btn--primary" type="submit" disabled={submitting || !content.trim()}>
          {submitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
}
