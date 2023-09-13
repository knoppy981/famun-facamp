import { useFetcher } from '@remix-run/react'
import { json } from '@remix-run/node'
import { AnimatePresence } from 'framer-motion'
import qs from 'qs'
import _ from 'lodash'


import { getCorrectErrorMessage, useUser, useUserType } from '~/utils'
import { formatUserData, getExistingUser, updateUser } from '~/models/user.server';
import { useOnScreen } from '~/hooks/useOnScreen';

import * as S from '~/styled-components/dashboard/data'
import Spinner from '~/styled-components/components/spinner'
import EditUserData from '~/styled-components/components/dataBox/user';
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor'
import Button from '~/styled-components/components/button'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { prismaUserSchema } from '~/schemas'
import React from 'react'


export const action = async ({ request }) => {
  const formData = await request.formData();
  let { id, ...userData } = qs.parse(formData.get("data"))

  userData = await formatUserData({
    data: userData,
    childrenModification: "update",
    userType: userData.delegate ? "delegate" : "advisor"
  })

  if (userData === undefined) return json({ errors: { data: "Unknown error" } }, { status: 404 })

  try {
    await prismaUserSchema.validateAsync(userData)
    await getExistingUser({
      name: userData.name ?? "",
      email: userData.email ?? "",
      document: { is: { value: userData.document.value ?? "" } },
      userId: id
    })
  } catch (error) {
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  return updateUser({ userId: id, values: userData })
}

const data = () => {

  const fetcher = useFetcher()
  const actionData = fetcher.data
  const [buttonRef, isRefVisible] = useOnScreen();
  const user = useUser()
  const userType = useUserType()
  const { readySubmission, userWantsToChangeData, handleUserWantsToChangeData, formData, setFormData, } =
    useUserUpdate(user, fetcher)
  const [handleChange, handleAddLanguage, handleRemoveLanguage] =
    useUpdateStateFunctions(formData, setFormData)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state)
  const handleSubmission = () => {
    if (readySubmission) {
      fetcher.submit(
        { data: qs.stringify(formData) },
        { replace: true, method: "post" }
      )
    } else {
      handleUserWantsToChangeData()
    }
  }

  return (
    <S.Wrapper method="post">
      <S.DataTitle ref={buttonRef}>
        Dados da Inscrição
        <ColorButtonBox color={buttonColor}>
          <Button onPress={handleSubmission}>
            {buttonIcon} {buttonLabel}
          </Button>
        </ColorButtonBox>
      </S.DataTitle>

      <EditUserData
        isDisabled={!userWantsToChangeData}
        actionData={actionData}
        formData={formData}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        userType={userType}
      />

      <AnimatePresence>
        {!isRefVisible &&
          <S.StickyButton
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ColorButtonBox color={buttonColor} boxShadow={1}>
              <Button onClick={handleSubmission}>
                {buttonIcon} {buttonLabel}
              </Button>
            </ColorButtonBox>
          </S.StickyButton>}
      </AnimatePresence>
    </S.Wrapper >
  )
}

function useUserUpdate(user, fetcher) {
  const [readySubmission, setReadySubmission] = React.useState(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState(false)
  const [formData, setFormData] = React.useState(_.cloneDeep(user));
  const handleUserWantsToChangeData = () => {
    setUserWantsToChangeData(!userWantsToChangeData)
  }
  React.useEffect(() => {
    // if input values are different than user data allow form submission
    setReadySubmission(!_.isEqual(formData, user) && userWantsToChangeData)
  }, [formData])
  React.useEffect(() => {
    // if loading back data and no errors, set every state back to default
    if (fetcher.state === 'loading' && !fetcher.data?.errors) {
      setFormData(_.cloneDeep(fetcher.data))
      setReadySubmission(false)
      setUserWantsToChangeData(false)
    }
  }, [fetcher])

  return {
    readySubmission,
    userWantsToChangeData,
    handleUserWantsToChangeData,
    formData,
    setFormData,
  }
}

function useButtonState(userWantsToChangeData, readySubmission, transition) {
  const [buttonLabel, setButtonLabel] = React.useState("Editar Dados")
  const [buttonIcon, setButtonIcon] = React.useState(<FiEdit />)
  const [buttonColor, setButtonColor] = React.useState("blue")

  React.useEffect(() => {
    setButtonLabel(transition !== 'idle' ?
      "Salvando" :
      !userWantsToChangeData ?
        "Editar Dados" :
        readySubmission ?
          "Salvar Alterações" :
          "Cancelar")
    setButtonIcon(transition !== 'idle' ?
      <Spinner dim={18} color='green' /> :
      !userWantsToChangeData ?
        <FiEdit /> :
        readySubmission ?
          <FiCheck /> :
          <FiX />)
    setButtonColor(userWantsToChangeData ?
      readySubmission ? 'green' : 'red' :
      'blue')
  }, [userWantsToChangeData, readySubmission, transition])

  return [buttonLabel, buttonIcon, buttonColor]
}

function useUpdateStateFunctions(formData, setFormData) {
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
  const handleAddLanguage = (language) => {
    if (!formData.delegate.languagesSimulates.includes(language)) {
      setFormData({
        ...formData,
        delegate: {
          ...formData.delegate,
          languagesSimulates: [...formData.delegate.languagesSimulates, language],
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

  return [handleChange, handleAddLanguage, handleRemoveLanguage]
}

export default data