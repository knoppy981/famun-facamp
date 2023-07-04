import React, { useEffect, useState, useRef } from 'react'
import { useActionData, useFetcher, useSubmit, useTransition } from '@remix-run/react'
import { json } from '@remix-run/node'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import qs from 'qs'
import _ from 'lodash'

import { useUser, useUserType, checkUserInputData } from '~/utils'
import { getExistingUser, updateUser } from '~/models/user.server';

import * as S from '~/styled-components/dashboard/data'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'
import Spinner from '~/styled-components/components/spinner'
import { updateDelegation } from '~/models/delegation.server'
import { isoCountries } from '~/data/ISO-3661-1'


export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = qs.parse(formData.get("data"));
  const userId = formData.get("userId")

  let user
  let delegationId

  if (data === undefined) return json({ errors: { data: "Unknown error" } }, { status: 404 })

  // check if it is a delegation change or user change
  if (data.name) {
    user = data

    //delete useless values
    delete data.id
    delete data.delegationId
    delete data?.delegate.id
    delete data?.delegate.userId
    data.leader = data.leader === "true" ? true : false
    delete data?.delegationAdvisor.id
    delete data?.delegationAdvisor.userId

    // add update
    data.delegate ? data.delegate = { update: data.delegate } : delete data.delegate
    data.delegationAdvisor ? data.delegationAdvisor = { update: data.delegationAdvisor } : delete data.delegationAdvisor
  } else {
    // find user
    user = data.participants.find(delegate => delegate.id === userId)
    delegationId = data.id

    //delete useless values
    delete data.id
    delete data.address.id
    delete data.address.delegationId

    delete user.id
    delete user.delegationId
    delete user?.delegate.id
    delete user?.delegate.userId
    user.leader = user.leader === "true" ? true : false
    delete user?.delegationAdvisor.id
    delete user?.delegationAdvisor.userId

    // add update
    user.delegate ? user.delegate = { update: user.delegate } : delete user.delegate
    user.delegationAdvisor ? user.delegationAdvisor = { update: user.delegationAdvisor } : delete user.delegationAdvisor

    data.address = { update: data.address }
    data.participants = {
      update: {
        where: { id: userId },
        data: user
      }
    }
  }

  const userData = { name: user?.name, email: user?.email, document: { is: { value: user.document.value } } }
  let existingUser = await getExistingUser(userData)
  if (existingUser.id === userId) existingUser = {}

  try {
    console.dir(data, { depth: null })
    checkUserInputData([
      { key: "email", value: user.email, errorMessages: { undefined: "E-mail is required", invalid: "Invalid e-mail", existingUser: "E-mail already taken" }, valuesToCompare: [existingUser?.email] },
      { key: "name", value: user.name, errorMessages: { undefined: "Name is required", invalid: "Invalid name", existingUser: "Name already taken" }, valuesToCompare: [existingUser?.name] },
      { key: "cpf", value: user.document.value, errorMessages: { undefined: "Cpf is required", invalid: "Invalid cpf", existingUser: "Cpf already taken" }, valuesToCompare: [existingUser?.document?.value], dontValidate: user.document.documentName !== "cpf" },
      { key: "passport", value: user.document.value, errorMessages: { undefined: "Passport number is required", invalid: "Invalid passport number", existingUser: "Passport number already taken" }, valuesToCompare: [existingUser?.document?.value], dontValidate: user.document.documentName !== "passport" },
      { key: "birthDate", value: user.birthDate, errorMessages: { undefined: "Birth date is required", invalid: "Invalid birth date" } },
      { key: "phoneNumber", value: user.phoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" } },
      { key: "emergencyContactName", value: user.delegate?.update.emergencyContactName, errorMessages: { undefined: "Name is required", invalid: "Invalid name" }, dontValidate: user.delegate ? false : true },
      { key: "emergencyContactPhoneNumber", value: user.delegate?.update.emergencyContactPhoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }, dontValidate: user.delegate ? false : true },
      { key: "languagesSimulates", value: user.delegate?.update.languagesSimulates, errorMessages: { undefined: "Select at least one language", invalid: "Invalid language" }, dontValidate: user.delegate ? false : true },

      { key: "schoolName", value: data.school, errorMessages: { undefined: "School / University name is required", invalid: "Invalid name", existingUser: "School / University already registered" }, dontValidate: data.name ? true : false },
      { key: "schoolPhoneNumber", value: data.schoolPhoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }, dontValidate: data.name ? true : false },
      { key: "address", value: data.address?.update.address, errorMessages: { undefined: "Address is required", invalid: "Invalid address" }, dontValidate: data.name ? true : false },
      { key: "country", value: data.address?.update.country, errorMessages: { undefined: "Address is required", invalid: "Invalid address" }, dontValidate: data.name ? true : false },
      { key: "postalCode", value: data.address?.update.postalCode, errorMessages: { undefined: "Postal code is required", invalid: "Invalid postal code" }, auxValue: data?.country, dontValidate: data.name ? true : false },
      { key: "state", value: data.address?.update.state, errorMessages: { undefined: "State is required", invalid: "Invalid state" }, dontValidate: data.name ? true : false },
      { key: "city", value: data.address?.update.city, errorMessages: { undefined: "City is required", invalid: "Invalid city" }, dontValidate: data.name ? true : false },
      { key: "neighborhood", value: data.address?.update.neighborhood, errorMessages: { undefined: "Neighborhood is required", invalid: "Invalid Neighborhood" }, dontValidate: data.name ? true : false },
    ])
  } catch (error) {
    console.log(error)
    error = qs.parse(error.message)
    console.log(error.key)
    return json(
      { errors: { [error.key]: error.msg } },
      { status: 400 }
    );
  }

  // atualizar usuario ou delegacao

  if (data.name) {
    return updateUser({ userId, values: data })
  } else {
    return updateDelegation({ delegationId: delegationId, values: data })
  }
}

