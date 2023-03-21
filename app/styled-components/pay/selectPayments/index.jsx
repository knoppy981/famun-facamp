import { useRef, useEffect, useState } from 'react'
import qs from "qs"

import * as S from "./elements"
import { FiAlertTriangle } from 'react-icons/fi'

const SelectPayment = ({ payments, selectedPayments, setSelectedPayments, price, setPrice, err }) => {

  const titleRef = useRef(null)
  const [titleHeight, setTitleHeight] = useState(titleRef?.current?.offsetHeight ?? 27)

  useEffect(() => {
    setTitleHeight(titleRef.current.offsetHeight)
  }, [err])

  return (
    <S.Wrapper>
      <S.Title ref={titleRef}>
        Selecione os pagamentos a serem realizados
        {err ? <S.Error><FiAlertTriangle />{err}</S.Error> : null}
      </S.Title>

      <S.Price>
        R$ {" "} {(price / 100).toLocaleString('de-DE')},00
      </S.Price>

      <S.Container height={titleHeight}>
        <S.Line />
        {payments.map((item, index) => {
          return (
            <S.Box key={index} last={index === 0} disabled={!item.available}>
              <S.CheckBox
                type="checkbox"
                name="payments"
                value={qs.stringify(item)}
                id={`${item.name}-subscription`}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedPayments(oldArray => [...oldArray, item])
                  } else {
                    setSelectedPayments(oldArray => oldArray.filter(el => el.id !== item.id))
                  }
                }}
                defaultChecked={selectedPayments?.some(e => e.id === item.id)}
                disabled={!item.available}
              />

              <S.Label htmlFor={`${item.name}-subscription`}>
                {item.type === 'user' ? `Taxa de inscrição de ${item.name}` : `Taxa de inscrição da Delegação`}
              </S.Label>

              <S.ItemContainer>
                <S.Item color={item.available ? 'green' : 'red'} >
                  R$ {" "} {item.price / 100},00
                </S.Item>
              </S.ItemContainer>
            </S.Box>
          )
        })}
      </S.Container>
    </S.Wrapper>
  )
}

export default SelectPayment