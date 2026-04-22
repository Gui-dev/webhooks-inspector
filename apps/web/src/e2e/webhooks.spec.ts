import { expect, test } from '@playwright/test'

test.describe('Webhooks List', () => {
  test('displays page heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /webhooks/i })).toBeVisible()
  })

  test('shows loading state while fetching', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('webhooks-skeleton')).toBeVisible()
  })

  test('displays webhooks after load', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('webhooks-skeleton')).not.toBeVisible()
    await expect(page.getByTestId('webhooks-list')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates to webhook details on click', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('webhooks-list')).toBeVisible()

    const firstWebhook = page.getByTestId('webhook-item').first()
    await firstWebhook.click()

    await expect(page).toHaveURL(/\/webhooks\/.+/)
  })
})

test.describe('Webhook Details', () => {
  test('shows skeleton while loading', async ({ page }) => {
    await page.goto('/webhooks/test-id')
    await expect(page.getByTestId('webhook-details-skeleton')).toBeVisible()
  })

  test('displays details for valid webhook from list', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('webhooks-list')).toBeVisible()

    const firstWebhook = page.getByTestId('webhook-item').first()
    await firstWebhook.click()

    await expect(page).toHaveURL(/\/webhooks\/.+/)
    await expect(page.getByTestId('webhook-method')).toBeVisible({ timeout: 10000 })
  })

  test('shows method and pathname in header', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('webhooks-list')).toBeVisible()

    const firstWebhook = page.getByTestId('webhook-item').first()
    await firstWebhook.click()

    await expect(page.getByTestId('webhook-method')).toBeVisible()
    await expect(page.getByTestId('webhook-pathname')).toBeVisible()
  })
})
