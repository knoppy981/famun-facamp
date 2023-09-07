import { useNavigate, useOutletContext } from '@remix-run/react'

import * as S from "~/styled-components/dashboard/payment/pending"
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor'
import { FiExternalLink } from 'react-icons/fi'

const pending = () => {

  const { payments } = useOutletContext()
  const navigate = useNavigate()
  const handlePaymentClick = (username) => {
    navigate(`/pay/s?${new URLSearchParams([["s", username]])}`)
  }

  return (
    payments?.find(el => el.available) ?
      <S.PaymentsTable>
        <thead>
          <S.TableRow example>
            <S.TableCell>
              Pagamento
            </S.TableCell>

            <S.TableCell style={{ paddingLeft: "30px" }}>
              Preço
            </S.TableCell>

            <S.TableCell>
              Expira em
            </S.TableCell>
          </S.TableRow>
        </thead>

        <tbody>
          {payments.map((item, index) => {
            if (!item.available) return null
            return (
              <S.TableRow
                key={index}
                onClick={() => handlePaymentClick(item.name)}
                tabIndex="0"
                role="link"
                aria-label={`Pay for user ${item.name}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Space') {
                    handlePaymentClick(item.name);
                    event.preventDefault();
                  }
                }}
              >
                <S.TableCell>
                  <S.CellFlexBox>
                    Inscrição de {item.name}

                    <ColorButtonBox>
                      <FiExternalLink /> Pagar
                    </ColorButtonBox>
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  <S.CellFlexBox>
                    <ColorButtonBox color="red">
                      {"R$ " + item.price / 100 + ",00"}
                    </ColorButtonBox>
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  30/8/2023
                </S.TableCell>
              </S.TableRow>
            )
          })}
        </tbody>
      </S.PaymentsTable>
      :
      <S.NoPaymentsMessage>
        Voce e sua delegação ja realizaram todos os pagamentos necessários
      </S.NoPaymentsMessage>
  )
}

export default pending