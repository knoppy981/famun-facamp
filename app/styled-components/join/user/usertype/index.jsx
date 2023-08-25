import * as S from './elements'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';

const UserType = () => {

  const [userType, setUserType] = React.useState("")

  return (
    <>
      <S.Title>
        Como você deseja se inscrever?
      </S.Title>

      <S.ButtonContainer>
        <DefaultButtonBox>
          <Button
            type="submit"
            name="action"
            value="next"
            onPress={() => setUserType("advisor")}
          >
            Professor(a) Orientador(a)
          </Button>
        </DefaultButtonBox>
        
        <DefaultButtonBox>
          <Button
            type="submit"
            name="action"
            value="next"
            onPress={() => setUserType("delegate")}
          >
            Delegado
          </Button>
        </DefaultButtonBox>

        <input type='hidden' name='userType' value={userType}/>
      </S.ButtonContainer>
    </>
  )
}

export default UserType