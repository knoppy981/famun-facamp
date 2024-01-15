import React from 'react'
import { useNavigate, useOutletContext } from "@remix-run/react"

import { useUser } from "~/utils"
import { Delegation } from '@prisma/client'
import { DelegationType } from '~/models/delegation.server'
import Button from '~/components/button'

const DelegationParticipants = () => {
  const delegation: DelegationType = useOutletContext()
  const navigate = useNavigate()
  const participants = delegation.participants
  const user = useUser()

  const handleUserClick = (username: string) => {
    const searchParams = new URLSearchParams([["u", username]])
    navigate(`/dashboard/delegation/data?${searchParams}`)
  }

  return (
    <div className='overflow-container'>
      <table className='table'>
        <thead>
          <tr className="table-row example">
            <td className='table-cell'>
              Nome
            </td>

            <td className='table-cell' style={{ paddingLeft: "30px" }}>
              Posição
            </td>

            <td className='table-cell'>
              Entrou em
            </td>
          </tr>
        </thead>

        <tbody>
          {participants?.map((item, index) => {
            const leader = item.leader
            return (
              <tr
                className="table-row cursor"
                key={index}
                onClick={() => handleUserClick(item.name)}
                tabIndex={0}
                role="link"
                aria-label={`Details for user ${user.name}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Space') {
                    handleUserClick(item.name);
                    event.preventDefault();
                  }
                }}
              >
                <td className={`table-cell ${item.id === user.id ? "user" : ""}`}>
                  <div className='table-flex-cell'>
                    {item.name}
                    {leader && <div className="secondary-button-box red-light"><div>Chefe da Delegação</div></div>}
                  </div>
                </td>

                <td className='table-cell'>
                  <div className='table-flex-cell'>
                    <div className={`secondary-button-box ${item.delegate ? 'blue-light' : 'green-light'}`}>
                      <div>
                        {item.delegate ? "Delegado" : item?.delegationAdvisor?.advisorRole}
                      </div>
                    </div>
                  </div>
                </td>

                <td className='table-cell'>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DelegationParticipants
