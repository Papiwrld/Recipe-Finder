import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="page-title">Page not found</h1>
      <p className="mb-6 mt-3 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Browse recipes
      </Link>
    </main>
  );
}
