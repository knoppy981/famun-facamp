
import { useEffect } from 'react'
import termsAndConditions from '~/data/termsAndConditions'
import * as S from './elements'

const TermsAndConditions = ({ setIsNextButtonDisabled }) => {

  useEffect(() => {
    setIsNextButtonDisabled(true)
  }, [])

  return (
    <>
      <S.Title>
        Termos e condições
      </S.Title>

      <S.TextContainer>
        {termsAndConditions}
      </S.TextContainer>

      <S.Container>
        <S.CheckBox 
          type="checkbox" 
          name="termsAndConditions"
          id="termsAndConditions"
          required
          onChange={e => setIsNextButtonDisabled(!e.target.checked)}
        />

        <S.Label htmlFor='termsAndConditions'>
          Eu li e aceito os Termos e Condições do evento Famun.
        </S.Label>
      </S.Container>
    </>
  )
}

export default TermsAndConditions