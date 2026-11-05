'use client';

import { useState, useEffect } from 'react';
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, Check, Clock, Pause, Play, X } from '@phosphor-icons/react';
import { Recipe } from '@/types/recipe';
import { cleanSteps } from '@/lib/utils/steps';
import VideoModal from './VideoModal';

interface CookModeProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const timerPresets = [5, 10, 15];

export default function CookMode({ recipe, isOpen, onClose }: CookModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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

  useEffect(() => {
    if (!isOpen || showVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showVideo, onClose]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const steps = cleanSteps(recipe.instructions);
  const hasNext = currentStep < steps.length - 1;
  const hasPrev = currentStep > 0;
  const isCurrentDone = completedSteps.has(currentStep);

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    if (hasNext) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex flex-col bg-bg"
        aria-modal="true"
        aria-labelledby="cook-mode-title"
        role="dialog"
      >
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <h1 id="cook-mode-title" className="truncate font-display text-lg font-semibold text-text">
                {recipe.title}
              </h1>
              <p className="text-sm tabular-nums text-text-secondary">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <button type="button" onClick={onClose} className="icon-btn flex-shrink-0" aria-label="Exit cook mode">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div
            className="h-1 bg-muted"
            role="progressbar"
            aria-label="Recipe progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={currentStep + 1}
          >
            <div
              className="h-full origin-left bg-accent transition-transform duration-300"
              style={{ transform: `scaleX(${(currentStep + 1) / steps.length})` }}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
            <p className="text-center font-display text-5xl font-semibold tabular-nums text-accent sm:text-6xl">{currentStep + 1}</p>
            <p className="mt-4 text-center font-display text-2xl leading-snug tracking-tight text-text sm:text-3xl sm:leading-snug" aria-live="polite">
              {steps[currentStep]}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => toggleStep(currentStep)}
                aria-pressed={isCurrentDone}
                className={`chip ${isCurrentDone ? 'chip-active' : ''}`}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                {isCurrentDone ? 'Done' : 'Mark done'}
              </button>
              {recipe.videoUrl && (
                <button type="button" onClick={() => setShowVideo(true)} className="chip">
                  <Play className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
                  Video
                </button>
              )}
            </div>

            <div className="mt-6">
              {timerSeconds > 0 ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2.5" role="timer">
                    <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                    <span className="font-display text-3xl font-semibold tabular-nums text-text">{formatTime(timerSeconds)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="icon-btn"
                      aria-label={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                    >
                      {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(0);
                        setIsTimerRunning(false);
                      }}
                      className="icon-btn"
                      aria-label="Reset timer"
                    >
                      <ArrowCounterClockwise className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-2 text-sm font-medium text-text">
                    <Clock className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                    Timer
                  </span>
                  {timerPresets.map((minutes) => (
                    <button key={minutes} type="button" onClick={() => startTimer(minutes)} className="chip tabular-nums">
                      {minutes} min
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-semibold text-text">All steps</h2>
              <ol className="mt-3 space-y-1">
                {steps.map((step, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      aria-current={index === currentStep ? 'step' : undefined}
                      className="flex w-full items-start gap-3 py-3 text-left transition-colors duration-150 hover:text-text"
                    >
                      <span
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                          completedSteps.has(index)
                            ? 'bg-accent text-on-accent'
                            : index === currentStep
                              ? 'bg-text text-bg'
                              : 'bg-muted text-text-secondary'
                        }`}
                      >
                        {completedSteps.has(index) ? <Check className="h-3.5 w-3.5" weight="bold" aria-label="Done" /> : index + 1}
                      </span>
                      <span className={`line-clamp-2 text-sm ${index === currentStep ? 'font-medium text-text' : 'text-text-secondary'}`}>
                        {step}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </main>
        </div>

        {/* Controls stay in reach however long the step text is */}
        <div className="border-t border-line bg-bg pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={!hasPrev}
              className="btn-secondary h-12"
            >
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
              Previous
            </button>
            <button type="button" onClick={handleNext} className="btn-primary h-12">
              {hasNext ? 'Next' : 'Finish'}
              {hasNext ? <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" /> : <Check className="h-[18px] w-[18px]" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {recipe.videoUrl && (
        <VideoModal
          videoUrl={recipe.videoUrl}
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          title={recipe.title}
        />
      )}
    </>
  );
}
