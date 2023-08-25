import { useFetcher, useOutletContext } from "@remix-run/react";
import { json } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import _, { set } from 'lodash';
import qs from "qs"

import { useOnScreen } from "~/hooks/useOnScreen";
import { updateUser } from "~/models/user.server";
import { updateDelegation } from "~/models/delegation.server";
import { useUser, useUserType } from "~/utils";

import * as S from "~/styled-components/dashboard/delegation"
import * as P from '~/styled-components/dashboard/data'
import EditUserData from '~/styled-components/components/dataBox/user';
import EditDelegationData from '~/styled-components/components/dataBox/delegation';
import Spinner from "~/styled-components/components/spinner";
import { FiEdit, FiX, FiCheck } from "react-icons/fi";


export const action = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("userId")
  const data = qs.parse(formData.get("data"))

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
    console.log("xxxx")
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

const DelegationData = ({
  userScrollRef,
  clickedUserFromTableId
}) => {

  const user = useUser()
  const userType = useUserType()
  const delegation = useOutletContext()
  // used for showing alternate button when the first one isnt visible
  const [buttonRef, isRefVisible] = useOnScreen();

  // data changes
  const fetcher = useFetcher()
  // only allow changes to advisor or delegation leader
  const allowChanges = userType === "advisor" ? true : user.leader ?? false
  // ready submission if changes have been made, and data change active if user clicked on the button to edit the data
  const [readySubmission, setReadySubmission] = React.useState(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState(false)
  // only one user change at a time, this state controls if you can change the user being edited
  const [allowChangeParticipant, setAllowChangeParticipant] = React.useState(true)

  // delegation data is the copy of the delegation ready for being changed without altering the original data
  // have to use cloneDeep here for later lodash functions uses later
  const [formData, setFormData] = React.useState(_.cloneDeep(delegation));
  // current user being visualized
  const [selectedUserId, setSelectedUserId] = React.useState(clickedUserFromTableId ?? formData.participants[0].id);

  // useEffect for every data change
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

  // useEffect for successful submission of data change form
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

  const handleSubmission = (e) => {
    e.preventDefault()
    if (!allowChanges) return

    // if submission is ready, meaning that the data has been modified, submi the form, else it means that the user wants to edit the data
    if (readySubmission) {
      fetcher.submit(e.currentTarget, { replace: true })
    } else {
      setUserWantsToChangeData(!userWantsToChangeData)
    }
  }

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

  const handleAddLanguage = (event) => {
    const newLanguage = event.target.value;

    setFormData((prevState) => {
      let newData = { ...prevState };

      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user && !user.delegate.languagesSimulates.includes(newLanguage)) {
        user.delegate.languagesSimulates.push(newLanguage);
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

  return (
    <S.DataForm method="post" action="/dashboard/data">
      <S.DataTitleBox>
        <P.ColorItem
          key='2-menu'
          onClick={handleSubmission}
          color={
            allowChanges ?
              userWantsToChangeData ?
                readySubmission ?
                  'green' :
                  'red' :
                'blue' :
              'gray'
          }
          ref={buttonRef}
        >
          {fetcher.state !== 'idle' ?
            <><Spinner dim={18} color='green' /> Salvando</> :
            !userWantsToChangeData ?
              <><FiEdit /> Editar Dados</> :
              readySubmission ?
                <><FiCheck /> Salvar Alterações</> :
                <><FiX /> Cancelar</>}
        </P.ColorItem>
      </S.DataTitleBox>

      <EditDelegationData
        isDisabled={!userWantsToChangeData}
        formData={formData}
        actionData={fetcher.data}
        handleChange={handleDelegationChange}
      />

      <S.DataTitleBox ref={userScrollRef}>
        <S.DataSubTitle>
          Dados do participante
        </S.DataSubTitle>

        <S.UserSelect
          onChange={event => setSelectedUserId(event.target.value)}
          disabled={!allowChangeParticipant}
          value={selectedUserId}
        >
          {formData.participants.map((user, index) => (
            <option
              style={{ whiteSpace: 'pre' }}
              key={user.id}
              value={user.id}
            >
              {user.name}
            </option>
          ))}
        </S.UserSelect>
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
            <P.ColorItem
              key='2-menu'
              onClick={handleSubmission}
              boxShadow={true}
              color={
                allowChanges ?
                  userWantsToChangeData ?
                    readySubmission ?
                      'green' :
                      'red' :
                    'blue' :
                  'gray'
              }
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Salvando</> :
                !userWantsToChangeData ?
                  <><FiEdit /> Editar Dados</> :
                  readySubmission ?
                    <><FiCheck /> Salvar Alterações</> :
                    <><FiX /> Cancelar</>}
            </P.ColorItem>
          </S.StickyButton>
        )}
      </AnimatePresence>

      <input type="hidden" name="userId" value={selectedUserId} />
      <input type="hidden" name="data" value={qs.stringify(formData)} />
    </S.DataForm >
  )
}

export default DelegationData