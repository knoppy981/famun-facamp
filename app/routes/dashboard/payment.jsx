import { useState } from 'react'
import { json } from '@remix-run/node'
import { useLoaderData, useCatch, useMatches } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import invariant from 'tiny-invariant';
import qs from "qs"

import { getDelegationId, requireUserId } from '~/session.server'
import { getRequiredPayments } from '~/models/payments.server'
import { getTransactionsByUserId } from '~/stripe.server'
import { safeRedirect, useUser, useUserType } from '~/utils'

import * as S from '~/styled-components/dashboard/payment'
import * as E from '~/styled-components/error'
import { FiCreditCard, FiExternalLink } from 'react-icons/fi'

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ errors: { delegationId: "You have to join a delegation in order to proceed to the payment" } }, { status: 404 });

  const payments = await getRequiredPayments({ userId, delegationId })
  const { data } = await getTransactionsByUserId(userId)
  data.forEach((el, index) => {
    const { amount, status, metadata, created, charges } = el
    const { payment_method_details, receipt_url } = charges.data[0]
    data[index] = { amount, status, metadata, created, receipt_url, type: payment_method_details.type }
  })
  console.log(data)

  return json({ payments, userPaymentsIntents: data })
}

const payment = () => {

  const user = useUser()
  const userType = useUserType()

  const { payments, userPaymentsIntents } = useLoaderData()

  const [menu, setMenu] = useState(payments.find(el => el.available) ? "pending" : "payments")


  return (
    <S.Wrapper>
      <S.Title>
        Pagamentos
      </S.Title>

      <S.Menu>
        <S.MenuItem active={menu === "pending"} onClick={() => setMenu("pending")} >
          {/* Pagamentos  */}Pendentes
          {menu === "pending" ? <S.UnderLine layoutId="paymentPageUnderLine" /> : null}
        </S.MenuItem>

        <S.MenuItem active={menu === "payments"} onClick={() => setMenu("payments")} >
          {/* Pagamentos  */}Realizados
          {menu === "payments" ? <S.UnderLine layoutId="paymentPageUnderLine" /> : null}
        </S.MenuItem>
      </S.Menu>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={menu}
          initial={{ x: menu === "pending" ? "-10%" : "10%", opacity: 0 }}
          animate={{ x: "0", opacity: 1 }}
          exit={{ x: menu === "pending" ? "-10%" : "10%", opacity: 0 }}
          transition={{ duration: .4, ease: "easeInOut" }}
        >
          {menu === 'pending' ?
            <S.Container>
              {payments?.find(el => el.available) ?
                <S.PaymentsList>
                  {payments.map((item, index) => {
                    if (!item.available) return null
                    return (
                      <S.PaymentContainer key={`paymentspage-payment${index}`}>
                        <S.Payment pending>
                          <S.PaymentInfo>
                            {item.type === 'user' ? `Inscri????o de ${item.name}` : 'Inscri????o da Delega????o'}

                            <S.PayContainer>
                              <S.PayButton to="/pay">
                                <FiExternalLink /> Pagar
                              </S.PayButton>
                            </S.PayContainer>
                          </S.PaymentInfo>

                          <S.PaymentAmountContainer>
                            <S.PaymentAmount pending>
                              {"$ " + item.price / 100 + ",00"}
                            </S.PaymentAmount>
                          </S.PaymentAmountContainer>

                          <div />

                          <S.PaymentDate>
                            At?? a data 30/8/2023
                          </S.PaymentDate>
                        </S.Payment>
                      </S.PaymentContainer>
                    )
                  })}
                </S.PaymentsList> :
                <S.NoPaymentsMessage>
                  {userType === 'delegate' ?
                    'Voce ja realizou todos os pagamentos necess??rios!' : 
                    'Voce e sua delega????o ja realizaram todos os pagamentos necess??rios!'
                  }
                </S.NoPaymentsMessage>
              }
            </S.Container>
            :
            <S.Container>
              {userPaymentsIntents?.length > 0 ?
                <S.PaymentsList>
                  {userPaymentsIntents.map((item, index) => {
                    return (
                      <S.PaymentContainer key={`realized-payment-${index}`} first={index === 0}>
                        <S.Payment status={item.status === "succeeded"}>
                          <S.PaymentInfo>
                            {item.type === 'card' && <FiCreditCard />}
                            Inscri????o d{item.metadata.delegationId ? "a sua delega????o " : ""}
                            {item.metadata.paidUsersIds ? `e ${Object.keys(qs.parse(item.metadata.paidUsersIds)).length}x participantes` : ''}
                          </S.PaymentInfo>

                          <S.PaymentAmountContainer>
                            <S.PaymentAmount>
                              R${" " + item.amount / 100},00
                            </S.PaymentAmount>
                          </S.PaymentAmountContainer>

                          <S.PaymentLinkContainer>
                            <S.PaymentLink href={item.receipt_url} target="_blank" rel="noopener noreferrer">
                              <FiExternalLink />  Recibo
                            </S.PaymentLink>
                          </S.PaymentLinkContainer>

                          <S.PaymentDate>
                            {new Date(item.created * 1000).toLocaleDateString("pt-BR")}
                          </S.PaymentDate>
                        </S.Payment>
                      </S.PaymentContainer>
                    )
                  })}
                </S.PaymentsList> :
                <S.NoPaymentsMessage>
                  Voce ainda n??o realizou nenhum pagamento
                </S.NoPaymentsMessage>
              }
            </S.Container>
          }
        </motion.div>
      </AnimatePresence>
    </S.Wrapper >
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.status === 404) {
    return (
      <S.Wrapper>
        <S.Title>
          Pagamentos
        </S.Title>

        <E.Message>

          {caught.data.errors.delegationId}
          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Join a Delegation
          </E.GoBacklink>
        </E.Message>

      </S.Wrapper>
    );
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  if (error instanceof Error) {
    return (
      <S.Wrapper>
        <S.Title>
          Unknown error
        </S.Title>

        <E.Message>
          {error.message} <E.GoBacklink to='/'>Voltar para p??gina inicial</E.GoBacklink>
        </E.Message>
      </S.Wrapper>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}


export default payment