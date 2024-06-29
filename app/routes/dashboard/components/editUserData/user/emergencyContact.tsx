import TextField from "~/components/textfield"
import PhoneNumberField from "~/components/textfield/phoneNumberField"

const EmergencyContactData = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData, theme } = props

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Contato de Emergencia
      </h3>

      <div className='data-box-input-container'>
        <TextField
          className="secondary-input-box"
          name="delegate.emergencyContactName"
          label="Nome"
          type="text"
          isRequired
          defaultValue={defaultValues?.delegate?.emergencyContactName}
          onChange={handleChange}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.emergencyContactName}
          action={actionData}
        />

        <PhoneNumberField
          className="secondary-input-box"
          name="delegate.emergencyContactPhoneNumber"
          label="Telefone"
          type="text"
          isRequired
          _defaultValue={defaultValues?.delegate?.emergencyContactPhoneNumber}
          onChange={value => handleChange({ target: { name: "delegate.emergencyContactPhoneNumber", value: value } })}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.emergencyContactPhoneNumber}
          action={actionData}
        />
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default EmergencyContactData