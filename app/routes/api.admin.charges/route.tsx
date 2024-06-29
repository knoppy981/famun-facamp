// get participants by id
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { getChargesByCustomerId } from "~/stripe.server"
import Stripe from "stripe"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  let stripeCustomerId = url.searchParams.get("stripeCustomerId")

  const paymentsList: {
    amount: number,
    currency: string,
    status: Stripe.Charge.Status,
    metadata: Stripe.Metadata,
    created: number,
    receiptUrl: string | null,
    paymentMethod: string | undefined
  }[] = []

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

    await Promise.all(operations);
  } catch (error) {
    console.log(error)
    return json(
      { errors: { error: "Failed searching users" } },
      { status: 400 }
    )
  }

  return json({ paymentsList })
}