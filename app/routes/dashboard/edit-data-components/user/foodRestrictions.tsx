import React from 'react';
import { Checkbox, CheckboxGroup } from '~/components/checkbox/checkbox-group';
import _Checkbox from '~/components/checkbox';
import TextArea from '~/components/textfield/textArea';

const FoodRestrictions = (props: any) => {
  const { formData, handleChange, actionData, isDisabled, error } = props

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">
        Restrições Alimentares
      </h3>

      <div className='data-box-secondary-input-container' style={{ gap: 10 }}>
        <CheckboxGroup
          label="Restrições alimentares"
          aria-label="Restrições alimentares"
          onChange={e => handleChange({
            target: {
              name: "foodRestrictions.diet",
              value: e
            }
          })
          }
          name="foodRestriction"
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.diet}
          defaultValue={formData?.foodRestrictions?.diet ? [formData?.foodRestrictions?.diet] : []}
          action={actionData}
        >
          <Checkbox value='vegetarian' isDisabled={isDisabled}>Vegetariano(a)</Checkbox>
          <Checkbox value='vegan' isDisabled={isDisabled}>Vegano(a)</Checkbox>
        </CheckboxGroup>

        <div style={{ justifySelf: "start" }}>
          <_Checkbox
            name="foodRestrictions.allergy"
            aria-label="Alergias"
            onChange={e => handleChange({ target: { name: "foodRestrictions.allergy", value: e } })}
            defaultSelected={formData?.foodRestrictions?.allergy}
            isDisabled={isDisabled}
          >
            Alergias Alimentares
          </_Checkbox>
        </div>

        {formData?.foodRestrictions?.allergy ?
          <TextArea
            className='textarea-secondary-input-box'
            name="foodRestrictions.allergyDescription"
            label="Descrição da(s) alergia(s):"
            type="text"
            onChange={handleChange}
            defaultValue={formData?.foodRestrictions?.allergyDescription}
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