import React from 'react';
import { Checkbox, CheckboxGroup } from '~/components/checkbox/checkbox-group';
import _Checkbox from '~/components/checkbox';
import TextArea from '~/components/textfield/textArea';

const FoodRestrictions = (props: any) => {
  const { defaultValues, handleChange, actionData, isDisabled, theme } = props
  const [showTextarea, setShowTextarea] = React.useState(defaultValues?.foodRestrictions?.allergy)

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Restrições Alimentares
      </h3>

      <div className='data-box-secondary-input-container' style={{ gap: 10 }}>
        <CheckboxGroup
          aria-label="Restrições alimentares"
          onChange={e => handleChange({ target: { name: "foodRestrictions.diet", value: e.length === 1 ? e[0] : e.length > 1 ? e : null } })}
          name="foodRestriction"
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.diet}
          defaultValue={defaultValues?.foodRestrictions?.diet ? [defaultValues?.foodRestrictions?.diet] : []}
          action={actionData}
        >
          <Checkbox value='vegetarian' isDisabled={isDisabled}>Vegetariano(a)</Checkbox>
          <Checkbox value='vegan' isDisabled={isDisabled}>Vegano(a)</Checkbox>
        </CheckboxGroup>

        <div style={{ justifySelf: "start" }}>
          <_Checkbox
            name="foodRestrictions.allergy"
            aria-label="Alergias"
            onChange={e => {
              handleChange({ target: { name: "foodRestrictions.allergy", value: e } })
              handleChange({ target: { name: "foodRestrictions.allergyDescription", value: e ? defaultValues?.foodRestrictions?.allergyDescription ?? "" : null }, delete: !e && !defaultValues?.foodRestrictions?.allergy })
              setShowTextarea(e)
            }}
            defaultSelected={defaultValues?.foodRestrictions?.allergy}
            isDisabled={isDisabled}
          >
            Alergias Alimentares
          </_Checkbox>
        </div>

        {showTextarea ?
          <TextArea
            className='textarea-secondary-input-box'
            name="foodRestrictions.allergyDescription"
            label="Descrição da(s) alergia(s):"
            type="text"
            onChange={e => {
              handleChange({ target: { name: "foodRestrictions.allergy", value: showTextarea } })
              handleChange(e)
            }}
            defaultValue={defaultValues?.foodRestrictions?.allergyDescription}
            errorMessage={actionData?.errors?.allergyDescription}
            action={actionData}
            isDisabled={isDisabled}
          />
          :
          null
        }
      </div>

      <div className='data-box-border' />
    </div >
  )
}

export default FoodRestrictions