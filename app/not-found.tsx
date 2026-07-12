import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <span className="text-6xl">📭</span>
      <div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link href="/" className="btn-primary text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Link>
    </div>
  );
}
