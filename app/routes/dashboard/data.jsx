import { useFetcher } from '@remix-run/react'
import { json } from '@remix-run/node'
import { AnimatePresence } from 'framer-motion'
import qs from 'qs'
import _ from 'lodash'


import { useUser, useUserType } from '~/utils'
import { getExistingUser, updateUser } from '~/models/user.server';
import { updateDelegation } from '~/models/delegation.server'
import { useOnScreen } from '~/hooks/useOnScreen';

import * as S from '~/styled-components/dashboard/data'
import Spinner from '~/styled-components/components/spinner'
import EditUserData from '~/styled-components/components/dataBox/user';
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor'
import Button from '~/styled-components/components/button'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'


export const action = async ({ request }) => {
  const formData = await request.formData();
  const { userId: id, ...data } = qs.parse(formData.get("data"))

  if (data === undefined) return json({ errors: { data: "Unknown error" } }, { status: 404 })

  //delete useless values
  delete data?.delegate.id
  delete data?.delegate.userId
  data.leader = data.leader === "true" ? true : false
  delete data?.delegationAdvisor.id
  delete data?.delegationAdvisor.userId

  // add update
  data.delegate ? data.delegate = { update: data.delegate } : delete data.delegate
  data.delegationAdvisor ? data.delegationAdvisor = { update: data.delegationAdvisor } : delete data.delegationAdvisor


  const userData = { name: user?.name, email: user?.email, document: { is: { value: user.document.value } } }
  let existingUser = await getExistingUser(userData)
  if (existingUser.id === userId) existingUser = {}

  try {
    console.dir(data, { depth: null })
    checkUserInputData([
      {
        key: "email",
        value: user.email,
        errorMessages: { undefined: "E-mail is required", invalid: "Invalid e-mail", existingUser: "E-mail already taken" },
        valuesToCompare: [existingUser?.email]
      },
      {
        key: "name",
        value: user.name,
        errorMessages: { undefined: "Name is required", invalid: "Invalid name", existingUser: "Name already taken" },
        valuesToCompare: [existingUser?.name]
      },
      {
        key: "cpf",
        value: user.document.value,
        errorMessages: { undefined: "Cpf is required", invalid: "Invalid cpf", existingUser: "Cpf already taken" },
        valuesToCompare: [existingUser?.document?.value],
        dontValidate: user.document.documentName !== "cpf"
      },
      {
        key: "passport",
        value: user.document.value,
        errorMessages: { undefined: "Passport number is required", invalid: "Invalid passport number", existingUser: "Passport number already taken" },
        valuesToCompare: [existingUser?.document?.value],
        dontValidate: user.document.documentName !== "passport"
      },
      {
        key: "birthDate",
        value: user.birthDate,
        errorMessages: { undefined: "Birth date is required", invalid: "Invalid birth date" }
      },
      {
        key: "phoneNumber",
        value: user.phoneNumber,
        errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }
      },
      {
        key: "emergencyContactName",
        value: user.delegate?.update.emergencyContactName,
        errorMessages: { undefined: "Name is required", invalid: "Invalid name" },
        dontValidate: user.delegate ? false : true
      },
      {
        key: "emergencyContactPhoneNumber",
        value: user.delegate?.update.emergencyContactPhoneNumber,
        errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" },
        dontValidate: user.delegate ? false : true
      },
      {
        key: "languagesSimulates",
        value: user.delegate?.update.languagesSimulates,
        errorMessages: { undefined: "Select at least one language", invalid: "Invalid language" },
        dontValidate: user.delegate ? false : true
      },
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

  return updateUser({ userId, values: data })
}

const data = () => {

  const fetcher = useFetcher()
  const transition = fetcher.state
  const actionData = fetcher.data

  const [buttonRef, isRefVisible] = useOnScreen();

  const user = useUser()
  const userType = useUserType()

  const [readySubmission, setReadySubmission] = React.useState(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState(false)
  const [formData, setFormData] = React.useState(_.cloneDeep(user));

  // useEffect for every data change
  React.useEffect(() => {
    // if input values are different than user data allow form submission
    setReadySubmission(!_.isEqual(formData, user) && userWantsToChangeData)
  }, [formData])

  // useEffect for successful submission of data change form
  React.useEffect(() => {
    // if loading back data and no errors, set every state back to default
    if (transition === 'loading' && !actionData?.errors) {
      setFormData(_.cloneDeep(actionData))
      setReadySubmission(false)
      setUserWantsToChangeData(false)
    }
  }, [fetcher])

  const handleSubmission = () => {
    if (readySubmission) {
      fetcher.submit(
        { data: qs.stringify(formData) },
        { replace: true, method: "post" }
      )
    } else {
      setUserWantsToChangeData(!userWantsToChangeData)
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

  return (
    <S.Wrapper method="post">
      <S.DataTitle ref={buttonRef}>
        Dados da Inscrição
        <ColorButtonBox color={userWantsToChangeData ? readySubmission ? 'green' : 'red' : 'blue'}>
          <Button onPress={handleSubmission}>
            {fetcher.state !== 'idle' ?
              <><Spinner dim={18} color='green' /> Salvando</> :
              !userWantsToChangeData ?
                <><FiEdit /> Editar Dados</> :
                readySubmission ?
                  <><FiCheck /> Salvar Alterações</> :
                  <><FiX /> Cancelar</>}
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
            <S.ColorItem
              color={userWantsToChangeData ? readySubmission ? 'green' : 'red' : 'blue'}
              boxShadow={true}
              onClick={handleSubmission}
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Salvando</> :
                !userWantsToChangeData ? <><FiEdit /> Editar Dados</> :
                  readySubmission ?
                    <><FiCheck /> Salvar Alterações</> :
                    <><FiX /> Cancelar</>}
            </S.ColorItem>
          </S.StickyButton>}
      </AnimatePresence>
    </S.Wrapper >
  )
}

export default data