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
      <div className="card reply-box panel panel--inset">
        <p className="reply-box__notice">Enter the guild to add your counsel to this thread.</p>
        <Link href="/auth" className="btn btn--primary">
          Enter Guild
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
    <form onSubmit={handleSubmit} className="card reply-box panel panel--inset">
      <div className="reply-box__header">
        <span className="reply-box__eyebrow">Guild Reply</span>
        <h4 className="reply-box__title">Add Counsel to the Record</h4>
      </div>
      <textarea
        id="replyTextarea"
        className="form-textarea"
        placeholder="Share your advice or follow-up..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      {error ? <p className="form-error">{error}</p> : null}
      <div className="reply-box__actions">
        <button className="btn btn--primary" type="submit" disabled={submitting || !content.trim()}>
          {submitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
}
