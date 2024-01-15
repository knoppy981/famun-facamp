import React from 'react'
import { Form, useFetcher } from '@remix-run/react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { AnimatePresence } from 'framer-motion'
import qs from 'qs'
import _ from 'lodash'
import { motion } from 'framer-motion'

import { useUser, useUserType } from '~/utils'
import { getCorrectErrorMessage } from '~/utils/error'
import { formatUserData, getExistingUser, updateUser } from '~/models/user.server';
import { useOnScreen } from '~/hooks/useOnScreen'
import { prismaUserSchema } from '~/schemas'

import Button from '~/components/button'
import EditUserData from '../dashboard/edit-data-components/user'
import { useUserUpdate } from './useUserUpdate'
import { useUpdateStateFunctions } from './useUpdateStateFunctions'
import { useButtonState } from './useButtonState'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = formData.get("data") as string
  let { id, ...userData } = qs.parse(data) as any
  console.log(userData)

  userData = await formatUserData({
    data: userData,
    childrenModification: "update",
    userType: userData.delegate ? "delegate" : "advisor",
    participationMethod: userData.participationMethod
  }) as any

  if (userData === undefined) return json({ errors: { data: "Unknown error" } }, { status: 404 })

  try {
    await prismaUserSchema.validateAsync(userData)
    await getExistingUser({
      name: userData.name ?? "",
      email: userData.email ?? "",
      document: { is: { value: userData?.document?.value ?? "" } },
      userId: id as string
    })
  } catch (error) {
    console.dir(error, { depth: null })
    const [label, msg, group, path] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg, errorGroup: group, path: path } },
      { status: 400 }
    );
  }

  console.log(userData)

  return updateUser({ userId: id as string, values: userData }) 
}

const Profile = () => {
  const fetcher = useFetcher()
  const actionData = fetcher.data
  const [buttonRef, isRefVisible] = useOnScreen();
  const user = useUser()
  const userType = useUserType()
  const { readySubmission, userWantsToChangeData, handleSubmission, formData, setFormData, } =
    useUserUpdate(user, fetcher)
  const [handleChange, handleAddLanguage, handleRemoveLanguage] =
    useUpdateStateFunctions(formData, setFormData)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state)

  return (
    <Form method="post" className='section-wrapper padding'>
      <div className='profile-title' ref={buttonRef}>
        Dados da Inscrição

        <Button
          onPress={handleSubmission}
          className={`secondary-button-box ${buttonColor ? buttonColor + "-light" : ""}`}
        >
          {buttonIcon} {buttonLabel}
        </Button>
      </div>

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
          <motion.div
            className='sticky-button'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className={`secondary-button-box ${buttonColor ? `${buttonColor}-light` : ""}`}
              onPress={handleSubmission}
            >
              {buttonIcon} {buttonLabel}
            </Button>
          </motion.div>}
      </AnimatePresence>
    </Form >
  )
}

export default Profile
