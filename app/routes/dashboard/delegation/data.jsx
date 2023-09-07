import { useFetcher, useOutletContext, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import _, { set } from 'lodash';
import qs from "qs"

import { useOnScreen } from "~/hooks/useOnScreen";
import { updateUser } from "~/models/user.server";
import { formatDelegationData, getExistingDelegation, updateDelegation } from "~/models/delegation.server";
import { getCorrectErrorMessage, timeout, useUser, useUserType } from "~/utils";
import { prismaDelegationSchema } from "~/schemas/objects/delegation";

import * as S from "~/styled-components/dashboard/delegation/data"
import EditUserData from '~/styled-components/components/dataBox/user';
import EditDelegationData from '~/styled-components/components/dataBox/delegation';
import Spinner from "~/styled-components/components/spinner";
import { FiEdit, FiX, FiCheck } from "react-icons/fi";
import ColorButtonBox from "~/styled-components/components/buttonBox/withColor";
import Button from "~/styled-components/components/button";
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'
import { ComboBox, Item } from '~/styled-components/components/comboBox';
import { Select } from "~/styled-components/components/select";


export const action = async ({ request }) => {
  const formData = await request.formData();
  let userId = formData.get("userId")
  let { id, ...data } = qs.parse(formData.get("data"))

  data = await formatDelegationData({
    data,
    addressModification: "update",
    participantModification: "update",
    usersIdFilter: [userId]
  })

  if (data === undefined) return json({ errors: { data: "Unknown error" } }, { status: 404 })

  try {
    await getExistingDelegation({ school: data.school ?? "", delegationId: id })
    await prismaDelegationSchema.validateAsync(data)
  } catch (error) {
    console.dir(error, { depth: null })
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  return updateDelegation({ delegationId: id, values: data })
}

const DelegationData = () => {
  const fetcher = useFetcher()
  const user = useUser()

  const userType = useUserType()
  const [searchParams] = useSearchParams();
  const allowChanges = userType === "advisor" ? true : user.leader ?? false // only allow changes to advisor or delegation leader
  const delegation = useOutletContext()
  const [buttonRef, isRefVisible] = useOnScreen();
  const { readySubmission, userWantsToChangeData, handleUserWantsToChangeData, formData, setFormData, allowChangeParticipant } =
    useDelegationUpdate(delegation, fetcher)
  const [selectedUserId, setSelectedUserId] = React.useState(formData.participants[0].id);
  const [userDataRef] = useUserScroll(searchParams, delegation, setSelectedUserId)
  const [handleDelegationChange, handleChange, handleAddLanguage, handleRemoveLanguage] =
    useUpdateStateFunctions(formData, setFormData, selectedUserId)
  const [buttonLabel, buttonIcon, buttonColor] =
    useButtonState(userWantsToChangeData, readySubmission, fetcher.state, allowChanges)
  const handleSubmission = () => {
    if (!allowChanges) return
    if (readySubmission) {
      fetcher.submit(
        { data: qs.stringify(formData), userId: selectedUserId },
        { replace: true, method: "post" }
      )
    } else {
      handleUserWantsToChangeData()
    }
  }

  return (
    <S.DataForm method="post">
      <S.DataTitleBox style={{ marginTop: 0 }}>
        <S.DataTitle ref={buttonRef}>
          <ColorButtonBox color={buttonColor}>
            <Button onPress={handleSubmission}>
              {buttonIcon} {buttonLabel}
            </Button>
          </ColorButtonBox>
        </S.DataTitle>
      </S.DataTitleBox>

      <EditDelegationData
        isDisabled={!userWantsToChangeData}
        formData={formData}
        actionData={fetcher.data}
        handleChange={handleDelegationChange}
      />

      <S.DataTitleBox ref={userDataRef}>
        <S.InputWrapper>
          <Select
            name="selectedParticipant"
            label="Dados do Participante"
            isRequired
            items={delegation.participants.map(participant => { return { id: participant.id } })}
            onSelectionChange={value => { if (value !== null) setSelectedUserId(value) }}
            selectedKey={selectedUserId}
            isDisabled={!allowChangeParticipant}
          >
            {(item) => <Item>{delegation.participants.find(el => el.id === item.id)?.name}</Item>}
          </Select>
        </S.InputWrapper>
      </S.DataTitleBox>

      <EditUserData
        isDisabled={!userWantsToChangeData}
        actionData={fetcher.data}
        formData={formData.participants.find((participant) => participant.id === selectedUserId)}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        userType={formData.participants.find((participant) => participant.id === selectedUserId).delegate ? 'delegate' : 'delegationAdvisor'}
      />

      <AnimatePresence>
        {!isRefVisible && (
          <S.StickyButton
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ColorButtonBox color={buttonColor} boxShadow={1}>
              <Button onPress={handleSubmission}>
                {buttonIcon} {buttonLabel}
              </Button>
            </ColorButtonBox>
          </S.StickyButton>
        )}
      </AnimatePresence>
    </S.DataForm >
  )
}

function useDelegationUpdate(delegation, fetcher) {
  const [formData, setFormData] = React.useState(_.cloneDeep(delegation));
  const [readySubmission, setReadySubmission] = React.useState(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState(false)
  const [allowChangeParticipant, setAllowChangeParticipant] = React.useState(true)
  const handleUserWantsToChangeData = () => {
    setUserWantsToChangeData(!userWantsToChangeData)
  }
  React.useEffect(() => {
    // if data is different from orginal data and the user clicked on the edit data button (userWantsToChangeData),
    // allow form submission and lock the user being edited, else don't
    if (!_.isEqual(delegation, formData) && userWantsToChangeData) {
      //different data
      setReadySubmission(true)
      setAllowChangeParticipant(false)
    } else {
      setReadySubmission(false)
      setAllowChangeParticipant(true)
    }
  }, [formData])
  React.useEffect(() => {
    if (fetcher.state === 'loading' && !fetcher.data?.errors) {
      // set the delegation data for the updated one recieved from the server
      setFormData(_.cloneDeep(fetcher.data))
      // set these variables to original state
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
      fetcher.data = undefined
    }
  }, [fetcher])
  return {
    readySubmission,
    userWantsToChangeData,
    handleUserWantsToChangeData,
    formData,
    setFormData,
    allowChangeParticipant,
  }
}

function useButtonState(userWantsToChangeData, readySubmission, transition, allowChanges) {
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
    setButtonColor(!allowChanges ?
      'gray' :
      userWantsToChangeData ?
        readySubmission ? 'green' : 'red' :
        'blue')
  }, [userWantsToChangeData, readySubmission, transition])

  return [buttonLabel, buttonIcon, buttonColor]
}

function useUpdateStateFunctions(formData, setFormData, selectedUserId) {
  const handleDelegationChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      let newData = { ...prevState };

      if (name.includes('.')) {
        const [field, nestedField] = name.split('.');

        // Check if the user object has the field and if the field is an object
        if (newData[field] && typeof newData[field] === 'object') {
          newData[field][nestedField] = value;
        } else {
          newData[field] = { [nestedField]: value };
        }
      } else {
        newData[name] = value;
      }

      return newData
    })
  }
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      // Copy the existing state
      let newData = { ...prevState };

      // Find the user and update the field
      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user) {
        // Check if the name includes a '.'
        if (name.includes('.')) {
          const [field, nestedField] = name.split('.');

          // Check if the user object has the field and if the field is an object
          if (user[field] && typeof user[field] === 'object') {
            user[field][nestedField] = value;
          } else {
            user[field] = { [nestedField]: value };
          }
        } else {
          user[name] = value;
        }
      }

      if (name === "nacionality") {
        user.document.documentName = value === "Brazil" ? "cpf" : "passport"
        user.document.value = ""
      }

      // Return the updated state
      return newData;
    });
  };
  const handleAddLanguage = (language) => {
    setFormData((prevState) => {
      let newData = { ...prevState };

      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user && !user.delegate.languagesSimulates.includes(language)) {
        user.delegate.languagesSimulates.push(language);
      }

      return newData;
    });
  };
  const handleRemoveLanguage = (language) => {
    setFormData((prevState) => {
      let newData = { ...prevState };

      // Find the user and remove the language from the language array
      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user) {
        user.delegate.languagesSimulates = user.delegate.languagesSimulates.filter(
          (el) => el !== language
        );
      }

      return newData;
    });
  };

  return [handleDelegationChange, handleChange, handleAddLanguage, handleRemoveLanguage]
}

function useUserScroll(searchParams, delegation, setSelectedUserId) {
  const userDataRef = React.useRef()

  if (!searchParams) return
  const name = searchParams.get("u")

  React.useEffect(() => {
    const id = delegation.participants.find(participant => participant.name === name)?.id
    if (id) {
      setSelectedUserId(id)

      const timer = setTimeout(() => {
        userDataRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)

      return () => {
        clearTimeout(timer);
      };
    }
  }, [])

  return [userDataRef]
}

export default DelegationData