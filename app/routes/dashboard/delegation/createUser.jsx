import { json } from "@remix-run/node"
import { useFetcher, useOutletContext } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import qs from "qs"
import { useOverlayTriggerState } from "react-stately";
import { useOverlayTrigger } from "react-aria";

import { createUser, formatUserData, getExistingUser } from "~/models/user.server"
import { joinDelegationById } from "~/models/delegation.server"
import { useOnScreen } from "~/hooks/useOnScreen";
import { useUser, useUserType, generatePassword, getCorrectErrorMessage } from "~/utils";

import * as S from "~/styled-components/dashboard/delegation/createUser"
import EditUserData from '~/styled-components/components/dataBox/user';
import Spinner from "~/styled-components/components/spinner";
import { FiUserPlus } from "react-icons/fi";
import { prismaUserSchema } from "~/schemas";
import Modal from "~/styled-components/components/modalOverlay";
import ColorButtonBox from "~/styled-components/components/buttonBox/withColor";
import Button from "~/styled-components/components/button";
import Dialog from "~/styled-components/components/dialog";
import { Select, Item } from '~/styled-components/components/select';
import DataChangeInputBox from "~/styled-components/components/inputBox/dataChange";

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationId = formData.get("delegationId")

  let userData = {
    ...qs.parse(formData.get("data")),
    password: generatePassword(),
  }
  userData = await formatUserData({
    data: userData,
    childrenModification: "update",
    userType: userData.delegate ? "delegate" : "advisor"
  })
  let user

  try {
    await prismaUserSchema.validateAsync(userData)
    await getExistingUser({
      name: userData.name ?? "",
      email: userData.email ?? "",
      document: { is: { value: userData.document.value ?? "" } }
    })

    /* user = await createUser(userData)

    await joinDelegationById(delegationId, user.id) */
  } catch (error) {
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  return json({ user: { name: "jorge", id: "1298371928379182723", email: "jorge@gmail.com" } })
}

const CreateUser = () => {
  const [buttonRef, isRefVisible] = useOnScreen();
  const delegation = useOutletContext()
  const delegatesCount = delegation.participants.filter(user => user.delegate !== null).length
  const user = useUser()
  const userType = useUserType()
  const fetcher = useFetcher()
  const { creatingUserType, handleCreatingUserType, allowCreation, formData, setFormData } =
    useUserCreation(user, userType, fetcher, delegatesCount)
  const [handleChange, handleAddLanguage, handleRemoveLanguage] =
    useUpdateStateFunctions(formData, setFormData)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(allowCreation, fetcher.state)
  const handleSubmission = (e) => {
    if (!allowCreation) return
    fetcher.submit(
      { data: qs.stringify(formData), delegationId: delegation.id },
      { replace: true, method: "post" }
    )
  }
  const [modalContext, state] = useModalContext(fetcher)

  return (
    <S.DataForm>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            asdjalskdjasd
          </Dialog>
        </Modal>
      }

      <S.DataTitleBox>
        <S.DataTitle ref={buttonRef}>
          {allowCreation ?
            <ColorButtonBox color={buttonColor}>
              <Button onPress={handleSubmission} isDisabled={!allowCreation}>
                {buttonIcon} {buttonLabel}
              </Button>
            </ColorButtonBox> :
            "Somente o líder da delegação e os orientadores podem adicionar participantes manualmente"
          }
        </S.DataTitle>
      </S.DataTitleBox>

      <S.DataTitleBox style={{ pointerEvents: allowCreation ? 'auto' : 'none', opacity: allowCreation ? 1 : 0.5, }}>
        <DataChangeInputBox>
          <Select
            label="Tipo do Participante"
            defaultSelectedKey={creatingUserType}
            onSelectionChange={handleCreatingUserType}
            items={[
              { id: "delegate", name: "Delegado" },
              { id: "delegationAdvisor", name: "Professor(a) Oritentador(a)" },
            ]}
            isDisabled={!allowCreation}
          >
            {(item) => <Item>{item.name}</Item>}
          </Select>
        </DataChangeInputBox>

        {creatingUserType === "delegate" && allowCreation ?
          <S.DelegateCountdown>
            <ColorButtonBox color="red">
              {10 - delegatesCount} vagas restantes para delegados
            </ColorButtonBox>
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
            <ColorButtonBox color={buttonColor} boxShadow={1}>
              <Button onPress={handleSubmission} isDisabled={!allowCreation}>
                {buttonIcon} {buttonLabel}
              </Button>
            </ColorButtonBox>
          </S.StickyButton>
        )}
      </AnimatePresence>
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
    email: 'lksad@gmail.com',
    name: 'lksad',
    document: { documentName: 'passport', value: '0928323' },
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
      facebook: 'lkjsad',
      instagram: '',
      linkedin: ''
    }
  }

  const [creatingUserType, setCreatingUserType] = React.useState("delegate")
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
    // update the default value for the user being created

  }, [creatingUserType])

  React.useEffect(() => {
    // setting data back to default after creating user
    if (fetcher?.data?.name === formData.name) setFormData(normalUser)
  }, [fetcher])

  const handleCreatingUserType = (userType) => {
    setFormData((prevState) => {
      let newData = { ...prevState }
      newData.delegate = userType === "delegate" ? normalUser.delegate : undefined
      newData.delegationAdvisor = userType === "delegationAdvisor" ? normalUser.delegationAdvisor : undefined
      return newData
    })
    setCreatingUserType(userType)
  }

  return {
    creatingUserType,
    handleCreatingUserType,
    allowCreation,
    formData,
    setFormData,
  }
}

function useButtonState(allowCreation, transition) {
  const [buttonLabel, setButtonLabel] = React.useState("Adicionar Participante")
  const [buttonIcon, setButtonIcon] = React.useState(<FiUserPlus />)
  const [buttonColor, setButtonColor] = React.useState("gray")

  React.useEffect(() => {
    setButtonLabel(transition !== 'idle' ? "Adicionando" : "Adicionar Participante")
    setButtonIcon(transition !== 'idle' ? <Spinner dim={18} color='green' /> : <FiUserPlus />)
    setButtonColor(transition !== 'idle' ? "blue" : allowCreation ? "green" : "gray")
  }, [allowCreation, transition])

  return [buttonLabel, buttonIcon, buttonColor]
}

function useUpdateStateFunctions(formData, setFormData) {
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
  function handleAddLanguage(language) {
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
  function handleRemoveLanguage(language) {
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

function useModalContext(fetcher) {
  const [modalContext, setModalContext] = React.useState()
  const state = useOverlayTriggerState({});

  React.useEffect(() => {
    if (fetcher.data?.user) {
      state.open()
      setModalContext(fetcher.data?.user)
    }
  }, [fetcher])

  return [modalContext, state]
}

export default CreateUser