import { FetcherWithComponents, Form, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React, { ChangeEvent } from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { FiToggleLeft, FiToggleRight, FiX } from "react-icons/fi/index.js";
import TextField from '~/components/textfield'
import Spinner from '~/components/spinner'
import { UserType } from '~/models/user.server'
import TextArea from '~/components/textfield/textArea'

const BarcodeModal = ({ close }: { close: () => void }) => {
  const { inputRef, handleInput, isSubmitting, error, isEntering, setIsEntering, prevRegistered } = useBarcodeScan()

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Credenciamento Diário
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <Form className='committee-add-form' method='POST'>
        <div className='committee-selected-delegates'>
          Conecte o leitor de códigos de barra e selecione a opção de cadastrar como entrada ou saída.
        </div>

        <div style={{ placeSelf: "flex-start" }}>
          <Button className={`secondary-button-box ${isEntering ? "green-dark" : "blue-dark"}`} onPress={() => setIsEntering(!isEntering)} type='button'>
            {isEntering ? <FiToggleLeft className='icon' /> : <FiToggleRight className='icon' />} Registrando {isEntering ? "entrada" : "saída"}
          </Button>
        </div>

        <input
          ref={inputRef}
          type="text"
          onChange={handleInput}
          style={{ position: 'absolute', left: '-9999px' }}
          autoFocus
        />

        {isSubmitting ? <Spinner dim='32px' color='#fff' /> :
          error ? <div className='text label error'>{error}</div> :
            prevRegistered.length > 0 ?
            prevRegistered.slice(-5).reverse().map((item, index) => (
              <div key={index} className='committee-selected-delegates'>{index + 1}. {item.name}, {item.timeString} {item.school ? `, ${item.school}` : ""}</div>
            ))
            : null
        }
      </Form>
    </Dialog>
  )
}

function useBarcodeScan() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<any>()
  const [isEntering, setIsEntering] = React.useState(false)
  const [prevRegistered, setPrevRegistered] = React.useState<{ name: string, timeString: string, school?: string }[]>([])
  let isSubmitting = fetcher.state !== "idle"
  let [error, setError] = React.useState<null | "">(null)

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value && value.length >= 8) {
      if (!isSubmitting) {
        console.log(value)
        fetcher.submit({ id: value, isEntering }, { action: "/api/admin/credentials", method: "post" })
      }
      e.currentTarget.value = '';
    }
  };

  React.useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleFocus);
    };
  }, []);

  React.useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.name) {
        setError(null)
        setPrevRegistered((prevState) => ([...prevState, fetcher.data]))
      } else if (fetcher.data?.errors?.barCode) {
        setError(fetcher.data?.errors?.barCode)
      }
    }
  }, [fetcher.data])

  return { inputRef, handleInput, isSubmitting, error, isEntering, setIsEntering, prevRegistered }
}

export default BarcodeModal
