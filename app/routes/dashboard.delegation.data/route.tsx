import React from "react";
import { FetcherWithComponents, Form, useFetcher, useOutletContext, useSearchParams } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import _ from 'lodash';
import qs from "qs"

import { useOnScreen } from "~/hooks/useOnScreen";
import { UserType, getExistingUser } from "~/models/user.server";
import { DelegationType, getExistingDelegation, updateDelegation } from "~/models/delegation.server";
import { useUser, useUserType } from "~/utils";
import { getCorrectErrorMessage } from "~/utils/error";
import { useDelegationUpdate } from "./useDelegationUpdate";
import { useButtonState } from "./useButtonState";
import { useUserScroll } from "./useUserScroll";

import Button from "~/components/button";
import { Select, Item } from "~/components/select";
import EditDelegationData from "../dashboard/edit-data-components/delegation";
import EditUserData from "../dashboard/edit-data-components/user";
import ModalTrigger from "~/components/modalOverlay/trigger";
import Dialog from "~/components/dialog";
import { iterateObject } from "../dashboard/utils/findDiffrences";
import { requireDelegationId, requireUserId } from "~/session.server";
import { updateDelegationSchema } from "~/schemas";
import PopoverTrigger from "~/components/popover/trigger";
import { createDelegationChangeNotification, createUserChangeNotification } from "~/models/notifications.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userId = await requireUserId(request)
  const delegationId = await requireDelegationId(request)
  let delegationChanges = qs.parse(formData.get("delegationChanges") as string)
  let participantChanges = qs.parse(formData.get("participantChanges") as string)
  let selectedUserId = formData.get("selectedUserId") as string
  let data: any = {}
  let participantsData: any = {}

  const hasDelegationChanges = Object.keys(delegationChanges).length > 0
  const hasParticipantsChanges = Object.keys(participantChanges).length > 0

  if (hasDelegationChanges) {
    iterateObject(delegationChanges, (key, value, path) => {
      if (value === "false" || value === "true") value = value === "true"
      if (key.includes('.')) {
        const [field, nestedField] = key.split('.')
        if (typeof data[field] === 'object' && data[field] !== null) {
          data[field]["update"][nestedField] = value ?? null;
        } else {
          data[field] = { update: { [nestedField]: value ?? null } };
        }
      } else {
        data[key] = value
      }
    })
  }

  if (hasParticipantsChanges) {
    iterateObject(participantChanges, (key, value, path) => {
      if (value === "false" || value === "true") value = value === "true"
      if (key.includes('.')) {
        const [field, nestedField] = key.split('.')
        if (typeof participantsData[field] === 'object' && participantsData[field] !== null) {
          if (field === "foodRestrictions") {
            participantsData[field]["upsert"]["create"][nestedField] = value ?? null;
            participantsData[field]["upsert"]["update"][nestedField] = value ?? null;
          } else {
            participantsData[field]["update"][nestedField] = value ?? null;
          }
        } else {
          if (field === "foodRestrictions") {
            participantsData[field] = { upsert: { create: { [nestedField]: value ?? null }, update: { [nestedField]: value ?? null } } };
          } else {
            participantsData[field] = { update: { [nestedField]: value ?? null } };
          }
        }
      } else {
        participantsData[key] = value
      }
    })

    data.participants = {
      update: {
        where: {
          id: selectedUserId
        },
        data: participantsData
      }
    }
  }

  let delegation

  try {
    await getExistingDelegation({ school: data.school ?? "", delegationId: delegationId })
    if (hasParticipantsChanges) {
      await getExistingUser({
        name: participantsData.name ?? "",
        email: participantsData.email ?? "",
        cpf: participantsData.cpf === "" ? undefined : participantsData.cpf,
        rg: participantsData.rg === "" ? undefined : participantsData.rg,
        passport: participantsData.passport === "" ? undefined : participantsData.passport,
        userId: selectedUserId
      })
    }
    await updateDelegationSchema.validateAsync(data)
    delegation = await updateDelegation({ delegationId: delegationId, values: data })
    if (hasDelegationChanges) await createDelegationChangeNotification(userId, qs.stringify(delegationChanges), delegationId)
    if (hasParticipantsChanges) await createUserChangeNotification(userId, qs.stringify(participantChanges), selectedUserId)
  } catch (error) {
    console.log(error)
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  return delegation
}

export type FetcherType = DelegationType & {
  errors: any;
}

