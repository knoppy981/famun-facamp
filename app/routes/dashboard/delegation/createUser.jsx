import { json } from "@remix-run/node"
import { useFetcher, useOutletContext } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import qs from "qs"
import { useOverlayTriggerState } from "react-stately";
import { useOverlayTrigger } from "react-aria";

import { createUser, formatUserData, getExistingUser } from "~/models/user.server"
import { joinDelegationById } from "~/models/delegation.server"
import { useOnScreen } from "~/hooks/useOnScreen";
import { useUser, useUserType, generatePassword } from "~/utils";

import * as P from '~/styled-components/dashboard/data'
import * as S from "~/styled-components/dashboard/delegation"
import EditUserData from '~/styled-components/components/dataBox/user';
import Spinner from "~/styled-components/components/spinner";
import { FiUserPlus } from "react-icons/fi";
import { prismaUserSchema } from "~/schemas";
import Modal from "~/styled-components/components/modalOverlay";


export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationId = formData.get("delegationId")

  let userData = {
    ...qs.parse(formData.get("data")),
    password: generatePassword(),
  }

  userData = await formatUserData(userData)

  let user

  try {
    await prismaUserSchema.validateAsync(userData)
    await getExistingUser({
      name: userData.name ?? "",
      email: userData.email ?? "",
      document: { is: { value: userData.document.value ?? "" } }
    })

    user = await createUser(userData)

    await joinDelegationById(delegationId, user.id)
  } catch (error) {
    console.dir(error, { depth: null })
    return json(
      { errors: { [error.details[0].context.key ?? "error"]: error.details[0].message ?? error } },
      { status: 400 }
    );
  }

  return json({})
}

const CreateUser = () => {
  const [buttonRef, isRefVisible] = useOnScreen();
  const delegation = useOutletContext()
  const delegatesCount = delegation.participants.filter(user => user.delegate !== null).length
  const user = useUser()
  const userType = useUserType()
  const fetcher = useFetcher()
  const { creatingUserType, handleCreatingUserTypeChange, allowCreation, formData, setFormData } =
    useUserCreation(user, userType, fetcher, delegatesCount)
  const handleSubmission = (e) => {
    e.preventDefault()
    fetcher.submit(e.currentTarget, { replace: true })
  }
  function handleChange(event) {
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
  function handleAddLanguage(event) {
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
  function handleRemoveLanguage(language) {
    setFormData({
      ...formData,
      delegate: {
        ...formData.delegate,
        languagesSimulates: formData.delegate.languagesSimulates.filter(lang => lang !== language),
      },
    });
  };

  const state = useOverlayTriggerState({});

  return (
    <S.DataForm disabled={!allowCreation} method="post">
      <button onClick={state.toggle}>asdasdasd</button>

      {state.isOpen && <Modal state={state} isDismissable></Modal>}
      <S.DataTitleBox>
        <S.DataTitle>
          {allowCreation ?
            <P.ColorItem
              onClick={handleSubmission}
              color={fetcher.state !== 'idle' ? "blue" : allowCreation ? "green" : "gray"}
              disabled={!allowCreation}
              ref={buttonRef}
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Adicionando</> :
                <><FiUserPlus /> Adicionar Participante</>}
            </P.ColorItem> :
            "Somente o líder da delegação e os orientadores podem adicionar participantes manualmente"
          }
        </S.DataTitle>
      </S.DataTitleBox>

      <S.DataTitleBox
        style={{
          pointerEvents: allowCreation ? 'auto' : 'none',
          opacity: allowCreation ? 1 : 0.5,
        }}
      >
        <S.DataSubTitle>
          Tipo do participante
        </S.DataSubTitle>

        <S.UserSelect
          onChange={handleCreatingUserTypeChange}
          disabled={!allowCreation}
        >
          {["delegate", "delegationAdvisor"].map((type, index) => (
            <option
              style={{ whiteSpace: 'pre' }}
              key={type}
              value={type}
            >
              {type === "delegate" ? "Delegado" : "Professor(a) Orientador(a)"}
            </option>
          ))}
        </S.UserSelect>

        {creatingUserType === "delegate" && allowCreation ?
          <S.DelegateCountdown>
            <P.ColorItem color="red" disabled>
              {10 - delegatesCount} vagas restantes para delegados
            </P.ColorItem>
          </S.DelegateCountdown> :
          null
        }
      </S.DataTitleBox>

      <EditUserData
        isDisabled={!allowCreation}
        actionData={fetcher.data}
        formData={formData}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        userType={creatingUserType}
      />

      <AnimatePresence>
        {allowCreation && !isRefVisible && (
          <S.StickyButton
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <P.ColorItem
              onClick={handleSubmission}
              boxShadow
              color={fetcher.state !== 'idle' ? "blue" : allowCreation ? "green" : "gray"}
              disabled={!allowCreation}
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Adicionando</> :
                <><FiUserPlus /> Adicionar Participante</>}
            </P.ColorItem>
          </S.StickyButton>
        )}
      </AnimatePresence>

      <input type="hidden" name="data" value={qs.stringify(formData)} />
      <input type="hidden" name="delegationId" value={delegation.id} />

    </S.DataForm >
  )
}

