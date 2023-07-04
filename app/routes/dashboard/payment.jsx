import { useState } from 'react'
import { json } from '@remix-run/node'
import { useLoaderData, useCatch, useMatches } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import invariant from 'tiny-invariant';
import qs from "qs"

import { getDelegationId, requireUser } from '~/session.server'
import { getRequiredPayments } from '~/models/payments.server'
import { getTransactionsByUserId, getUserPayments } from '~/stripe.server'
import { safeRedirect, useUser, useUserType } from '~/utils'

import { ensureStripeCostumer } from '~/models/user.server';

import * as S from '~/styled-components/dashboard/payment'
import * as E from '~/styled-components/error'
import { FiCreditCard, FiExternalLink } from 'react-icons/fi'
import Spinner from '~/styled-components/components/spinner';


export const loader = async ({ request }) => {
  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await getDelegationId(request)
  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const payments = await getRequiredPayments({ user, delegationId })

  const paymentsIntents = await getUserPayments(user.id)
  paymentsIntents.forEach((el, index) => {
    const { amount, status, metadata, created, charges } = el
    const { payment_method_details, receipt_url } = charges.data[0]
    paymentsIntents[index] = { amount, status, metadata, created, receipt_url, type: payment_method_details.type }
  })

  return json({ payments, userPaymentsIntents: paymentsIntents })
}

const payment = () => {

  const { payments, userPaymentsIntents } = useLoaderData()

  const [menu, setMenu] = useState(userPaymentsIntents.length > 0 ? "payments" : "pending")
  const slideVariants = {
    enter: (direction) => {
      return {
        //x: direction > 0 ? "8%" : "-8%",
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      //x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        //x: direction < 0 ? "8%" : "-8%",
        opacity: 0
      };
    }
  };
  const [page, setPage] = useState(userPaymentsIntents.length > 0 ? 1 : 0);
  const paginate = (newPage) => {
    // awlays scroll to the top on page change because of animation glitches
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // You can change it to 'auto' for instant scrolling
    });
    // set page
    setPage(newPage);
  };

  return (
    <S.Wrapper>
      <S.Title>
        Pagamentos
      </S.Title>

      <S.Menu>
        <S.MenuItem active={page === 0} onClick={() => paginate(0)} >
          {/* Pagamentos  */}Pendentes
          {page === 0 ? <S.UnderLine layoutId="paymentPageUnderLine" /> : null}
        </S.MenuItem>

        <S.MenuItem active={page === 1} onClick={() => paginate(1)} >
          {/* Pagamentos  */}Realizados
          {page === 1 ? <S.UnderLine layoutId="paymentPageUnderLine" /> : null}
        </S.MenuItem>
      </S.Menu>

      <S.Container>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`menu-${page}`}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: .6, ease: "easeInOut" }}
          >
            {page === 0 ?
              payments?.find(el => el.available) ?
                <S.PaymentsList>
                  {payments.map((item, index) => {
                    if (!item.available) return null
                    return (
                      <S.PaymentContainer key={`paymentspage-payment${index}`}>
                        <S.Payment pending>
                          <S.PaymentInfo>
                            {`Inscrição de ${item.name}`}

                            <S.PayContainer>
                              <S.PayButton to={`/pay/s?${new URLSearchParams([["s", item.name]])}`}>
                                <FiExternalLink /> Pagar
                              </S.PayButton>
                            </S.PayContainer>
                          </S.PaymentInfo>

                          <S.PaymentAmountContainer>
                            <S.PaymentAmount pending>
                              {"R$ " + item.price / 100 + ",00"}
                            </S.PaymentAmount>
                          </S.PaymentAmountContainer>

                          <div />

                          <S.PaymentDate>
                            Até a data 30/8/2023
                          </S.PaymentDate>
                        </S.Payment>
                      </S.PaymentContainer>
                    )
                  })}
                </S.PaymentsList> :
                <S.NoPaymentsMessage>
                  Voce e sua delegação ja realizaram todos os pagamentos necessários!
                </S.NoPaymentsMessage>
              :
              userPaymentsIntents?.length > 0 ?
                <S.PaymentsList>
                  {userPaymentsIntents.map((item, index) => {
                    return (
                      <S.PaymentContainer key={`realized-payment-${index}`} first={index === 0}>
                        <S.Payment status={item.status === "succeeded"}>
                          <S.PaymentInfo>
                            {item.type === 'card' && <FiCreditCard />}
                            Inscrição de {item.metadata.paidUsersIds ? ` ${Object.keys(qs.parse(item.metadata.paidUsersIds)).length}x participante${Object.keys(qs.parse(item.metadata.paidUsersIds)).length > 1 ? "s" : ""}` : ''}
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
                  Voce ainda não realizou nenhum pagamento
                </S.NoPaymentsMessage>
            }
          </motion.div>
        </AnimatePresence>
      </S.Container>
    </S.Wrapper >
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.data.errors.delegation === "No delegation found") {
    return (
      <S.Wrapper>
        <S.Title>
          Delegação
        </S.Title>

        <E.Message>
          Para realizar os pagamentos é necessário entrar em uma delegação

          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Entrar em uma delegação
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
          {error.message} <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
      </S.Wrapper>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}


export default payment