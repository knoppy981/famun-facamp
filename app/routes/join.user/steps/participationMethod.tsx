import React from 'react'
import Button from '~/components/button';

const ParticipationMethod = () => {

  const [participationMethod, setParticipationMethod] = React.useState("")

  return (
    <>
      <h2 className='join-title'>
        Você está se increvendo junto com uma escola ou faculdade?
      </h2>

      <div className='join-choice-buttons-container'>
        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setParticipationMethod("Escola")}
        >
          Escola
        </Button>

        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setParticipationMethod("Faculdade")}
        >
          Faculdade
        </Button>

        <input type='hidden' name='participationMethod' value={participationMethod} />
      </div>
    </>
  )
}

export default ParticipationMethod