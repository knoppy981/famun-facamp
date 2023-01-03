import { Form, useOutletContext } from "@remix-run/react"
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

import * as S from '~/styled-components/pay/index'
import { useUser } from "~/utils"

const index = () => {

  const { payments, price } = useOutletContext()

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
    <S.Wrapper>
      <PaymentElement />

      <S.Container>
        <S.PaymentListTitle>
          Pagamentos
        </S.PaymentListTitle>

        <S.PaymentList>

          {payments?.map((item, index) => (
            <S.Payment key={`confirm-payment-${index}`}>
              <S.PaymentName>{item.type === 'user' ? `Taxa de inscrição do ${item.name}` : `Taxa de inscrição da Delegação`}</S.PaymentName>
              <S.PaymentPrice color="green">R$ {" "} {item.price / 100},00</S.PaymentPrice>
            </S.Payment>
          ))}

        </S.PaymentList>

        <S.CheckoutLine>
          <S.PayButton onClick={handleSubmit}>
            Pagar
          </S.PayButton>

          <S.TotalPrice>
            R$ {" "} {price / 100},00
          </S.TotalPrice>
        </S.CheckoutLine>
      </S.Container>
    </S.Wrapper>
  )
}

export default index