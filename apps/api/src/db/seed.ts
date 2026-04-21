import { faker } from '@faker-js/faker'
import { db } from './index.js'
import { webhooks } from './schema/webhooks.js'

const STRIPE_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.processing',
  'payment_intent.canceled',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.payment_pending',
  'invoice.finalized',
  'invoice.opened',
  'invoice.voided',
  'invoice.deleted',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'charge.refunded',
  'charge.refund.updated',
  'charge.captured',
  'charge.expired',
  'charge.failed',
  'charge.pending',
  'charge.succeeded',
  'checkout.session.completed',
  'checkout.session.expired',
  'checkout.session.async_payment_failed',
  'checkout.session.async_payment_succeeded',
  'account.updated',
  'account.application.authorized',
  'account.application.deauthorized',
  'account.application.dragged',
  'dispute.created',
  'dispute.updated',
  'dispute.closed',
  'payout.paid',
  'payout.failed',
  'payout.created',
  'payout.updated',
  'coupon.created',
  'coupon.deleted',
  'coupon.updated',
  'promotion_code.created',
  'promotion_code.deleted',
  'promotion_code.updated',
  'customer.created',
  'customer.updated',
  'customer.deleted',
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'billing_portal.session.created',
  'radar.early_fraud_warning.created',
  'radar.early_fraud_warning.updated',
  'setup_intent.succeeded',
  'setup_intent.setup_failed',
  'subscription_schedule.created',
  'subscription_schedule.updated',
  'subscription_schedule.canceled',
  'terminal.reader.updated',
  'terminal.reader.action_failed',
  'topup.succeeded',
  'topup.failed',
] as const

type StripeEvent = (typeof STRIPE_EVENTS)[number]

function generateStripePayload(eventType: StripeEvent, customerId: string) {
  const id = `evt_${faker.string.alphanumeric(24)}`
  const object = {
    id,
    object: 'event',
    type: eventType,
    created: Date.now(),
    data: {
      object: generateEventData(eventType, customerId),
    },
  }
  return JSON.stringify(object)
}

function generateEventData(eventType: StripeEvent, customerId: string) {
  switch (true) {
    case eventType.startsWith('payment_intent'):
      return {
        id: `pi_${faker.string.alphanumeric(24)}`,
        object: 'payment_intent',
        amount: faker.number.int({ min: 100, max: 999900 }),
        currency: 'usd',
        status: eventType.includes('succeeded')
          ? 'succeeded'
          : eventType.includes('failed')
            ? 'failed'
            : eventType.includes('processing')
              ? 'processing'
              : 'canceled',
        customer: customerId,
      }
    case eventType.startsWith('invoice'):
      return {
        id: `in_${faker.string.alphanumeric(24)}`,
        object: 'invoice',
        number: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
        amount_due: faker.number.int({ min: 100, max: 99900 }),
        amount_paid: faker.number.int({ min: 0, max: 99900 }),
        status: eventType.includes('paid')
          ? 'paid'
          : eventType.includes('failed')
            ? 'payment_failed'
            : eventType.includes('voided')
              ? 'void'
              : 'open',
        customer: customerId,
      }
    case eventType.startsWith('customer'):
      return {
        id: customerId,
        object: 'customer',
        email: faker.internet.email(),
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      }
    case eventType.startsWith('charge'):
      return {
        id: `ch_${faker.string.alphanumeric(24)}`,
        object: 'charge',
        amount: faker.number.int({ min: 100, max: 999900 }),
        currency: 'usd',
        status: eventType.includes('succeeded')
          ? 'succeeded'
          : eventType.includes('failed')
            ? 'failed'
            : eventType.includes('pending')
              ? 'pending'
              : 'expired',
        customer: customerId,
      }
    case eventType.startsWith('checkout'):
      return {
        id: `cs_${faker.string.alphanumeric(24)}`,
        object: 'checkout.session',
        payment_status: eventType.includes('completed')
          ? 'paid'
          : eventType.includes('failed')
            ? 'unpaid'
            : 'unpaid',
        status: eventType.includes('completed')
          ? 'complete'
          : eventType.includes('expired')
            ? 'expired'
            : 'open',
        customer: customerId,
      }
    case eventType.startsWith('subscription'):
      return {
        id: `sub_${faker.string.alphanumeric(24)}`,
        object: 'subscription',
        status: eventType.includes('created')
          ? 'active'
          : eventType.includes('updated')
            ? 'active'
            : eventType.includes('deleted')
              ? 'canceled'
              : eventType.includes('paused')
                ? 'paused'
                : 'active',
        current_period_end:
          Math.floor(Date.now() / 1000) + faker.number.int({ min: 86400, max: 2592000 }),
        customer: customerId,
      }
    case eventType.startsWith('dispute'):
      return {
        id: `dp_${faker.string.alphanumeric(24)}`,
        object: 'dispute',
        status: eventType.includes('created')
          ? 'needs_response'
          : eventType.includes('closed')
            ? 'won'
            : 'needs_response',
        reason: faker.helpers.arrayElement([
          'duplicate',
          'fraudulent',
          'subscription_canceled',
          'product_not_received',
        ]),
        charge: `ch_${faker.string.alphanumeric(24)}`,
      }
    case eventType.startsWith('payout'):
      return {
        id: `po_${faker.string.alphanumeric(24)}`,
        object: 'payout',
        amount: faker.number.int({ min: 1000, max: 99900 }),
        currency: 'usd',
        status: eventType.includes('paid')
          ? 'paid'
          : eventType.includes('failed')
            ? 'failed'
            : 'pending',
      }
    default:
      return {
        id: `evt_${faker.string.alphanumeric(24)}`,
        object: 'event',
        type: eventType,
      }
  }
}

async function seed() {
  console.log('🌱 Seeding database...')

  const webhookData = Array.from({ length: 60 }, () => {
    const eventType = faker.helpers.arrayElement(STRIPE_EVENTS)
    const customerId = `cus_${faker.string.alphanumeric(14)}`
    const payload = generateStripePayload(eventType, customerId)

    return {
      method: 'POST',
      ip: faker.internet.ipv4(),
      pathname: '/webhooks/stripe',
      statusCode: 200,
      contentType: 'application/json',
      contentLength: payload.length,
      queryParams: { type: eventType } as Record<string, string>,
      headers: {
        'content-type': 'application/json',
        'stripe-signature': faker.string.alphanumeric(64),
        'user-agent': 'Stripe/1.0',
      } as Record<string, string>,
      body: payload,
    }
  })

  await db.insert(webhooks).values(webhookData)

  console.log(`✅ Seeded ${webhookData.length} webhooks`)
}

seed()
  .catch(console.error)
  .finally(() => process.exit())
