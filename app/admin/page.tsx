'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cookTime: '',
    servings: '',
    cuisine: '',
    area: '',
    image: '',
    videoUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async () => {
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
        alert('Invalid token');
      }
    } catch (error) {
      // Fallback to client-side check (not recommended for production)
      const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123';
      if (token === adminToken) {
        setAuthenticated(true);
      } else {
        alert('Invalid token');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      alert('Recipe saved successfully!');
      setFormData({
        title: '',
        ingredients: '',
        instructions: '',
        cookTime: '',
        servings: '',
        cuisine: '',
        area: '',
        image: '',
        videoUrl: '',
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="max-w-md w-full p-8 bg-surface rounded-lg border border-muted">
          <h1 className="text-2xl font-bold text-text mb-4">Admin Access</h1>
          <p className="text-text-secondary mb-4">
            Enter your admin token to access the recipe submission form.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin Token"
              className="w-full p-3 bg-bg border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            />
            <button
              onClick={handleAuth}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Authenticate
            </button>
            <Link
              href="/"
              className="block text-center text-accent hover:underline"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Submit Recipe
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Ingredients * (one per line)
            </label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              required
              rows={8}
              className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="2 cups rice&#10;1 large onion&#10;3 tomatoes"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Instructions * (one step per line)
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              required
              rows={10}
              className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Step 1: Heat oil in a large pot...&#10;Step 2: Add onions and sauté..."
            />
          </div>

          {/* Grid for other fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Servings
              </label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Cuisine
              </label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                placeholder="e.g., West African"
                className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Area (Ghana/Nigeria)
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Ghana or Nigeria"
                className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-3 bg-surface border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Save Recipe'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

