import React from "react"
import { FiCheck, FiEdit, FiTrash2, FiX } from "react-icons/fi/index.js"
import Spinner from "~/components/spinner"

export function useButtonState(
  userWantsToChangeData: boolean,
  readySubmission: boolean,
  transition: "idle" | "loading" | "submitting",
  removeParticipantsTransition: "idle" | "loading" | "submitting",
  changeLeaderTransition: "idle" | "loading" | "submitting",
  allowChanges: boolean
) {
  const [buttonLabel, setButtonLabel] = React.useState("Editar Dados")
  const [buttonIcon, setButtonIcon] = React.useState(<FiEdit className="icon" />)
  const [buttonColor, setButtonColor] = React.useState("gray")

  const [removeParticipantButtonIcon, setRemoveParticipantButtonIcon] = React.useState(<FiTrash2 className="icon" />)
  const [removeParticipantButtonLabel, setRemoveParticipantButtonLabel] = React.useState("Remover Participante")

  const [changeLeaderButtonIcon, setChangeLeaderButtonIcon] = React.useState(<></>)
  const [changeLeaderButtonLabel, setChangeLeaderButtonLabel] = React.useState("Nomear o Líder da Delegação")

  React.useEffect(() => {
    setButtonLabel(transition !== 'idle' ?
      "Salvando" :
      !userWantsToChangeData ?
        "Editar Dados" :
        readySubmission ?
          "Salvar Alterações" :
          "Cancelar")

    setButtonIcon(transition !== 'idle' ?
      <Spinner dim="18px" color='green' /> :
      !userWantsToChangeData ?
        <FiEdit className="icon" /> :
        readySubmission ?
          <FiCheck className="icon" /> :
          <FiX className="icon" />)

    setButtonColor(!allowChanges ?
      'gray' :
      userWantsToChangeData ?
        readySubmission ? 'green' : 'red' :
        'blue')
  }, [userWantsToChangeData, readySubmission, transition])

  React.useEffect(() => {
    setRemoveParticipantButtonIcon(removeParticipantsTransition !== "idle" ?
      <Spinner dim="18px" /> :
      <FiTrash2 className="icon" />)
    setRemoveParticipantButtonLabel(removeParticipantsTransition !== "idle" ? "Removendo" : "Remover Participante")
  }, [removeParticipantsTransition])

  React.useEffect(() => {
    setChangeLeaderButtonIcon(changeLeaderTransition !== "idle" ?
      <Spinner dim="18px" /> :
      <></>)
    setChangeLeaderButtonLabel(changeLeaderTransition !== "idle" ? "Atualizando" : "Nomear o Líder da Delegação")
  }, [changeLeaderTransition])

  return [buttonLabel, buttonIcon, buttonColor, removeParticipantButtonIcon, removeParticipantButtonLabel, changeLeaderButtonIcon, changeLeaderButtonLabel]
}
