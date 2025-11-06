'use client';

import { useState, useEffect } from 'react';
import { X, Check, Clock, Play, Pause } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import VideoModal from './VideoModal';

interface CookModeProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export default function CookMode({ recipe, isOpen, onClose }: CookModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState<number | null>(null);
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

  const steps = recipe.instructions;
  const hasNext = currentStep < steps.length - 1;
  const hasPrev = currentStep > 0;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-bg overflow-y-auto"
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <header className="sticky top-0 z-10 bg-surface border-b border-muted p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">{recipe.title}</h1>
              <p className="text-sm text-text-secondary">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Exit cook mode"
            >
              <X className="w-6 h-6 text-text" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-surface rounded-lg p-6 mb-6 border border-muted">
            <div className="flex items-start gap-4 mb-4">
              <button
                onClick={() => toggleStep(currentStep)}
                className={`mt-1 p-2 rounded-full transition-colors ${
                  completedSteps.has(currentStep)
                    ? 'bg-accent text-white'
                    : 'bg-muted text-text-secondary hover:bg-accent/20'
                }`}
                aria-label={completedSteps.has(currentStep) ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <Check className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-text mb-2">
                  Step {currentStep + 1}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {steps[currentStep]}
                </p>
              </div>
            </div>

            {/* Timer */}
            {timerSeconds > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-lg font-mono text-text">{formatTime(timerSeconds)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerSeconds(0);
                      setIsTimerRunning(false);
                    }}
                    className="px-4 py-2 bg-surface border border-muted rounded-lg hover:bg-muted transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Quick Timer Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => startTimer(5)}
                className="px-3 py-1 text-sm bg-surface border border-muted rounded-lg hover:bg-muted transition-colors"
              >
                5 min
              </button>
              <button
                onClick={() => startTimer(10)}
                className="px-3 py-1 text-sm bg-surface border border-muted rounded-lg hover:bg-muted transition-colors"
              >
                10 min
              </button>
              <button
                onClick={() => startTimer(15)}
                className="px-3 py-1 text-sm bg-surface border border-muted rounded-lg hover:bg-muted transition-colors"
              >
                15 min
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={!hasPrev}
              className="px-6 py-3 bg-surface border border-muted rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {recipe.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Watch Video
              </button>
            )}

            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={!hasNext}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* All Steps List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-text mb-4">All Steps</h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    index === currentStep
                      ? 'border-accent bg-accent/10'
                      : 'border-muted bg-surface hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        completedSteps.has(index)
                          ? 'bg-accent text-white'
                          : 'bg-muted text-text-secondary'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-sm ${index === currentStep ? 'font-medium text-text' : 'text-text-secondary'}`}>
                      {step}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
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

