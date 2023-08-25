import { useEffect, useState } from 'react'
import { Form, useActionData, useFetcher, useLoaderData, useOutletContext, useSearchParams, useTransition } from '@remix-run/react'
import { json } from '@remix-run/node'
import qs from 'qs'

import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'
import { useUser } from '~/utils'

import * as S from '~/styled-components/pay'
import Spinner from '~/styled-components/components/spinner'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';

import { CheckboxGroup, Checkbox } from '~/styled-components/components/checkbox/checkboxGroup'

export const loader = async ({ request }) => {
  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await requireDelegationId(request)

  const payments = await getRequiredPayments({ user, delegationId })

  return json({ payments })
}

const SelectPayments = () => {
  const { payments } = useLoaderData()
  const actionData = useActionData()
  const err = actionData?.errors
  
  const transition = useTransition()
  const [searchParams] = useSearchParams();

  const [selectedPaymentsNames, setSelectedPaymentsNames] = useState(searchParams.getAll("s"))
  const [price, setPrice] = useState(0)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  useEffect(() => {
    const sumPrices = payments.reduce((sum, payment) => {
      if (selectedPaymentsNames.includes(payment.name)) {
        return sum + payment.price;
      }
      return sum;
    }, 0);

    setPrice(sumPrices)

    setIsButtonDisabled(selectedPaymentsNames.length === 0)
  }, [selectedPaymentsNames])

  return (
    <Form action="/pay/c" method="get">
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

        <S.PageTitle>
          Selecione os pagamentos a serem realizados
          {err ? <S.Error><FiAlertTriangle />{err?.selectedPayments}</S.Error> : null}
        </S.PageTitle>

        <S.PaymentList>
          <CheckboxGroup
            name="s"
            label="Pagamento Selecionados"
            hideLabel={true}
            value={selectedPaymentsNames}
            onChange={setSelectedPaymentsNames}
          >
            {payments.map((item, index) => {
              return (
                <Checkbox
                  key={index}
                  value={item.name}
                >
                  <S.OvrflowText>
                    Taxa de inscrição de {item.name}
                  </S.OvrflowText>

                  <S.RightContainer>
                    <S.ColorLabel color={item.available ? 'green' : 'red'} >
                      R$ {" "} {item.price / 100},00
                    </S.ColorLabel>
                  </S.RightContainer>
                </Checkbox>
              )
            })}
          </CheckboxGroup>
        </S.PaymentList>

        <S.Price>
          R$ {" "} {(price / 100).toLocaleString('de-DE')},00
        </S.Price>

        <S.ButtonContainer>
          <DefaultButtonBox isDisabled={isButtonDisabled}>
            <Button type='submit' isDisabled={isButtonDisabled}> Próximo {transition.state !== "idle" && <Spinner dim={18} />}</Button>
          </DefaultButtonBox>
        </S.ButtonContainer>
      </S.PaymentWrapper>
    </Form>
  )
}

export default SelectPayments