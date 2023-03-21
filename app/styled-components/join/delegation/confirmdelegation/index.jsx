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
        <S.Column>
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
                {data[item[1]]}
              </S.Item>
            )
          })}
        </S.Column>

        <S.Column>
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
                {data[item[1]]}
              </S.Item>
            )
          })}
        </S.Column>

        <S.Column>
          {[
            ["CEP", "cep"],
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
        </S.Column>
      </S.List>
    </>
  )
}

export default index