import React from 'react'

const ConfirmData = ({ data }: { data: any }) => {
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
          ["Escola / Universidade", "school"],
          ["Número Telefone", "schoolPhoneNumber"],
          ["Metodo de Participação", "participationMethod"],
          ["País", "country"],
          ["Cidade", "city"],
          ["Estado", "state"],
          ["Código Postal (CEP)", "postalCode"],
          ["Endereço", "address"]
        ].map((item, index) => {
          return (
            <div className='join-confirm-data-list-item' key={index}>
              <div className='join-confirm-data-list-label'>
                {item[0]}
              </div>
              {data[item[1]]}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ConfirmData
