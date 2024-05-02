import Stripe from "stripe";
import { updateUsersPaymentStatus, updateUserPayments, getUserPaymentsIds, getPaidUsers } from "./models/payments.server";
import qs from "qs"

import { getUserByCustomerId, getUserById, type UserType } from '~/models/user.server';
import { sendEmail } from "./nodemailer.server";
import { paymentCompletedEmail } from "./lib/emails";
import { DelegationType } from "./models/delegation.server";

if (typeof process.env.STRIPE_SECRET_KEY === 'undefined') {
  throw new Error('stripe secret key is not defined in the environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function getPaymentIntentById(paymentIntentId: Stripe.PaymentIntent["id"]) {
  return stripe.paymentIntents.retrieve(
    paymentIntentId
  );
}

export async function getPaymentsIntentByCustomerId(customerId: UserType["stripeCustomerId"]): Promise<Stripe.ApiListPromise<Stripe.PaymentIntent>> {

  if (customerId === null) {
    throw new Error(`Error loading payments id`)
  }

  return stripe.paymentIntents.list({ customer: customerId })
}

export async function cancelPaymentIntentById(id: string) {
  return stripe.paymentIntents.cancel(id)
}

export async function getChargesByCustomerId(customerId: UserType["stripeCustomerId"]): Promise<Stripe.ApiListPromise<Stripe.Charge> | undefined> {

  if (customerId === null) {
    return
  }

  return stripe.charges.list({ customer: customerId })
}

export async function getTransactionsByUserId(userId: UserType["id"]) {
  return stripe.paymentIntents.search({
    query: `status:\'succeeded\' AND metadata[\'payerId\']:\'${userId}\'`,
  });
}

export async function createPaymentIntent({
  price,
  userId,
  email,
  stripeCustomerId,
  payments,
  currency
}: {
  price: number; userId: UserType["id"]; email: UserType["email"]; stripeCustomerId: Stripe.Customer["id"],
  payments: {
    id: string;
    name: string;
    price: number;
    currency: string;
    type: "delegate" | "advisor";
    available: boolean;
    expiresAt: Date;
    expired: boolean;
  }[],
  currency: string
}) {
  return stripe.paymentIntents.create({
    customer: stripeCustomerId,
    amount: price,
    receipt_email: email,
    currency: currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      data: qs.stringify({
        payerId: userId,
        payments: payments.map(p => ({ amount: p.price, currency: p.currency, userId: p.id })),
      }),
    },
  });
}

export async function getDelegationCharges(delegation: DelegationType) {
  let query = ""
  let count = 0
  delegation.participants?.map(participant => participant?.stripeCustomerId)?.forEach((customerId, index) => {
    if (customerId !== null) {
      query += `${count !== 0 ? " OR " : ""}customer:"${customerId}"`
      count += 1
    }
  })

  if (query === "") return

  return stripe.charges.search({
    query,
    limit: 30,
  });
}

export async function handleWebHook(request: Request) {
  // stripe listen --forward-to localhost:3000/api/stripewebhook

  const payload = await request.text()
  const sig: any = request.headers.get("stripe-signature")
  let event

  if (typeof process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET === 'undefined') {
    throw new Error('stripe webhook secret is not defined in the environment variables');
  }

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
    ) as Stripe.Event;
  } catch (err: any) {
    console.log(err);
    return new Response(JSON.stringify({ errors: { message: err.message } }), { status: err.statusCode });
  }
  console.log(event.type)

  if (event.type == 'payment_intent.created') {
  }

  if (event.type == 'charge.succeeded') {
  }

  if (event.type === 'payment_intent.succeeded') {
    const { id, metadata } = event.data.object

    const parsed = qs.parse(metadata.data) as {
      payerId: string,
      payments: {
        amount: string,
        currency: string,
        userId: string
      }[]
    }

    const paidUsersIds = parsed.payments.map(item => item.userId)
    const user = await getUserById(parsed.payerId)
    const paidUsers = await getPaidUsers(paidUsersIds)

    if (!user) return

    await updateUsersPaymentStatus(parsed.payments)
    await updateUserPayments(parsed.payerId, id)

    const info = await sendEmail({
      to: user.email,
      subject: `FAMUN ${new Date().getFullYear()}: Pagamento confirmado`,
      html: paymentCompletedEmail(user.name, paidUsers, new Date(event.data.object.created * 1000).toLocaleDateString("pt-BR"))
    })
  }

  return {}
}