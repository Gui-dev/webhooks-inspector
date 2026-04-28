# Webhooks

A monorepo for capturing and inspecting webhooks.

## Tech Stack

- **Monorepo**: Turborepo 2.x
- **Package Manager**: pnpm 9.x
- **Language**: TypeScript 5.9
- **API**: Fastify 5.x with Zod
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: React 19 + Vite 8
- **Code Quality**: Biome (linting & formatting)
- **Testing**: Vitest

## Project Structure

```
webhooks/
├── apps/
│   ├── api/          # Fastify API server
│   └── web/          # React frontend
├── packages/         # Shared packages
│   └── env/          # Environment variables
├── config/           # Shared configurations
│   └── typescript/
├── turbo.json        # Turborepo config
├── biome.json        # Biome config
└── pnpm-workspace.yaml
```

## Features

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks` | List all webhooks (paginated) |
| GET | `/api/webhooks/:id` | Get a specific webhook |
| POST | `/api/webhooks` | Create a new webhook |
| DELETE | `/api/webhooks/:id` | Delete a webhook |
| GET | `/api/webhooks/:id/generate-handler` | Generate handler code |
| POST | `/capture/*` | Capture incoming webhooks |

### Architecture

The API follows **Hexagonal Architecture** pattern:

- **Routes**: `apps/api/src/routes/`
- **Use Cases**: `apps/api/src/use-cases/`
- **Repositories**: `apps/api/src/repositories/`
- **Contracts**: `apps/api/src/contracts/`
- **Errors**: `apps/api/src/_error/`

### Implemented Use Cases

- `GetWebhookUseCase` - Retrieve a single webhook by ID
- `DeleteWebhookUseCase` - Delete a webhook by ID
- `ListWebhooksUseCase` - List webhooks with pagination support
- `CreateWebhookUseCase` - Create a new webhook
- `GenerateHandlerUseCase` - Generate handler code for a webhook

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.x
- PostgreSQL database

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/webhooks
PORT=3333
```

### Development

Run all apps in development mode:

```bash
pnpm dev
```

Run individual apps:

```bash
# API
cd apps/api
pnpm dev

# Frontend
cd apps/web
pnpm dev
```

### Build

```bash
pnpm build
```

### Database Migrations

```bash
# Generate migration
cd apps/api
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open DB studio
pnpm db:studio
```

### Testing

```bash
# Run API tests
cd apps/api
pnpm test

# Run web tests
cd apps/web
pnpm test

# Run e2e tests
cd apps/web
pnpm test:e2e
```

## Code Quality

```bash
# Lint all packages
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## API Documentation

When the API is running, visit:
- Swagger UI: `http://localhost:3333/docs`
- OpenAPI spec: `http://localhost:3333/json`

## Screenshots

<!-- Add your project screenshots here -->

![Webhooks Dashboard](./docs/screenshots/webhooks-dashboard.png)

## License

ISC
