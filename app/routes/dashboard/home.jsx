import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import { useUser } from '~/utils'
import { getDelegationId, requireUser } from '~/session.server'
import { getRequiredPayments, getUserPayments } from '~/models/payments.server'

import * as S from '~/styled-components/dashboard/home'
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor'
import Link from "~/styled-components/components/link";

export const loader = async ({ request }) => {
  const delegationId = await getDelegationId(request)

  return json({ delegationId })
}

const home = () => {

  const { delegationId } = useLoaderData()
  const user = useUser()
  const paymentSucceed = user.stripePaymentId
  const document = false

  const completed = () => {
    return (delegationId && paymentSucceed && document) ? true : false
  }

  return (
    <S.Wrapper>
      <S.Title>
        Inscrição
        <ColorButtonBox color={completed() ? 'green' : 'red'}> {completed() ? "Concluída" : "Incompleta"} </ColorButtonBox>
      </S.Title>

      <S.Container>
        <Link to={delegationId ? '/dashboard/delegation' : "/join/delegation"}>
          <S.Item first={1}>
            <S.ItemTitle>
              Delegação
            </S.ItemTitle>

            Entrar para uma delegação

            <ColorButtonBox color={delegationId ? 'green' : 'red'}>
              {delegationId ? 'Concluído' : 'Entrar'}
            </ColorButtonBox>
          </S.Item>
        </Link>

        <Link to="/dashboard/payment">
          <S.Item>
            <S.ItemTitle>
              Pagamentos
            </S.ItemTitle>

            Pagar taxa de Inscrição

            <ColorButtonBox color={paymentSucceed ? 'green' : 'blue'}>
              {paymentSucceed ? 'Concluído' : 'Pendente'}
            </ColorButtonBox>
          </S.Item>
        </Link>

        <Link to="/dashboard/documents">
          <S.Item>
            <S.ItemTitle>
              Documentos
            </S.ItemTitle>

            Comprovante de Vacinação

            <ColorButtonBox color={document ? 'green' : 'blue'}>
              {document ? 'Concluído' : 'Pendente'}
            </ColorButtonBox>
          </S.Item>
        </Link>

      </S.Container>

      {/* <S.Title>
        Informações do evento
      </S.Title> */}

    </S.Wrapper>
  )
}

export default home