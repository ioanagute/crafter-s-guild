import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import ThreadReplyForm from "@/components/ThreadReplyForm";
import { fetchAPI } from "@/lib/api";
import { ThreadSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getThread(id: string) {
  return fetchAPI(`/forums/threads/${id}`) as Promise<ThreadSummary>;
}

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = await getThread(id);

  return (
    <div className="page-shell">
      <section className="thread-hero card">
        <div className="thread-hero__crumbs">
          <Link href="/threads" className="thread-hero__crumb">Forum Records</Link>
          <span className="thread-hero__crumb-sep">/</span>
          <Link href={`/threads?category=${thread.categoryId}`} className="badge badge--gold">
            {thread.category?.name}
          </Link>
        </div>
        <h1 className="thread-hero__title">{thread.title}</h1>
        <div className="thread-hero__meta">
          <span>By <span className="thread-hero__author">{thread.author?.username}</span></span>
          <span>{new Date(thread.createdAt).toLocaleString()}</span>
          <span>{thread.posts?.length || 0} replies</span>
        </div>
      </section>

      <div className="card thread-post-card">
        <div className="post post--original">
          <div className="post__author">
            <div className="avatar avatar--lg thread-avatar">
              {thread.author?.avatar || "A"}
            </div>
            <span className="post__username">{thread.author?.username}</span>
            <span className="post__role">Original Poster</span>
          </div>
          <div className="post__content">
            <div className="post__header">
              <span className="post__date">Opening Record</span>
            </div>
            <div className="post__body">
              {thread.content.split("\n").map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider"><span className="divider__icon">Replies</span> {thread.posts?.length || 0}</div>

      <div className="card thread-post-card">
        {thread.posts?.map((post) => (
          <div key={post.id} className="post">
            <div className="post__author">
              <div className="avatar avatar--md thread-avatar thread-avatar--small">
                {post.author?.avatar || "M"}
              </div>
              <span className="post__username">{post.author?.username}</span>
              <span className="post__role">Guild Member</span>
            </div>
            <div className="post__content">
              <div className="post__header">
                <span className="post__date">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <div className="post__body">
                {post.content.split("\n").map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {!thread.posts?.length ? (
          <EmptyState
            title="No replies yet"
            description="Be the first guild member to answer this thread."
          />
        ) : null}
      </div>

      <section className="reply-section" id="reply">
        <PageHeader
          title="Post a Reply"
          subtitle="Add your counsel to the guild record."
          eyebrow="Reply Chamber"
        />
        <ThreadReplyForm threadId={thread.id} />
      </section>
    </div>
  );
}
