import Stripe from "stripe";
import { updateDelegationPaymentStatus, updateUsersPaymentStatus } from "./models/payments.server";
import qs from "qs"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function getAllTransactions() {
  return stripe.paymentIntents.search({ query: 'status:\'succeeded\'' })
}

export async function getTransactionsByUserId(userId) {
  return stripe.paymentIntents.search({
    query: `status:\'succeeded\' AND metadata[\'payerId\']:\'${userId}\'`,
  });
}

export async function createPaymentIntent({
  price,
  userId,
  stripeCustomerId,
  delegationId,
  paidUsersIds
}) {
  return stripe.paymentIntents.create({
    customer: stripeCustomerId,
    amount: price,
    currency: 'brl',
    payment_method_types: ['card'],
    metadata: {
      payerId: userId,
      paidUsersIds: qs.stringify(paidUsersIds),
      delegationId: delegationId ?? ""
    },
  });
}

export async function handleWebHook(request) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature")
  let event
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
    );
  } catch (err) {
    console.log(err);
    return new Response({ errors: { message: err.message } }, { status: 400 });
  }
  console.log(event.type)

  if (event.type == 'payment_intent.created') {
  }

  if (event.type == 'charge.succeeded') {
    const { id, metadata } = event.data.object
    const parsed = qs.parse(metadata.paidUsersIds)
    const paidUsersIds = Object.values(parsed)
    console.log(id)

    if (paidUsersIds.length > 0) 
      await updateUsersPaymentStatus({ 
        paidUsersIds: paidUsersIds, 
        stripePaymentId: id 
      })

    if (metadata.delegationId) 
      await updateDelegationPaymentStatus({ 
        delegationId: metadata.delegationId, 
        stripePaymentId: id 
      })
  }

  console.log('\n')

  return {}
}