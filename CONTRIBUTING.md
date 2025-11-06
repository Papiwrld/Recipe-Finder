# Contributing to Recipe Finder

Thank you for your interest in contributing to Recipe Finder! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/recipe-finder.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start the development server: `npm run dev`

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (e.g., "Add", "Fix", "Update", "Remove")
- Keep the first line under 50 characters
- Add more details in the body if needed

Example:
```
Add loading state to recipe search

- Implement skeleton loader for better UX
- Add error handling for failed API calls
```

### Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Test your changes thoroughly
3. Update documentation if needed
4. Create a pull request with a clear description
5. Link any related issues

## Project Structure

```
recipe-finder/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utilities and API logic
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

## API Usage

This project uses public APIs that don't require API keys:
- TheMealDB
- TheCocktailDB
- RecipePuppy (optional)

Please respect API rate limits and terms of service.

## Questions?

Feel free to open an issue for questions or suggestions!

