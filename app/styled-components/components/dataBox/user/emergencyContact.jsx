import TextField from '~/styled-components/components/textField';
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'
import PhoneNumberField from '~/styled-components/components/textField/phoneNumber'

import * as S from "../elements"

const EmergencyContactData = (props) => {

  const { formData, isDisabled, handleChange, actionData } = props

  return (
    <S.Container>
      <S.ContainerTitle border="blue">
        Contato de Emergencia
      </S.ContainerTitle>

      <DataChangeInputBox>
        <TextField
          name="delegate.emergencyContactName"
          label="Name"
          type="text"
          isRequired
          defaultValue={formData?.delegate?.emergencyContactName}
          onChange={handleChange}
          isDisabled={isDisabled}
          err={actionData?.errors?.emergencyContactName}
        />

        <PhoneNumberField
          name="delegate.emergencyContactPhoneNumber"
          label="Phone Number"
          type="text"
          isRequired
          _defaultValue={formData?.delegate?.emergencyContactPhoneNumber}
          onChange={value => handleChange({ target: { name: "delegate.emergencyContactPhoneNumber", value: value } })}
          isDisabled={isDisabled}
          err={actionData?.errors?.emergencyContactPhoneNumber}
        />
      </DataChangeInputBox>
    </S.Container>
  )
}

export default EmergencyContactData