import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useLoaderData } from '@remix-run/react'
import { Outlet } from '@remix-run/react'

import { createPaymentIntent } from '~/models/payments'

const stripePromise = loadStripe("pk_test_51L58wIJJYWRor6C30b1RIpW4RWVGpjUNlFZYif6YAgODWzParVCSxfmbpLlR68oGMKfgHZZyrB9cGFuUNaj6vvPk00CxBuyZlX")

export const loader = async ({request}) => {
  return await createPaymentIntent()
}

const Pay = () => {

  const paymentIntent = useLoaderData()

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: paymentIntent.client_secret }}
    >
      <Outlet />
    </Elements>
  )
}

export default Pay