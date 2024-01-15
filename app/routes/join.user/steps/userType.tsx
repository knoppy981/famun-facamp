import React from 'react';
import Button from '~/components/button';

const UserType = () => {

  const [userType, setUserType] = React.useState("")

  return (
    <>
      <h2 className='join-title'>
        Como você deseja se inscrever?
      </h2>

      <div className='join-choice-buttons-container'>
        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setUserType("advisor")}
        >
          Professor(a) Orientador(a)
        </Button>

        <Button
          className='primary-button-box'
          type="submit"
          name="action"
          value="next"
          onPress={() => setUserType("delegate")}
        >
          Delegado
        </Button>

        <input type='hidden' name='userType' value={userType} />
      </div>
    </>
  )
}

export default UserType