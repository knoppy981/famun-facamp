import { Link, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import { useUser } from '~/utils'
import { getDelegationId, requireUser } from '~/session.server'
import { getRequiredPayments, getUserPayments } from '~/models/payments.server'

import * as S from '~/styled-components/dashboard/home'

export const loader = async ({ request }) => {
  const user = await requireUser(request)
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
        Inscrição <S.Item color={completed() ? 'green' : 'red'}> {completed() ? "Concluída" : "Incompleta"} </S.Item>
      </S.Title>

      <S.Container>
        <S.Grid>
          <S.GridItem first={1} to={delegationId ? '/dashboard/delegation' : "/join/delegation"}>
            <S.GridItemTitle>
              Delegação
            </S.GridItemTitle>

            <S.GridList>
              <S.GridListItem>
                Entrar para uma delegação
              </S.GridListItem>

              <S.GridListItem>
                <S.Item color={delegationId ? 'green' : 'red'}>
                  {delegationId ? 'Concluído' : 'Entrar'}
                </S.Item>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>

          <S.GridItem to="/dashboard/payment">
            <S.GridItemTitle>
              Pagamentos
            </S.GridItemTitle>

            <S.GridList>
              <S.GridListItem>
                Pagar taxa de Inscrição
              </S.GridListItem>

              <S.GridListItem>
                <S.Item color={paymentSucceed ? 'green' : 'blue'}>
                  {paymentSucceed ? 'Concluído' : 'Pendente'}
                </S.Item>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>

          <S.GridItem to="/dashboard/documents">
            <S.GridItemTitle>
              Documentos
            </S.GridItemTitle>

            <S.GridList>
              <S.GridListItem>
                Comprovante de Vacinação
              </S.GridListItem>

              <S.GridListItem>
                <S.Item color={document ? 'green' : 'blue'}>
                  {document ? 'Concluído' : 'Pendente'}
                </S.Item>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>
        </S.Grid>
      </S.Container>

      {/* <S.Title>
        Informações do evento
      </S.Title> */}

    </S.Wrapper>
  )
}

export default home