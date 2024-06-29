import React from "react"
import { Navigation } from "@remix-run/react"

import Spinner from "~/components/spinner"

export function useButtonState(step: number, transition: Navigation): [
  string, boolean, (value: boolean) => void, () => void, React.ReactElement | null
] {
  const [buttonLabel, setButtonLabel] = React.useState<string>("Próximo")
  const [buttonSpinner, setButtonSpinner] = React.useState<React.ReactElement | null>(null)
  const [isButtonClicked, setIsButtonClicked] = React.useState<boolean>(false)
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)

  const handleButtonPress = () => {
    setIsButtonClicked(true)
  }

  React.useEffect(() => {
    setButtonLabel(step === 3 ? 'Criar' : 'Próximo')
    setIsButtonClicked(transition.state === 'idle' ? false : isButtonClicked)
    setButtonSpinner(transition.state !== 'idle' && isButtonClicked ?
      <Spinner dim="18px" /> :
      null
    )
  }, [step, transition])

  return [buttonLabel, isButtonDisabled, setIsButtonDisabled, handleButtonPress, buttonSpinner]
}