import React from "react"
import { FiCheck, FiEdit, FiX } from "react-icons/fi/index.js"
import Spinner from "~/components/spinner"

export function useButtonState(userWantsToChangeData: boolean, readySubmission: boolean, transition: "idle" | "loading" | "submitting", allow: boolean) {
  const [buttonLabel, setButtonLabel] = React.useState<string>("Editar Dados")
  const [buttonIcon, setButtonIcon] = React.useState<React.ReactNode>(<FiEdit className="icon" />)
  const [buttonColor, setButtonColor] = React.useState<string>("blue")

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
        <FiEdit className='icon' /> :
        readySubmission ?
          <FiCheck className='icon' /> :
          <FiX className='icon' />)
    setButtonColor(!allow ? "gray" :
      userWantsToChangeData ?
        readySubmission ? 'green' : 'red' :
        'blue')
  }, [userWantsToChangeData, readySubmission, transition])

  return [buttonLabel, buttonIcon, buttonColor]
}