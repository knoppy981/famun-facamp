import React from 'react'
import qs from 'qs'
import { getLocalTimeZone, parseDate } from '@internationalized/date'

const ConfirmData = ({ data, userType }: { data: any, userType: any }) => {
  return (
    <>
      <h2 className='join-title'>
        Confirmar os dados
      </h2>

      <h3 className='join-subtitle'>
        É possível alterar os dados após a inscrição
      </h3>

      <div className='join-confirm-data-list'>
        {[
          ["Nome", "name"],
          ["E-mail", "email"],
          ["Telefone", "phoneNumber"],
          ["Nacionalidade", "nacionality"],
        ].map((item, index) => {
          if (!data[item[1]]) return null
          return (
            <div className='join-confirm-data-list-item' key={index} x-autocompletetype="off">
              <div className='join-confirm-data-list-label'>
                {item[0]}
              </div>
              {data[item[1]]}
            </div>
          )
        })}

        <div className='join-confirm-data-list-item'>
          <div className='join-confirm-data-list-label'>
            {data.nacionality === "Brazil" ? "Rg" : "Número do Passaporte"}
          </div>
          {data.nacionality === "Brazil" ? data.rg : data.passport}
        </div>

        {data.cpf ?
          <div className='join-confirm-data-list-item'>
            <div className='join-confirm-data-list-label'>
              CPF
            </div>
            {data.cpf}
          </div>
          :
          null
        }

        <div className='join-confirm-data-list-item'>
          <div className='join-confirm-data-list-label'>
            Data de Nascimento
          </div>
          {data.birthDate ? parseDate(data?.birthDate).toDate(getLocalTimeZone()).toLocaleDateString() : ""}
        </div>

        {data.foodRestrictions ?
          <div className='join-confirm-data-list-item two-columns-span'>
            <div className='join-confirm-data-list-label'>
              Restrições Alimentares
            </div>

            <p className='join-confirm-data-list-item'>{data.foodRestriction === "vegan" ? "Vegano(a)" : "Vegetariano(a)"}</p>
            <p className='join-confirm-data-list-item'>{data.allergyDescription}</p>
          </div>
          :
          null
        }

        {userType === "delegate" &&
          <>
            <div className='join-confirm-data-list-item two-columns-span'>
              <div className='join-confirm-data-list-label'>
                Preferência de Conselho
              </div>

              {Object.values(qs.parse(data.councilPreference)).map((item, index) => {
                if (item === undefined) return
                item = item as string
                item = item.replace(/_/g, ' ')
                return (
                  <p className='join-confirm-data-list-item' key={index}>{(index + 1) + "° " + item}</p>
                )
              })}
            </div>

            <div className='join-confirm-data-list-item two-columns-span'>
              <div className='join-confirm-data-list-label'>
                Nível de escolaridade
              </div>

              <p className='join-confirm-data-list-item'>{data.educationLevel}</p>
              <p className='join-confirm-data-list-item'>{data.currentYear}</p>
            </div>

            <div className='join-confirm-data-list-item two-columns-span'>
              <div className='join-confirm-data-list-label'>
                Idiomas que pode simular
              </div>

              {Array.isArray(data.languagesSimulates) ?
                data.languagesSimulates.map((item: any, index: number) => (
                  <p className='join-confirm-data-list-item' key={index}>{item}</p>
                )) :
                data.languagesSimulates
              }
            </div>
          </>
        }

        {userType === "advisor" &&
          <>
            <div className='join-confirm-data-list-item'>
              <div className='join-confirm-data-list-label'>Posição</div>
              {data.advisorRole}
            </div>

            {[
              ["Instagram", "instagram"],
              ["Facebook", "facebook"],
              ["Linkedin", "linkedin"],
              ["Twitter", "twitter"]
            ].map((item, index) => {
              if (!data[item[1]]) return null
              return (
                <div className='join-confirm-data-list-item' key={index}>
                  <div className='join-confirm-data-list-label'>
                    {item[0]}
                  </div>
                  {data[item[1]]}
                </div>
              )
            })}
          </>
        }
      </div>
    </>
  )
}

export default ConfirmData