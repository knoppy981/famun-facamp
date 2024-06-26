import React from 'react'
import { today, getLocalTimeZone, parseDate, CalendarDate } from '@internationalized/date';

import DatePicker from '~/components/datePicker';
import TextField from '~/components/textfield';
import TextArea from '~/components/textfield/textArea';
import PhoneNumberField from '~/components/textfield/phoneNumberField';
import { CheckboxGroup, Checkbox } from '~/components/checkbox/checkbox-group';
import _Checkbox from '~/components/checkbox';
import { Radio, RadioGroup } from '~/components/radioGroup';

const UserData = ({ data, actionData }: { data: any; actionData: any }) => {

  const [isAllergySelected, setIsAllergySelected] = React.useState<boolean>(data?.allergy)

  return (
    <>
      <h2 className='join-title'>
        Dados pessoais
      </h2>

      <div className='join-container'>
        <div className='join-input-container'>
          <TextField
            className='primary-input-box'
            name="name"
            label="Nome completo"
            type="text"
            defaultValue={data?.name}
            errorMessage={actionData?.errors?.name}
            autoComplete='off'
            action={actionData}
          />

          <TextField
            className='primary-input-box'
            name="socialName"
            label="Nome social"
            type="text"
            placeholder='Opcional'
            defaultValue={data?.socialName}
            errorMessage={actionData?.errors?.socialName}
            autoComplete='off'
            action={actionData}
          />

          <div className='join-sub-input-container'>
            {data?.nacionality === "Brazil" ?
              <>
                <TextField
                  className='primary-input-box'
                  name="rg"
                  label="RG"
                  type="text"
                  defaultValue={data?.rg}
                  errorMessage={actionData?.errors?.rg}
                  autoComplete='off'
                  action={actionData}
                />

                <TextField
                  className='primary-input-box'
                  name="cpf"
                  label="CPF"
                  type="text"
                  placeholder='CPF opcional'
                  defaultValue={data?.cpf}
                  errorMessage={actionData?.errors?.cpf}
                  autoComplete='off'
                  action={actionData}
                />
              </>
              :
              <TextField
                className='primary-input-box'
                name="passport"
                label="Número do Passaporte"
                type="text"
                defaultValue={data?.passport}
                errorMessage={actionData?.errors?.passport}
                autoComplete='off'
                action={actionData}
              />
            }

            <DatePicker
              className="primary-input-box"
              name="birthDate"
              label="Data de Nascimento"
              maxValue={today(getLocalTimeZone())}
              minValue={new CalendarDate(1900, 0, 0)}
              defaultValue={data.birthDate ? parseDate(data.birthDate) : undefined}
              errorMessage={actionData?.errors?.birthDate}
              action={actionData}
            />

            <PhoneNumberField
              className="primary-input-box"
              name="phoneNumber"
              label="Telefone"
              placeholder='DDI + DDD + número'
              _defaultValue={data?.phoneNumber}
              errorMessage={actionData?.errors?.phoneNumber}
              autoComplete='off'
              action={actionData}
            />
          </div>

          <RadioGroup
            className="primary-input-box"
            name="sex"
            label="Sexo"
            defaultValue={data?.sex}
            errorMessage={actionData?.errors?.sex}
            action={actionData}
          >
            <Radio value="Masculino">Masculino</Radio>
            <Radio value='Feminino'>Feminino</Radio>
            <Radio value='Outro'>Outro</Radio>
          </RadioGroup>

          <CheckboxGroup
            label="Restrições alimentares"
            aria-label="Restrições alimentares"
            name="diet"
            defaultValue={[data?.diet]}
            errorMessage={actionData?.errors.diet}
            action={actionData}
          >
            <Checkbox value='vegetarian'>Vegetariano(a)</Checkbox>
            <Checkbox value='vegan'>Vegano(a)</Checkbox>
          </CheckboxGroup>

          <div style={{ justifySelf: "start" }}>
            <_Checkbox
              name="allergy"
              aria-label="Alergias"
              onChange={setIsAllergySelected}
              defaultSelected={data?.allergy}
            >
              Alergias Alimentares
            </_Checkbox>
          </div>

          {isAllergySelected ?
            <TextArea
              className='textarea-input-box'
              name="allergyDescription"
              label="Descreva sua(s) alergia(s)"
              type="text"
              defaultValue={data?.allergyDescription}
              errorMessage={actionData?.errors?.allergyDescription}
              action={actionData}
            />
            :
            null
          }
        </div>
      </div>
    </>
  )
}

export default UserData
