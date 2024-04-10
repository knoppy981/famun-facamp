import TermsAndConditionsText from '~/lib/termsAndConditions'

import Checkbox from '~/components/checkbox'

const TermsAndConditions = ({ setIsButtonDisabled }: { setIsButtonDisabled: (value: boolean) => void }) => {
  return (
    <>
      <h2 className='join-title'>
        Termos e condições
      </h2>

      <div className='join-text-box'>
        <TermsAndConditionsText />
      </div>

      <Checkbox
        name="termsAndConditions"
        isRequired
        onChange={value => setIsButtonDisabled(!value)}
      >
        Eu li e aceito os Termos e Condições do evento Famun.
      </Checkbox>
    </>
  )
}

export default TermsAndConditions