export const EditUserData = ({
  allowChanges = true,
  actionData,
  formData,
  handleChange,
  handleAddLanguage,
  handleRemoveLanguage,
  handleCouncilPreference,
  userType
}) => {

  const containerRef = useRef(null);
  const isWrapped = useWrapChange(containerRef);

  return (
    <S.Wrapper ref={containerRef} isWrapped={isWrapped}>
      <S.Column>
        <S.Container key="personal-data-container">
          <S.ContainerTitle border="red">
            Dados Pessoais
          </S.ContainerTitle>

          <S.InputContainer>
            {[
              ["Name", "name", "text"],
              ["Email", "email", "email"],
            ].map((item, index) => (
              <React.Fragment key={index}>
                <S.Label err={actionData?.errors?.[item[1]]} key={`label-${item[1]}`} first={index === 0}>
                  {actionData?.errors?.[item[1]] ?? item[0]}
                </S.Label>

                <S.Input
                  id={item[1]}
                  required
                  name={item[1]}
                  type={item[2]}
                  key={`${formData?.id}-${item[0]}`}
                  value={formData?.[item[1]]}
                  onChange={handleChange}
                  disabled={!allowChanges}
                  autoComplete="false"
                  err={actionData?.errors?.[item[1]]}
                />
              </React.Fragment>
            ))}

            <S.Label err={actionData?.errors?.phoneNumber} key={`label-phoneNumber`}>
              {actionData?.errors?.phoneNumber ? actionData?.errors?.phoneNumber : "Phone Number"}
            </S.Label>

            <S.PhoneNumberInput
              id="phoneNumber"
              required
              name="phoneNumber"
              type='text'
              key={`${formData?.id}-phoneNumber`}
              value={formData?.phoneNumber}
              onChange={value => handleChange({ target: { name: "phoneNumber", value: value } })}
              disabled={!allowChanges}
              autoComplete="false"
              err={actionData?.errors?.phoneNumber}
            />

            <S.Label err={actionData?.errors?.birthDate} key={`label-birthDate`}>
              {actionData?.errors?.birthDate ? actionData?.errors?.birthDate : "Birth Date"}
            </S.Label>

            <S.DateInput
              id="birthDate"
              required
              name="birthDate"
              type='text'
              key={`${formData?.id}-birthDate`}
              value={formData?.birthDate}
              onChange={handleChange}
              disabled={!allowChanges}
              autoComplete="false"
              err={actionData?.errors?.birthDate}
            />

            <S.Label err={actionData?.errors?.nacionality} key={`label-nacionality`}>
              {actionData?.errors?.nacionality ? actionData?.errors?.nacionality : "Nacionality"}
            </S.Label>

            <S.GridInput>
              <S.Select
                id="Nacionality"
                required
                name="nacionality"
                type='text'
                key={`${formData.id}-nacionality`}
                value={formData?.nacionality}
                onChange={handleChange}
                disabled={!allowChanges}
                autoComplete="false"
                err={actionData?.errors?.nacionality}
              >
                {Object.keys(isoCountries).map((item, index) => (
                  <option key={`country-${item}`}>{item}</option>
                ))}
              </S.Select>
            </S.GridInput>

            <S.Label err={actionData?.errors?.[formData?.nacionality === "Brazil" ? "cpf" : "passport"]} key={`label-document`}>
              {actionData?.errors?.[formData?.nacionality === "Brazil" ? "cpf" : "passport"] ? actionData?.errors?.[formData?.nacionality === "Brazil" ? "cpf" : "passport"] : formData?.nacionality === "Brazil" ? "Cpf" : "Passport"}
            </S.Label>

            <S.Input
              id={formData?.nacionality === "Brazil" ? "cpf" : "passport"}
              required
              name="document.value"
              type='text'
              key={formData?.nacionality === "Brazil" ? `${formData?.id}-cpf` : `${formData?.id}-passport`}
              value={formData?.document?.value}
              onChange={handleChange}
              disabled={!allowChanges}
              autoComplete="false"
              err={actionData?.errors?.[formData?.nacionality === "Brazil" ? "cpf" : "passport"]}
              mask={formData?.nacionality === "Brazil" ? '999.999.999-99' : null}
            />
          </S.InputContainer>
        </S.Container>

        {userType === 'delegate' ?
          <S.Container key="emergency-contact-container">
            <S.ContainerTitle border="red">
              Contato de Emergencia
            </S.ContainerTitle>

            <S.InputContainer>
              <S.Label err={actionData?.errors?.emergencyContactName}>
                {actionData?.errors?.emergencyContactName ?? "Name"}
              </S.Label>

              <S.Input
                id="delegate.emergencyContactName"
                required
                name="delegate.emergencyContactName"
                type="text"
                key={`${formData?.name}-emergencyContactName`}
                defaultValue={formData?.delegate?.emergencyContactName}
                onChange={handleChange}
                disabled={!allowChanges}
                autoComplete="false"
                err={actionData?.errors?.emergencyContactName}
              />

              <S.Label err={actionData?.errors?.emergencyContactPhoneNumber}>
                {actionData?.errors?.emergencyContactPhoneNumber ?? "Phone Number"}
              </S.Label>

              <S.PhoneNumberInput
                id="delegate.emergencyContactPhoneNumber"
                required
                name="delegate.emergencyContactPhoneNumber"
                type='text'
                key={`${formData?.id}-emergencyContactPhoneNumber`}
                value={formData?.delegate?.emergencyContactPhoneNumber}
                onChange={value => handleChange({ target: { name: "delegate.emergencyContactPhoneNumber", value: value } })}
                disabled={!allowChanges}
                autoComplete="false"
                err={actionData?.errors?.phoneNumber}
              />
            </S.InputContainer>
          </S.Container>
          :
          <S.Container key="advisor-role-container">
            <S.ContainerTitle border="red">
              Posição do orientador
            </S.ContainerTitle>

            <S.Select
              name="delegationAdvisor.advisorRole"
              onChange={handleChange}
              key={`${formData?.name}-advisorRole`}
              defaultValue={formData?.delegationAdvisor?.advisorRole}
              disabled={!allowChanges}
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
          </S.Container>
        }
      </S.Column>

      <S.Column>
        {userType === 'delegate' ?
          <>
            <S.Container key="council-preference-container">
              <S.ContainerTitle>
                Preferencia de Conselho
              </S.ContainerTitle>

              <S.DragDropContainer key={`${formData?.name}-councilPreferences`}>
                <S.DragDropIndexes>
                  {formData?.delegate?.councilPreference?.map((item, index) => (
                    <div key={`dropdown-index-${index}`}>
                      {index + 1}.
                    </div>
                  ))}
                </S.DragDropIndexes>

                <DragDropContext onDragEnd={handleCouncilPreference}>
                  <Droppable droppableId="list">
                    {(provided) => (
                      <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {formData?.delegate?.councilPreference?.map((item, index) => (
                          <Draggable key={item} draggableId={item} index={index} isDragDisabled={!allowChanges} style={{ willChange: "unset" }}>
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
                                  {item.replace(/_/g, ' ')}
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
            </S.Container>

            <S.Container key="language-simulates-container">
              <S.ContainerTitle err={actionData?.errors?.languagesSimulates} border="green">
                {actionData?.errors?.languagesSimulates ?? `Idiomas que pode simular`}
              </S.ContainerTitle>

              {formData?.delegate?.languagesSimulates?.map((language, index) => (
                <S.CheckboxButton
                  key={`${formData?.id}-language-${index}`}
                  disabled={!allowChanges}
                  onClick={() => allowChanges ? handleRemoveLanguage(language) : null}
                >
                  <S.CheckboxIcon disabled={!allowChanges}>
                    <FiX />
                  </S.CheckboxIcon>

                  <S.CheckboxLabel
                    disabled={!allowChanges}
                  >
                    {language}
                  </S.CheckboxLabel>
                </S.CheckboxButton>
              ))}

              <S.Select
                name="languages"
                style={{ display: allowChanges ? 'block' : 'none' }}
                onChange={event => event.target.value !== "Adicionar idioma" && allowChanges ? handleAddLanguage(event) : null}
                defaultValue="Adicionar idioma"
                key={`${formData?.name}-languages`}
              >
                {[
                  'Adicionar idioma',
                  'Portugues',
                  'Ingles',
                  'Espanhol',
                ].map((language, index) => (
                  <S.Option
                    key={`${formData?.name}-language-option-${index}`}
                  >
                    {language}
                  </S.Option>
                ))}
              </S.Select>
            </S.Container>
          </>
          :
          <S.Container key="social-medias-container">
            <S.ContainerTitle border="green">
              Redes Sociais
            </S.ContainerTitle>

            {["Instagram", "Facebook", "Linkedin"].map((socialMedia, index) => (
              <S.SMContainer
                key={`${formData?.name}-socialMedia-${index}`}
              >
                <S.SMLabel
                  disabled={false}
                >
                  {socialMedia}
                </S.SMLabel>

                <S.SMInput
                  id={formData?.delegationAdvisor?.[socialMedia]}
                  required
                  name={`delegationAdvisor.${socialMedia}`}
                  type="text"
                  defaultValue={formData?.delegationAdvisor?.[socialMedia]}
                  placeholder="adicionar"
                  autoComplete="false"
                  disabled={!allowChanges}
                  onChange={handleChange}
                />

              </S.SMContainer>
            ))}
          </S.Container>
        }
      </S.Column>
    </S.Wrapper>
  )
}

const useWrapChange = (ref) => {
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      const children = ref.current.children;
      if (children.length < 2) return;
      setIsWrapped(children[0].offsetTop !== children[1].offsetTop);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // check on mount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return isWrapped;
};

const data = () => {

  const fetcher = useFetcher()
  const transition = fetcher.state
  const actionData = fetcher.data

  const user = useUser()
  const userType = useUserType()

  const [[readySubmission, dataChangeActive], setReadySubmission] = useState([false, false])

  const [formData, setFormData] = useState(_.cloneDeep(user));

  useEffect(() => {
    if (!_.isEqual(formData, user) && dataChangeActive) {
      setReadySubmission([true, true])
    } else {
      setReadySubmission([false, dataChangeActive])
    }
  }, [formData])

  useEffect(() => {
    if (transition === 'loading' && !actionData?.errors) {
      setFormData(_.cloneDeep(actionData))
      setReadySubmission([false, false])
    }
  }, [transition])

  const handleSubmission = (e) => {
    e.preventDefault()

    if (readySubmission) {
      fetcher.submit(e.currentTarget, { replace: true })
    } else {
      setReadySubmission([readySubmission, !dataChangeActive])
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      // Copy the existing state
      let newData = { ...prevState };

      // Check if the name includes a '.'
      if (name.includes('.')) {
        const [field, nestedField] = name.split('.');

        // Check if the data object has the field and if the field is an object
        if (newData[field] && typeof newData[field] === 'object') {
          newData[field][nestedField] = value;
        } else {
          newData[field] = { [nestedField]: value };
        }
      } else {
        newData[name] = value;
      }

      if (name === "nacionality") {
        newData.document.documentName = value === "Brazil" ? "cpf" : "passport"
        newData.document.value = ""
      }

      // Return the updated state
      return newData;
    });
  };

  const handleAddLanguage = (event) => {
    const newLanguage = event.target.value;
    if (!formData.delegate.languagesSimulates.includes(newLanguage)) {
      setFormData({
        ...formData,
        delegate: {
          ...formData.delegate,
          languagesSimulates: [...formData.delegate.languagesSimulates, newLanguage],
        },
      });
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData({
      ...formData,
      delegate: {
        ...formData.delegate,
        languagesSimulates: formData.delegate.languagesSimulates.filter(lang => lang !== language),
      },
    });
  };

  const handleCouncilPreference = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(formData.delegate.councilPreference);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormData(prevState => ({
      ...prevState,
      delegate: {
        ...prevState.delegate,
        councilPreference: items,
      }
    }));
  }

  return (
    <S.DataForm method="post">
      <S.DataTitle>
        Dados da Inscrição
        <S.ColorItem
          color={
            dataChangeActive ?
              readySubmission ?
                'green' :
                'red' :
              'blue'
          }
          onClick={handleSubmission}
        >
          {fetcher.state !== 'idle' ?
            <><Spinner dim={18} color='green' /> Salvando</> :
            !dataChangeActive ?
              <><FiEdit /> Editar Dados</> :
              readySubmission ?
                <><FiCheck /> Salvar Alterações</> :
                <><FiX /> Cancelar</>}
        </S.ColorItem>
      </S.DataTitle>

      <EditUserData
        allowChanges={dataChangeActive}
        actionData={actionData}
        formData={formData}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        handleCouncilPreference={handleCouncilPreference}
        userType={userType}
      />

      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="data" value={qs.stringify(formData)} />
    </S.DataForm >
  )
}

export default data