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
            ["Escola / Universidade", "school"],
            ["Numero Telefone", "schoolPhoneNumber"],
            ["Metodo de Participação", "participationMethod"],
          ].map((item, index) => {
            return (
              <S.Item key={`1column-item-${index}`}>
                <S.Label>
                  {item[0]}
                </S.Label>
                {data[item[1]]}
              </S.Item>
            )
          })}

          {[
            ["País", "country"],
            ["Cidade", "city"],
            ["Estado", "state"],
          ].map((item, index) => {
            return (
              <S.Item key={`2column-item-${index}`}>
                <S.Label>
                  {item[0]}
                </S.Label>
                {data[item[1]]}
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
                {data[item[1]]}
              </S.Item>
            )
          })}
      </S.List>
    </>
  )
}

export default index