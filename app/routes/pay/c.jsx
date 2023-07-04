import { Link, useActionData, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { useState } from "react"
import { json } from '@remix-run/node'
import qs from 'qs'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { createPaymentIntent } from '~/stripe.server'
import { requireDelegationId } from "~/session.server"
import { getUserById } from "~/models/user.server"
import { getRequiredPayments } from "~/models/payments.server"

import * as S from '~/styled-components/pay'
import Spinner from "~/styled-components/components/spinner"

const stripePromise = loadStripe("pk_test_51Lwc6CG8QBKHSgkGKn1eEavFX2wS75qcPXAhIf6a1FKhiTb3En4rlawvC5xohEmhIzvWn4C8gw3FcV2N59V7CKll00YmZnlrcw")

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  //get the user Id to register which user is paying
  const userId = url.searchParams.get("userId");
  // stripe customer Id
  const stripeCustomerId = url.searchParams.get("stripeCustomerId");
  // get all user names that were selected to be paid
  const namesForPayments = url.searchParams.getAll("s");

  // now filter all the payments in of the delegation by the names the user selected
  const user = await getUserById(userId)
  const delegationId = await requireDelegationId(request)
  let payments = await getRequiredPayments({ user, delegationId: delegationId })
  payments = payments.filter(payment => namesForPayments.includes(payment.name))
  // get the payments data

  // get only the paid users ids if it is available
  const paidUsersIds = payments
    .filter(payment => payment.available === true)
    .map(payment => payment.id);

  // get the total price for the payment intent
  const price = payments.reduce((sum, item) => {
    if (item.available) {
      return sum + item.price;
    }
    return sum;
  }, 0);

  // create the payment intent
  const paymentIntent = await createPaymentIntent({ price, userId, stripeCustomerId, paidUsersIds })

  // if there is no payment intent throw an error
  if (paymentIntent === undefined)
    return json({
      errors: { paymentIntent: "Failed to load payment intent" },
      status: 400
    })

  // return payment intent and the price
  return json({ paymentIntent, price, payments })
}

const CompletePayment = () => {

  const { paymentIntent, price, payments } = useLoaderData()
  const { WEBSITE_URL } = useOutletContext()

  const delegatesPaymentsCount = payments.reduce((totalCount, payment) => {
    if (payment.type === "delegate") {
      return totalCount + 1;
    }
    return totalCount;
  }, 0);

  const advisorPaymentsCount = payments.reduce((totalCount, payment) => {
    if (payment.type === "advisor") {
      return totalCount + 1;
    }
    return totalCount;
  }, 0);

  const paymentNames = payments
    .map(payment => payment.name);

  return (
    <S.PaymentWrapper>
      <S.TitleBox>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <S.AuxDiv>
          <S.ArrowIconBox />

          <S.SubTitle>
            Payments
          </S.SubTitle>
        </S.AuxDiv>
      </S.TitleBox>

      <S.Container>
        <S.PageTitle>
          Finalizar Pagamento
        </S.PageTitle>

        <S.PaymentCountList>
          {delegatesPaymentsCount > 0 ?
            <S.PaymentsCount>
              {delegatesPaymentsCount}x inscrições de Delegados
            </S.PaymentsCount> :
            null}

          {advisorPaymentsCount > 0 ?
            <S.PaymentsCount>
              {advisorPaymentsCount}x inscrições de Orientadores
            </S.PaymentsCount> :
            null}
        </S.PaymentCountList>

        <S.Price>
          R$ {" "} {(price / 100).toLocaleString('de-DE')},00
        </S.Price>

        <S.StripeElementsWrapper>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: paymentIntent.client_secret }}
          >
            {paymentIntent !== undefined ?
              <PaymentForm
                WEBSITE_URL={WEBSITE_URL}
                paymentNames={paymentNames}
              /> :
              null
            }
          </Elements>
        </S.StripeElementsWrapper>
      </S.Container>
    </S.PaymentWrapper>
  )
}

const PaymentForm = ({ WEBSITE_URL, paymentNames }) => {

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

  const goBackParams = new URLSearchParams();
  paymentNames.forEach(names => {
    goBackParams.append('s', names);
  });

  return (
    <>
      <PaymentElement />

      <S.PayButtonContainer>
        <S.GoBackLink
          to={`/pay/s?${goBackParams}`}
        >
          Voltar
        </S.GoBackLink>

        <S.Button onClick={handleSubmit}>
          Realizar Pagamento {isSubmitting && <Spinner dim={18} />}
        </S.Button>
      </S.PayButtonContainer>
    </>
  )
}

export default CompletePayment