import { Link, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import { useUser } from '~/utils'
import { getDelegationId, requireUserId } from '~/session.server'
import { getUserPayments } from '~/models/payments.server'

import * as S from '~/styled-components/dashboard/home'

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  const delegationId = await getDelegationId(request)

  const payments = await getUserPayments(userId)

  return json({ delegationId, payments })
}

const home = () => {

  const { delegationId, payments } = useLoaderData()
  const user = useUser()

  const paymentSucceed = payments.find(payment => payment.succeed)

  return (
    <S.Wrapper>

      <S.SubTitle>
        Inscrição <S.Item color='red'> Incompleta </S.Item>
      </S.SubTitle>

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
                <Link to="/dashboard/delegation">
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
                  <S.Item color={'blue'}>
                    {'Pendente'}
                  </S.Item>
                </Link>
              </S.GridListItem>
            </S.GridList>
          </S.GridItem>
        </S.Grid>
      </S.Container>

      <S.SubTitle>
        Informações do evento
      </S.SubTitle>

    </S.Wrapper>
  )
}

export default home