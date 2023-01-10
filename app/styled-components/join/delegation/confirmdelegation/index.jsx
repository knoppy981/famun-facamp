import React from 'react'

import * as S from './elements'

const index = ({ data }) => {
  return (
    <>
      <S.Title>
        Estamos quase lá!
      </S.Title>

      <S.SubTitle>
        Confirme os dados abaixo para finalizar a inscrição da delegação da sua escola / universidade
      </S.SubTitle>

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