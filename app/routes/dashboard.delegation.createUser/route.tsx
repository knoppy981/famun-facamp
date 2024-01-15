import React, { Key } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useFetcher, useOutletContext } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import qs from "qs"
import { motion } from "framer-motion";

import { createUser, formatUserData, getExistingUser } from "~/models/user.server"
import { DelegationType, countDelegates, joinDelegationById } from "~/models/delegation.server"
import { useOnScreen } from "~/hooks/useOnScreen";
import { useUser, useUserType, generatePassword } from "~/utils";
import { getCorrectErrorMessage } from "~/utils/error";
import { prismaUserSchema } from "~/schemas";
import { useUserCreation } from "./useUserCreation";
import { useUpdateStateFunctions } from "./useUpdateStateFunctions";
import { useButtonState } from "./useButtonState";
import { useModalContext } from "./useModalContext";

import EditUserData from "../dashboard/edit-data-components/user";
import Modal from "~/components/modalOverlay";
import Button from "~/components/button";
import Dialog from "~/components/dialog";
import { Select, Item } from "~/components/select";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const delegationId = formData.get("delegationId") as string
  const participationMethod = formData.get("participationMethod") as string
  const data = formData.get("data") as string

  const count = await countDelegates(delegationId)
  if (count > 10) {
    return json(
      { errors: { participants: "Maximum delegates reached" } },
      { status: 400 }
    )
  }

  let userData = {
    ...qs.parse(data) as any,
    password: generatePassword(),
  }

  userData = await formatUserData({
    data: userData,
    childrenModification: "create",
    userType: userData.delegate ? "delegate" : "advisor",
    participationMethod: participationMethod
  })

  let user

  try {
    await prismaUserSchema.validateAsync(userData)
    await getExistingUser({
      name: userData.name === "" ? undefined : userData.name,
      email: userData.email === "" ? undefined : userData.email,
      cpf: userData.cpf === "" ? undefined : userData.cpf,
      rg: userData.rg === "" ? undefined : userData.rg,
      passport: userData.passport === "" ? undefined : userData.passport,
    })
  } catch (error) {
    console.log(error)
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  try {
    user = await createUser(userData)
    await joinDelegationById(delegationId, user.id)
  } catch (e) {
    console.log(e)
  }

  return json({ user })
}

const CreateUser = () => {
  const [buttonRef, isRefVisible] = useOnScreen();
  const delegation: DelegationType = useOutletContext()
  const delegatesCount = delegation.participants?.filter(user => user.delegate !== null).length as number
  const user = useUser()
  const userType = useUserType()
  const fetcher = useFetcher()
  const [creatingUserType, changeCreatingUserType, creationPermission, formData, setFormData, handleSubmission] =
    useUserCreation(user, userType, fetcher, delegatesCount, delegation.id, delegation.participationMethod)
  const [handleChange, handleAddLanguage, handleRemoveLanguage] =
    useUpdateStateFunctions(formData, setFormData)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(creationPermission?.allowed, fetcher.state)
  const [modalContext, state] = useModalContext(fetcher)

  return (
    <Form className="delegation-data-form" method="post">
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog maxWidth>
            <div className="dialog-title">
              Novo usuário criado!
            </div>

            <div className="dialog-title">
              Será enviado um email para {modalContext?.email} <br /> avisando {modalContext?.name} sobre a sua inscrição!
            </div>

            <Button className="secondary-button-box blue-dark" onPress={state.close}>
              Fechar
            </Button>
          </Dialog>
        </Modal>
      }

      <div className="delegation-data-title-box" style={{ marginTop: 0 }}>
        <div className="delegation-data-title" ref={buttonRef}>
          {creationPermission === undefined ? <></> :
            creationPermission ?
              <Button
                className={`secondary-button-box ${buttonColor ? `${buttonColor}-light` : ""}`}
                onPress={handleSubmission}
                isDisabled={!creationPermission?.allowed}
              >
                {buttonIcon} {buttonLabel}
              </Button> :
              <p className="data-box-subtitle label error">
                Somente os líderes e os orientadores podem adicionar participantes manualmente
              </p>
          }
        </div>
      </div>

      <div className="delegation-data-title-box">
        <Select
          className="delegation-data-input-wrapper"
          label="Tipo do Participante"
          defaultSelectedKey={creatingUserType}
          onSelectionChange={(key: Key) => changeCreatingUserType(key as "delegate" | "advisor")}
          items={[
            { id: "delegate", name: "Delegado" },
            { id: "advisor", name: "Professor(a) Oritentador(a)" },
          ]}
          isDisabled={creationPermission?.type === "userType"}
        >
          {(item) => <Item>{item.name}</Item>}
        </Select>

        {creatingUserType === "delegate" && creationPermission ?
          <div className="delegation-data-delegates-countdown">
            <div className="secondary-button-box red-light">
              <div>
                {10 - delegatesCount} vagas restantes para delegados
              </div>
            </div>
          </div> :
          null
        }
      </div>

      <EditUserData
        isDisabled={!creationPermission?.allowed}
        actionData={fetcher.data}
        formData={formData}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        userType={creatingUserType}
      />

      <AnimatePresence>
        {creationPermission?.allowed && !isRefVisible && (
          <motion.div
            className="sticky-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className={`secondary-button-box ${buttonColor ? `${buttonColor}-light` : ""}`}
              onPress={handleSubmission}
              isDisabled={!creationPermission?.allowed}
            >
              {buttonIcon} {buttonLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Form >
  )
}

export default CreateUser