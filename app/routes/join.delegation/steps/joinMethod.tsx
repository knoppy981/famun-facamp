import React from 'react'
import Button from '~/components/button'

const JoinMethod = () => {

  const [joinMethod, setJoinMethod] = React.useState("")

  return (
    <>
      <h2 className='join-title'>
        Participe de uma delegação
      </h2>

      <h3 className='join-subtitle'>
        Crie uma delegação para sua equipe ou entre na delegação do seu grupo!
      </h3>

      <div className='join-choice-buttons-container'>
        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setJoinMethod("create")}
        >
          Criar uma nova delegação
        </Button>

        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setJoinMethod("join")}
        >
          Entrar em uma delegação
        </Button>

        <input type='hidden' name='joinMethod' value={joinMethod} />
      </div>
    </>
  )
}

export default JoinMethod
