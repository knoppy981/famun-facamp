import { useNavigate, useOutletContext } from '@remix-run/react'
import qs from 'qs'

import * as S from "~/styled-components/dashboard/payment/completed"
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor'
import { FiExternalLink, FiCreditCard } from 'react-icons/fi'
import Link from '~/styled-components/components/link/htmlLink'

const completed = () => {

  const { userPaymentsIntents } = useOutletContext()

  return (
    userPaymentsIntents?.length > 0 ?
      <S.PaymentsTable>
        <thead>
          <S.TableRow example>
            <S.TableCell>
              Pagamento
            </S.TableCell>

            <S.TableCell style={{ paddingLeft: "30px" }}>
              Valor
            </S.TableCell>

            <S.TableCell style={{ paddingLeft: "30px" }}>
              Recibo
            </S.TableCell>

            <S.TableCell>
              Data
            </S.TableCell>
          </S.TableRow>
        </thead>

        <tbody>
          {userPaymentsIntents.map((item, index) => {
            return (
              <S.TableRow key={index} first={index === 0}>
                <S.TableCell>
                  <S.CellFlexBox>
                    {item.type === 'card' && <FiCreditCard />}
                    Inscrição de {item?.metadata?.paidUsersIds ? ` ${Object.keys(qs.parse(item?.metadata?.paidUsersIds)).length}x participante${Object.keys(qs.parse(item?.metadata?.paidUsersIds)).length > 1 ? "s" : ""}` : ''}
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  <S.CellFlexBox>
                    <ColorButtonBox color="green">
                      R${" " + item?.amount / 100},00
                    </ColorButtonBox>
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  <S.CellFlexBox>
                    <ColorButtonBox>
                      <Link href={item?.receipt_url} target="_blank" rel="noopener noreferrer">
                        <FiExternalLink />  Recibo
                      </Link>
                    </ColorButtonBox>
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  {new Date(item?.created * 1000).toLocaleDateString("pt-BR")}
                </S.TableCell>
              </S.TableRow>
            )
          })}
        </tbody>
      </S.PaymentsTable>
      :
      <S.NoPaymentsMessage>
        Não encontramos nenhum pagamento
      </S.NoPaymentsMessage>
  )
}

export default completed