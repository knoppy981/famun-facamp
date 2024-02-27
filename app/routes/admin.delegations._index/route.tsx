import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { FetcherWithComponents, Form, SubmitFunction, useFetcher, useLoaderData, useNavigate, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react'

import { adminDelegationsList } from '~/models/delegation.server';

import { FiBell, FiCheckCircle, FiChevronLeft, FiChevronRight, FiXCircle } from "react-icons/fi/index.js";
import { ParticipationMethod } from '@prisma/client';
import Button from '~/components/button'
import TextField from '~/components/textfield';
import { adminDelegationType } from './types';
import useDidMountEffect from '~/hooks/useDidMountEffect';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchIndex = url.searchParams.get("i");
  const query = url.searchParams.get("delegation-search");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const delegations = await adminDelegationsList(Number(searchIndex) ?? 0, participationMethod ?? "Escola", query as string)

  return json({ delegations })
}

const Delegation = () => {
  const submit = useSubmit()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { delegations } = useLoaderData<typeof loader>()
  const [searchIndex, handle, resetIndex] = handleSearchIndex(submit, formRef, participationMethod)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  return (
    <Form ref={formRef} onChange={e => { submit(e.currentTarget, { method: "GET" }) }} className='admin-container' >
      <div className='admin-search-container'>
        <TextField
          className="admin-search-input-box"
          name="delegation-search"
          aria-label="Procurar"
          type="text"
          isRequired
          onChange={resetIndex}
          placeholder='Procurar...'
        />
      </div>

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
            {delegations?.map((delegation, index) => {
              const participantsCount = delegation.participants.length
              const info = true
              let paymentsCount = delegation.participants?.reduce((accumulator, participant) => {
                if (participant.stripePaydId) accumulator += 1
                return accumulator
              }, 0) as number
              const payments = paymentsCount === participantsCount
              let necessaryDocumentsCount = delegation.participants.reduce((accumulator, participant) => {
                if (participant.delegate) {
                  accumulator += 2;
                } else if (participant.delegationAdvisor) {
                  accumulator += 1;
                }
                return accumulator;
              }, 0);
              const documents = delegation.participants.filter(participant => participant._count.files > 0).length === necessaryDocumentsCount

              return participantsCount > 0 ?
                <tr
                  className="table-row cursor"
                  key={index}
                  tabIndex={0}
                  role="link"
                  aria-label={`Details for delegation ${delegation.school}`}
                  onClick={() => navigate({
                    pathname: delegation.school,
                    search: searchParams.toString(),
                  })}
                  onKeyDown={() => navigate({
                    pathname: delegation.school,
                    search: searchParams.toString(),
                  })}
                >
                  <td className={`table-cell ${payments && documents && info ? "border-left-green" : payments || documents || info ? "border-left-yellow" : ""}`}>
                    <div className='table-flex-cell'>
                      {delegation.school}
                      {delegation._count.participants > 0 ? <div className='notification'><FiBell className='icon notification' /></div> : null}
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
                      {delegation.school}
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

      <input type='hidden' name="i" value={String(searchIndex)} />
      <input type='hidden' name="pm" value={participationMethod} />

      <div className='admin-navigation-button-container'>
        <Button onPress={() => handle(false)} isDisabled={searchIndex < 1}>
          <FiChevronLeft className='icon' />
        </Button>

        Página {searchIndex + 1}

        <Button onPress={() => handle(true)} isDisabled={delegations.length < 12}>
          <FiChevronRight className='icon' />
        </Button>
      </div>
    </Form>
  )
}

function handleSearchIndex(submit: SubmitFunction, formRef: React.RefObject<HTMLFormElement>, participationMethod: ParticipationMethod): [
  number,
  (isAdding: boolean) => void,
  () => void,
] {
  const [searchIndex, setSearchIndex] = React.useState<number>(0)
  // adding this extra state so that the form is only submitted when handle is triggered, and submit the form directly on handle because I cant modify the value of formRef.current
  const [testState, setTestState] = React.useState(false)

  const handle = (isAdding: boolean) => {
    setSearchIndex(prevValue => isAdding ? prevValue + 1 : prevValue - 1)
    setTestState(!testState)
  }

  const resetIndex = () => setSearchIndex(0)

  useDidMountEffect(() => {
    submit(formRef.current, { method: "GET" })
  }, [testState])

  useDidMountEffect(() => {
    resetIndex()
  }, [participationMethod])


  return [searchIndex, handle, resetIndex]
}

export default Delegation
