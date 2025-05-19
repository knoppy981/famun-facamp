import React from 'react'
import { Form, useFetcher, useOutletContext } from '@remix-run/react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { AnimatePresence } from 'framer-motion'
import qs from 'qs'
import _ from 'lodash'
import { motion } from 'framer-motion'

import { useUser, useUserType } from '~/utils'
import { getCorrectErrorMessage } from '~/utils/error'
import { getExistingUser, updateUser } from '~/models/user.server';
import { useOnScreen } from '~/hooks/useOnScreen'
import { updateUserSchema } from '~/schemas'

import Button from '~/components/button'
import EditUserData from '../dashboard/components/editUserData/user'
import { useUserUpdate } from './hooks/useUserUpdate'
import { useButtonState } from './hooks/useButtonState'
import { requireUser } from '~/session.server'
import { iterateObject } from '../dashboard/utils/findDiffrences'
import { createUserChangeNotification } from '~/models/notifications.server'
import { getParticipantConfigurationRequirements } from '~/models/configuration.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request)
  const config = await getParticipantConfigurationRequirements()
  
  if (!config?.allowParticipantsChangeData) return json(
    { errors: { error: "Prazo para edição de dados encerrou" } },
    { status: 400 }
  );

  const formData = await request.formData();
  let changes = qs.parse(formData.get("changes") as string)
  let data: any = {}

  iterateObject(changes, (key, value, path) => {
    if (value === "false" || value === "true") value = value === "true"
    if (key.includes('.')) {
      const [field, nestedField] = key.split('.')
      if (typeof data[field] === 'object' && data[field] !== null) {
        if (field === "foodRestrictions") {
          data[field]["upsert"]["create"][nestedField] = value ?? null;
          data[field]["upsert"]["update"][nestedField] = value ?? null;
        } else {
          data[field]["update"][nestedField] = value ?? null;
        }
      } else {
        if (field === "foodRestrictions") {
          data[field] = { upsert: { create: { [nestedField]: value ?? null }, update: { [nestedField]: value ?? null } } };
        } else {
          data[field] = { update: { [nestedField]: value ?? null } };
        }
      }
    } else {
      data[key] = typeof value === "string" ? value.trim() : value
    }
  });

  try {
    await updateUserSchema.validateAsync(data)
    await getExistingUser({
      name: data.name ?? "",
      email: data.email ?? "",
      cpf: data.cpf === "" ? undefined : data.cpf,
      rg: data.rg === "" ? undefined : data.rg,
      passport: data.passport === "" ? undefined : data.passport,
      userId: user.id
    })
  } catch (error) {
    console.log(error)
    const [label, msg, group, path] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg, errorGroup: group, path: path } },
      { status: 400 }
    );
  }

  await createUserChangeNotification(user.id, qs.stringify(changes), user.id, `Changed ${user.name} data`)

  return updateUser({ userId: user.id, values: data })
}

const Profile = () => {
  const fetcher = useFetcher()
  const actionData = fetcher.data
  const { config } = useOutletContext<{
    config: {
      allowParticipantsChangeData: boolean | null;
      allowParticipantsPayments: boolean | null;
      allowParticipantsSendDocuments: boolean | null;
    }
  }>()
  const allowParticipantsChangeData = config?.allowParticipantsChangeData ?? false
  const [buttonRef, isRefVisible] = useOnScreen();
  const user = useUser()
  const userType = useUserType()
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange } =
    useUserUpdate(user, fetcher, allowParticipantsChangeData)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state, allowParticipantsChangeData)

  return (
    <Form method="post" className='section-wrapper padding'>
      <h2 className='admin-section-title' ref={buttonRef}>
        Dados da Inscrição

        <Button
          onPress={handleSubmission}
          className={`secondary-button-box ${buttonColor ? buttonColor + "-light" : ""}`}
        >
          {buttonIcon} {buttonLabel}
        </Button>
      </h2>

      {!allowParticipantsChangeData && <i className='payments-warning'>
        Aviso:
        <br />
        O prazo para edição de dados foi encerrado!
      </i>}

      <EditUserData
        isDisabled={!userWantsToChangeData}
        actionData={actionData}
        defaultValues={user}
        id={""}
        handleChange={handleChange}
        userType={userType}
        actionType="edit"
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
