'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FloppyDisk } from '@phosphor-icons/react';

const emptyForm = {
  title: '',
  ingredients: '',
  instructions: '',
  cookTime: '',
  servings: '',
  cuisine: '',
  area: '',
  image: '',
  videoUrl: '',
};

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAuth = async () => {
    setAuthError('');
    // In production, this should call a server-side API route
    // For now, using client-side check (not secure - for demo only)
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        setAuthenticated(true);
      } else {
        setAuthError('That token is not valid.');
      }
    } catch (error) {
      // Fallback to client-side check (not recommended for production)
      const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123';
      if (token === adminToken) {
        setAuthenticated(true);
      } else {
        setAuthError('That token is not valid.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      // Parse ingredients and instructions
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const instructionsArray = formData.instructions
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const recipe = {
        id: `local-${Date.now()}`,
        title: formData.title,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        cookTime: formData.cookTime ? parseInt(formData.cookTime) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        cuisine: formData.cuisine || undefined,
        area: formData.area || undefined,
        image: formData.image || undefined,
        videoUrl: formData.videoUrl || undefined,
        source: 'local',
      };

      // In a real app, this would send to a serverless function or API
      // For now, we'll store in localStorage as a simple solution
      const localRecipes = JSON.parse(localStorage.getItem('local-recipes') || '[]');
      localRecipes.push(recipe);
      localStorage.setItem('local-recipes', JSON.stringify(localRecipes));

      setStatus({ type: 'success', message: `Saved "${recipe.title}".` });
      setFormData(emptyForm);
    } catch (error) {
      console.error('Error saving recipe:', error);
      setStatus({ type: 'error', message: "We couldn't save this recipe. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [field]: e.target.value });

  if (!authenticated) {
    return (
      <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
        <h1 className="page-title">Admin access</h1>
        <p className="mt-3 text-center text-text-secondary">
          Enter your admin token to submit a recipe.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
        >
          <div>
            <label htmlFor="admin-token" className="field-label">Admin token</label>
            <input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              aria-invalid={!!authError}
              aria-describedby={authError ? 'admin-token-error' : undefined}
              className="field"
            />
            {authError && (
              <p id="admin-token-error" role="alert" className="mt-1.5 text-sm font-medium text-accent">
                {authError}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
          <Link href="/" className="block rounded text-center text-sm font-medium text-text-secondary transition-colors hover:text-text">
            Back to recipes
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 sm:px-6 sm:pt-12">
      <h1 className="page-title">Submit a recipe</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="field-label">Recipe title (required)</label>
          <input id="title" type="text" value={formData.title} onChange={updateField('title')} required className="field" />
        </div>

        <div>
          <label htmlFor="ingredients" className="field-label">Ingredients, one per line (required)</label>
          <textarea
            id="ingredients"
            value={formData.ingredients}
            onChange={updateField('ingredients')}
            required
            rows={8}
            className="field"
            placeholder={'2 cups rice\n1 large onion\n3 tomatoes'}
          />
        </div>

        <div>
          <label htmlFor="instructions" className="field-label">Instructions, one step per line (required)</label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={updateField('instructions')}
            required
            rows={10}
            className="field"
            placeholder={'Heat oil in a large pot.\nAdd the onions and sauté until soft.'}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="cookTime" className="field-label">Cook time (minutes)</label>
            <input id="cookTime" type="number" min="0" value={formData.cookTime} onChange={updateField('cookTime')} className="field" />
          </div>
          <div>
            <label htmlFor="servings" className="field-label">Servings</label>
            <input id="servings" type="number" min="0" value={formData.servings} onChange={updateField('servings')} className="field" />
          </div>
          <div>
            <label htmlFor="cuisine" className="field-label">Cuisine</label>
            <input id="cuisine" type="text" value={formData.cuisine} onChange={updateField('cuisine')} placeholder="e.g., Italian" className="field" />
          </div>
          <div>
            <label htmlFor="area" className="field-label">Area</label>
            <input id="area" type="text" value={formData.area} onChange={updateField('area')} placeholder="e.g., Ghana" className="field" />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="field-label">Image URL</label>
          <input id="image" type="url" value={formData.image} onChange={updateField('image')} placeholder="https://example.com/image.jpg" className="field" />
        </div>

        <div>
          <label htmlFor="videoUrl" className="field-label">YouTube video URL</label>
          <input id="videoUrl" type="url" value={formData.videoUrl} onChange={updateField('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." className="field" />
        </div>

        {status && (
          <p role={status.type === 'error' ? 'alert' : 'status'} className={`text-sm font-medium ${status.type === 'error' ? 'text-accent' : 'text-text'}`}>
            {status.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          <FloppyDisk className="h-5 w-5" aria-hidden="true" />
          {isSubmitting ? 'Saving...' : 'Save recipe'}
        </button>
      </form>
    </main>
  );
}
