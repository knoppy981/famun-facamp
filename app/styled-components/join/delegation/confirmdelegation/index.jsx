import React from 'react'

import * as S from './elements'

const index = ({ data }) => {
  return (
    <>
      <S.TitleBox>
        <S.Title>
          Confirmar os dados
        </S.Title>
      </S.TitleBox>

      <S.TitleBox>
        <S.SubTitle>
          É possível alterar os dados após a inscrição
        </S.SubTitle>
      </S.TitleBox>

      <S.List>
          {[
            ["Nome da Escola / Universidade", "schoolName"],
            ["Numero Telefone", "schoolPhoneNumber"],
            ["Metodo de Participação", "participationMethod"],
          ].map((item, index) => {
            return (
              <S.Item key={`1column-item-${index}`}>
                <S.Label>
                  {item[0]}
                </S.Label>
                <S.MaxWidthText>{data[item[1]]}</S.MaxWidthText>
              </S.Item>
            )
          })}

          {[
            ["País", "country"],
            ["Cidade", "state"],
            ["Estado", "city"],
          ].map((item, index) => {
            return (
              <S.Item key={`2column-item-${index}`}>
                <S.Label>
                  {item[0]}
                </S.Label>
                <S.MaxWidthText>{data[item[1]]}</S.MaxWidthText>
              </S.Item>
            )
          })}

          {[
            ["Código Postal (CEP)", "postalCode"],
            ["Endereço", "address"],
            ["Bairro", "neighborhood"],
          ].map((item, index) => {
            return (
              <S.Item key={`2column-item-${index}`}>
                <S.Label>
                  {item[0]}
                </S.Label>
                <S.MaxWidthText>{data[item[1]]}</S.MaxWidthText>
              </S.Item>
            )
          })}
      </S.List>
    </>
  )
}

export default index