# AGENTS.md - Development Guidelines for AI Agents

This document provides guidelines for AI agents working in this codebase.

## Project Structure

```
webhooks/
├── apps/
│   ├── api/            # Fastify API server (Node/TypeScript)
│   └── web/            # React + Vite frontend
├── packages/           # Shared packages
│   └── env/            # Environment variables schema
├── config/             # Shared configurations
│   └── typescript/
├── turbo.json          # Turborepo configuration
├── biome.json          # Biome linting/formatting config
└── pnpm-workspace.yaml
```

## Build & Development Commands

### Root Commands (Turborepo)
```bash
pnpm install            # Install all dependencies
pnpm build              # Build all packages
pnpm dev                # Run dev mode for all packages
pnpm clean              # Clean build artifacts
pnpm lint               # Lint all packages
pnpm lint:fix           # Fix lint issues
pnpm format             # Format code
pnpm format:check       # Check formatting
pnpm format-and-lint    # Biome check all
pnpm format-and-lint:fix # Biome check + auto-fix
```

### API Commands (apps/api)
```bash
cd apps/api
pnpm dev                # Start dev server with tsx watch (http://localhost:3333)
pnpm start              # Start production server (node dist/server.js)
pnpm db:generate        # Generate Drizzle migrations
pnpm db:migrate         # Run database migrations
pnpm db:studio          # Open Drizzle Studio
```

### Web Commands (apps/web)
```bash
cd apps/web
pnpm dev                # Start Vite dev server
pnpm build              # Type check + Vite build
pnpm preview            # Preview production build
pnpm lint               # Biome lint check
pnpm lint:fix           # Fix lint issues
pnpm format             # Format code
pnpm format:check       # Check formatting
```

### Running a Single Test
Tests are not yet configured. When adding tests, use Vitest:
```bash
cd apps/api  # or apps/web
npx vitest run path/to/file.test.ts          # Run single test file
npx vitest run -t "test name"                # Run single test by name
npx vitest watch path/to/file.test.ts        # Watch mode for single file
```

### Database
Create `.env` in project root with `DATABASE_URL` and `PORT` before running migrations.

## Code Style Guidelines

### Formatting (Biome 2.4)

Config in root `biome.json`:

- **Indentation:** 2 spaces
- **Line width:** 100 characters
- **Line endings:** LF (Unix)
- **JS quotes:** Single quotes `''`
- **JSX quotes:** Double quotes `""`
- **Trailing commas:** ES5 style
- **Semicolons:** As needed
- **Arrow parentheses:** As needed (omit for single param)
- **Import organization:** Enabled (Biome auto-sorts imports)

### TypeScript Guidelines

- **Strict mode:** Enabled in all tsconfigs
- **Module system:** NodeNext (API), ES modules (Web)
- **Path aliases:** `@/*` maps to `./src/*` in API
- Prefer interfaces over types for object shapes
- Use `unknown` instead of `any` when type is uncertain (note: `noExplicitAny` lint rule is off but avoid when possible)
- Use explicit types for function parameters and return types
- Leverage Zod for runtime validation (used with `drizzle-zod` and `fastify-type-provider-zod`)

### Naming Conventions

- **Files:** kebab-case (e.g., `user-service.ts`, `list-webhook.route.ts`)
- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Functions:** camelCase (e.g., `getUserData`, `formatDate`)
- **Constants:** UPPER_SNAKE_CASE for true constants, camelCase otherwise
- **Interfaces/Types:** PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Database tables:** snake_case in schema, PascalCase in TypeScript

### Import Organization

Biome auto-sorts imports. Manual order should be:
1. Node built-ins (e.g., `node:path`, `node:crypto`)
2. External packages (e.g., `fastify`, `zod`, `react`)
3. Workspace packages (e.g., `@webhooks/env`)
4. Relative imports (e.g., `./routes/...`, `../utils/...`)

```typescript
import { fastify } from 'fastify'
import { env } from '@webhooks/env'
import { listWebhook } from './routes/list-webhook.route'
```

### Error Handling

- Use try-catch for async operations with proper error logging
- Create custom error classes for domain-specific errors
- Return appropriate HTTP status codes in API responses
- Never expose sensitive information in error messages
- Use Zod schemas for request validation with `fastify-type-provider-zod`

```typescript
// Custom error class
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Route error handling
try {
  const result = await validateInput(data)
} catch (error) {
  logger.error({ err: error, input: data }, 'Validation failed')
  return reply.status(400).send({ error: 'Invalid input' })
}
```

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Avoid inline styles; prefer CSS or utility classes

### General Guidelines

- **No console.log in production code** - Use a proper logger
- **No commented-out code** - Remove or use TODO comments
- **Keep functions small** - Max 50-80 lines per function
- **Always run** `pnpm format-and-lint:fix` before committing
- **Use absolute imports** with `@/*` alias in API when possible

## Environment Variables

- Create `.env` file in project root for local development
- Never commit `.env` files - they are in `.gitignore`
- Shared env schema lives in `packages/env` for type safety
- Use `dotenv-cli` for loading env vars in API scripts

## Workflow for AI Agents

1. **Before making changes:** Read relevant files and understand context
2. **Follow code style:** Run `pnpm format-and-lint:fix` before committing
3. **Test changes:** Verify the app still runs after modifications
4. **Document complex logic:** Add comments for non-obvious code
5. **Keep changes small:** Make focused, incremental updates

## Known Technologies

- **Turborepo 2.x** - Monorepo orchestration
- **Biome 2.4** - Linting and formatting (replaces ESLint/Prettier)
- **pnpm 9.x** - Package manager
- **TypeScript 5.9** - Type safety
- **Fastify 5.x** - API server with Zod type provider
- **Drizzle ORM** - Database ORM with migrations
- **React 19 + Vite 8** - Frontend
- **Zod 4.x** - Runtime validation
- **Scalar** - API documentation
