import { Checkbox, CheckboxGroup } from "~/components/checkbox/checkbox-group"
import { Radio, RadioGroup } from "~/components/radioGroup"
import TextField from "~/components/textfield"
import PhoneNumberField from "~/components/textfield/phoneNumberField"

const DefaultConfigurations = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData } = props

  return (
    <div className={`data-box-container`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Configurações gerais
      </h3>

      <div className='data-box-secondary-input-container' style={{ gap: 10 }}>
        <RadioGroup
          label="Status das Inscrições"
          onChange={e => handleChange({ target: { name: "subscriptionAvailable", value: e } })}
          name="subscriptionAvailable"
          isDisabled={isDisabled}
          defaultValue={defaultValues.subscriptionAvailable ? "true" : "false"}
          errorMessage={actionData?.errors?.subscriptionAvailable}
          action={actionData}
        >
          <Radio value='true'  isDisabled={isDisabled}>Abertas</Radio>
          <Radio value='false' isDisabled={isDisabled}>Fechadas</Radio>
        </RadioGroup>
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default DefaultConfigurations