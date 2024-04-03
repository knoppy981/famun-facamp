import { FetcherWithComponents, Navigation, useFetcher } from '@remix-run/react'
import React, { ChangeEvent, ChangeEventHandler, Dispatch, ReactElement, SetStateAction } from 'react'
import { PressEvent } from 'react-aria'
import Button from '~/components/button'
import Spinner from '~/components/spinner'
import TextField from '~/components/textfield'
import { UserType } from '~/models/user.server'

const JoinDelegation = ({ transition, user }: { transition: Navigation, user: UserType }) => {
  const fetcher: FetcherWithComponents<{ delegation?: any; errors?: any }> = useFetcher()
  const { data } = fetcher
  const [readySubmission, value, handleChange] = useJoinDelegation(fetcher, user)
  const [buttonLabel, handleButtonPress, buttonSpinner] = useButtonState(fetcher, transition)

  return (
    <>
      <h1 className='join-title'>
        Entrar em uma delegação
      </h1>

      <h2 className='join-subtitle'>
        Digite o código da sua delegação abaixo ou peça um convite para o chefe da sua delegação
      </h2>

      <div className='join-container'>
        <TextField
          className='primary-input-box'
          label="Código da Delegação"
          value={value}
          onChange={handleChange}
          name="delegationCode"
          type="text"
          placeholder='Insira o código'
          errorMessage={fetcher.data?.errors?.code}
          autoComplete="off"
          aria-autoComplete="none"
        />

        <Button
          className={`primary-button-box ${!readySubmission ? "transparent" : ""}`}
          name="action"
          value="next"
          type="submit"
          isDisabled={!readySubmission}
          onPress={handleButtonPress}
        >
          {buttonLabel} {buttonSpinner}
        </Button>

        <div className={`join-subtitle label ${data?.errors?.delegation ? "error" : ""}`}>
          {data?.errors?.delegation ?
            data?.errors?.delegation :
            (data?.delegation?.school && readySubmission) ?
              `Você está entrando na delegação do ${data?.delegation?.school}` :
              null
          }
        </div>
      </div>
    </>
  )
}

function useJoinDelegation(fetcher: FetcherWithComponents<{ delegation?: any; errors?: any }>, user: UserType): [
  boolean, string | undefined, any
] {
  const [value, setValue] = React.useState<string>("")
  const [readySubmission, setReadySubmission] = React.useState<boolean>(false)

  const handleChange = (event: any): void => {
    const { value } = event.target;

    let delegationCode = value.toUpperCase()
    setValue(delegationCode)
    if (delegationCode.length === 6) {
      fetcher.submit(
        { delegationCode, userId: user.id },
        { method: "post", action: "/api/join/delegationCode" }
      )
    } else {
      setReadySubmission(false)
    }
  }

  React.useEffect(() => {
    console.dir(fetcher, { depth: null })
    setReadySubmission(fetcher.data?.delegation && value?.length === 6)
  }, [fetcher.data])

  return [readySubmission, value, handleChange]
}

function useButtonState(fetcher: FetcherWithComponents<unknown>, transition: Navigation): [
  string, ((e: PressEvent) => void) | undefined, ReactElement | null
] {
  const [buttonLabel, setButtonLabel] = React.useState<string>("Entrar")
  const [buttonSpinner, setButtonSpinner] = React.useState<ReactElement | null>(null)
  const [isButtonClicked, setIsButtonClicked] = React.useState<boolean>(false)

  const handleButtonPress = () => {
    setIsButtonClicked(true)
  }

  React.useEffect(() => {
    setButtonLabel(fetcher.state === 'submitting' ? 'Procurando...' : 'Entrar')
    setIsButtonClicked(transition.state === 'idle' ? false : isButtonClicked)
    setButtonSpinner(transition.state !== 'idle' && isButtonClicked ?
      <Spinner dim="18px" /> :
      null
    )
  }, [fetcher.state, transition])

  return [buttonLabel, handleButtonPress, buttonSpinner]
}

export default JoinDelegation
