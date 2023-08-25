
import { useEffect } from 'react'
import termsAndConditions from '~/data/termsAndConditions'
import * as S from './elements'
import Checkbox from '~/styled-components/components/checkbox'

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

      <Checkbox
        name="termsAndConditions"
        required
        onChange={value => setIsNextButtonDisabled(!value)}
      >
        Eu li e aceito os Termos e Condições do evento Famun.
      </Checkbox>
    </>
  )
}

export default TermsAndConditions