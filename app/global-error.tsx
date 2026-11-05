'use client';

import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-dvh items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-text">Something went wrong</h1>
            <p className="mb-6 mt-3 text-text-secondary">
              Recipe Finder failed to load. Please try again.
            </p>
            <button type="button" onClick={reset} className="btn-primary">
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
