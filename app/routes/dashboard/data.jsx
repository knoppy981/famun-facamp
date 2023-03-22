import { useEffect, useState, useRef } from 'react'
import { useActionData, useFetcher, useSubmit, useTransition } from '@remix-run/react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import qs from 'qs'

import { useUser, useUserType, createNestedObject, validateEmail, validatePhoneNumber, checkString } from '~/utils'
import { getExistingUser, updateUser } from '~/models/user.server';

import * as S from '~/styled-components/dashboard/profile'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { json } from '@remix-run/node'
import Spinner from '~/styled-components/components/spinner'

export const action = async ({ request }) => {
  const formData = await request.formData();
  const changes = qs.parse(formData.get("changes"));
  const userId = formData.get("userId")

  // objeto final para prisma
  const prismaData = {}

  Object.values(changes).forEach(change => {
    if (change.userChange === 'true') {
      // mudanca de usuário
      if (change.target === 'language') {
        // mudanças de idioma
        createNestedObject(prismaData, ["delegate", "update", "languagesSimulates", "set"])
        prismaData.delegate.update.languagesSimulates.set = change.change

      } else if (change.target === 'councilPreference') {
        // mudança de conselho
        createNestedObject(prismaData, ["delegate", "update", "councilPreference", "set"])
        prismaData.delegate.update.councilPreference.set = change.change

      } else if (change.target === 'advisorRole') {
        //mudança de posição
        createNestedObject(prismaData, ["delegationAdvisor", "update", "advisorRole"])
        prismaData.delegationAdvisor.update.advisorRole = change.change

      } else if (change.target === 'sm') {
        // mudança de rede social
        createNestedObject(prismaData, ["delegationAdvisor", "update", "socialMedia", "set"])
        prismaData.delegationAdvisor.update.socialMedia.set = change.change
      } else {
        // mudanças simples
        prismaData[change.target] = change.change
      }
    } else {
      //mudanca de delegação
      createNestedObject(prismaData, ["delegation", "update"])
      if (change.target === 'school' || change.target === 'schoolPhoneNumber' || change.target === 'participationMethod') {
        prismaData.delegation.update[change.target] = change.change
      } else {
        createNestedObject(prismaData, ["delegation", "update", "address", "update"])
        prismaData.delegation.update.address.update[change.target] = change.change
      }
    }
  })

  console.dir(prismaData, { depth: null })

  // testar compatibilidade de dados com outros usuários

  const userData = { name: prismaData?.name, email: prismaData?.email, document: { is: { value: prismaData.cpf ?? prismaData.passport } } }
  const user = await getExistingUser(userData)

  //teste de dadods
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

  if (prismaData.cpf?.length === 0)
    return json(
      { errors: { cpf: "Digite seu cpf" } },
      { status: 400 }
    );
  if (prismaData.cpf) {
    if (prismaData.cpf === user?.document?.value && user?.document?.documentName === 'cpf')
      return json(
        { errors: { cpf: "Cpf já utilizado" } },
        { status: 400 }
      );
    if (typeof prismaData.cpf !== "string" || prismaData.cpf.length !== 14 || !validateCpf(prismaData.cpf))
      return json(
        { errors: { cpf: "Cpf Inválido" } },
        { status: 400 }
      );
  }

  if (prismaData.passport?.length === 0)
    return json(
      { errors: { passport: "Digite seu Passaporte" } },
      { status: 400 }
    );
  if (prismaData.passport) {
    if (prismaData.passport === user?.document?.value && user?.document?.documentName === 'passport')
      return json(
        { errors: { passport: "Passaporte já utilizado" } },
        { status: 400 }
      );
    if (typeof prismaData.passport !== "string" || prismaData.passport.length > 20)
      return json(
        { errors: { passport: "Passaporte Inválido" } },
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

  if (prismaData.delegation) {
    let aux1 = prismaData.delegation.update

    if (aux1?.school?.length === 0)
      return json(
        { errors: { school: "Preencha o nome da Escola / Universidade" } },
        { status: 400 }
      );
    if (aux1.school) {
      if (typeof aux1.school !== "string" || !checkString(aux1.school) || aux1.school === "")
        return json(
          { errors: { school: "Nome da Escola / Universidade inválido" } },
          { status: 400 }
        );
    }

    if (aux1?.schoolPhoneNumber?.length === 0)
      return json(
        { errors: { schoolPhoneNumber: "Preencha com o telefone da Escola / Universidade" } },
        { status: 400 }
      );
    if (aux1.schoolPhoneNumber) {
      if (typeof aux1.schoolPhoneNumber !== "string" || !validatePhoneNumber(aux1.schoolPhoneNumber))
        return json(
          { errors: { schoolPhoneNumber: "Telefone da Escola / Universidade inválido" } },
          { status: 400 }
        );
    }

    if (aux1.address) {
      let aux2 = aux1.address.update

      if (aux2?.country?.length === 0)
        return json(
          { errors: { country: "Preencha com um país" } },
          { status: 400 }
        );
      if (aux2.country) {
        if (typeof aux2.country !== "string")
          return json(
            { errors: { country: "País inválido" } },
            { status: 400 }
          );
      }

      if (aux2?.cep?.length === 0)
        return json(
          { errors: { cep: "Preencha com o cep da Escola / Universidade" } },
          { status: 400 }
        );
      if (aux2.cep) {
        if (typeof aux2.cep !== "string" || aux2.cep.length !== 8)
          return json(
            { errors: { cep: "Cep da Escola / Universidade inválido" } },
            { status: 400 }
          );
      }

      if (aux2?.state?.length === 0)
        return json(
          { errors: { state: "Preencha com um estado" } },
          { status: 400 }
        );
      if (aux2.state) {
        if (typeof aux2.state !== "string")
          return json(
            { errors: { state: "Estado inválido" } },
            { status: 400 }
          );
      }

      if (aux2?.city?.length === 0)
        return json(
          { errors: { city: "Preencha com uma Cidade" } },
          { status: 400 }
        );
      if (aux2.city) {
        if (typeof aux2.city !== "string")
          return json(
            { errors: { city: "Cidade inválida" } },
            { status: 400 }
          );
      }

      if (aux2?.address?.length === 0)
        return json(
          { errors: { address: "Preencha com um endereço" } },
          { status: 400 }
        );
      if (aux2.address) {
        if (typeof aux2.address !== "string")
          return json(
            { errors: { address: "Endereço inválid0" } },
            { status: 400 }
          );
      }

      if (aux2?.neighborhood?.length === 0)
        return json(
          { errors: { neighborhood: "Preencha com um bairro" } },
          { status: 400 }
        );
      if (aux2.neighborhood) {
        if (typeof aux2.neighborhood !== "string")
          return json(
            { errors: { neighborhood: "Bairro inválido" } },
            { status: 400 }
          );
      }
    }
  }

  // atualizar usuario

  return updateUser({ userId, values: prismaData })
}

export const EditUserData = ({
  isActive,
  actionData,
  handleChange,
  languages,
  handleLanguageChange,
  councilPreference,
  handleCouncilPreference,
  handleSocialMediaChange,
  data,
  userType,
  delegationAdvisor,
  delegate,
}) => {

  const languagesRef = useRef(null)

  return (
    <>
      <S.DataColumn>
        <S.DataContainer>
          {[
            ["Name", "name", "text"],
            ["Email", "email", "email"],
            ["Phone Number", "phoneNumber", "text"],
            ["Nacionality", "nacionality", , "text"],
            ["Date of Birth", "birthDate", "text"],
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
                key={data[item[1]]}
                defaultValue={data[item[1]]}
                autoComplete="false"
                disabled={!isActive}
                onChange={handleChange(item[1])}
                err={actionData?.errors?.[item[1]]}
              />
            </S.ItemContainer>
          ))}
          <S.ItemContainer>
            <S.Key err={actionData?.errors?.document}>
              {actionData?.errors?.document ?? data.document.documentName}
            </S.Key>

            <S.Item
              id={data.document.documentName}
              required
              name={data.document.documentName}
              type='text'
              key={data.document.documentName}
              defaultValue={data.document.value}
              autoComplete="false"
              disabled={!isActive}
              onChange={handleChange(data.document.documentName)}
              err={actionData?.errors?.document}
            />
          </S.ItemContainer>
        </S.DataContainer>

        {userType === 'delegate' ?
          <S.ColumnDataContainer>
            <S.Key>
              Idiomas que pode simular
            </S.Key>

            {languages?.map((item, index) => (
              <S.CheckboxButton
                key={`language-${index}`}
                disabled={!isActive}
                onClick={e => { e.preventDefault(); handleLanguageChange(item) }}
              >
                <S.CheckboxIcon disabled={!isActive}>
                  <FiX />
                </S.CheckboxIcon>

                <S.CheckboxLabel
                  disabled={!isActive}
                >
                  {item}
                </S.CheckboxLabel>
              </S.CheckboxButton>
            ))}

            <S.Select
              ref={languagesRef}
              style={{ display: isActive ? 'block' : 'none' }}
              disabled={!isActive}
              onChange={event => {
                languages.find(el => el.language === event.target.value) ?
                  undefined : event.target.value === 'Adicionar idioma' ?
                    undefined : handleLanguageChange(event.target.value)
                languagesRef.current.value = "Adicionar idioma"
              }}
              defaultValue="Adicionar idioma"
              key={`${data.name}-languages`}
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
          :
          <S.ColumnDataContainer>
            <S.Key>
              Posição do orientador
            </S.Key>

            <S.Select
              disabled={!isActive}
              onChange={handleChange('advisorRole')}
              key={delegationAdvisor.advisorRole}
              defaultValue={delegationAdvisor.advisorRole}
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
        }
      </S.DataColumn>

      <S.DataColumn>
        {userType === 'delegate' ?
          <S.ColumnDataContainer>
            <S.Key>
              Preferencia de Conselho
            </S.Key>

            <S.DragDropContainer key={`${data.name}-languages`}>
              <S.DragDropIndexes>
                {councilPreference?.map((item, index) => (
                  <div key={`dropdown-index-${index}`}>
                    {index + 1}.
                  </div>
                ))}
              </S.DragDropIndexes>

              <DragDropContext onDragEnd={handleCouncilPreference}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                      {councilPreference?.map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index} isDragDisabled={!isActive} style={{ willChange: "unset" }}>
                          {(provided, snapshot) => (
                            <S.ListItemContainer
                              first={index === 0}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <S.ListItem
                                first={index === 0}
                                {...provided.dragHandleProps}
                              >
                                {item}
                              </S.ListItem>
                            </S.ListItemContainer>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </S.DragDropContainer>
          </S.ColumnDataContainer>
          :
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
                  onChange={handleSocialMediaChange(item)}
                />

              </S.SMContainer>
            ))}
          </S.ColumnDataContainer>
        }
      </S.DataColumn>
    </>
  )
}

