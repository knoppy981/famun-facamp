import React from 'react'
import { useFetcher, useOutletContext } from '@remix-run/react'
import Button from '~/components/button'
import Spinner from '~/components/spinner'

import { FiCheckCircle, FiXCircle } from "react-icons/fi/index.js";
import { ParticipationMethod } from '@prisma/client';
import { useDelegationData } from './useDelegationData';
import { useDelegationsList } from './useDelegationsList';
import DelegationData from './delegationData';
import { delegationAoo } from '~/sheets/data';

const Delegation = () => {
  const fetcher = useFetcher<any>()
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const [searchIndex, setSearchIndex, delegations] = useDelegationsList(fetcher, participationMethod)
  const delegationFetcher = useFetcher<any>()
  const [delegation, state, openModal, aoo] = useDelegationData(delegationFetcher)

  return (
    <>
      <DelegationData delegation={delegation} state={state} aoo={aoo} />

      <div className='overflow-container'>
        <table className='table'>
          <thead>
            <tr className="table-row example">
              <td className='table-cell'>
                {participationMethod}
              </td>

              <td className='table-cell' style={{ paddingLeft: "30px" }}>
                Dados
              </td>

              <td className='table-cell' style={{ paddingLeft: "30px" }}>
                Pagamentos
              </td>

              <td className='table-cell' style={{ paddingLeft: "30px" }}>
                Documentos
              </td>
            </tr>
          </thead>

          <tbody>
            {delegations?.map((item, index) => {
              const participantsCount = item.participants.length
              const info = true
              const payments = item._count.participants === participantsCount
              let necessaryDocumentsCount = item.participants.reduce((accumulator, participant) => {
                if (participant.delegate) {
                  accumulator += 2;
                } else if (participant.delegationAdvisor) {
                  accumulator += 1;
                }
                return accumulator;
              }, 0);
              const documents = item.participants.filter(participant => participant._count.files > 0).length === necessaryDocumentsCount

              return participantsCount > 0 ?
                <tr
                  className="table-row cursor"
                  key={index}
                  onClick={() => openModal(item)}
                  tabIndex={0}
                  role="link"
                  aria-label={`Details for delegation ${item.school}`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === 'Space') {
                      openModal(item);
                      event.preventDefault();
                    }
                  }}
                >
                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      {item.school}
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <div className={`secondary-button-box ${info ? 'green-light' : 'red-light'}`}>
                        <div>
                          {info ? <><FiCheckCircle className='icon' /> Preenchidos</> : <><FiXCircle className='icon' /> Não preenchidos</>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <div className={`secondary-button-box ${payments ? 'green-light' : 'red-light'}`}>
                        <div>
                          {payments ? <><FiCheckCircle className='icon' /> Pagos</> : <><FiXCircle className='icon' /> Não pagos</>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <div className={`secondary-button-box ${documents ? 'green-light' : 'red-light'}`}>
                        <div>
                          {documents ? <><FiCheckCircle className='icon' /> Enviados</> : <><FiXCircle className='icon' /> Não enviados</>}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                :
                <tr className="table-row" key={index}>
                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      {item.school}
                    </div>
                  </td>

                  <td className='table-cell'>
                    <p className='text italic'>Delegação vazia</p>
                  </td>

                  <td className='table-cell'></td>
                  <td className='table-cell'></td>
                </tr>
            })}
          </tbody>
        </table>
      </div>

      {fetcher.state !== "idle" ?
        <Spinner dim='50px' width="2" />
        : searchIndex !== null ?
          <Button onPress={() => setSearchIndex(prevNumber => prevNumber !== null ? prevNumber + 1 : null)}>
            Carregar mais
          </Button>
          : null
      }
    </>
  )
}

export default Delegation
