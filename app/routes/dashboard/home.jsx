import { Link, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import { useUser } from '~/utils'
import { getDelegationId, requireUserId } from '~/session.server'
import { getRequiredPayments, getUserPayments } from '~/models/payments.server'

import * as S from '~/styled-components/dashboard/home'

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  const delegationId = await getDelegationId(request)
  const payments = await getRequiredPayments({ userId, delegationId })

  return json({ delegationId, payments })
}

const home = () => {

  const { delegationId, payments } = useLoaderData()
  const user = useUser()
  const paymentSucceed = payments ? !payments.find(el => el.available) : false
  const document = false

  const completed = () => {
    return (delegationId && paymentSucceed && document) ? true : false
  }

  return (
    <S.Wrapper>

      <S.Title>
        Inscrição <S.Item color={completed() ? 'green' : 'red'}> {completed()? "Concluída" : "Incompleta"} </S.Item>
      </S.Title>

      <S.Container>
        <S.Grid>
          <S.GridItem first>
            <S.GridItemTitle>
              Delegação
            </S.GridItemTitle>

            <S.GridList>
              <S.GridListItem>
                Entrar para uma delegação
              </S.GridListItem>

              <S.GridListItem>
                <Link to={delegationId ? '/dashboard/delegation' : "/join/delegation"}>
                  <S.Item color={delegationId ? 'green' : 'red'}>
                    {delegationId ? 'Concluído' : 'Entrar'}
                  </S.Item>
                </Link>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>

          <S.GridItem>
            <S.GridItemTitle>
              Pagamentos
            </S.GridItemTitle>

            <S.GridList>
              <S.GridListItem>
                Pagar taxa de Inscrição
              </S.GridListItem>

              <S.GridListItem>
                <Link to="/dashboard/payment">
                  <S.Item color={paymentSucceed ? 'green' : 'blue'}>
                    {paymentSucceed ? 'Concluído' : 'Pendente'}
                  </S.Item>
                </Link>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>

          <S.GridItem>
            <S.GridItemTitle>
              Documentos
            </S.GridItemTitle>

            <S.GridList>
              <S.GridListItem>
                Comprovante de Vacinação
              </S.GridListItem>

              <S.GridListItem>
                <Link to="/dashboard/documents">
                  <S.Item color={document ? 'green' : 'blue'}>
                    {document ? 'Concluído' : 'Pendente'}
                  </S.Item>
                </Link>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>
        </S.Grid>
      </S.Container>

      <S.Title>
        Informações do evento
      </S.Title>

    </S.Wrapper>
  )
}

export default home