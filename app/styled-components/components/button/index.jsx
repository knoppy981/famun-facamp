import { useButton } from 'react-aria';
import styled from 'styled-components';

const StyledButton = styled.button`
  position: relative;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const Button = (props) => {
  let ref = props.buttonRef
  let { buttonRef = ref, children, name, value } = props;
  let { buttonProps } = useButton(props, ref);
  return (
    <StyledButton {...buttonProps} name={name} value={value} ref={buttonRef}>
      {children}
    </StyledButton>
  );
}

export default Button