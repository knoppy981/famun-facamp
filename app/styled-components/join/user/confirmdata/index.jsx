import qs from 'qs'
import * as S from './elements'
import React from 'react'

const ConfirmData = ({ data, userType }) => {
  return (
    <>
      <S.Title>
        Confirmar os dados
      </S.Title>

      <S.SubTitle>
        É possível alterar os dados após a inscrição
      </S.SubTitle>

      <S.List>
        {[
          ["Nacionalidade", "nacionality"],
          ["Nome", "name"],
          ["E-mail", "email"],
          ["Telefone", "phoneNumber"],
        ].map((item, index) => {
          if (!data[item[1]]) return null
          return (
            <S.Item key={index} x-autocompletetype="off">
              <S.Label>
                {item[0]}
              </S.Label>
              {data[item[1]]}
            </S.Item>
          )
        })}

        <S.Item>
          <S.Label>
            {data.cpf ? "Cpf" : "Número do Passaporte"}
          </S.Label>
          {data.cpf ?? data?.passport}
        </S.Item>

        <S.Item>
          <S.Label>
            Data de Nascimento
          </S.Label>
          {new Date(data.birthDate).toLocaleDateString("pt-BR")}
        </S.Item>

        {userType === "delegate" &&
          <>
            <S.Item isSpanTwoColumns={1}>
              <S.Label>
                Preferência de Conselho
              </S.Label>
              {Object.values(qs.parse(data.councilPreference)).map((item, index) => (
                <p style={{ fontSize: "inherit" }} key={index}>{index + 1}-{" " + item.replace(/_/g, ' ')}</p>
              ))}
            </S.Item>

            <S.Item isSpanTwoColumns={1}>
              <S.Label>
                Idiomas que pode simular
              </S.Label>
              {Array.isArray(data.languagesSimulates) ?
                data.languagesSimulates.map((item, index) => (
                  <p style={{ fontSize: "inherit" }} key={index}>{item}</p>
                )) :
                data.languagesSimulates
              }
            </S.Item>
          </>
        }

        {userType === "advisor" &&
          <>
            <S.Item>
              <S.Label>Posição</S.Label>
              {data.advisorRole}
            </S.Item>

            {[
              ["Instagram", "instagram"],
              ["Facebook", "facebook"],
              ["Linkedin", "linkedin"],
              ["Twitter", "twitter"]
            ].map((item, index) => {
              if (!data[item[1]]) return null
              return (
                <S.Item key={index}>
                  <S.Label>
                    {item[0]}
                  </S.Label>
                  {data[item[1]]}
                </S.Item>
              )
            })}
          </>
        }
      </S.List>
    </>
  )
}

export default ConfirmData