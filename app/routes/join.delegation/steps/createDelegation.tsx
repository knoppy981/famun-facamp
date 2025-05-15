import React from 'react'
import ComboBox, { Item } from '~/components/combobox'
import TextField from '~/components/textfield'
import { NumberField } from '~/components/textfield/numberField'
import PhoneNumberField from '~/components/textfield/phoneNumberField'
import { isoCountries } from '~/lib/ISO-3661-1'
import { UserType } from '~/models/user.server'

const CreateDelegation = ({ data, actionData, user }: { data: any, actionData: any, user: UserType }) => {
  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }

  const countryArray = createCountryArray(isoCountries)

  let [country, setCountry] = React.useState(data.nacionality ?? "Brazil");

  return (
    <>
      <h2 className='join-title'>
        Criar uma delegação
      </h2>

      <div className='join-container'>
        <div className='join-input-container'>
          <TextField
            className='primary-input-box'
            name="school"
            label="Nome da Escola / Universidade"
            type="text"
            defaultValue={data?.school}
            errorMessage={actionData?.errors?.school}
            action={actionData}
          />

          <PhoneNumberField
            className='primary-input-box'
            name="schoolPhoneNumber"
            placeholder='DDI + DDD + número'
            label="Numero de Telefone da Escola / Universidade"
            _defaultValue={data?.schoolPhoneNumber}
            errorMessage={actionData?.errors?.schoolPhoneNumber}
            action={actionData}
          />

          <NumberField 
            className='primary-input-box'
            name="maxParticipants"
            label="Número de Delegados"
            minValue={1}
            defaultValue={1}
            maxValue={10}
          />

          <p className='text italic'>
            Atenção! A quantidade de delegados que vão se inscrever com esta delegação deve ser definida agora e não poderá ser alterada depois
          </p>

          <input type='hidden' name='participationMethod' value={user.participationMethod} />
        </div>

        <div className='join-input-container'>
          <TextField
            className='primary-input-box'
            name="address"
            label="Endereço"
            type="text"
            defaultValue={data?.address}
            errorMessage={actionData?.errors?.address}
            action={actionData}
          />

          <ComboBox
            className='primary-input-box'
            name="country"
            label="País"
            defaultItems={countryArray}
            errorMessage={actionData?.errors?.country}
            action={actionData}
            onSelectionChange={setCountry}
            defaultInputValue={country}
            defaultSelectedKey={country}
            leftItem={country && <div className={`join-nacionality-flag flag-icon flag-icon-${isoCountries[country]?.toLowerCase()}`} />}
          >
            {(item) => <Item>{item.id}</Item>}
          </ComboBox>

          <div className='join-sub-input-container'>
            <TextField
              className='primary-input-box'
              name="postalCode"
              label="Código Postal"
              type="text"
              defaultValue={data?.postalCode}
              errorMessage={actionData?.errors?.postalCode}
              action={actionData}
            />

            <TextField
              className='primary-input-box'
              name="state"
              label="Estado"
              type="text"
              defaultValue={data?.state}
              errorMessage={actionData?.errors?.state}
              action={actionData}
            />
          </div>

          <div className='join-sub-input-container'>
            <TextField
              className='primary-input-box'
              name="city"
              label="Cidade"
              type="text"
              defaultValue={data?.city}
              errorMessage={actionData?.errors?.city}
              action={actionData}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateDelegation
