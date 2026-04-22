import { expect, type Locator, type Page } from '@playwright/test'

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
    await this.webhookItems.filter({ has: this.page.getByText(id) }).click()
  }
}
