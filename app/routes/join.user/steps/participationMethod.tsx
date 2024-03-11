import React from 'react'
import Button from '~/components/button';

const ParticipationMethod = () => {

  const [participationMethod, setParticipationMethod] = React.useState("")

  return (
    <>
      <h2 className='join-title'>
        Você está se inscrevendo como participante de uma:
      </h2>

      <div className='join-choice-buttons-container'>
        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setParticipationMethod("Universidade")}
        >
          Universidade
        </Button>

        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setParticipationMethod("Escola")}
        >
          Ensino Médio
        </Button>

        <input type='hidden' name='participationMethod' value={participationMethod} />
      </div>
    </>
  )
}

export default ParticipationMethod