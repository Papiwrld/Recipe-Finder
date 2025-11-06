'use client';

import { Github, Mail, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const socialLinks = {
    email: 'kwesieugene77@gmail.com',
    github: 'https://github.com/Papiwrld',
    twitter: 'https://x.com/papiwrld_?s=21',
    linkedin: 'https://www.linkedin.com/in/eugene-awagah-86068a341',
  };

  return (
    <footer className="bg-surface border-t border-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg text-text mb-4">About Recipe Finder</h3>
            <p className="text-text-secondary text-sm">
              Discover and explore thousands of delicious recipes from around the world. 
              Cook with confidence using our curated collection of authentic dishes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg text-text mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-text-secondary hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/favorites" className="text-text-secondary hover:text-accent transition-colors">
                  Favorites
                </a>
              </li>
              <li>
                <a href="/admin" className="text-text-secondary hover:text-accent transition-colors">
                  Submit Recipe
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg text-text mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href={`mailto:${socialLinks.email}`}
                className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-text hover:text-white" />
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-text hover:text-white" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-text hover:text-white" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-text hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="pt-8 border-t border-muted text-center">
          <p className="text-text-secondary text-sm">
            Built by{' '}
            <span className="font-semibold text-accent">Awagah Eugene Kwesi</span>
            {' '}—{' '}
            <a href={`mailto:${socialLinks.email}`} className="hover:text-accent transition-colors">
              {socialLinks.email}
            </a>
          </p>
          <p className="text-text-secondary text-xs mt-2">
            © {new Date().getFullYear()} Recipe Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