const DelegationData = () => {
  const user = useUser()
  const delegation: DelegationType = useOutletContext()
  const fetcher = useFetcher<FetcherType>()
  const removeParticipantFetcher = useFetcher()
  const changeLeaderFetcher = useFetcher()
  const userType = useUserType()
  const [searchParams] = useSearchParams();
  const [buttonRef, isRefVisible] = useOnScreen();
  const allowChanges = userType === "advisor" || user.leader // only allow advisors or delegation leader to make changes
  const { selectedUserId, setSelectedUserId, readySubmission, userWantsToChangeData, allowChangeParticipant, handleSubmission, handleChange, handleRemoveParticipant, handleChangeLeader } =
    useDelegationUpdate(allowChanges, delegation, fetcher as FetcherWithComponents<FetcherType>, removeParticipantFetcher, changeLeaderFetcher)
  const userDataRef =
    useUserScroll(searchParams, delegation, setSelectedUserId)
  const [buttonLabel, buttonIcon, buttonColor, removeParticipantButtonIcon, removeParticipantButtonLabel, changeLeaderButtonIcon, changeLeaderButtonLabel] =
    useButtonState(userWantsToChangeData, readySubmission, fetcher.state, removeParticipantFetcher.state, changeLeaderFetcher.state, allowChanges)

  return (
    <Form className="delegation-data-form" method="post">
      {allowChanges &&
        <div className="delegation-data-title-box" style={{ marginTop: 0 }}>
          <div className="delegation-data-title" ref={buttonRef}>
            <Button
              className={`secondary-button-box ${buttonColor ? `${buttonColor}-light` : ""}`}
              onPress={handleSubmission}
              isDisabled={!allowChanges}
            >
              {buttonIcon} {buttonLabel}
            </Button>
          </div>
        </div>
      }

      <EditDelegationData
        isDisabled={!userWantsToChangeData}
        defaultValues={delegation}
        actionData={fetcher.data}
        handleChange={handleChange("delegation")}
        id={"a"}
      />

      {delegation.participants?.find((participant) => participant?.id === selectedUserId) ?
        <>
          <div className="delegation-data-title-box" ref={userDataRef}>
            <Select
              className="delegation-data-input-wrapper"
              name="selectedParticipant"
              label="Dados do Participante"
              isRequired
              items={delegation.participants?.map(participant => { return { id: participant.id, name: participant.name } })}
              onSelectionChange={value => { if (value !== null) setSelectedUserId(value as string) }}
              selectedKey={selectedUserId}
              isDisabled={!allowChangeParticipant}
            >
              {(item) => <Item>{item.name}</Item>}
            </Select>
          </div>

          <div className={`animate-height-container ${allowChanges && userWantsToChangeData ? "animate" : ""}`}>
            <div className="delegation-data-participant-options-box">
              {selectedUserId !== user.id ?
                <ModalTrigger buttonClassName="" label={<>{removeParticipantButtonIcon} {removeParticipantButtonLabel}</>} >
                  {(close: () => void) =>
                    <Dialog maxWidth>
                      <div className="dialog-title">
                        Tem certeza que deseja excluír a conta do(a) {delegation.participants?.find(el => el.id === selectedUserId)?.name}?
                      </div>

                      <div className="dialog-subitem">
                        Obs: Todos os dados do participante serão perdidos, se já foi realizado um pagamento
                        para a inscrição deste usuário não haverá nenhum tipo de reembolso
                      </div>

                      <Button
                        className="secondary-button-box blue-dark"
                        onPress={() => {
                          close()
                        }}
                      >
                        Cancelar
                      </Button>

                      <Button
                        className="secondary-button-box red-dark"
                        onPress={() => {
                          close()
                          handleRemoveParticipant(selectedUserId as string)
                        }}
                      >
                        Excluír
                      </Button>
                    </Dialog>
                  }
                </ModalTrigger> :
                <PopoverTrigger buttonClassName="opacity" label={<>{removeParticipantButtonIcon} {removeParticipantButtonLabel}</>}>
                  <Dialog maxWidth>
                    <div className="text">
                      Você não pode excluir a própria conta
                    </div>
                  </Dialog>
                </PopoverTrigger>
              }

              <div className="vertical-line" />

              {!delegation.participants?.find((participant) => participant?.id === selectedUserId)?.leader ?
                <ModalTrigger
                  buttonClassName=""
                  label={<>{changeLeaderButtonIcon} {changeLeaderButtonLabel}</>}
                >
                  {(close: () => void) =>
                    <Dialog maxWidth>
                      <div className="dialog-title">
                        Tem certeza que deseja nomear {delegation.participants?.find(el => el.id === selectedUserId)?.name} o chefe da delegação?
                      </div>

                      <span className="dialog-subitem">
                        Obs.: Quando você deixa de ser o chefe de delegação, você perde o privilégio de alterar os dados de sua delegação e de seus participantes, de realizar pagamentos e enviar documentos para a delegação toda.
                      </span>

                      <b style={{ fontSize: "1.3rem" }}>
                        ATENÇÃO: Esses privilégios se mantêm para os Professores Orientadores.
                      </b>

                      <Button
                        className="secondary-button-box red-dark"
                        onPress={() => {
                          close()
                        }}
                      >
                        Cancelar
                      </Button>

                      <Button
                        className="secondary-button-box blue-dark"
                        onPress={() => {
                          close()
                          handleChangeLeader(selectedUserId as string)
                        }}
                      >
                        Trocar o Líder
                      </Button>
                    </Dialog>
                  }
                </ModalTrigger> :
                <PopoverTrigger buttonClassName="opacity" label={<>{changeLeaderButtonIcon} {changeLeaderButtonLabel}</>}>
                  <Dialog maxWidth>
                    <div className="text">
                      Este participante já é o Líder da delegação!
                    </div>
                  </Dialog>
                </PopoverTrigger>
              }
            </div>
          </div>

          <EditUserData
            isDisabled={!userWantsToChangeData}
            actionData={fetcher.data}
            defaultValues={delegation.participants?.find((participant) => participant?.id === selectedUserId) as UserType}
            handleChange={handleChange("participant")}
            id={selectedUserId}
            userType={delegation.participants?.find((participant) => participant?.id === selectedUserId)?.delegate ? 'delegate' : 'delegationAdvisor'}
            actionType="edit"
          />
        </>
        :
        <></>
      }

      <AnimatePresence>
        {allowChanges && !isRefVisible && (
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
            >
              {buttonIcon} {buttonLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Form >
  )
}

export default DelegationData