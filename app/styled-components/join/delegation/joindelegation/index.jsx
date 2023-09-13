import { useState, useEffect, useRef } from 'react'
import { useFetcher, useTransition } from '@remix-run/react'

import * as S from './elements'
import { FiCheck, FiX } from 'react-icons/fi'
import Spinner from '~/styled-components/components/spinner'
import Button from '~/styled-components/components/button'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import TextField from '~/styled-components/components/textField';

const JoinDelegation = ({ transition }) => {
  const fetcher = useFetcher()
  const [readySubmission, value, handleChange] = useJoinDelegation(fetcher)
  const [buttonLabel, handleButtonPress, buttonSpinner] = useButtonState(fetcher, transition)

  return (
    <>
      <S.Title>
        Entrar em uma delegação
      </S.Title>

      <S.SubTitle>
        Digite o código da sua delegação abaixo ou peça um convite para o chefe da sua delegação
      </S.SubTitle>

      <S.Wrapper>
        <S.Container>
          <DefaultInputBox>
            <TextField
              label="Código da Delegação"
              value={value}
              onChange={handleChange}
              name="delegationCode"
              type="text"
              placeholder='Insira o código'
              err={fetcher.data?.errors?.code}
              autoComplete={false}
              aria-autoComplete="none"
            />
          </DefaultInputBox>

          <DefaultButtonBox isDisabled={!readySubmission}>
            <Button
              name="action"
              value="next"
              type="submit"
              isDisabled={!readySubmission}
              onPress={handleButtonPress}
            >
              {buttonLabel} {buttonSpinner}
            </Button>
          </DefaultButtonBox>
        </S.Container>

        {<S.Status err={fetcher.data?.errors?.delegation}>
          {fetcher.data?.errors?.delegation ?
            fetcher.data?.errors?.delegation :
            (fetcher.data?.delegation?.school && readySubmission) ?
              `Você está entrando na delegação do ${fetcher.data?.delegation?.school}` :
              null
          }
        </S.Status>}
      </S.Wrapper>
    </>
  )
}

function useJoinDelegation(fetcher) {
  const [value, setValue] = React.useState("")
  const [readySubmission, setReadySubmission] = React.useState(false)

  const handleChange = (e) => {
    const delegationCode = e.target.value.toUpperCase()
    setValue(delegationCode)
    if (delegationCode.length === 6) {
      fetcher.submit(
        { delegationCode },
        { method: "post", action: "/api/delegationCode" }
      )
    } else {
      setReadySubmission(false)
    }
  }

  React.useEffect(() => {
    setReadySubmission(fetcher.data?.delegation && value.length === 6)
  }, [fetcher.data])

  return [readySubmission, value, handleChange]
}

function useButtonState(fetcher, transition) {
  const [buttonLabel, setButtonLabel] = React.useState("Entrar")
  const [buttonSpinner, setButtonSpinner] = React.useState(null)
  const [isButtonClicked, setIsButtonClicked] = React.useState(false)

  const handleButtonPress = () => {
    setIsButtonClicked(true)
  }

  React.useEffect(() => {
    transition.state === 'idle' && setIsButtonClicked(false)
    setButtonLabel(fetcher.state === 'submitting' ? 'Procurando...' : 'Entrar')
    setButtonSpinner(transition.state !== 'idle' && isButtonClicked ?
      <Spinner dim={18} /> :
      null
    )
  }, [fetcher.state, transition])

  return [buttonLabel, handleButtonPress, buttonSpinner]
}

export default JoinDelegation