const data = () => {

  const fetcher = useFetcher()
  const transition = fetcher.state
  const actionData = fetcher.data

  const { delegate, delegationAdvisor, ...data } = { ...useUser() }

  const userType = useUserType()

  const [languages, setLanguages] = useState(delegate?.languagesSimulates)
  const [councilPreference, setCouncilPreference] = useState(delegate?.councilPreference)
  const [socialMedias, setSocialMedias] = useState(delegationAdvisor?.socialMedia)
  const [changes, setChanges] = useState([])
  const [isActive, setIsActive] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (changes.length > 0) {
      fetcher.submit(e.currentTarget, { replace: true })
    } else {
      setIsActive(!isActive)
    }
  }

  const handleChange = name => event => {
    setChanges((current) => [...current.filter((change) => change?.target !== name)])

    if (name === 'councilPreference') {
      if (delegate?.councilPreference != event.target.value) setChanges(current => [...current, { target: name, change: event.target.value, userChange: true }])
    } else if (name === 'advisorRole') {
      if (delegationAdvisor?.advisorRole != event.target.value) setChanges(current => [...current, { target: name, change: event.target.value, userChange: true }])
    } else if (data[name] != event.target.value) {
      setChanges(current => [...current, { target: name, change: event.target.value, userChange: true }])
    }
  }

  const handleLanguageChange = lng => {
    setChanges((current) => [...current.filter((el) => el?.target !== 'language')])

    if (languages.includes(lng)) {
      setLanguages((current) => [...current.filter((el) => el !== lng)])
    } else {
      setLanguages((current) => [...current, lng])
    }
  }

  useEffect(() => {
    if (
      (!languages?.every(item => delegate.languagesSimulates.includes(item)) ||
        !delegate.languagesSimulates?.every(item => languages.includes(item))) &&
      languages?.length > 0
    ) {
      setChanges((current) => [...current, { target: 'language', change: languages, userChange: true }])
    }
  }, [languages])

  const handleSocialMediaChange = sm => event => {
    setChanges((current) => [...current.filter((el) => el?.target !== "sm")])

    setSocialMedias((current) => [...current.filter((el) => el.socialMediaName !== sm)])
    if (socialMedias.includes({ socialMediaName: sm, username: event.target.value })) {
      setSocialMedias((current) => [...current, { username: event.target.value, socialMediaName: sm }])
    } else {
      setSocialMedias((current) => [...current, { username: event.target.value, socialMediaName: sm }])
    }
  }

  useEffect(() => {
    if (
      (!socialMedias?.every(item => delegationAdvisor.socialMedia.find(el => el.username === item.username)) ||
        !delegationAdvisor.socialMedia.every(item => socialMedias.find(el => el.username === item.username))) &&
      socialMedias?.length > 0
    ) {
      setChanges((current) => [...current, { target: 'sm', change: socialMedias, userChange: true }])
    }
  }, [socialMedias])

  const handleCouncilPreference = (result) => {
    if (!result.destination || !isActive) {
      return;
    }

    const newItems = [...councilPreference];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setChanges((current) => [...current.filter((change) => change?.target !== "councilPreference")])

    if (!newItems.every((item, i) => i === delegate.councilPreference.indexOf(item)) && !delegate.councilPreference.every((item, i) => i === newItems.indexOf(item))) {
      setChanges(current => [...current, { target: "councilPreference", change: newItems, userChange: true }])
    }

    setCouncilPreference(newItems);
  }

  /* useEffect(() => {
    console.log(actionData?.errors)
  }, [actionData]) */

  useEffect(() => {
    console.log(transition)
  }, [transition])

  useEffect(() => {
    console.log(actionData?.errors)
    if (transition === 'loading' && !actionData?.errors) {
      /* console.log('deactivate') */
      setIsActive(false)
      setChanges([])
    }
  }, [transition])

  return (
    <S.DataForm disabled={isActive} method="post">
      <S.DataTitle>
        Dados da Inscrição
        <S.ColorItem
          onClick={handleSubmit}
          color={!isActive ? 'blue' : changes.length > 0 ? 'green' : 'red'}
        >
          {transition !== 'idle' ? <><Spinner dim={18} color='green' /> Salvando</> : !isActive ? <><FiEdit /> Editar</> : changes.length > 0 ? <><FiCheck /> Salvar Alterações</> : <><FiX /> Cancelar</>}
        </S.ColorItem>
      </S.DataTitle>

      <S.DataWrapper>
        <EditUserData
          isActive={isActive}
          actionData={actionData}
          handleChange={handleChange}
          languages={languages}
          handleLanguageChange={handleLanguageChange}
          councilPreference={councilPreference}
          handleCouncilPreference={handleCouncilPreference}
          handleSocialMediaChange={handleSocialMediaChange}
          data={data}
          userType={userType}
          delegationAdvisor={delegationAdvisor}
          delegate={delegate}
        />
      </S.DataWrapper>

      <input type="hidden" name="userId" value={data.id} />
      <input type="hidden" name="changes" value={qs.stringify(changes)} />
    </S.DataForm>
  )
}

export default data