import React, { Key } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useFetcher, useOutletContext } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import qs from "qs"
import { motion } from "framer-motion";

import { createUser, getExistingUser } from "~/models/user.server"
import { DelegationType } from "~/models/delegation.server"
import { useOnScreen } from "~/hooks/useOnScreen";
import { useUser, useUserType, generatePassword } from "~/utils";
import { getCorrectErrorMessage } from "~/utils/error";
import { createUserSchema } from "~/schemas";
import { useUserCreation } from "./useUserCreation";
import { useButtonState } from "./useButtonState";
import { useModalContext } from "./useModalContext";
import { requireDelegation, requireUser } from "~/session.server";

import EditUserData from "../dashboard/edit-data-components/user";
import Modal from "~/components/modalOverlay";
import Button from "~/components/button";
import Dialog from "~/components/dialog";
import { Select, Item } from "~/components/select";
import { defaultUser } from "./defaultUserData";
import { iterateObject } from "../dashboard/utils/findDiffrences";
import { createDelegationChangeNotification } from "~/models/notifications.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request)
  const delegation = await requireDelegation(request)
  const formData = await request.formData()
  const newUserData = qs.parse(formData.get("newUserData") as string)

  const count = delegation.participants?.reduce((accumulator, participant) => {
    if (participant.delegate) accumulator += 1
    return accumulator
  }, 0) as number
  if (count > 10) {
    return json(
      { errors: { participants: "Maximum delegates reached" } },
      { status: 400 }
    )
  }

  let data: any = {
    participationMethod: delegation.participationMethod
  }

  iterateObject(newUserData, (key, value, path) => {
    if (value === "false" || value === "true") value = value === "true"
    if (key.includes('.')) {
      const [field, nestedField] = key.split('.')
      if (typeof data[field] === 'object' && data[field] !== null) {
        data[field]["create"][nestedField] = value ?? null;
      } else {
        data[field] = { create: { [nestedField]: value ?? null } };
      }
    } else {
      data[key] = value
    }
  });

  console.dir(data, { depth: null })

  try {
    await createUserSchema.validateAsync(data)
    await getExistingUser({
      name: data.name === "" ? undefined : data.name,
      email: data.email === "" ? undefined : data.email,
      cpf: data.cpf === "" ? undefined : data.cpf,
      rg: data.rg === "" ? undefined : data.rg,
      passport: data.passport === "" ? undefined : data.passport,
    })
  } catch (error) {
    console.log(error)
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  let newUser

  try {
    newUser = await createUser({
      ...data,
      delegation: {
        connect: {
          id: delegation.id
        }
      }
    })
    /* await createDelegationChangeNotification(user.id, qs.stringify(data), newUser.id, "delegation", `Created ${newUser.name}, and joined ${delegation.school} delegation`) */
  } catch (e) {
    console.log(e)
  }

  return json({ newUser })
}

const CreateUser = () => {
  const [buttonRef, isRefVisible] = useOnScreen();
  const delegation: DelegationType = useOutletContext()
  const delegatesCount = delegation.participants?.filter(user => user.delegate !== null).length as number
  const user = useUser()
  const userType = useUserType()
  const fetcher = useFetcher()
  const { creatingUserType, changeCreatingUserType, creationPermission, handleChange, handleSubmission, editUserDataId } =
    useUserCreation(user, userType, fetcher, delegatesCount, delegation.id, delegation.participationMethod)
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
        defaultValues={defaultUser}
        handleChange={handleChange}
        id={editUserDataId}
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