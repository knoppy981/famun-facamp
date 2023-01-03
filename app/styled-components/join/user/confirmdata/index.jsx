import * as S from './elements'

const ConfirmData = ({ data, userType }) => {
  const { password, confirmPassword, ...dataWithoutPassword } = data
  return (
    <>
      <S.Title>
        Confirmar os dados
      </S.Title>

      <S.SubTitle>
        É possível alterar os dados após a inscrição
      </S.SubTitle>

      <S.List>
        <S.Column>
          {[
            ["Nacionalidade", "nacionality"],
            ["Nome", "name"],
            ["E-mail", "email"],
            ["Telefone", "phoneNumber"],
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
            ["Cpf", "cpf"],
            ["Rg", "rg"],
            ["Data de aniversário", "birthDate"],
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
          <S.Item>
            <S.Label>
              {data.role ? "Posição" : "Preferência de Conselho"}
            </S.Label>
            {data.role ?? data.council}
          </S.Item>

          {data.language &&
            <S.Item>
              <S.Label>
                Idiomas Fluentes
              </S.Label>
              {Array.isArray(data.language) ?
                data.language.map((item, index) => (
                  <p>
                    {item}
                  </p>
                )) :
                data.language
              }
            </S.Item>
          }
        </S.Column>

        <S.Column>
          {userType === "advisor" &&
            [
              ["Instagram", "Instagram"],
              ["Facebook", "Facebook"],
              ["Linkedin", "Linkedin"],
              ["Twitter", "Twitter"]
            ].map((item, index) => {
              if (!data[item[1]]) return null
              return (
                <S.Item key={`4column-item-${index}`}>
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

export default ConfirmData