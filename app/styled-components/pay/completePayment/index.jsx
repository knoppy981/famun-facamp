import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from "react"

import * as S from "./elements"
import Spinner from "~/styled-components/components/spinner"

const stripePromise = loadStripe("pk_test_51Lwc6CG8QBKHSgkGKn1eEavFX2wS75qcPXAhIf6a1FKhiTb3En4rlawvC5xohEmhIzvWn4C8gw3FcV2N59V7CKll00YmZnlrcw")

const PaymentForm = ({ WEBSITE_URL }) => {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${WEBSITE_URL}/dashboard/payment`
      }
    })
    setIsSubmitting(false)
  }

  return (
    <>
      <PaymentElement />

      <S.PayButtonContainer>
        <S.PayButton onClick={handleSubmit}>
          Realizar Pagamento {isSubmitting && <Spinner dim={18}/>}
        </S.PayButton>
      </S.PayButtonContainer>
    </>
  )
}

const CompletePayment = ({ paymentIntent, payments, price, WEBSITE_URL }) => {
  return (
    <S.Wrapper>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntent.client_secret }}
      >
        <S.Title>
          Finalizar Pagamento
        </S.Title>

        <S.Price>
          R$ {" "} {(price / 100).toLocaleString('de-DE')},00
        </S.Price>

        <PaymentForm WEBSITE_URL={WEBSITE_URL} />
      </Elements>
    </S.Wrapper>
  )
}

export default CompletePayment