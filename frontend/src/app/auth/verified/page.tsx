import PageHero from '@/components/PageHero';

const statusCopy: Record<string, { title: string; message: string }> = {
  success: {
    title: 'Email Verified',
    message: 'Your account has been verified. You can sign in now.',
  },
  expired: {
    title: 'Verification Link Expired',
    message: 'This verification link has expired. Request a new one from the sign-in screen.',
  },
  invalid: {
    title: 'Invalid Verification Link',
    message: 'The verification link is invalid or has already been used.',
  },
};

export default async function VerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || 'invalid';
  const copy = statusCopy[status] || statusCopy.invalid;

  return (
    <div className="page-shell">
      <PageHero
        title={copy.title}
        subtitle={copy.message}
        eyebrow="Guild Entry"
        compact
      />
      <section className="auth-shell">
        <div className="card auth-card">
          <p className="section-header__subtitle">{copy.message}</p>
        </div>
      </section>
    </div>
  );
}
