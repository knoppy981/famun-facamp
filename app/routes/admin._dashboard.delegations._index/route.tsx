import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData, useNavigate, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react'

import { adminDelegationsList } from '~/models/delegation.server';

import { FiBell, FiCheckCircle, FiChevronLeft, FiChevronRight, FiDownload, FiXCircle } from "react-icons/fi/index.js";
import { ParticipationMethod } from '@prisma/client';
import Button from '~/components/button'
import TextField from '~/components/textfield';
import Spinner from '~/components/spinner';
import useDleegationsSheet from './hooks/useDelegationSheet';

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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [handleDelegationsSheet, downloadState] = useDleegationsSheet(participationMethod)

  return (
    <Form className='admin-container' preventScrollReset ref={formRef}>
      <div className='admin-search-container'>
        <TextField
          className="admin-search-input-box"
          name="delegation-search"
          aria-label="Procurar"
          type="text"
          isRequired
          onChange={() => {
            const formData = new FormData(formRef.current ?? undefined);
            submit(formData, { method: "GET", preventScrollReset: true })
          }}
          defaultValue={searchParams.get("participant-search") ?? ""}
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
                if (participant.stripePaid) accumulator += 1
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
              let sentDocumentsCount = delegation.participants.reduce((accumulator, participant) => {
                accumulator += participant._count.files
                return accumulator;
              }, 0);
              const documents = sentDocumentsCount === necessaryDocumentsCount

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
                        <div className='button-child'>
                          {info ? <><FiCheckCircle className='icon' /> Preenchidos</> : <><FiXCircle className='icon' /> Não preenchidos</>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <div className={`secondary-button-box ${payments ? 'green-light' : 'red-light'}`}>
                        <div className='button-child'>
                          {payments ? <><FiCheckCircle className='icon' /> Pagos</> : <><FiXCircle className='icon' /> Não pagos</>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <div className={`secondary-button-box ${documents ? 'green-light' : 'red-light'}`}>
                        <div className='button-child'>
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

      <div className='admin-navigation-button-container'>
        <div>
          <Button onPress={() => handleDelegationsSheet()} className='secondary-button-box green-light'>
            {downloadState === "idle" ? <FiDownload className='icon' /> : <Spinner dim='18px' color='green' />} Planilha
          </Button>
        </div>

        <div>
          <Button
            onPress={() => {
              const formData = new FormData(formRef.current ?? undefined);
              let nextIndex = Number(searchParams.get("i") ?? 0) - 1
              formData.set('i', String(nextIndex))
              formData.set('order-by', searchParams.get("order-by") ?? "name")
              submit(formData, { method: "GET", preventScrollReset: true })
            }}
            isDisabled={Number(searchParams.get("i")) < 1}
          >
            <FiChevronLeft className='icon' />
          </Button>

          Página {Number(searchParams.get("i") ?? 0) + 1}

          <Button
            onPress={() => {
              const formData = new FormData(formRef.current ?? undefined);
              let nextIndex = Number(searchParams.get("i") ?? 0) + 1
              formData.set('i', String(nextIndex))
              formData.set('order-by', searchParams.get("order-by") ?? "name")
              submit(formData, { method: "GET", preventScrollReset: true })
            }}
            isDisabled={delegations.length < 12}
          >
            <FiChevronRight className='icon' />
          </Button>
        </div>
      </div>

      <input type='hidden' name='pm' value={participationMethod} />
    </Form>
  )
}

export default Delegation
