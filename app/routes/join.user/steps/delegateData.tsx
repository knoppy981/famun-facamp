import React from 'react'
import qs from 'qs'
import { useListData } from 'react-stately';
import { ReorderableListBox, Item } from '~/components/reordableList';
import { CheckboxGroup, Checkbox } from '~/components/checkbox/checkbox-group';
import TextField from '~/components/textfield';
import PhoneNumberField from '~/components/textfield/phoneNumberField';
import { RadioGroup, Radio } from '~/components/radioGroup';
import TextArea from '~/components/textfield/textArea';

const DelegateData = ({ data, actionData, participationMethod }: { data: any; actionData: any, participationMethod: string }) => {
  console.log(data)

  const list = useListData({
    initialItems: data.councilPreference ?
      Object.values(qs.parse(data.councilPreference)).map(item => ({ id: item })) : data.councils.map((item: string) => ({ id: item }))
  });

  const onReorder = (e: any) => {
    if (e.target.dropPosition === 'before') {
      list.moveBefore(e.target.key, e.keys);
    } else if (e.target.dropPosition === 'after') {
      list.moveAfter(e.target.key, e.keys);
    }
  };

  const defaultLanguages = Array.isArray(data.languagesSimulates) ? data.languagesSimulates : [data.languagesSimulates]

  return (
    <>
      <h2 className='join-title'>
        Informações do Delegado
      </h2>

      <div className='join-container'>
        <ReorderableListBox
          className="primary-reordable-list"
          label="Coloque em ordem crescente quais Comitês / Conselhos você deseja simular em ordem de preferência. Atenção aos idiomas de cada simulação"
          aria-label="Preferencia de conselho"
          selectionMode="multiple"
          selectionBehavior="replace"
          items={list.items}
          onReorder={onReorder}
          isDisabled={false}
        >
          {(item: { id: string }) => <Item>{item.id.replace(/_/g, " ")}</Item>}
        </ReorderableListBox>

        <input type="hidden" name="councilPreference" value={qs.stringify(list.items.map((item: any) => item.id))} />

        <CheckboxGroup
          label="Idiomas que pode simular"
          aria-label="Idiomas que pode simular"
          name="languagesSimulates"
          defaultValue={defaultLanguages}
          errorMessage={actionData?.errors.languagesSimulates}
          action={actionData}
        >
          <Checkbox value="Portugues">Português</Checkbox>
          <Checkbox value="Ingles">Inglês</Checkbox>
          <Checkbox value="Espanhol">Espanhol</Checkbox>
        </CheckboxGroup>

        <div className='join-input-container'>
          <RadioGroup
            label="Nível de Escolaridade"
            aria-label="Nível de Escolaridade"
            name="educationLevel"
            defaultValue={data?.educationLevel}
            errorMessage={actionData?.errors.educationLevel}
            action={actionData}
          >
            {participationMethod === "Escola" ? <Radio value="Ensino Medio">Ensino Médio</Radio> : <Radio value="Universidade">Universidade</Radio>}
            <Radio value="Cursinho">Cursinho</Radio>
          </RadioGroup>

          <TextArea
            className='textarea-input-box'
            label="Ano em que está cursando"
            aria-label="Ano em que está cursando"
            name="currentYear"
            defaultValue={data?.currentYear}
            errorMessage={actionData?.errors.currentYear}
            action={actionData}
          />
        </div>

        <div className='join-input-container'>
          <label className='join-subtitle'>Contato de Emergência</label>

          <TextField
            className='primary-input-box'
            name="emergencyContactName"
            label="Nome"
            aria-label="Nome"
            type="text"
            defaultValue={data?.emergencyContactName}
            errorMessage={actionData?.errors?.emergencyContactName}
          />

          <PhoneNumberField
            className='primary-input-box'
            name="emergencyContactPhoneNumber"
            label="Número para Contato"
            aria-label="Número para Contato"
            type="text"
            placeholder='DDI + DDD + número'
            _defaultValue={data?.emergencyContactPhoneNumber}
            errorMessage={actionData?.errors?.emergencyContactPhoneNumber}
            action={actionData}
          />
        </div>

        <input type='hidden' name="userType" value="delegate" />
      </div>
    </>
  )
}

export default DelegateData
