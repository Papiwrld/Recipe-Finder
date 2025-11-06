'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import ReactPlayer from 'react-player';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VideoModal({ videoUrl, isOpen, onClose, title }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-4xl mx-4 bg-surface rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-muted">
          <h2 id="video-modal-title" className="text-lg font-semibold text-text">
            {title || 'Recipe Video'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close video modal"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative pt-[56.25%] bg-black">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            controls
            playing
          />
        </div>
      </div>
    </div>
  );
}

