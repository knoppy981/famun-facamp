import React from 'react'
import { AnimatePresence } from 'framer-motion'

import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { FiDollarSign, FiDownload, FiFile, FiX } from "react-icons/fi/index.js";
import { OverlayTriggerState } from 'react-stately'
import { modalContextType } from './types'
import Button from '~/components/button';
import { exportAoo } from '~/sheets';
import { FetcherWithComponents } from '@remix-run/react';
import Spinner from '~/components/spinner';
import { delegationAoo } from '~/sheets/data';
import { ParticipationMethod } from '@prisma/client';

const DelegationData = ({ delegation, state, fetcher }: { delegation: modalContextType, state: OverlayTriggerState, fetcher: FetcherWithComponents<any> }) => {
  const delegates = delegation?.participants?.filter((participant) => participant.delegate !== null && participant.id)
  const advisors = delegation?.participants?.filter((participant) => participant.delegationAdvisor !== null && participant.id)

  const delegatesWithDocumentsSent = delegates?.reduce((accumulator, delegate) => {
    if (delegate.files?.filter(file => file.name === "Liability Waiver" || file.name === "Position Paper").length === 2) accumulator += 1
    return accumulator
  }, 0) as number

  const advisorsWithDocumentsSent = advisors?.reduce((accumulator, delegate) => {
    if (delegate.files?.filter(file => file.name === "Liability Waiver").length === 1) accumulator += 1
    return accumulator
  }, 0) as number
  const documentsSentCount = advisorsWithDocumentsSent + delegatesWithDocumentsSent

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Delegação {delegation?.school}
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <div className='admin-dialog-container'>
              <div className="admin-dialog-item">
                <span>{delegation?.participants?.length}</span> participante{delegation?.participants?.length !== 1 ? "s" : ""}
              </div>

              <div className="admin-dialog-item">
                <span>{delegation?.paymentsCount}</span> inscriç{delegation?.paymentsCount !== 1 ? "ões" : "ão"} paga{delegation?.paymentsCount !== 1 ? "s" : ""}
              </div>

              {delegation?.amountPaid ?
                <ul>
                  <li className="admin-dialog-item" style={{ listStyle: "disc", marginLeft: "25px" }}>
                    Total pago: {(delegation?.amountPaid / 100).toLocaleString("pt-BR", { style: "currency", currency: "brl" })}
                  </li>
                </ul> : null
              }

              <div className="admin-dialog-item">
                <span>{documentsSentCount}</span> participante{documentsSentCount !== 1 ? "s" : ""} com documentos enviado{documentsSentCount !== 1 ? "s" : ""}
              </div>

              <div className="admin-dialog-list-item">
                <Button
                  className="secondary-button-box green-dark"
                  isDisabled={fetcher.state !== "idle"}
                  onPress={() => {
                    if (delegation !== null) {
                      let aoo = delegationAoo({
                        address: delegation.address,
                        code: delegation.code as string,
                        createdAt: new Date(delegation.createdAt as any),
                        id: delegation.id as string,
                        inviteLink: delegation.inviteLink as string,
                        participationMethod: delegation.participationMethod as ParticipationMethod,
                        paymentExpirationDate: new Date(delegation.paymentExpirationDate as any),
                        school: delegation.school as string,
                        schoolPhoneNumber: delegation.schoolPhoneNumber as string,
                        updatedAt: new Date(),
                        participants: delegation.participants as any
                      }, delegation.amountPaid)

                      exportAoo(aoo, delegation.school as string)
                    }
                  }}
                >
                  <FiDownload className='icon' /> Planilha
                </Button>
              </div>
            </div>

            {advisors && advisors.length > 0 &&
              <div className='admin-dialog-container'>
                <div className="admin-dialog-item">
                  {advisors.length} Professores(as) Orientadores(as)
                </div>

                <ol>
                  {advisors.map((item, index) => {
                    const isDocumentsSent = item.files?.filter((file) => file.name === "Liability Waiver")
                    const isPaid = item.stripePaydId

                    return (
                      <li key={index} className="admin-dialog-list-item">
                        <FiFile className='icon' color={isDocumentsSent?.length === 1 ? "green" : "red"} />
                        <FiDollarSign className='icon' color={isPaid ? "green" : "red"} />
                        {item.name}
                      </li>
                    )
                  })}
                </ol>
              </div>
            }

            {delegates && delegates.length > 0 &&
              < div className='admin-dialog-container'>
                <div className="admin-dialog-item">
                  {delegates.length} Delegados(as)
                </div>

                <ol>
                  {delegates.map((item, index) => {
                    const isDocumentsSent = item.files?.filter((file) => file.name === "Liability Waiver" || file.name === "Position Paper")
                    const isPaid = item.stripePaydId

                    return (
                      <li key={index} className="admin-dialog-list-item">
                        <FiFile className='icon' color={isDocumentsSent?.length === 2 ? "green" : "red"} />
                        <FiDollarSign className='icon' color={isPaid ? "green" : "red"} />
                        {item.name}
                      </li>
                    )
                  })}
                </ol>
              </div>
            }


            {fetcher.state !== "idle" ? <div className='admin-dialog-spinner-container'><Spinner dim='25px' color='#fff' /></div> : <></>}
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

export default DelegationData
