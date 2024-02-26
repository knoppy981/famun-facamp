import Stripe from "stripe";
import { updateUsersPaymentStatus, updateUserPayments, getUserPaymentsIds, getPaidUsersIds } from "./models/payments.server";
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

export async function getPaymentsIntentByCustomerId(customerId: UserType["stripeCustomerId"]):
  Promise<Stripe.ApiListPromise<Stripe.PaymentIntent>> {

  if (customerId === null) {
    throw new Error(`Error loading payments id`)
  }

  return stripe.paymentIntents.list({ customer: customerId })
}

export async function getChargesByCustomerId(customerId: UserType["stripeCustomerId"]):
  Promise<Stripe.ApiListPromise<Stripe.Charge>> {

  if (customerId === null) {
    throw new Error(`Error loading payments id`)
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
  stripeCustomerId,
  usersIdsThatWillBePaid,
  currency
}: {
  price: number; userId: UserType["id"]; stripeCustomerId: Stripe.Customer["id"], usersIdsThatWillBePaid: Array<string>, currency: string
}) {
  return stripe.paymentIntents.create({
    customer: stripeCustomerId,
    amount: price,
    currency: currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      payerId: userId,
      paidUsersIds: qs.stringify(usersIdsThatWillBePaid),
    },
  });
}

export async function getDelegationCharges(delegation: DelegationType) {
  let query = ""
  delegation.participants?.map(participant => participant?.stripeCustomerId)?.forEach((customerId, index) => {
    if (customerId !== null) {
      query += `${index !== 0 ? " OR " : ""}customer:"${customerId}"`
    }
  })

  if (query === "") return

  return stripe.charges.search({
    query
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

    const parsed = qs.parse(metadata.paidUsersIds)
    const paidUsersIds: Array<string> = Object.values(parsed).filter((value): value is string => typeof value === 'string');

    const user = await getUserById(metadata.payerId)
    const paidUsers = await getPaidUsersIds(paidUsersIds)

    if (!user) return

    await updateUsersPaymentStatus({ paidUsersIds, stripePaymentId: id })
    await updateUserPayments({ userId: metadata.payerId, stripePaymentId: id })

    console.log("\n")
    console.log("sending email !!!!!!!!")
    console.log("\n")

    const info = await sendEmail({
      to: user.email,
      subject: "Pagamento Confirmado!",
      html: paymentCompletedEmail(user as UserType, paidUsers as UserType[], event.data.object?.charges?.data[0].receipt_url as string, new Date(event.data.object.created * 1000).toLocaleDateString("pt-BR"))
    })
  }

  return {}
}