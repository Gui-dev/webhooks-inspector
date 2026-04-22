import { expect, test } from '@playwright/test'
import { WebhookDetailsPage } from './page-objects/webhook-details.page'
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
    await expect(page.getByTestId('webhooks-skeleton')).not.toBeVisible()
    await expect(webhooksList.webhooks).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates to webhook details on click', async ({ page }) => {
    const webhooksList = new WebhooksListPage(page)
    await webhooksList.goto()

    await expect(webhooksList.webhooks).toBeVisible()

    const firstWebhook = webhooksList.webhookItems.first()
    await firstWebhook.click()

    await expect(page).toHaveURL(/\/webhooks\/.+/)
  })
})

test.describe('Webhook Details', () => {
  test('shows skeleton while loading', async ({ page }) => {
    await page.goto('/webhooks/test-id')
    await expect(page.getByTestId('webhook-details-skeleton')).toBeVisible()
  })

  test('displays webhook details', async ({ page }) => {
    await page.goto('/webhooks/test-id')
    await expect(page.getByTestId('webhook-details-skeleton')).not.toBeVisible()
    await expect(page.getByTestId('webhook-method')).toBeVisible()
  })

  test('delete button is visible', async ({ page }) => {
    const detailsPage = new WebhookDetailsPage(page)
    await detailsPage.goto('test-webhook-id')

    await detailsPage.expectLoaded()
    await expect(detailsPage.deleteButton).toBeVisible()
  })
})
