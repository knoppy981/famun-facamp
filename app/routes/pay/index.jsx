import { Form } from "@remix-run/react"
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

import * as S from '~/styled-components/pay'
import { useUser } from "~/utils"

const index = () => {

  const user = useUser()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(elements)

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/dashboard/payment'
      }
    })
  }

  return (
    <S.FormContainer onSubmit={handleSubmit}>
      <S.PaymentDescBox>
        <S.PaymentDesc>
          Taxa de inscrição do {user.name}
        </S.PaymentDesc>

        <S.PaymentPrice>
          RS 45,00
        </S.PaymentPrice>
      </S.PaymentDescBox>

      <S.PaymentElementContainer>
        <PaymentElement />
      </S.PaymentElementContainer>

      <S.ConfirmPaymentButton>
        Pay
      </S.ConfirmPaymentButton>
    </S.FormContainer>
  )
}

export default index