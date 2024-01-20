import { FetcherWithComponents, useFetcher, useOutletContext } from '@remix-run/react'
import React, { useEffect } from 'react'
import Button from '~/components/button'
import Spinner from '~/components/spinner'

import { FiCheckCircle, FiXCircle } from "react-icons/fi/index.js";

const Delegation = () => {
  const fetcher = useFetcher<any>()
  const { participationMethod } = useOutletContext<{ participationMethod: "Escolas" | "Universidades" }>()
  const [searchIndex, setSearchIndex, delegations] = useDelegationList(fetcher, participationMethod)

  return (
    <>
      <div className='overflow-container'>
        <table className='table'>
          <thead>
            <tr className="table-row example">
              <td className='table-cell'>
                {participationMethod.slice(0, -1)}
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
              const documents = item.participants.filter(participant => participant._count.files > 0).length === participantsCount

              return participantsCount > 0 ? (
                <tr
                  className="table-row cursor"
                  key={index}
                  /* onClick={() => handleUserClick(item.name)} */
                  tabIndex={0}
                  role="link"
                  aria-label={`Details for delegation ${item.school}`}
                /* onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Space') {
                    handleUserClick(item.name);
                    event.preventDefault();
                  }
                }} */
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
              ) :
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

function useDelegationList(fetcher: FetcherWithComponents<any>, participationMethod: "Escolas" | "Universidades"): [
  number | null,
  React.Dispatch<React.SetStateAction<number | null>>,
  {
    school: string;
    participants: {
      name: string;
      _count: {
        files: number;
      };
    }[];
    _count: {
      participants: number;
    };
  }[]] {
  const [searchIndex, setSearchIndex] = React.useState<number | null>(0)
  const [delegations, setDelegations] = React.useState<{
    school: string;
    participants: {
      name: string;
      _count: {
        files: number;
      };
    }[];
    _count: {
      participants: number;
    };
  }[]>([])

  const handleSubmission = (searchIndex: number, participationMethod: "Escolas" | "Universidades") => {
    fetcher.load(`/api/adminDelegationList?i=${searchIndex}&pm=${participationMethod}`)
  }

  useEffect(() => {
    setSearchIndex(0)
  }, [participationMethod])

  useEffect(() => {
    console.log(searchIndex)
    if (searchIndex !== null) handleSubmission(searchIndex, participationMethod)
  }, [searchIndex])

  useEffect(() => {
    if (fetcher.data?.delegations) {
      console.log(fetcher.data?.delegations.length)
      setDelegations(prevState => [...prevState, ...fetcher.data?.delegations])
      if (fetcher.data?.delegations.length < 12) setSearchIndex(null)
    }
  }, [fetcher.data])

  return [searchIndex, setSearchIndex, delegations]
}

export default Delegation
