import Stripe from "stripe";
import { updateUsersPaymentStatus, updateUserPayments, getUserPaymentsIds, getPaidUsers } from "./models/payments.server";
import qs from "qs"

import { getUserById, type UserType } from '~/models/user.server';
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

  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0)
  const timestampStartOfYearInSeconds = Math.floor(startOfYear.getTime() / 1000)

  return stripe.paymentIntents.list({ customer: customerId, created: { gte: timestampStartOfYearInSeconds } })
}

export async function getChargesByCustomerId(customerId: UserType["stripeCustomerId"]): Promise<Stripe.ApiListPromise<Stripe.Charge> | undefined> {

  if (customerId === null) {
    return
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0)
  const timestampStartOfYearInSeconds = Math.floor(startOfYear.getTime() / 1000)

  return stripe.charges.list({ customer: customerId, created: { gte: timestampStartOfYearInSeconds } })
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
  const metadata: any = {
    payerId: userId,
  }

  payments.forEach((p, i) => {
    metadata[i] = qs.stringify({ amount: p.price, currency: p.currency, userId: p.id })
  })

  console.log(metadata)

  return stripe.paymentIntents.create({
    customer: stripeCustomerId,
    amount: price,
    receipt_email: email,
    currency: currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
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

    function parseObjectValues(obj: any) {
      const parsedArray: {
        amount: string,
        currency: string,
        userId: string
      }[] = [];

      for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== "payerId") {
          const decoded = decodeURIComponent(obj[key]);

          parsedArray.push(qs.parse(decoded) as any);
        }
      }

      return parsedArray;
    }

    const data = parseObjectValues(metadata)

    const paidUsersIds = data.map(item => item.userId)
    const user = await getUserById(metadata.payerId)
    const paidUsers = await getPaidUsers(paidUsersIds)

    if (!user) return

    await updateUsersPaymentStatus(data)
    await updateUserPayments(metadata.payerId, id)

    const info = await sendEmail({
      to: user.email,
      subject: `FAMUN ${new Date().getFullYear()}: Pagamento confirmado`,
      html: paymentCompletedEmail(user.name, paidUsers, new Date(event.data.object.created * 1000).toLocaleDateString("pt-BR"))
    })
  }

  return {}
}

export default stripe