import React from 'react'
import { json } from '@remix-run/node'
import { useLoaderData, Link, useSubmit, useFetcher } from '@remix-run/react'

import { getAllTransacoes, getUserPayments } from '~/models/payments'
import { requireUserId } from '~/session.server'
import { useUser } from '~/utils'

import * as S from '~/styled-components/dashboard/payment'
import { FiCreditCard, FiExternalLink } from 'react-icons/fi'

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  const { payments } = await getUserPayments(userId)
  const transactions = await getAllTransacoes()

  return json({ payments, transactions })
}

const payment = () => {

  const user = useUser()
  const fetcher = useFetcher()

  const handleForm = async (e) => {
		e.preventDefault();
		fetcher.submit(
      {
        paymentDescription: `Inscrição de ${user.name}`, 
        paymentPrice: 4500,
        paymentMethod: 'card',
      },
      { method: "post", action: "/api/pay" }
    );
	}

  const { transactions } = useLoaderData()
  const payments = [{ succeed: false }, { succeed: false }, { succeed: false }]

  return (
    <S.Wrapper>
      <S.Title>
        Pagamentos
      </S.Title>

      {!(payments.find(el => el.succeed === true)) &&
        <S.Container>
          <S.SubTitle>
            Pendentes
          </S.SubTitle>

          <S.PaymentsList>
            <S.PaymentContainer>
              <S.Payment pending>
                <S.PaymentInfo>
                  Inscrição de {user.name}

                  <S.PayContainer>
                    <S.PayButton to="/pay">
                      <FiExternalLink /> Pagar
                    </S.PayButton>
                  </S.PayContainer>
                </S.PaymentInfo>

                <S.PaymentAmountContainer>
                  <S.PaymentAmount pending>
                    {"$ " + 45 + ",00"}
                  </S.PaymentAmount>
                </S.PaymentAmountContainer>

                <div />

                <S.PaymentDate>
                  Até a data 30/8/2023
                </S.PaymentDate>
              </S.Payment>
            </S.PaymentContainer>
          </S.PaymentsList>
        </S.Container>
      }

      {transactions.length > 0 &&
        <S.Container>
          <S.SubTitle>
            Pagamentos realizados
          </S.SubTitle>

          <S.PaymentsList transactionList>
            {transactions.map((item, index) => (
              <S.PaymentContainer key={`payment-realized-${index}`} first={index === 0}>
                <S.Payment status={item.status === "succeeded"}>
                  <S.PaymentInfo>
                    {item.metodoPgto === "cartão" && <FiCreditCard />} Inscrição de {user.name}
                  </S.PaymentInfo>

                  <S.PaymentAmountContainer>
                    <S.PaymentAmount>
                      {"$ " + item.amount.slice(0, item.amount.length - 2) + "," + item.amount.slice(item.amount.length - 2, item.amount.length)}
                    </S.PaymentAmount>
                  </S.PaymentAmountContainer>

                  <S.PaymentLinkContainer>
                    <S.PaymentLink href={item.comprovantePgto} target="_blank" rel="noopener noreferrer">
                      <FiExternalLink />  Recibo
                    </S.PaymentLink>
                  </S.PaymentLinkContainer>

                  <S.PaymentDate>
                    30/10/2022
                  </S.PaymentDate>
                </S.Payment>
              </S.PaymentContainer>
            ))}
          </S.PaymentsList>
        </S.Container>
      }
    </S.Wrapper >
  )
}

export default payment