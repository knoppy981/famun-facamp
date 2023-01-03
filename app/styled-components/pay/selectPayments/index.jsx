import React from 'react'
import qs from "qs"

import * as S from "./elements"

const SelectPayment = ({ payments, selectedPayments, setSelectedPayments, price, setPrice }) => {
  return (
    <>
      <S.Title>
        Selecione os pagamentos a serem realizados
      </S.Title>

      <S.Wrapper>
        <S.Container>
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
                      setPrice(price + item.price)
                    } else {
                      setSelectedPayments(oldArray => oldArray.filter(el => el.id !== item.id))
                      setPrice(price - item.price)
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
                    R$ {" "} {item.price/100},00
                  </S.Item>
                </S.ItemContainer>
              </S.Box>
            )
          })}
        </S.Container>

        <S.PriceContainer>
          <S.PriceList>
            {selectedPayments.map((item, index) => (
              <S.PriceItem first={index === 0} key={`price-item-${index}`}>
                + {" " + item.price/100},00
              </S.PriceItem>
            ))}
          </S.PriceList>

          <S.Price>
            R$ {" "} {(price / 100).toLocaleString('de-DE')},00
          </S.Price>
        </S.PriceContainer>
      </S.Wrapper>
    </>
  )
}

export default SelectPayment