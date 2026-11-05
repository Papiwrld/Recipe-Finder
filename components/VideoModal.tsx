'use client';

import { useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import ReactPlayer from 'react-player';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VideoModal({ videoUrl, isOpen, onClose, title }: VideoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-surface shadow-lifted"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 py-2 pl-5 pr-2">
          <h2 id="video-modal-title" className="truncate font-display text-lg font-semibold text-text">
            {title || 'Recipe video'}
          </h2>
          <button type="button" onClick={onClose} className="icon-btn flex-shrink-0" aria-label="Close video">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative bg-black pt-[56.25%]">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            controls
            playing
          />
        </div>
      </div>
    </div>
  );
}
