import { useNavigate, useOutletContext } from "@remix-run/react"
import { useUser, formatDate } from "~/utils"

import * as S from "~/styled-components/dashboard/delegation/participants"
import ColorButtonBox from "~/styled-components/components/buttonBox/withColor";

const Participants = () => {

  const delegation = useOutletContext()
  const navigate = useNavigate()
  const participants = delegation.participants
  const user = useUser()

  const handleUserClick = (username) => {
    const searchParams = new URLSearchParams([["u", username]])
    navigate(`/dashboard/delegation/data?${searchParams}`)
  }

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
              <S.TableRow
                key={index}
                onClick={() => handleUserClick(item.name)}
                tabIndex="0"
                role="link"
                aria-label={`Details for user ${user.name}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Space') {
                    handleUserClick(item.name);
                    event.preventDefault();
                  }
                }}
              >
                <S.TableCell user={item.id === user.id}>
                  <S.CellFlexBox>
                    {item.name}
                    {leader && <ColorButtonBox color="red"> Chefe da Delegação </ColorButtonBox>}
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  <S.CellFlexBox>
                    <ColorButtonBox color={item.delegate ? 'blue' : 'green'}>
                      {item.delegate ? "Delegado" : item.delegationAdvisor.advisorRole}
                    </ColorButtonBox>
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