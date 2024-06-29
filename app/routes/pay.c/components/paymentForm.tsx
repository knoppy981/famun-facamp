import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Stripe, StripeElements } from '@stripe/stripe-js'
import React from 'react'
import Button from '~/components/button'
import Link from '~/components/link'
import Spinner from '~/components/spinner'

const PaymentForm = ({ WEBSITE_URL, paymentNames }: { WEBSITE_URL: string, paymentNames: string[] | undefined }) => {

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const stripe = useStripe() as Stripe
  const elements = useElements() as StripeElements

  const handleSubmit = async (e: any) => {
    const searchParams = new URLSearchParams([["stripe", "paymentCompleted"]]);

    setIsSubmitting(true);
    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${WEBSITE_URL}/dashboard/payments/completed`
      }
    })
    setIsSubmitting(false)
  }

  const goBackParams = new URLSearchParams();
  paymentNames?.forEach(names => {
    goBackParams.append('s', names);
  });

  return (
    <>
      <PaymentElement />

      <div className='pay-confirm-payments-button-container'>
        <Link
          to={`/pay/s?${goBackParams}`}
        >
          Voltar
        </Link>

        <Button className='primary-button-box' onPress={handleSubmit}>
          Realizar Pagamento {isSubmitting && <Spinner dim="18px" />}
        </Button>
      </div>
    </>
  )
}
export default PaymentForm
