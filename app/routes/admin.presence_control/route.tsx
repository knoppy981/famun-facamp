import React from 'react'

import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import ModalTrigger from '~/components/modalOverlay/trigger';
import { BsUpcScan } from 'react-icons/bs/index.js';
import BarcodeModal from './components/barcodeModal';
import Link from '~/components/link';
import Button from '~/components/button';
import useCredentialsSheet from './hooks/useCredentialsSheet';
import { FiDownload, FiExternalLink } from 'react-icons/fi/index.js';
import Spinner from '~/components/spinner';

export const action = async ({ request }: ActionFunctionArgs) => {
  return json({})
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({})
}

const PresenceControl = () => {
  const { downloadCredentialsSheet, isDownloadingCredentialsSheet, pm } = useCredentialsSheet()

  return (
    <div style={{ display: "contents" }}>
      <div className='admin-container padding'>

        <ModalTrigger
          buttonClassName="secondary-button-box blue-light"
          label={<><BsUpcScan className='icon' /> Credenciamento diário</>}
        >
          {(close: () => void) => <BarcodeModal close={close} />}
        </ModalTrigger>

        <Link to="/api/admin/credentials/pdf" target='_blank' className='secondary-button-box blue-light'>
          <div className='button-child'>
            <FiExternalLink className='icon' />
            PDF com Códigos de Barras
          </div>
        </Link>

        <Button onPress={() => downloadCredentialsSheet("Escola")} isDisabled={isDownloadingCredentialsSheet} className='secondary-button-box green-light'>
          {isDownloadingCredentialsSheet && pm === "Escola" ? <Spinner dim='18px' color='green' /> : <FiDownload className='icon' />} Planilha Credenciamento Diário EM
        </Button>

        <Button onPress={() => downloadCredentialsSheet("Universidade")} isDisabled={isDownloadingCredentialsSheet} className='secondary-button-box green-light'>
          {isDownloadingCredentialsSheet && pm === "Universidade" ? <Spinner dim='18px' color='green' /> : <FiDownload className='icon' />} Planilha Credenciamento Diário UNI
        </Button>
      </div>
    </div>
  )
}

export default PresenceControl
