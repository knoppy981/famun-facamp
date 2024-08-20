import React from "react"

import { FiUserPlus } from "react-icons/fi/index.js"
import Spinner from "~/components/spinner"

export function useButtonState(allowCreation: boolean | undefined, transition: "idle" | "loading" | "submitting", allow: boolean) {
  const [buttonLabel, setButtonLabel] = React.useState("Adicionar Participante")
  const [buttonIcon, setButtonIcon] = React.useState(<FiUserPlus className="icon" />)
  const [buttonColor, setButtonColor] = React.useState("gray")

  React.useEffect(() => {
    setButtonLabel(transition !== 'idle' ? "Adicionando" : "Adicionar Participante")
    setButtonIcon(transition !== 'idle' ? <Spinner dim="18px" color='green' /> : <FiUserPlus className="icon" />)
    setButtonColor(transition !== 'idle' ? "blue" : allowCreation && allow ? "green" : "gray")
  }, [allowCreation, transition])

  return [buttonLabel, buttonIcon, buttonColor]
}
