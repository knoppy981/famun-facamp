import React, { Key } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { Form, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import qs from "qs"
import { motion } from "framer-motion";

import { createUser, getExistingUser } from "~/models/user.server"
import { DelegationType } from "~/models/delegation.server"
import { useOnScreen } from "~/hooks/useOnScreen";
import { useUser, useUserType } from "~/utils";
import { getCorrectErrorMessage } from "~/utils/error";
import { createUserSchema } from "~/schemas";
import { useUserCreation } from "./hooks/useUserCreation";
import { useButtonState } from "./hooks/useButtonState";
import { useModalContext } from "./hooks/useModalContext";
import { requireDelegation, requireUser } from "~/session.server";

import EditUserData from "../dashboard/components/editUserData/user";
import Modal from "~/components/modalOverlay";
import Button from "~/components/button";
import Dialog from "~/components/dialog";
import { Select, Item } from "~/components/select";
import { defaultUser } from "./utils/defaultUserData";
import { iterateObject } from "../dashboard/utils/findDiffrences";
import { getCouncils } from "~/models/configuration.server";
import { manualCreateUserEmail } from "~/lib/emails";
import { sendEmail } from "~/nodemailer.server";
import { generatePassword } from "./utils/generatePassword";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request)
  const delegation = await requireDelegation(request)
  const formData = await request.formData()
  const newUserData = qs.parse(formData.get("newUserData") as string)

  const count = delegation.participants.filter(p => p.delegate).length
  if (count >= delegation.maxParticipants && !newUserData['delegationAdvisor.advisorRole']) {
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
    let [hash, password] = await generatePassword()
    newUser = await createUser({
      ...data,
      delegation: {
        connect: {
          id: delegation.id
        }
      },
      password: {
        create: {
          hash: hash
        }
      }
    })
    const info = await sendEmail({
      to: newUser.email,
      subject: "Bem-vindo a Famun",
      html: manualCreateUserEmail(user.name, delegation.school, newUser, password, process.env.WEBSITE_URL ?? "app.famun.com.br")
    })
  } catch (e) {
    console.log(e)
  }

  return json({ newUser })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const delegation = await requireDelegation(request)

  const councils = await getCouncils(delegation.participationMethod)

  return json({ councils })
}

const CreateUser = () => {
  const [buttonRef, isRefVisible] = useOnScreen();
  const delegation: DelegationType = useOutletContext()
  const { councils } = useLoaderData<typeof loader>()
  const delegatesCount = delegation.participants?.filter(user => user.delegate !== null).length as number
  const user = useUser()
  const userType = useUserType()
  const fetcher = useFetcher()
  const { creatingUserType, changeCreatingUserType, creationPermission, handleChange, handleSubmission, editUserDataId } =
    useUserCreation(user, userType, fetcher, delegatesCount, delegation, delegation.participationMethod, councils as string[])
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(creationPermission?.allowed, fetcher.state)
  const [modalContext, state] = useModalContext(fetcher)

  return (
    <div className="delegation-data-form">
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
          selectedKey={creatingUserType}
          onSelectionChange={(key: Key) => changeCreatingUserType(key as "delegate" | "advisor")}
          items={[
            { id: "delegate", name: "Delegado" },
            { id: "advisor", name: "Professor(a) Orientador(a)" },
          ]}
          isDisabled={creationPermission?.type === "userType"}
        >
          {(item) => <Item>{item.name}</Item>}
        </Select>

        {creatingUserType === "delegate" && creationPermission ?
          <div className="delegation-data-delegates-countdown">
            <div className="secondary-button-box red-light">
              <div className='button-child'>
                {delegation.maxParticipants - delegatesCount} vagas restantes para delegados
              </div>
            </div>
          </div> :
          null
        }
      </div>

      <EditUserData
        isDisabled={!creationPermission?.allowed}
        actionData={fetcher.data}
        defaultValues={defaultUser(councils as string[], delegation.participationMethod)}
        handleChange={handleChange}
        id={editUserDataId}
        userType={creatingUserType}
        actionType="add"
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
    </div>
  )
}

export default CreateUser