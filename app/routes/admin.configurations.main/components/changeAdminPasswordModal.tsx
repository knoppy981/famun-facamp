import qs from "qs"
import { FetcherWithComponents, Form, useFetcher } from '@remix-run/react'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import React, { useRef } from "react"
import { FiX } from 'react-icons/fi/index.js';
import TextField from "~/components/textfield"
import Spinner from "~/components/spinner"

const ChangeAdminPasswordModal = ({ close }: { close: () => void }) => {
  const { submit, step, isLoading, confirmedCode, error } = useChangeAdminPassword()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Alterar Senha
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <Form className='committee-add-form' onSubmit={e => { e.preventDefault() }} ref={formRef}>
        {step === 0 &&
          <>
            <div className='committee-selected-delegates'>
              Ao clicar em Avançar, uma mensagem será enviada ao e-mail da FAMUN para a confirmação da troca de senha
            </div>

            <Button
              type='button'
              className='committee-add-form-button'
              onPress={() => {
                const formData = new FormData(formRef.current ?? undefined);
                formData.set('action', "request")
                submit(formData, { method: "POST", action: "/api/admin/password", preventScrollReset: true })
              }}
              isDisabled={isLoading}
            >
              {isLoading && <Spinner dim="18px" color="#fff" />}
              Avançar
            </Button>
          </>
        }

        {step === 1 &&
          <>
            <div className='committee-selected-delegates'>
              Enviamos um código ao email: famun@facamp.com.br.
            </div>

            <TextField
              className='primary-input-box'
              name="code"
              id="code"
              label="Insira o código de 6 dígitos"
              theme='dark'
            />

            {error !== null ? <p className="text label error">{error}</p> : null}

            <Button
              type='button'
              className='committee-add-form-button'
              onPress={() => {
                const formData = new FormData(formRef.current ?? undefined);
                formData.set('action', "challenge")
                submit(formData, { method: "POST", action: "/api/admin/password", preventScrollReset: true })
              }}
              isDisabled={isLoading}
            >
              {isLoading && <Spinner dim="18px" color="#fff" />}
              Avançar
            </Button>
          </>
        }

        {step === 2 && confirmedCode &&
          <>
            <div className='committee-selected-delegates'>
              Crie uma senha nova
            </div>

            <div className='committee-selected-delegates'>
              Para proteger sua conta, escolha uma senha forte que você não usou antes e que tenha pelo menos 8 carácteres.
            </div>

            <TextField
              className='primary-input-box'
              name="password"
              label="Senha"
              aria-label="Senha"
              type="password"
              theme='dark'
            />

            <TextField
              className='primary-input-box'
              name="confirmPassword"
              label="Confirme a Senha"
              aria-label="Confirme a Senha"
              type="password"
              theme='dark'
            />

            {error !== null ? <p className="text label error">{error}</p> : null}

            <input type="hidden" name="code" value={confirmedCode} />

            <Button
              type='submit'
              className='committee-add-form-button'
              onPress={() => {
                const formData = new FormData(formRef.current ?? undefined);
                formData.set('action', "reset")
                submit(formData, { method: "POST", action: "/api/admin/password", preventScrollReset: true })
              }}
              isDisabled={isLoading}
            >
              {isLoading && <Spinner dim="18px" color="#fff" />}
              Avançar
            </Button>
          </>
        }

        {step === 3 &&
          <>
            <div className='text'>
              Senha alterada com sucesso!
            </div>

            <Button
              type='submit'
              className='committee-add-form-button'
              onPress={close}
            >
              Fechar
            </Button>
          </>
        }
      </Form>
    </Dialog >
  )
}

function useChangeAdminPassword() {
  const fetcher = useFetcher<any>()
  // 0: no action, 1: challenge, 2: change password
  const [step, setStep] = React.useState(0)
  const isLoading = fetcher.state !== "idle"
  const [confirmedCode, setConfirmedCode] = React.useState<null | string>(null)
  const [error, setError] = React.useState<null | string>(null)


  React.useEffect(() => {
    if (fetcher.data && fetcher.data?.confirmed) {
      console.log(fetcher.data)
      const actionConfirmed = fetcher.data?.confirmed
      setError(null)
      if (actionConfirmed === "error") {
        setError(fetcher.data?.message)
      } else if (actionConfirmed === "request") {
        setStep(1)
      } else if (actionConfirmed === "challenge") {
        if (fetcher.data?.code) setConfirmedCode(fetcher.data?.code)
        setStep(2)
      } else if (actionConfirmed === "reset") {
        setStep(3)
      }
    }
  }, [fetcher.data])

  return { step, isLoading, submit: fetcher.submit, confirmedCode, error }
}

export default ChangeAdminPasswordModal
