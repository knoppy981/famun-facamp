import React from "react";
import { FetcherWithComponents, Form, useFetcher, useOutletContext, useSearchParams } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import _ from 'lodash';
import qs from "qs"

import { useOnScreen } from "~/hooks/useOnScreen";
import { UserType } from "~/models/user.server";
import { DelegationType, formatDelegationData, getExistingDelegation, updateDelegation } from "~/models/delegation.server";
import { useUser, useUserType } from "~/utils";
import { getCorrectErrorMessage } from "~/utils/error";
import { prismaDelegationSchema } from "~/schemas/objects/delegation";
import { useDelegationUpdate } from "./useDelegationUpdate";
import { useButtonState } from "./useButtonState";
import { useUpdateStateFunctions } from "./useUpdateStateFunctions";
import { useUserScroll } from "./useUserScroll";

import Button from "~/components/button";
import { Select, Item } from "~/components/select";
import EditDelegationData from "../dashboard/edit-data-components/delegation";
import EditUserData from "../dashboard/edit-data-components/user";
import ModalTrigger from "~/components/modalOverlay/trigger";
import Dialog from "~/components/dialog";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  let userId = formData.get("userId")
  let { id, ...data } = qs.parse(formData.get("data") as string) as any

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
    console.log(error)
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  return updateDelegation({ delegationId: id, values: data })
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
  const allowChanges = userType === "advisor" || user.leader // only allow changes to advisor or delegation leader
  const [selectedUserId, setSelectedUserId] = React.useState<UserType["id"]>(delegation.participants?.[0].id as string);
  const { readySubmission, userWantsToChangeData, handleSubmission, formData, setFormData, allowChangeParticipant, handleRemoveParticipant, handleChangeLeader } =
    useDelegationUpdate(
      selectedUserId,
      setSelectedUserId,
      allowChanges,
      delegation,
      fetcher as FetcherWithComponents<FetcherType>,
      removeParticipantFetcher,
      changeLeaderFetcher
    )
  const userDataRef =
    useUserScroll(searchParams, delegation, setSelectedUserId)
  const [handleDelegationChange, handleChange, handleAddLanguage, handleRemoveLanguage] =
    useUpdateStateFunctions(formData, setFormData, selectedUserId)
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
        formData={formData}
        actionData={fetcher.data}
        handleChange={handleDelegationChange}
      />

      {formData.participants?.find((participant) => participant?.id === selectedUserId) ?
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

          {allowChanges && userWantsToChangeData &&
            <div className="delegation-data-title-box">
              {selectedUserId !== user.id &&
                <ModalTrigger
                  buttonClassName=""
                  label={<>{removeParticipantButtonIcon} {removeParticipantButtonLabel}</>}
                >
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
                          handleRemoveParticipant(selectedUserId)
                        }}
                      >
                        Excluír
                      </Button>
                    </Dialog>
                  }
                </ModalTrigger>
              }

              {!formData.participants?.find((participant) => participant?.id === selectedUserId)?.leader ?
                <>
                  <div className="vertical-line" />

                  <ModalTrigger
                    buttonClassName=""
                    label={<>{changeLeaderButtonIcon} {changeLeaderButtonLabel}</>}
                  >
                    {(close: () => void) =>
                      <Dialog maxWidth>
                        <div className="dialog-title">
                          Tem certeza que deseja nomear {delegation.participants?.find(el => el.id === selectedUserId)?.name} o líder da delegação?
                        </div>

                        <div className="dialog-subitem">
                          Obs: Quando você deixa de ser o líder da delegação você perde o privilégio de alterar dados da sua delegação e de seus participantes e
                          de realizar pagamentos e enviar documentos para a delegação toda
                        </div>

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
                            handleChangeLeader(selectedUserId)
                          }}
                        >
                          Trocar o Líder
                        </Button>
                      </Dialog>
                    }
                  </ModalTrigger>

                </>
                :
                null
              }
            </div>
          }

          <EditUserData
            isDisabled={!userWantsToChangeData}
            actionData={fetcher.data}
            formData={formData.participants?.find((participant) => participant?.id === selectedUserId) as UserType}
            handleChange={handleChange}
            handleAddLanguage={handleAddLanguage}
            handleRemoveLanguage={handleRemoveLanguage}
            userType={formData.participants?.find((participant) => participant?.id === selectedUserId)?.delegate ? 'delegate' : 'delegationAdvisor'}
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