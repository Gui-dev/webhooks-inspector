# Frontend E2E Tests with Playwright Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add end-to-end tests for frontend using Playwright, covering webhook list and details views.

**Architecture:** Tests will use Playwright with page objects pattern, running against the frontend dev server. API calls will be mocked or the test server will seed data.

**Tech Stack:** Playwright, React, Vite (dev server)

---

## File Structure

```
apps/web/
├── e2e/
│   ├── page-objects/
│   │   ├── webhooks-list.page.ts      # Webhooks list page object
│   │   └── webhook-details.page.ts    # Webhook details page object
│   └── webhooks.spec.ts              # E2E tests
├── playwright.config.ts             # Playwright configuration
└── package.json                    # Add playwright scripts
```

---

## Tasks

### Task 1: Install Playwright and configure

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/playwright.config.ts`

- [ ] **Step 1: Install Playwright**

Run: `cd apps/web && pnpm add -D @playwright/test && pnpm playwright install chromium`
Expected: Playwright installed with Chromium browser

- [ ] **Step 2: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

- [ ] **Step 3: Update package.json scripts**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json apps/web/playwright.config.ts apps/web/playwright
git commit -m "chore(web): add Playwright for e2e tests"
```

---

### Task 2: Create page objects

**Files:**
- Create: `apps/web/e2e/page-objects/webhooks-list.page.ts`
- Create: `apps/web/e2e/page-objects/webhook-details.page.ts`

- [ ] **Step 1: Create webhooks-list.page.ts**

```typescript
import { type Page, type Locator, expect } from '@playwright/test'

export class WebhooksListPage {
  readonly page: Page
  readonly heading: Locator
  readonly webhooks: Locator
  readonly webhookItems: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: /webhooks/i })
    this.webhooks = page.getByTestId('webhooks-list')
    this.webhookItems = this.webhooks.getByTestId('webhook-item')
  }

  async goto() {
    await this.page.goto('/')
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible()
  }

  async expectWebhookCount(count: number) {
    await expect(this.webhookItems).toHaveCount(count)
  }

  async clickWebhook(id: string) {
    await this.webhookItems.filter({ has: page.getByText(id) }).click()
  }
}
```

- [ ] **Step 2: Create webhook-details.page.ts**

```typescript
import { type Page, type Locator, expect } from '@playwright/test'

export class WebhookDetailsPage {
  readonly page: Page
  readonly method: Locator
  readonly pathname: Locator
  readonly ip: Locator
  readonly deleteButton: Locator

  constructor(page: Page) {
    this.page = page
    this.method = page.getByTestId('webhook-method')
    this.pathname = page.getByTestId('webhook-pathname')
    this.ip = page.getByTestId('webhook-ip')
    this.deleteButton = page.getByRole('button', { name: /delete/i })
  }

  async goto(id: string) {
    await this.page.goto(`/webhooks/${id}`)
  }

  async expectLoaded() {
    await expect(this.method).toBeVisible()
  }

  async expectMethod(method: string) {
    await expect(this.method).toHaveText(method)
  }

  async delete() {
    await this.deleteButton.click()
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/page-objects/
git commit -m "test(web): add page objects for e2e tests"
```

---

### Task 3: Create e2e tests

**Files:**
- Create: `apps/web/e2e/webhooks.spec.ts`

- [ ] **Step 1: Write basic navigation tests**

```typescript
import { test, expect } from '@playwright/test'
import { WebhooksListPage } from './page-objects/webhooks-list.page'

test.describe('Webhooks List', () => {
  test('displays page heading', async ({ page }) => {
    const webhooksList = new WebhooksListPage(page)
    await webhooksList.goto()
    await webhooksList.expectLoaded()
  })

  test('shows loading state while fetching', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('webhooks-skeleton')).toBeVisible()
  })

  test('displays webhooks after load', async ({ page }) => {
    const webhooksList = new WebhooksListPage(page)
    await webhooksList.goto()
    // Wait for webhooks to load (skeleton disappears)
    await expect(page.getByTestId('webhooks-skeleton')).not.toBeVisible()
    // Verify webhooks are displayed
    await expect(webhooksList.webhooks).toBeVisible()
  })
})

test.describe('Webhook Details', () => {
  test('shows skeleton while loading', async ({ page }) => {
    await page.goto('/webhooks/test-id')
    await expect(page.getByTestId('webhook-details-skeleton')).toBeVisible()
  })

  test('displays webhook details', async ({ page }) => {
    await page.goto('/webhooks/test-id')
    // Wait for details to load
    await expect(page.getByTestId('webhook-details-skeleton')).not.toBeVisible()
    await expect(page.getByTestId('webhook-method')).toBeVisible()
  })
})
```

- [ ] **Step 2: Write interaction tests**

```typescript
test.describe('Navigation', () => {
  test('navigates to webhook details on click', async ({ page }) => {
    const webhooksList = new WebhooksListPage(page)
    await webhooksList.goto()
    
    // Wait for webhooks to load
    await expect(webhooksList.webhooks).toBeVisible()
    
    // Click first webhook
    const firstWebhook = webhooksList.webhookItems.first()
    await firstWebhook.click()
    
    // Verify URL changed
    await expect(page).toHaveURL(/\/webhooks\/.+/)
  })
})

test.describe('Webhook Details', () => {
  test('delete button triggers confirmation', async ({ page }) => {
    const detailsPage = new WebhookDetailsPage(page)
    await detailsPage.goto('test-webhook-id')
    
    await detailsPage.expectLoaded()
    await detailsPage.deleteButton.click()
    
    // Verify confirmation dialog appears
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/webhooks.spec.ts
git commit -m "test(web): add e2e tests for webhooks pages"
```

---

### Task 4: Run tests and fix issues

- [ ] **Step 1: Run e2e tests**

Run: `cd apps/web && pnpm test:e2e`
Expected: Tests run (may need component data-testid attributes)

- [ ] **Step 2: Add data-testid to components as needed**

Add `data-testid` attributes to components for reliable selectors:
- `WebhooksList`: `data-testid="webhooks-list"`
- `WebhooksListItem`: `data-testid="webhook-item"`
- `WebhookDetails`: `data-testid="webhook-details"`
- Skeletons: `data-testid="webhooks-skeleton"`, `data-testid="webhook-details-skeleton"`

- [ ] **Step 3: Commit fixes**

```bash
git add apps/web/src/components/
git commit -m "test(web): add data-testid for e2e test selectors"
```

---

## Dependencies

- `@playwright/test` - Test runner
- Chromium browser (installed via `pnpm playwright install`)

## Notes

1. Tests require both frontend dev server AND API running
2. Consider using MSW for API mocking in CI
3. `data-testid` attributes improve test stability over CSS selectors
4. Page objects encapsulate selectors and reduce test duplication