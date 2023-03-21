import * as S from './elements'

const UserType = () => {
  return (
    <>
      <S.Title>
        Como você deseja se inscrever?
      </S.Title>

      <S.ButtonsContainer>
        <S.Button name="userType" type="submit" value="advisor">
          Professor(a) Orientador(a)
        </S.Button>

        <S.Button name="userType" type="submit" value="delegate">
          Delegado
        </S.Button>
      </S.ButtonsContainer>
    </>
  )
}

export default UserType