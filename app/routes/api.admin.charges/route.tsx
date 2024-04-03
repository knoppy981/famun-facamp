// get participants by id
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { getChargesByCustomerId, getPaymentIntentById } from "~/stripe.server"
import Stripe from "stripe"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  let stripeCustomerId = url.searchParams.get("stripeCustomerId")
  let stripePaidId = url.searchParams.get("stripePaidId")

  const paymentsList: {
    amount: number,
    currency: string,
    status: Stripe.Charge.Status,
    metadata: Stripe.Metadata,
    created: number,
    receiptUrl: string | null,
    paymentMethod: string | undefined
  }[] = []
  let paymentIntent: Stripe.PaymentIntent | null = null

  try {
    const operations = [];

    if (stripeCustomerId) {
      operations.push((async () => {
        const charges = await getChargesByCustomerId(stripeCustomerId)
        charges?.data.forEach((ch) => {
          paymentsList.push({
            amount: ch.amount,
            currency: ch.currency,
            status: ch.status,
            metadata: ch.metadata,
            created: ch.created,
            receiptUrl: ch.receipt_url,
            paymentMethod: ch.payment_method_details?.type,
          });
        });
        return
      })());
    }

    if (stripePaidId) {
      operations.push((async () => {
        paymentIntent = stripePaidId ? await getPaymentIntentById(stripePaidId) : null
        return
      })());
    }

    await Promise.all(operations);
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteCommittee: "Failed searching users" } },
      { status: 400 }
    )
  }

  return json({ paymentsList, paymentIntent })
}