function useUserCreation(user, userType, fetcher, delegatesCount) {
  const normalUser = {
    /* email: '',
    name: '',
    document: { documentName: 'cpf', value: '' },
    phoneNumber: '',
    birthDate: '',
    nacionality: 'Brazil',
    delegate: {
      emergencyContactName: '',
      emergencyContactPhoneNumber: '',
      councilPreference: [
        'Conselho_de_Seguranca_da_ONU',
        'Rio_92',
        'Assembleia_Geral_da_ONU',
        'Conselho_de_Juventude_da_ONU'
      ],
      languagesSimulates: []
    },
    delegationAdvisor: {
      advisorRole: 'Professor',
      Facebook: '',
      Instagram: '',
      Linkedin: ''
    } */
    email: 'kasjdhakjsd@gmail.com',
    name: 'kjasdhakjsd',
    document: { documentName: 'passport', value: '092832093' },
    phoneNumber: '+55 19 99283 3233',
    birthDate: '2000-06-23',
    nacionality: 'Angola',
    delegate: {
      emergencyContactName: 'aklsdjd',
      emergencyContactPhoneNumber: '+55 19 99283 3239',
      councilPreference: [
        'Conselho_de_Seguranca_da_ONU',
        'Rio_92',
        'Assembleia_Geral_da_ONU',
        'Conselho_de_Juventude_da_ONU'
      ],
      languagesSimulates: ['Portugues']
    },
    delegationAdvisor: {
      advisorRole: 'Professor',
      Facebook: '',
      Instagram: '',
      Linkedin: ''
    }
  }

  const [creatingUserType, setCreatingUserType] = React.useState("delegationAdvisor")
  const [allowCreation, setAllowCreation] = React.useState(false)
  const [formData, setFormData] = React.useState(normalUser)

  React.useEffect(() => {
    // update the variable that decides if the user can create a user
    setAllowCreation(() => {
      if (creatingUserType === "delegate" && delegatesCount > 10) {
        return false
      } else if (userType === "delegationAdvisor" || user.leader) {
        return true
      } else {
        return false
      }
    })
  }, [creatingUserType])

  React.useEffect(() => {
    // update the default value for the user being created
    setFormData((prevState) => {
      let newData = { ...prevState }
      newData.delegate = creatingUserType === "delegate" ? normalUser.delegate : null
      newData.delegationAdvisor = creatingUserType === "delegationAdvisor" ? normalUser.delegationAdvisor : null
      return newData
    })
  }, [creatingUserType])

  React.useEffect(() => {
    // setting data back to default after creating user
    if (fetcher?.data?.name === formData.name) setFormData(normalUser)
  }, [fetcher])

  const handleCreatingUserTypeChange = () => {
    setCreatingUserType(prevState => prevState === "delegate" ? "delegationAdvisor" : "delegate")
  }

  return {
    creatingUserType,
    allowCreation,
    formData,
    setFormData,
    handleCreatingUserTypeChange
  }
}

export default CreateUser