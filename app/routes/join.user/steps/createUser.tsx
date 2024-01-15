import React from 'react'
import TextField from '~/components/textfield'

const CreateUser = ({ data, actionData }: { data: any; actionData: any }) => {
  return (
    <>
      <h2 className='join-title'>
        Criar conta
      </h2>

      <div className='join-container'>
        <div className='join-input-container'>
          <TextField
            className='primary-input-box'
            name="email"
            label="E-mail"
            aria-label="E-mail"
            type="email"
            defaultValue={data?.email}
            errorMessage={actionData?.errors?.email}
            action={actionData}
          />

          <div className='join-sub-input-container'>
            <TextField
              className='primary-input-box'
              name="password"
              label="Senha"
              aria-label="Senha"
              type="password"
              defaultValue={data?.password}
              errorMessage={actionData?.errors?.password}
              action={actionData}
            />

            <TextField
              className='primary-input-box'
              name="confirmPassword"
              label="Confirme a Senha"
              aria-label="Confirme a Senha"
              type="password"
              defaultValue={data?.confirmPassword}
              errorMessage={actionData?.errors?.confirmPassword}
              action={actionData}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateUser
