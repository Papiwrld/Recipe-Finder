import Link from 'next/link';
import { Envelope, GithubLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react/dist/ssr';

const email = 'kwesieugene77@gmail.com';

const socialLinks = [
  { href: `mailto:${email}`, label: 'Email', icon: Envelope },
  { href: 'https://github.com/Papiwrld', label: 'GitHub', icon: GithubLogo },
  { href: 'https://x.com/papiwrld_?s=21', label: 'Twitter', icon: TwitterLogo },
  { href: 'https://www.linkedin.com/in/eugene-awagah-86068a341', label: 'LinkedIn', icon: LinkedinLogo },
];

export default function Footer() {
  return (
    // Bottom padding keeps the credits clear of the floating navigation
    <footer className="mt-20 pb-28 text-center">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex justify-center gap-1">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="icon-btn"
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <Link
          href="/admin"
          className="mt-4 inline-block rounded text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text"
        >
          Submit a recipe
        </Link>

        <p className="mt-4 text-sm text-text-secondary">
          Built by Awagah Eugene Kwesi.
        </p>
        <p className="mt-1 text-sm text-text-secondary">© {new Date().getFullYear()} Recipe Finder</p>
      </div>
    </footer>
  );
}
