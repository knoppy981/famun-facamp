import * as S from './elements'
import { FiAlertTriangle } from 'react-icons/fi'

const DelegateData = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Preferencias
      </S.Title>

      <S.Wrapper>
        <S.Container>
          <S.CheckBoxTitle err={actionData?.errors.council}>
            {actionData?.errors.council ? <><FiAlertTriangle /> {actionData?.errors.council} </> : 'Preferencias de Conselho :'}
          </S.CheckBoxTitle>

          {['Assembleia Geral da ONU', 'Rio 92', 'Conselho de Juventude da ONU', 'Conselho de Seguranca da ONU'].map((item, index) => (
            <S.CheckBoxContainer key={`council-checkbox-${index}`}>
              <S.CheckBox
                id={`council-${item}`}
                name="council"
                value={item}
                defaultChecked={
                  data?.council === `${item}`
                }
                type="radio"
              />

              <S.LabelContainer>
                <S.Label>
                  {item}
                </S.Label>
              </S.LabelContainer>
            </S.CheckBoxContainer>
          ))}
        </S.Container>

        <S.Container>
          <S.CheckBoxTitle err={actionData?.errors.language}>
            {actionData?.errors.language ? <><FiAlertTriangle /> {actionData?.errors.language} </> : 'Idiomas fluentes :'}
          </S.CheckBoxTitle>

          {["Portugues", "Ingles", "Espanhol"].map((item, index) => (
            <S.CheckBoxContainer key={`language-checkbox-${index}`}>
              <S.CheckBox
                id={item}
                name="language"
                value={item}
                defaultChecked={data?.language?.includes(
                  `${item}`
                )}
                type="checkbox"
              />

              <S.LabelContainer>
                <S.Label>
                  {item}
                </S.Label>
              </S.LabelContainer>
            </S.CheckBoxContainer>
          ))}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default DelegateData