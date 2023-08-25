import { useState, useEffect, useRef } from 'react'
import { useFetcher, useTransition } from '@remix-run/react'

import * as S from './elements'
import { FiCheck, FiX } from 'react-icons/fi'
import Spinner from '~/styled-components/components/spinner'
import Button from '~/styled-components/components/button'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import TextField from '~/styled-components/components/textField';

const JoinDelegation = ({ data, transition, isNextButtonClicked, setIsNextButtonClicked }) => {
  const [value, setValue] = React.useState("")
  const [readySubmission, setReadySubmission] = React.useState(false)

  const searchDelegation = useFetcher()

  const handleChange = (value) => {
    if (value.length === 6) {
      searchDelegation.submit(
        { delegationCode: value },
        { method: "post", action: "/api/delegationCode" }
      )
    }
  }

  React.useEffect(() => {
    setReadySubmission(searchDelegation.data?.delegation && value.length === 6)
  }, [searchDelegation.data])

  React.useEffect(() => {
    if (value.length !== 6) setReadySubmission(false)
  }, [value])

  /* useEffect(() => {
    setLabel(
      searchDelegation.state !== "idle" ?
        "Procurando..." : searchDelegation?.data?.delegation && inputRef.current.value.length === 6 ?
          "Delegação do " + searchDelegation?.data?.delegation.school : searchDelegation?.data?.errors ?
            searchDelegation?.data?.errors["delegation" || "code"] : "Exemplo : A1B2C3"
    )
    setValid((searchDelegation?.data?.delegation && inputRef.current.value.length === 6) ? true : false)
  }, [searchDelegation, value]) */

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
          {/* <S.Label>
            Código :
          </S.Label> */}

          <DefaultInputBox>
            <TextField
              label="Código da Delegação"
              value={value}
              onChange={e => { setValue(e.target.value); handleChange(e.target.value) }}
              name="delegationCode"
              type="text"
              placeholder='Insira o código'
              err={searchDelegation.data?.errors?.code}
              autoComplete={false}
              aria-autoComplete="none"
            />
          </DefaultInputBox>

          {/* <S.StatusIcon color={searchDelegation?.data?.errors ? "#A7A7A7" : "green"}>
            {searchDelegation?.data?.errors ? <FiX /> : (searchDelegation?.data?.delegation && value.length === 6) ? <FiCheck /> : null}
          </S.StatusIcon> */}

          <DefaultButtonBox isDisabled={!readySubmission}>
            <Button
              name="action"
              value="next"
              type="submit"
              isDisabled={!readySubmission}
              onPress={() => setIsNextButtonClicked(true)}
            >
              {searchDelegation.state === 'submitting' ?
                <>Procurando...</> :
                <>Entrar {transition.state !== 'idle' && isNextButtonClicked && <Spinner dim={18} />}</>
              }
            </Button>
          </DefaultButtonBox>
        </S.Container>

        <S.Status err={searchDelegation.data?.errors?.delegation}>
          {searchDelegation.data?.errors?.delegation ?
            searchDelegation.data?.errors?.delegation :
            (searchDelegation.data?.delegation?.school && readySubmission) ?
              `Você está entrando na delegação do ${searchDelegation.data?.delegation?.school}` :
              null
          }
        </S.Status>
      </S.Wrapper>
    </>
  )
}

export default JoinDelegation