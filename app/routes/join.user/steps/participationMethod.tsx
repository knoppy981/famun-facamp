import React from 'react'
import Button from '~/components/button';
import Dialog from '~/components/dialog';
import PopoverTrigger from '~/components/popover/trigger';
import { FiAlertCircle } from 'react-icons/fi/index.js'

const ParticipationMethod = ({ isSubscriptionAvailable }: { isSubscriptionAvailable: { subscriptionEM: boolean; subscriptionUNI: boolean; } }) => {
  const [participationMethod, setParticipationMethod] = React.useState("")

  return (
    <>
      <h2 className='join-title'>
        Você está se inscrevendo como participante de uma:
      </h2>

      <div className='join-choice-buttons-container'>
        <div className='join-choice-button-box'>
          <Button
            className='primary-button-box'
            type="submit"
            name="action"
            value="next"
            isDisabled={!isSubscriptionAvailable.subscriptionUNI}
            onPress={() => setParticipationMethod("Universidade")}
          >
            Universidade
          </Button>

          {!isSubscriptionAvailable.subscriptionUNI ?
            <PopoverTrigger label={<FiAlertCircle className='icon error' />} buttonClassName="join-choice-button-alert">
              <Dialog maxWidth>
                <div className='dialog-title'>
                  As inscrições para universidade estão fechadas!
                  <br />Entre em contato com a nossa Equipe para checar a disponibilidade de vagas
                  <br />email: famun@facamp.com.br
                </div>
              </Dialog>
            </PopoverTrigger>
            :
            null
          }
        </div>

        <div className='join-choice-button-box'>
          <Button
            className='primary-button-box'
            type="submit"
            name="action"
            value="next"
            isDisabled={!isSubscriptionAvailable.subscriptionEM}
            onPress={() => setParticipationMethod("Escola")}
          >
            Ensino Médio
          </Button>

          {!isSubscriptionAvailable.subscriptionEM ?
            <PopoverTrigger label={<FiAlertCircle className='icon error' />} buttonClassName="join-choice-button-alert">
              <Dialog maxWidth>
                <div className='dialog-title'>
                  As inscrições para ensino médio estão fechadas!
                  <br />Entre em contato com a nossa Equipe para checar a disponibilidade de vagas
                  <br />email: famun@facamp.com.br
                </div>
              </Dialog>
            </PopoverTrigger>
            :
            null
          }
        </div>

        <input type='hidden' name='participationMethod' value={participationMethod} />
      </div>
    </>
  )
}

export default ParticipationMethod