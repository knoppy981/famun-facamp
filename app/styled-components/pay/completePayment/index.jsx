import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Outlet } from '@remix-run/react'

import * as S from "./elements"

const stripePromise = loadStripe("pk_test_51Lwc6CG8QBKHSgkGKn1eEavFX2wS75qcPXAhIf6a1FKhiTb3En4rlawvC5xohEmhIzvWn4C8gw3FcV2N59V7CKll00YmZnlrcw")

const CompletePayment = ({ paymentIntent, payments, price }) => {
  console.log(payments)
  return (
    <div>
      <S.Title>
        Finalizar Pagamento
      </S.Title>

      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntent.client_secret }}
      >
        <Outlet context={{ payments, price }} />
      </Elements>
    </div>
  )
}

export default CompletePayment