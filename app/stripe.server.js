import Stripe from "stripe";
import { updateUsersPaymentStatus, updateUserPayments, getUserPaymentsIds } from "./models/payments.server";
import qs from "qs"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function getUserPayments(userId) {
  const { stripePaymentsId } = await getUserPaymentsIds(userId)

  return Promise.all(stripePaymentsId.map((id) => stripe.paymentIntents.retrieve(id)))
    .then((paymentIntents) => {
      return paymentIntents
    })
    .catch((error) => {
      return error
    });
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
  usersIdsThatWillBePaid
}) {
  return stripe.paymentIntents.create({
    customer: stripeCustomerId,
    amount: price,
    currency: 'brl',
    payment_method_types: ['card'],
    metadata: {
      payerId: userId,
      paidUsersIds: qs.stringify(usersIdsThatWillBePaid),
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
  }

  if (event.type === 'payment_intent.succeeded') {
    const { id, metadata } = event.data.object

    console.log(metadata)

    const parsed = qs.parse(metadata.paidUsersIds)
    const paidUsersIds = Object.values(parsed)
    console.log(event)
    console.log(paidUsersIds)

    await updateUsersPaymentStatus({ paidUsersIds, stripePaymentId: id })
    await updateUserPayments({ userId: metadata.payerId, stripePaymentId: id })
  }

  console.log('\n')

  return {}
}