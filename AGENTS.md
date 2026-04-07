# AGENTS.md - Development Guidelines for AI Agents

This document provides guidelines for AI agents working in this codebase.

## Project Structure

```
webhooks/                 # Turborepo monorepo
├── apps/
│   ├── api/             # Fastify API server (Node/TypeScript)
│   └── web/             # React + Vite frontend
├── packages/            # Shared packages (empty for now)
├── turbo.json          # Turborepo configuration
├── biome.json          # Biome linting/formatting config
└── pnpm-workspace.yaml # pnpm workspaces
```

## Build & Development Commands

### Root Commands (Turborepo)
```bash
pnpm build              # Build all packages
pnpm dev                # Run dev mode for all packages
pnpm clean              # Clean build artifacts
pnpm lint               # Lint all packages
pnpm lint:fix           # Fix lint issues
pnpm format             # Format code
pnpm format:check       # Check formatting
```

### App-Specific Commands

**API (apps/api):**
```bash
cd apps/api
pnpm dev                # Start dev server with tsx watch
pnpm start              # Start production server
```

**Web (apps/web):**
```bash
cd apps/web
pnpm dev                # Start Vite dev server
pnpm build              # Build for production
pnpm preview            # Preview production build
pnpm lint               # Biome lint check
pnpm lint:fix           # Fix lint issues
pnpm format             # Format code
pnpm format:check       # Check formatting
```

## Code Style Guidelines

### Formatting (Biome)

The project uses Biome for linting and formatting. Configuration in `biome.json`:

- **Indentation:** 2 spaces
- **Line width:** 100 characters
- **Line endings:** LF (Unix)
- **JS quotes:** Single quotes `''`
- **JSX quotes:** Double quotes `""`
- **Trailing commas:** ES5 style
- **Semicolons:** As needed

Run formatting:
```bash
pnpm format             # Format all code
pnpm format:check       # Check without fixing
pnpm lint:fix           # Fix lint issues
```

### TypeScript Guidelines

- Use explicit types for function parameters and return types
- Prefer interfaces over types for object shapes
- Use `unknown` instead of `any` when type is unknown
- Enable strict mode in tsconfig.json

### Naming Conventions

- **Files:** kebab-case (e.g., `user-service.ts`, `my-component.tsx`)
- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Functions:** camelCase (e.g., `getUserData`, `formatDate`)
- **Constants:** UPPER_SNAKE_CASE for true constants, camelCase otherwise
- **Interfaces/Types:** PascalCase with descriptive names (e.g., `UserProfile`, `ApiResponse`)

### Import Organization

Order imports as follows:
1. Node built-ins (e.g., `path`, `fs`, `crypto`)
2. External packages (e.g., `react`, `fastify`, `zod`)
3. Relative imports from same package
4. Relative imports from different packages

```typescript
// 1. Node built-ins
import path from 'node:path';
import crypto from 'node:crypto';

// 2. External packages
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// 3. Same package relative
import { logger } from './logger.js';
import { validateRequest } from '../utils/validation.js';
```

### Error Handling

- Use try-catch for async operations with proper error logging
- Create custom error classes for domain-specific errors
- Return appropriate HTTP status codes in API responses
- Never expose sensitive information in error messages
- Use result/either patterns for functions that can fail

```typescript
// Good: Custom error with proper logging
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Good: Proper error handling in routes
try {
  const result = await validateInput(data);
} catch (error) {
  logger.error({ err: error, input: data }, 'Validation failed');
  return reply.status(400).send({ error: 'Invalid input' });
}
```

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript generics for reusable components
- Avoid inline styles; use CSS modules or Tailwind classes

### General Guidelines

- **No console.log in production code** - Use a proper logger
- **No commented-out code** - Remove or use TODO comments
- **Keep functions small** - Max 50-80 lines per function
- **Write tests** - Aim for unit tests for utility functions
- **Use absolute imports** - Configure path aliases in tsconfig

## Testing

When tests are added, run them with:
```bash
# Single test file (example patterns - adjust as needed)
pnpm test                # Run all tests
pnpm test -- --run       # Run tests once (not watch mode)
pnpm test specific-file  # Run specific test file
```

## Environment Variables

- Create `.env` files in project root for local development
- Never commit `.env` files - add to `.gitignore`
- Use `dotenv-cli` for loading env vars (already configured in API)

## Workflow for AI Agents

1. **Before making changes:** Read relevant files and understand the codebase
2. **Follow code style:** Run `pnpm lint:fix` and `pnpm format` before committing
3. **Test changes:** Verify the app still runs after modifications
4. **Document complex logic:** Add comments for non-obvious code
5. **Keep PRs small:** Make focused, incremental changes

## Known Technologies

- **Turborepo 2.x** - Monorepo orchestration
- **Biome** - Linting and formatting (replaces ESLint/Prettier)
- **pnpm** - Package manager
- **TypeScript 5.9** - Type safety
- **Fastify 5.x** - API server
- **React 19 + Vite** - Frontend