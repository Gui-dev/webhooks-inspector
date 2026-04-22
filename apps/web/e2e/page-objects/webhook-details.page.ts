import { expect, type Locator, type Page } from '@playwright/test'

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
