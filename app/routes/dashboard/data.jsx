import { useEffect, useState, useRef } from 'react'
import { useActionData, useSubmit, useTransition } from '@remix-run/react'
import qs from 'qs'

import { useUser, useUserType, createNestedObject, validateEmail, validatePhoneNumber, checkString } from '~/utils'
import { getExistingUser, updateUser } from '~/models/user.server';

import * as S from '~/styled-components/dashboard/profile'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { json } from '@remix-run/node'

export const action = async ({ request }) => {
  const formData = await request.formData();
  const changes = qs.parse(formData.get("changes"));
  const userId = formData.get("userId")
  console.log(changes)

  const prismaData = {}
  const addLng = []
  const remLng = []

  Object.values(changes).forEach(change => {
    if (change.target === 'language') {
      if (change.type === 'adding') {
        createNestedObject(prismaData, ["delegate", "update", "languagesSimulates", "createMany", "data"])
        addLng.push({ language: change.change })
      } else {
        createNestedObject(prismaData, ["delegate", "update", "languagesSimulates", "deleteMany", "OR"])
        remLng.push({ language: change.change })
      }
    } else if (change.target === 'councilPreference') {
      createNestedObject(prismaData, ["delegate", "update", "councilPreference"])
      prismaData.delegate.update.councilPreference = change.change
    } else if (change.target === 'advisorRole') {
      createNestedObject(prismaData, ["delegationadvisor", "update", "advisorRole"])
      prismaData.delegationAdvisor.update.advisorRole = change.change
    } else if (change.target === 'Facebook' || 'Instagram' || 'Linkedin') {
      createNestedObject(prismaData, ["delegationadvisor", "update", "socialMedia"])

    } else {
      prismaData[change.target] = change.change
    }
  })

  if (addLng.length > 0) prismaData.delegate.update.languagesSimulates.createMany.data = addLng
  if (remLng.length > 0) prismaData.delegate.update.languagesSimulates.deleteMany.OR = remLng

  /* console.log(prismaData)
  console.log(prismaData?.delegate?.update?.languagesSimulates)
  console.log(prismaData?.delegate?.update?.languagesSimulates?.deleteMany.OR)
  console.log(prismaData?.delegate?.update?.languagesSimulates?.createMany.data) */

  const userData = { name: prismaData?.name, email: prismaData?.email, cpf: prismaData?.cpf, rg: prismaData?.rg }
  const user = await getExistingUser(userData)

  if (prismaData?.email?.length === 0)
    return json(
      { errors: { email: "Preencha com seu e-mail" } },
      { status: 400 }
    );
  if (prismaData.email) {
    if (prismaData.email === user?.email)
      return json(
        { errors: { email: "E-mail já utilizado" } },
        { status: 400 }
      );
    if (typeof prismaData.email !== "string" || !validateEmail(prismaData.email))
      return json(
        { errors: { email: "E-mail inválido" } },
        { status: 400 }
      );
  }

  if (prismaData?.name?.length === 0)
    return json(
      { errors: { name: "Preencha com o seu Nome" } },
      { status: 400 }
    );
  if (prismaData.name) {
    if (prismaData.name === user?.name)
      return json(
        { errors: { name: "Nome já utilizado" } },
        { status: 400 }
      );
    if (typeof prismaData.name !== "string" || !checkString(prismaData.name) || prismaData.name === "")
      return json(
        { errors: { name: "Nome inválido" } },
        { status: 400 }
      );
  }

  if (prismaData?.cpf?.length === 0)
    return json(
      { errors: { cpf: "Digite seu cpf" } },
      { status: 400 }
    );
  if (prismaData.cpf) {
    if (prismaData.cpf === user?.cpf)
      return json(
        { errors: { cpf: "Cpf já utilizado" } },
        { status: 400 }
      );
    if (typeof prismaData.cpf !== "string" || prismaData.cpf.length !== 11)
      return json(
        { errors: { cpf: "Cpf Inválido" } },
        { status: 400 }
      );
  }

  if (prismaData?.rg?.length === 0)
    return json(
      { errors: { rg: "Digite seu Rg" } },
      { status: 400 }
    );
  if (prismaData.rg) {
    if (prismaData.rg === user?.rg)
      return json(
        { errors: { rg: "Rg já utilizado" } },
        { status: 400 }
      );
    if (typeof prismaData.rg !== "string" || prismaData.rg.length !== 9)
      return json(
        { errors: { rg: "Rg Inválido" } },
        { status: 400 }
      );
  }

  if (prismaData?.phoneNumber?.length === 0)
    return json(
      { errors: { phoneNumber: "Digite seu Númro de Celular" } },
      { status: 400 }
    );
  if (prismaData.phoneNumber) {
    if (typeof prismaData.phoneNumber !== "string" || !validatePhoneNumber(prismaData.phoneNumber))
      return json(
        { errors: { phoneNumber: "Número de celular inválido" } },
        { status: 400 }
      );
  }

  if (prismaData?.birthDate?.length === 0)
    return json(
      { errors: { birthDate: "Preencha a Data de nascimento" } },
      { status: 400 }
    );
  if (prismaData.birthDate) {
    if (typeof prismaData.birthDate !== "string" || prismaData.birthDate.length !== 10)
      return json(
        { errors: { birthDate: "Data de Nascimento inválida" } },
        { status: 400 }
      );
  }

  console.log(prismaData)

  await updateUser({ userId, values: prismaData })

  return json({})
}

