import { useEffect, useState } from 'react'
import { Form, useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'
import { json } from '@remix-run/node'

import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'

import * as S from '~/styled-components/pay/selectPayments'
import Spinner from '~/styled-components/components/spinner'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';
import { CheckboxGroup, Checkbox } from '~/styled-components/components/checkbox/checkboxGroup'
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor'
import { FiAlertTriangle, FiChevronRight } from 'react-icons/fi'

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
  const [selectedPaymentsNames, setSelectedPaymentsNames, price, isButtonDisabled] = useSelectPayments(payments)

  console.log(payments)

  return (
    <Form action="/pay/c" method="get">
      <S.PaymentWrapper>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <FiChevronRight size={25} />

          <S.SubTitle>
            Payments
          </S.SubTitle>
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
                  isDisabled={!item.available}
                  tooltip="Somente líderes e orientadores podem realizar pagamentos de outros participantes"
                >
                  <S.OverflowText>
                    Taxa de inscrição de {item.name}
                  </S.OverflowText>

                  <S.RightContainer>
                    <ColorButtonBox color={item.available ? 'green' : 'red'} >
                      R$ {" "} {item.price / 100},00
                    </ColorButtonBox>
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

function useSelectPayments(payments) {
  const [searchParams] = useSearchParams();
  function getNamesWithAvailablePayments(names) {
    return names.filter(name => {
      return payments.some(p => p.name === name && p.available);
    });
  }

  const [selectedPaymentsNames, setSelectedPaymentsNames] = useState(
    getNamesWithAvailablePayments(searchParams.getAll('s')))
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

  return [selectedPaymentsNames, setSelectedPaymentsNames, price, isButtonDisabled]
}

export default SelectPayments