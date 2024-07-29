import React from 'react';
import TextField from '~/components/textfield';

const PaymentConfigurations = (props: any) => {
  const { defaultValues, handleChange, actionData, isDisabled, theme } = props
  const formatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div className={`data-box-container ${theme ?? ""}`}>
      <h3 className="data-box-container-title blue-border">
        Pagamentos
      </h3>

      <div className='label text'>Delegados(as):</div>

      <div className='data-box-input-container'>
        {[
          ["Ensino Medio (R$)", "precoDelegadoEnsinoMedio", "text"],
          ["Universidade (R$)", "precoDelegadoUniversidade", "text"],
          ["Internacional (USD)", "precoDelegadoInternacional", "text"],
        ].map((item, index) => {
          const defaultValue = String(defaultValues?.[item[1]])
          const [value, setValue] = React.useState(formatter.format(Number(defaultValue) / 100))
          const handleInputChange = (e: any) => {
            let newValue = e.target.value.replace(/[^0-9]/g, '');
            let formattedValue = formatter.format(Number(newValue) / 100)
            setValue(formattedValue)
            handleChange({ target: { name: item[1], value: parseInt(newValue.replace(/[,.]/g, '')) } })
          }
          return (
            <TextField
              className="secondary-input-box"
              key={index}
              name={item[1]}
              label={item[0]}
              type={item[2]}
              value={value}
              onChange={handleInputChange}
              isDisabled={isDisabled}
              errorMessage={actionData?.errors?.[item[1]]}
              action={actionData}
            />
          )
        })}
      </div>

      <div className='label text'>Professores(as) Orientadores(as):</div>

      <div className='data-box-input-container'>
        {[
          ["Nacional (R$)", "precoProfessorOrientador", "text"],
          ["Internacional (USD)", "precoFacultyAdvisors", "text"],
        ].map((item, index) => {
          const defaultValue = String(defaultValues?.[item[1]])
          const [value, setValue] = React.useState(defaultValue.length >= 3 ? defaultValue.slice(0, -2) + "," + defaultValue.slice(-2) : defaultValue)
          const handleInputChange = (e: any) => {
            let newValue = e.target.value.replace(/[^0-9]/g, '');
            let formattedValue = formatter.format(Number(newValue) / 100)
            setValue(formattedValue)
            handleChange({ target: { name: item[1], value: parseInt(newValue.replace(/[,.]/g, '')) } })
          }
          return (
            <TextField
              className="secondary-input-box"
              key={index}
              name={item[1]}
              label={item[0]}
              type={item[2]}
              value={value}
              onChange={handleInputChange}
              isDisabled={isDisabled}
              errorMessage={actionData?.errors?.[item[1]]}
              action={actionData}
            />
          )
        })}
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default PaymentConfigurations