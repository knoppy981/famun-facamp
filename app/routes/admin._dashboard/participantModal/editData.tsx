import React from 'react'
import { useFetcher } from '@remix-run/react'
import { Notifications } from '@prisma/client'
import { OverlayTriggerState } from 'react-stately'

import { useUserUpdate } from './useUserUpdate'
import { useButtonState } from './useButtonState'
import { UserType } from '~/models/user.server'

import EditUserData from "~/routes/admin._dashboard/edit-data-components/user"
import Button from '~/components/button'

type menus = "notifications" | "data" | "documents" | "payments" | "delete"

const EditData = ({ state, participant, selectedMenu, setSelectedMenu }: {
  state: OverlayTriggerState,
  selectedMenu: menus,
  setSelectedMenu: React.Dispatch<React.SetStateAction<menus>>,
  participant: UserType & { notifications?: Notifications[] }
}) => {
  const fetcher = useFetcher<any>()
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange } =
    useUserUpdate(participant, fetcher, state, selectedMenu, setSelectedMenu)
  const [buttonLabel, buttonIcon, buttonColor] =
    useButtonState(userWantsToChangeData, readySubmission, fetcher.state)

  return (
    <>
      <div className='admin-delegation-modal-button-list'>
        <Button className={`secondary-button-box ${buttonColor + "-dark"}`} onPress={handleSubmission}>
          {buttonIcon} {buttonLabel}
        </Button>
      </div>

      <EditUserData
        isDisabled={!userWantsToChangeData}
        actionData={fetcher.data}
        defaultValues={participant}
        handleChange={handleChange}
        id={""}
        userType={participant.delegate ? 'delegate' : 'delegationAdvisor'}
        actionType="edit"
        theme="dark"
      />
    </>
  )
}

export default EditData
