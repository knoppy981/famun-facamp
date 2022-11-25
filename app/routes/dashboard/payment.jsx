import React from 'react'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getAllTransacoes } from '~/models/payments'

import * as S from '~/styled-components/dashboard/payment'

export const loader = async ({ request }) => {

  const transactions = await getAllTransacoes()
  console.log(transactions)
  return json({ transactions })
}

const payment = () => {

  const data = useLoaderData()

  return (
    <S.Wrapper>
      <S.Title>
        Pagamentos
      </S.Title>

      <S.Container>
        <S.SubTitle>
          Pendentes
        </S.SubTitle>

        <S.PaymentsList>
          <S.PaymentContainer>
            <S.Payment></S.Payment>
          </S.PaymentContainer>

          <S.PaymentContainer>
            <S.Payment></S.Payment>
          </S.PaymentContainer>

          <S.PaymentContainer>
            <S.Payment></S.Payment>
          </S.PaymentContainer>
        </S.PaymentsList>
      </S.Container>
    </S.Wrapper>
  )
}

export default payment