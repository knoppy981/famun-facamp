import { useOutletContext } from "@remix-run/react"
import { useUser, formatDate } from "~/utils"

import * as S from "~/styled-components/dashboard/delegation"

const Participants = ({ handleUserClick }) => {

  const delegation = useOutletContext()
  const participants = delegation.participants
  const user = useUser()

  return (
    <S.OverflowContainer>
      <S.DelegatesTable>
        <thead>
          <S.TableRow example>
            <S.TableCell>
              Nome
            </S.TableCell>

            <S.TableCell style={{ paddingLeft: "30px" }}>
              Posição
            </S.TableCell>

            <S.TableCell>
              Entrou em
            </S.TableCell>
          </S.TableRow>
        </thead>

        <tbody>
          {participants.map((item, index) => {
            const leader = item.leader
            return (
              <S.TableRow key={`delegation-user-${index}`} onClick={() => handleUserClick(item.id)}>
                <S.TableCell user={item.id === user.id}>
                  <S.CellFlexBox>
                    {item.name}
                    {leader && <S.Item color="red"> Chefe da Delegação </S.Item>}
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  <S.CellFlexBox>
                    <S.Item color={item.delegate ? 'blue' : 'green'}>
                      {item.delegate ? "Delegado" : item.delegationAdvisor.advisorRole}
                    </S.Item>
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  {formatDate(item.createdAt.split("T")[0])}
                </S.TableCell>
              </S.TableRow>
            )
          })}
        </tbody>
      </S.DelegatesTable>
    </S.OverflowContainer>
  )
}

export default Participants