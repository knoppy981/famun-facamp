import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 40px;
  padding-top: 100px;
`
export const TitleBox = styled.div`
  display: grid;
`
export const Title = styled.div`
  font-size: 35px;
  font-weight: 500;
  color: #183567;
`
export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #666666;
`
export const GridWrapper = styled.div`
  width: 100%;
`
export const GridTitle = styled.div`
  margin-bottom: 15px;
`
export const DelegationContainer = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 25px;
`
export const DelegationDataWrapper = styled.div`
  height: 100px;
`
export const DelegatesListWrapper = styled.div`
  width: 100%;
  border: 1px solid rgba(0,0,0,.2);
`
export const DelegatesList = styled.ul`
  width: 100%;
  height: 250px;
  display: grid;
  overflow-y: auto;
  overflow-x: hidden;
`
export const Delegate = styled.div`
  height: 45px;
  display: grid;
  align-items: center;
  padding: 0 20px;
  grid-template-columns: 14fr 8fr 6fr 3fr;
  font-size: 15px;
  color: ${p => p.example ? 'rgba(0,0,0,.4)' : '#000000'};
  border-bottom: 1px solid rgba(0,0,0,.2);
`
export const DelegateIcon = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  svg {
    height: 25px;
    width: 25px;
  }
`
export const DelegateName = styled.div`
  height: 30px;
  display: flex;
  align-items: flex-end;
`
export const DelegateEmail = styled.div`
  height: 30px;
  display: flex;
  align-items: flex-end;
`
export const DelegateJoinDate = styled.div`

`
export const DelegateSubscription = styled.div`

`