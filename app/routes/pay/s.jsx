import { Form, useOutletContext, useTransition } from '@remix-run/react'
import { useEffect, useState } from 'react'
import qs from 'qs'

import * as S from '~/styled-components/pay'
import Spinner from '~/styled-components/components/spinner'

const SelectPayments = () => {

  const transition = useTransition()

  useEffect(() => {
    console.log(transition.state)
  }, [transition])

  const { payments, selectedPaymentsNames, setSelectedPaymentsNames, price, err, user } = useOutletContext()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  useEffect(() => {
    selectedPaymentsNames.length > 0 ? setIsButtonDisabled(false) : setIsButtonDisabled(true)
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

        <input type="hidden" name="stripeCustomerId" value={user.stripeCustomerId} />
        <input type="hidden" name="userId" value={user.id} />

        <S.PaymentList>
          {payments.map((item, index) => {
            return (
              <S.Payment key={index} last={index === 0} disabled={!item.available}>
                <S.CheckBox
                  type="checkbox"
                  name="s"
                  value={item.name}
                  id={`${item.name}-subscription`}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedPaymentsNames(oldArray => [...oldArray, item.name])
                    } else {
                      setSelectedPaymentsNames(oldArray => oldArray.filter(name => name !== item.name))
                    }
                  }}
                  defaultChecked={selectedPaymentsNames?.some(name => name === item.name)}
                  disabled={!item.available}
                />

                <S.Label htmlFor={`${item.name}-subscription`}>
                  {`Taxa de inscrição de ${item.name}`}
                </S.Label>

                <S.RightContainer>
                  <S.ColorLabel color={item.available ? 'green' : 'red'} >
                    R$ {" "} {item.price / 100},00
                  </S.ColorLabel>
                </S.RightContainer>
              </S.Payment>
            )
          })}
        </S.PaymentList>

        <S.Price>
          R$ {" "} {(price / 100).toLocaleString('de-DE')},00
        </S.Price>

        <S.ButtonContainer>
          <S.Button type='submit' disabled={isButtonDisabled}> Próximo {transition.state !== "idle" && <Spinner dim={18} />}</S.Button>
        </S.ButtonContainer>
      </S.PaymentWrapper>
    </Form>
  )
}

export default SelectPayments