const data = () => {

  const submit = useSubmit()
  const transition = useTransition()
  const actionData = useActionData()

  const { delegate, delegationAdvisor, ...data } = {
    ...useUser(),
    userType: useUserType()
  }

  const [languages, setLanguages] = useState(delegate?.languagesSimulates)
  const [changes, setChanges] = useState([])
  const [isActive, setIsActive] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (changes.length > 0) {
      submit(e.currentTarget, { changes })
      setChanges([])
    } else {
      setIsActive(!isActive)
    }
  }

  const handleChange = name => event => {
    setChanges((current) => [...current.filter((change) => change?.target !== name)])

    if (name === 'councilPreference' && delegate?.councilPreference != event.target.value) {
      setChanges(current => [...current, { target: name, change: event.target.value }])
    } else if (name === 'advisorRole' && delegationAdvisor?.councilPreference != event.target.value) {
      setChanges(current => [...current, { target: name, change: event.target.value }])
    } else if (data[name] != event.target.value) {
      setChanges(current => [...current, { target: name, change: event.target.value }])
    }
  }

  const handleLanguageChange = lng => {
    console.log(lng)
    setChanges((current) => [...current.filter((el) => el?.change !== lng)])

    if (languages.find(el => el.language === lng)) {
      // tirando
      console.log("tirando")
      setLanguages((current) => [...current.filter((el) => el?.language !== lng)])
      // se tiver na origem add change
      if (delegate?.languagesSimulates.find(el => el.language === lng)) {
        console.log("change")
        setChanges((current) => [...current, { target: 'language', change: lng, type: "removing" }])
      }
    } else {
      // adicionando
      console.log("adicionando")
      setLanguages((current) => [...current, { language: lng }])
      // se nao tiver na origem add change
      if (!delegate?.languagesSimulates.find(el => el.language === lng)) {
        console.log("change")
        setChanges((current) => [...current, { target: 'language', change: lng, type: "adding" }])
      }
    }
  }

  useEffect(() => {
    console.log(actionData)
  }, [actionData])

  useEffect(() => {
    if (transition.state === 'loading' && !actionData?.errors) setIsActive(false)
  }, [transition])

  return (
    <S.DataForm disabled={isActive} method="post">
      <S.DataTitle>
        Dados da Inscrição
        <S.ColorItem
          onClick={handleSubmit}
          color={!isActive ? 'blue' : changes.length > 0 ? 'green' : 'red'}
        >
          {!isActive ? <><FiEdit /> Editar</> : changes.length > 0 ? <><FiCheck /> Salvar Alterações</> : <><FiX /> Cancelar</>}
        </S.ColorItem>
      </S.DataTitle>

      <S.DataWrapper>
        <S.DataContainer>
          {[
            ["Name", "name", "text"],
            ["Email", "email", "email"],
            ["Phone Number", "phoneNumber", "text"],
            ["Nacionality", "nacionality", , "text"],
            ["Date of Birth", "birthDate", "text"],
            ["Cpf", "cpf", "text"],
            ["Rg", "rg", "text"],
          ].map((item, index) => (
            <S.ItemContainer key={`item-${item[0]}`}>
              <S.Key err={actionData?.errors?.[item[1]]}>
                {actionData?.errors?.[item[1]] ?? item[0]}
              </S.Key>

              <S.Item
                id={item[1]}
                required
                name={item[1]}
                type={item[2]}
                defaultValue={data[item[1]]}
                autoComplete="false"
                disabled={!isActive}
                onChange={handleChange(item[1])}
              />
            </S.ItemContainer>
          ))}
        </S.DataContainer>

        {data.userType === 'delegate' ?
          <>
            <S.ColumnDataContainer>
              <S.Key>
                Preferencia de Conselho
              </S.Key>

              <S.Select
                disabled={!isActive}
                onChange={handleChange('councilPreference')}
              >
                {[
                  'Assembleia_Geral_da_ONU',
                  'Rio_92',
                  'Conselho_de_Juventude_da_ONU',
                  'Conselho_de_Seguranca_da_ONU'
                ].map((item, index) => (
                  <S.Option key={`council-preference-${index}-option`} value={item}>{item.replace(/_/g, " ")}</S.Option>
                ))}
              </S.Select>
            </S.ColumnDataContainer>

            <S.ColumnDataContainer>
              <S.Key>
                Idiomas fluentes
              </S.Key>

              {languages.map((item, index) => (
                <S.CheckboxButton
                  key={`language-${index}`}
                  disabled={!isActive}
                  onClick={e => { e.preventDefault(); handleLanguageChange(item.language) }}
                >
                  <S.CheckboxIcon disabled={!isActive}>
                    <FiX />
                  </S.CheckboxIcon>

                  <S.CheckboxLabel
                    disabled={!isActive}
                  >
                    {item.language}
                  </S.CheckboxLabel>
                </S.CheckboxButton>
              ))}

              <S.Select
                style={{ display: isActive ? 'block' : 'none' }}
                disabled={!isActive}
                onChange={event =>
                  languages.find(el => el.language === event.target.value) ?
                    undefined : event.target.value === 'Adicionar idioma' ?
                      undefined : handleLanguageChange(event.target.value)
                }
              >
                {[
                  'Adicionar idioma',
                  'Portugues',
                  'Ingles',
                  'Espanhol',
                  'Alemao',
                  'Mandarin'
                ].map((item, index) => (
                  <S.Option
                    key={`language-option-${index}`}
                  >
                    {item}
                  </S.Option>
                ))}
              </S.Select>
            </S.ColumnDataContainer>
          </>
          :
          <>
            <S.ColumnDataContainer>
              <S.Key>
                Posição do orientador
              </S.Key>

              <S.Select
                disabled={!isActive}
                onChange={handleChange('advisorRole')}
              >
                {[
                  'Professor',
                  'Coordenador',
                  'Diretor',
                  'Outro'
                ].map((item, index) => (
                  <S.Option key={`position-${item}`}>{item}</S.Option>
                ))}
              </S.Select>
            </S.ColumnDataContainer>

            <S.ColumnDataContainer>
              <S.Key>
                Redes Sociais
              </S.Key>

              {["Instagram", "Facebook", "Linkedin"].map((item, index) => (
                <S.SMContainer
                  key={`socialMedia-${index}`}
                >
                  <S.SMLabel
                    disabled={!isActive}
                  >
                    {item}
                  </S.SMLabel>

                  <S.SMInput
                    id={delegationAdvisor?.socialMedia[item]}
                    required
                    name={item}
                    type="text"
                    defaultValue={delegationAdvisor?.socialMedia.find(el => el.socialMediaName === item)?.username}
                    placeholder="adicionar"
                    autoComplete="false"
                    disabled={!isActive}
                    onChange={handleChange(item)}
                  />

                </S.SMContainer>
              ))}
            </S.ColumnDataContainer>
          </>
        }
      </S.DataWrapper>

      <input type="hidden" name="userId" value={data.id} />
      <input type="hidden" name="changes" value={qs.stringify(changes)} />
    </S.DataForm>
  )
}

export default data