import * as S from './elements'

const UserType = () => {
  return (
    <>
      <S.Title>
        Como voce deseja se inscrever?
      </S.Title>

      <S.ButtonsContainer>
        <S.Button name="userType" type="submit" value="advisor">
          Professor Orientador
        </S.Button>

        <S.Button name="userType" type="submit" value="delegate">
          Delegado
        </S.Button>
      </S.ButtonsContainer>
    </>
  )
}

export default UserType