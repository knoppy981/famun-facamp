import React from "react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadStripe } from "@stripe/stripe-js";

import { getRequiredPayments } from "~/models/payments.server";
import { requireDelegationId, requireUser } from "~/session.server";
import { createPaymentIntent } from "~/stripe.server";
import { usePaymentsData } from "./usePaymentsData";
import { getCurrentLocale } from "~/hooks/useCurrentLocale";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./form";
import { checkCuponCode } from "~/models/configuration.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  // get all user names that were selected to be paid
  const namesForPayments = url.searchParams.getAll("s");
  const coupon = url.searchParams.get("coupon");

  const user = await requireUser(request)
  const delegationId = await requireDelegationId(request)
  let payments = await getRequiredPayments({ userId: user.id, isLeader: user.leader, delegationId: delegationId })

  // with the array of available payments, select the Id for the users that are gonna get their payment paid
  payments = payments?.filter(payment => namesForPayments.includes(payment.name) && payment.available && !payment.expired)

  if (payments?.length === 0 || payments === undefined) return redirect("/pay/s")
  const isCouponValid = await checkCuponCode(coupon as string, user.participationMethod)

  // get the total price
  const price = payments.reduce((sum, item) => {
    if (item.available) {
      return isCouponValid ? sum + item.price / 2 : sum + item.price;
    }
    return sum;
  }, 0) as number;

  // create the payment intent
  let paymentIntent
  try {
    paymentIntent = await createPaymentIntent(
      { price, userId: user.id, email: user.email, stripeCustomerId: user.stripeCustomerId as string, payments, currency: payments[0].currency }
    )
  } catch (error) {
    console.log(error)
    throw json({
      errors: { paymentIntent: "Failed to load payment intent" },
      status: 400
    })
  }

  // return payment intent and the price
  return json({ paymentIntent, price, payments, WEBSITE_URL: process.env.WEBSITE_URL, STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY as string })
}

const CompletePayments = () => {
  const { paymentIntent, price, payments, WEBSITE_URL, STRIPE_PUBLIC_KEY } = useLoaderData<typeof loader>()
  const [stripePromise, setStripePromise] = React.useState(() => loadStripe(STRIPE_PUBLIC_KEY))
  const [delegatesPaymentsCount, advisorPaymentsCount, paymentNames] = usePaymentsData(payments)
  const locale = getCurrentLocale()

  return (
    <div className='auth-container' style={{ gap: "15px" }}>
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <h2 className='join-title'>
        Finalizar pagamento
      </h2>

      <ul className="pay-confirm-payments-list">
        {delegatesPaymentsCount ?
          <li className="pay-confirm-payments-list-item">
            {delegatesPaymentsCount}x inscrições de Delegados
          </li> :
          null
        }

        {advisorPaymentsCount ?
          <li className="pay-confirm-payments-list-item">
            {advisorPaymentsCount}x inscrições de Orientadores
          </li> :
          null
        }
      </ul>

      <div className='pay-price' style={{ margin: 0 }}>
        {(price / 100).toLocaleString(locale, { style: "currency", currency: paymentIntent.currency })}
      </div>

      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntent.client_secret as string }}
      >
        {paymentIntent !== undefined ?
          <PaymentForm
            WEBSITE_URL={WEBSITE_URL as string}
            paymentNames={paymentNames}
          /> :
          null
        }
      </Elements>
    </div>
  )
}

export default CompletePayments