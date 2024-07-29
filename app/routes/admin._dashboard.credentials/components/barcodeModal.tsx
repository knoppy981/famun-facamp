import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React, { ChangeEvent } from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { FiX } from "react-icons/fi/index.js";
import TextField from '~/components/textfield'
import Spinner from '~/components/spinner'
import { UserType } from '~/models/user.server'
import TextArea from '~/components/textfield/textArea'

const BarcodeModal = ({ close }: { close: () => void }) => {
  const fetcher = useFetcher<any>()
  const [] = useBarcodeScan()
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value) {
      console.log(value);
      e.currentTarget.value = ''; // Clear the input after processing
    }
  };

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <fetcher.Form className='committee-add-form' method='POST'>
        <input
          ref={inputRef}
          type="text"
          onInput={handleInput}
          style={{ position: 'absolute', left: '-9999px' }}
          autoFocus
        />
      </fetcher.Form>
    </Dialog>
  )
}

function useBarcodeScan(): [] {

  return []
}

export default BarcodeModal
